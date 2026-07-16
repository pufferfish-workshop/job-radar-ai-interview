import type { ProfileChange, ProfileData, ResumeVersion } from '@/lib/profile-types';

function displayValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length === 0 ? 'None' : value.join(', ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }

  return String(value || 'Not provided');
}

function normalizedValue(value: unknown): string {
  return JSON.stringify(value);
}

export function compareProfiles(current: ProfileData, selected: ProfileData): ProfileChange[] {
  const changes: ProfileChange[] = [];

  const basicFields: Array<[string, keyof ProfileData['basic']]> = [
    ['First name', 'firstName'],
    ['Last name', 'lastName'],
    ['Headline', 'headline'],
    ['Email', 'email'],
    ['Location', 'location'],
    ['Summary', 'summary'],
  ];

  basicFields.forEach(([field, key]) => {
    if (normalizedValue(current.basic[key]) !== normalizedValue(selected.basic[key])) {
      changes.push({
        section: 'Basic info',
        field,
        currentValue: displayValue(current.basic[key]),
        selectedValue: displayValue(selected.basic[key]),
      });
    }
  });

  const collectionFields: Array<[
    string,
    keyof Pick<ProfileData, 'experience' | 'education' | 'projects' | 'skills' | 'languages'>,
  ]> = [
    ['Experience', 'experience'],
    ['Education', 'education'],
    ['Projects', 'projects'],
    ['Skills', 'skills'],
    ['Languages', 'languages'],
  ];

  collectionFields.forEach(([field, key]) => {
    if (normalizedValue(current[key]) !== normalizedValue(selected[key])) {
      changes.push({
        section: 'Profile content',
        field,
        currentValue: displayValue(current[key]),
        selectedValue: displayValue(selected[key]),
      });
    }
  });

  const applicationFields: Array<[string, keyof ProfileData['application']]> = [
    ['Work authorization', 'authorizedToWork'],
    ['Sponsorship', 'requiresSponsorship'],
    ['Work preference', 'workPreference'],
    ['Relocation', 'willingToRelocate'],
  ];

  applicationFields.forEach(([field, key]) => {
    if (
      normalizedValue(current.application[key]) !== normalizedValue(selected.application[key])
    ) {
      changes.push({
        section: 'Application questions',
        field,
        currentValue: displayValue(current.application[key]),
        selectedValue: displayValue(selected.application[key]),
      });
    }
  });

  return changes;
}

export function summarizeProfile(profile: ProfileData): string {
  const parts = [
    profile.experience.length ? `${profile.experience.length} roles` : null,
    profile.projects.length ? `${profile.projects.length} project${profile.projects.length === 1 ? '' : 's'}` : null,
    profile.skills.length ? `${profile.skills.length} skills` : null,
  ].filter((part): part is string => Boolean(part));

  return parts.length ? parts.join(' · ') : 'Profile details';
}

export function countChanges(current: ProfileData, version: ResumeVersion): number {
  return compareProfiles(current, version.profile).length;
}
