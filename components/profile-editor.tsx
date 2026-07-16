'use client';

import type { ChangeEvent } from 'react';
import { TextAreaField, SelectField, TextField } from '@/components/form-controls';
import type { ProfileData, SectionId } from '@/lib/profile-types';

interface ProfileEditorProps {
  profile: ProfileData;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  onChange: (profile: ProfileData) => void;
}

const sections: Array<{ id: SectionId; label: string; description: string }> = [
  { id: 'basic', label: 'Basic info', description: 'Name, contact, and summary' },
  { id: 'experience', label: 'Experience', description: 'Your work history' },
  { id: 'education', label: 'Education', description: 'Degrees and schools' },
  { id: 'projects', label: 'Projects', description: 'Selected work' },
  { id: 'skills', label: 'Skills & languages', description: 'What you bring' },
  { id: 'application', label: 'Application questions', description: 'Common application details' },
];

const workPreferenceOptions = [
  { value: '', label: 'Select preference' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const yesNoOptions = [
  { value: '', label: 'Select an answer' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

function createItemId(prefix: string): string {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return `${prefix}-${id}`;
}

function updateArrayItem<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function ProfileEditor({
  profile,
  activeSection,
  onSectionChange,
  onChange,
}: ProfileEditorProps) {
  const updateBasic = (patch: Partial<ProfileData['basic']>) =>
    onChange({ ...profile, basic: { ...profile.basic, ...patch } });

  const updateApplication = (patch: Partial<ProfileData['application']>) =>
    onChange({ ...profile, application: { ...profile.application, ...patch } });

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicSection profile={profile} onChange={updateBasic} />;
      case 'experience':
        return <ExperienceSection profile={profile} onChange={onChange} />;
      case 'education':
        return <EducationSection profile={profile} onChange={onChange} />;
      case 'projects':
        return <ProjectsSection profile={profile} onChange={onChange} />;
      case 'skills':
        return <SkillsSection profile={profile} onChange={onChange} />;
      case 'application':
        return <ApplicationSection profile={profile} onChange={updateApplication} />;
    }
  };

  return (
    <div className="profile-editor">
      <aside className="section-rail" aria-label="Profile sections">
        <div className="rail-label">Profile sections</div>
        <nav>
          {sections.map((section) => (
            <button
              className={`section-link ${activeSection === section.id ? 'is-active' : ''}`}
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              <span className="section-link-mark" aria-hidden="true">
                {section.id === 'basic' ? '01' : section.id === 'experience' ? '02' : section.id === 'education' ? '03' : section.id === 'projects' ? '04' : section.id === 'skills' ? '05' : '06'}
              </span>
              <span>
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="editor-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Your professional details</p>
            <h1>Profile</h1>
            <p className="page-subtitle">Keep your professional profile accurate and ready to use.</p>
          </div>
        </div>
        {renderSection()}
      </main>
    </div>
  );
}

interface SectionProps {
  profile: ProfileData;
  onChange: (profile: ProfileData) => void;
}

interface BasicSectionProps {
  profile: ProfileData;
  onChange: (patch: Partial<ProfileData['basic']>) => void;
}

function BasicSection({ profile, onChange }: BasicSectionProps) {
  const { basic } = profile;

  return (
    <section className="editor-section" aria-labelledby="basic-info-heading">
      <SectionHeader id="basic-info-heading" title="Basic info" description="The essentials recruiters see first." />
      <div className="form-grid two-columns">
        <TextField id="first-name" label="First name" value={basic.firstName} onChange={(event) => onChange({ firstName: event.target.value })} />
        <TextField id="last-name" label="Last name" value={basic.lastName} onChange={(event) => onChange({ lastName: event.target.value })} />
        <TextField id="headline" label="Headline" value={basic.headline} onChange={(event) => onChange({ headline: event.target.value })} hint="A concise description of your professional focus." />
        <TextField id="email" label="Email" type="email" value={basic.email} onChange={(event) => onChange({ email: event.target.value })} />
        <TextField id="location" label="Location" value={basic.location} onChange={(event) => onChange({ location: event.target.value })} />
        <div className="field field-placeholder" aria-hidden="true" />
        <div className="field full-width">
          <TextAreaField id="summary" label="Summary" value={basic.summary} onChange={(event) => onChange({ summary: event.target.value })} rows={5} hint={`${basic.summary.length} / 600 characters`} />
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ profile, onChange }: SectionProps) {
  const addExperience = () => {
    onChange({
      ...profile,
      experience: [
        ...profile.experience,
        { id: createItemId('experience'), company: '', role: '', location: '', startDate: '', endDate: 'Present', description: '' },
      ],
    });
  };

  return (
    <section className="editor-section" aria-labelledby="experience-heading">
      <SectionHeader id="experience-heading" title="Experience" description="Show the work that best supports your next move." action={<button className="secondary-button" type="button" onClick={addExperience}>+ Add role</button>} />
      <div className="repeatable-list">
        {profile.experience.map((item, index) => (
          <article className="repeatable-item" key={item.id}>
            <div className="item-heading"><div><span className="item-index">0{index + 1}</span><h3>{item.role || 'New role'}</h3></div><button className="text-button danger-text" type="button" onClick={() => onChange({ ...profile, experience: profile.experience.filter((entry) => entry.id !== item.id) })}>Remove</button></div>
            <div className="form-grid two-columns">
              <TextField id={`${item.id}-company`} label="Company" value={item.company} onChange={(event) => onChange({ ...profile, experience: updateArrayItem(profile.experience, item.id, { company: event.target.value }) })} />
              <TextField id={`${item.id}-role`} label="Role" value={item.role} onChange={(event) => onChange({ ...profile, experience: updateArrayItem(profile.experience, item.id, { role: event.target.value }) })} />
              <TextField id={`${item.id}-location`} label="Location" value={item.location} onChange={(event) => onChange({ ...profile, experience: updateArrayItem(profile.experience, item.id, { location: event.target.value }) })} />
              <TextField id={`${item.id}-start`} label="Start date" type="month" value={item.startDate} onChange={(event) => onChange({ ...profile, experience: updateArrayItem(profile.experience, item.id, { startDate: event.target.value }) })} />
              <TextField id={`${item.id}-end`} label="End date" value={item.endDate} onChange={(event) => onChange({ ...profile, experience: updateArrayItem(profile.experience, item.id, { endDate: event.target.value }) })} />
              <div className="field field-placeholder" aria-hidden="true" />
              <div className="field full-width"><TextAreaField id={`${item.id}-description`} label="Description" value={item.description} onChange={(event) => onChange({ ...profile, experience: updateArrayItem(profile.experience, item.id, { description: event.target.value }) })} rows={4} /></div>
            </div>
          </article>
        ))}
        {profile.experience.length === 0 ? <EmptyEditorState message="No experience added yet." actionLabel="Add your first role" onAction={addExperience} /> : null}
      </div>
    </section>
  );
}

function EducationSection({ profile, onChange }: SectionProps) {
  const addEducation = () => onChange({ ...profile, education: [...profile.education, { id: createItemId('education'), school: '', degree: '', field: '', startYear: '', endYear: '' }] });

  return (
    <section className="editor-section" aria-labelledby="education-heading">
      <SectionHeader id="education-heading" title="Education" description="Add degrees, training, and other credentials." action={<button className="secondary-button" type="button" onClick={addEducation}>+ Add education</button>} />
      <div className="repeatable-list">
        {profile.education.map((item, index) => (
          <article className="repeatable-item" key={item.id}>
            <div className="item-heading"><div><span className="item-index">0{index + 1}</span><h3>{item.school || 'New education'}</h3></div><button className="text-button danger-text" type="button" onClick={() => onChange({ ...profile, education: profile.education.filter((entry) => entry.id !== item.id) })}>Remove</button></div>
            <div className="form-grid two-columns">
              <TextField id={`${item.id}-school`} label="School" value={item.school} onChange={(event) => onChange({ ...profile, education: updateArrayItem(profile.education, item.id, { school: event.target.value }) })} />
              <TextField id={`${item.id}-degree`} label="Degree" value={item.degree} onChange={(event) => onChange({ ...profile, education: updateArrayItem(profile.education, item.id, { degree: event.target.value }) })} />
              <TextField id={`${item.id}-field`} label="Field of study" value={item.field} onChange={(event) => onChange({ ...profile, education: updateArrayItem(profile.education, item.id, { field: event.target.value }) })} />
              <div className="form-grid two-columns compact-grid"><TextField id={`${item.id}-start-year`} label="Start year" value={item.startYear} onChange={(event) => onChange({ ...profile, education: updateArrayItem(profile.education, item.id, { startYear: event.target.value }) })} /><TextField id={`${item.id}-end-year`} label="End year" value={item.endYear} onChange={(event) => onChange({ ...profile, education: updateArrayItem(profile.education, item.id, { endYear: event.target.value }) })} /></div>
            </div>
          </article>
        ))}
        {profile.education.length === 0 ? <EmptyEditorState message="No education added yet." actionLabel="Add your first credential" onAction={addEducation} /> : null}
      </div>
    </section>
  );
}

function ProjectsSection({ profile, onChange }: SectionProps) {
  const addProject = () => onChange({ ...profile, projects: [...profile.projects, { id: createItemId('project'), name: '', description: '', url: '', technologies: '' }] });

  return (
    <section className="editor-section" aria-labelledby="projects-heading">
      <SectionHeader id="projects-heading" title="Projects" description="Highlight focused work that makes your experience memorable." action={<button className="secondary-button" type="button" onClick={addProject}>+ Add project</button>} />
      <div className="repeatable-list">
        {profile.projects.map((item, index) => (
          <article className="repeatable-item" key={item.id}>
            <div className="item-heading"><div><span className="item-index">0{index + 1}</span><h3>{item.name || 'New project'}</h3></div><button className="text-button danger-text" type="button" onClick={() => onChange({ ...profile, projects: profile.projects.filter((entry) => entry.id !== item.id) })}>Remove</button></div>
            <div className="form-grid two-columns">
              <TextField id={`${item.id}-name`} label="Project name" value={item.name} onChange={(event) => onChange({ ...profile, projects: updateArrayItem(profile.projects, item.id, { name: event.target.value }) })} />
              <TextField id={`${item.id}-url`} label="Project URL" type="url" value={item.url} onChange={(event) => onChange({ ...profile, projects: updateArrayItem(profile.projects, item.id, { url: event.target.value }) })} />
              <TextField id={`${item.id}-technologies`} label="Technologies" value={item.technologies} onChange={(event) => onChange({ ...profile, projects: updateArrayItem(profile.projects, item.id, { technologies: event.target.value }) })} hint="Separate technologies with commas." />
              <div className="field field-placeholder" aria-hidden="true" />
              <div className="field full-width"><TextAreaField id={`${item.id}-description`} label="Description" value={item.description} onChange={(event) => onChange({ ...profile, projects: updateArrayItem(profile.projects, item.id, { description: event.target.value }) })} rows={4} /></div>
            </div>
          </article>
        ))}
        {profile.projects.length === 0 ? <EmptyEditorState message="No projects added yet." actionLabel="Add your first project" onAction={addProject} /> : null}
      </div>
    </section>
  );
}

function SkillsSection({ profile, onChange }: SectionProps) {
  const updateList = (key: 'skills' | 'languages', value: string) => {
    onChange({ ...profile, [key]: value.split(',').map((item) => item.trim()).filter(Boolean) });
  };

  return (
    <section className="editor-section" aria-labelledby="skills-heading">
      <SectionHeader id="skills-heading" title="Skills & languages" description="Keep your most relevant strengths easy to scan." />
      <div className="form-grid two-columns">
        <div className="field full-width"><TextAreaField id="skills" label="Skills" value={profile.skills.join(', ')} onChange={(event) => updateList('skills', event.target.value)} rows={4} hint="Separate skills with commas." /></div>
        <div className="field full-width"><TextAreaField id="languages" label="Languages" value={profile.languages.join(', ')} onChange={(event) => updateList('languages', event.target.value)} rows={4} hint="Include your level when it is helpful." /></div>
      </div>
      <div className="chip-list" aria-label="Current skills">
        {profile.skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}
      </div>
    </section>
  );
}

interface ApplicationSectionProps {
  profile: ProfileData;
  onChange: (patch: Partial<ProfileData['application']>) => void;
}

function ApplicationSection({ profile, onChange }: ApplicationSectionProps) {
  return (
    <section className="editor-section" aria-labelledby="application-heading">
      <SectionHeader id="application-heading" title="Application questions" description="Keep common application details ready for every role." />
      <div className="form-grid two-columns">
        <SelectField id="authorized-to-work" label="Authorized to work" value={profile.application.authorizedToWork} options={yesNoOptions} onChange={(event) => onChange({ authorizedToWork: event.target.value as ProfileData['application']['authorizedToWork'] })} />
        <SelectField id="requires-sponsorship" label="Requires sponsorship" value={profile.application.requiresSponsorship} options={yesNoOptions} onChange={(event) => onChange({ requiresSponsorship: event.target.value as ProfileData['application']['requiresSponsorship'] })} />
        <SelectField id="work-preference" label="Work preference" value={profile.application.workPreference} options={workPreferenceOptions} onChange={(event) => onChange({ workPreference: event.target.value as ProfileData['application']['workPreference'] })} />
        <SelectField id="willing-to-relocate" label="Willing to relocate" value={profile.application.willingToRelocate} options={yesNoOptions} onChange={(event) => onChange({ willingToRelocate: event.target.value as ProfileData['application']['willingToRelocate'] })} />
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  id: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

function SectionHeader({ id, title, description, action }: SectionHeaderProps) {
  return <div className="section-header"><div><p className="section-kicker">Profile section</p><h2 id={id}>{title}</h2><p>{description}</p></div>{action}</div>;
}

interface EmptyEditorStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

function EmptyEditorState({ message, actionLabel, onAction }: EmptyEditorStateProps) {
  return <div className="empty-editor-state"><p>{message}</p><button className="secondary-button" type="button" onClick={onAction}>{actionLabel}</button></div>;
}
