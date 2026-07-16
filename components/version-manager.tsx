'use client';

import { useState } from 'react';
import { compareProfiles, summarizeProfile } from '@/lib/profile-diff';
import type { ProfileData, ResumeVersion } from '@/lib/profile-types';

interface VersionManagerProps {
  currentProfile: ProfileData;
  versions: ResumeVersion[];
  selectedVersionId: string | null;
  onSelectVersion: (id: string | null) => void;
  onCreateVersion: (name: string) => boolean;
  onRestore: (version: ResumeVersion) => void;
  onRename: (versionId: string, name: string) => boolean;
  onDelete: (versionId: string) => void;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function VersionManager({
  currentProfile,
  versions,
  selectedVersionId,
  onSelectVersion,
  onCreateVersion,
  onRestore,
  onRename,
  onDelete,
}: VersionManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const selectedVersion = versions.find((version) => version.id === selectedVersionId) ?? null;
  const changes = selectedVersion ? compareProfiles(currentProfile, selectedVersion.profile) : [];

  const createVersion = () => {
    if (onCreateVersion(name)) {
      setName('');
      setIsCreating(false);
    }
  };

  const renameVersion = () => {
    if (!selectedVersion) return;
    if (onRename(selectedVersion.id, renameValue)) {
      setIsRenaming(false);
    }
  };

  return (
    <aside className="versions-panel" aria-label="Resume versions">
      <div className="versions-heading">
        <div><p className="section-kicker">Local history</p><h2>Resume versions</h2><p>Save a checkpoint before you tailor your profile.</p></div>
        <button className="primary-button compact-button" type="button" onClick={() => setIsCreating((current) => !current)}>{isCreating ? 'Close' : 'Save version'}</button>
      </div>

      {isCreating ? (
        <form className="create-version-form" onSubmit={(event) => { event.preventDefault(); createVersion(); }}>
          <label className="field-label" htmlFor="version-name">Version name</label>
          <div className="inline-form"><input className="text-input" id="version-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Product-focused" autoFocus /><button className="primary-button" type="submit">Create</button></div>
          <p className="field-hint">This saves the profile exactly as it is now.</p>
        </form>
      ) : null}

      <div className="version-list">
        <button className={`version-row ${selectedVersionId === null ? 'is-selected' : ''}`} type="button" onClick={() => onSelectVersion(null)}>
          <span className="version-radio" aria-hidden="true" />
          <span className="version-row-copy"><strong>Current profile</strong><small>Active in editor</small><em>{summarizeProfile(currentProfile)}</em></span>
        </button>
        {versions.map((version) => (
          <button className={`version-row ${selectedVersionId === version.id ? 'is-selected' : ''}`} key={version.id} type="button" onClick={() => onSelectVersion(version.id)}>
            <span className="version-radio" aria-hidden="true" />
            <span className="version-row-copy"><strong>{version.name}</strong><small>{formatDate(version.createdAt)}</small><em>{summarizeProfile(version.profile)}</em></span>
          </button>
        ))}
      </div>

      {versions.length === 0 ? <div className="versions-empty"><span className="empty-icon" aria-hidden="true">+</span><p>No saved versions yet.</p><small>Create a checkpoint before making a major change.</small></div> : null}

      {selectedVersion ? (
        <div className="compare-panel">
          <div className="compare-heading"><div><p className="section-kicker">Selected version</p><h3>{selectedVersion.name}</h3></div><span className="change-count">{changes.length} change{changes.length === 1 ? '' : 's'}</span></div>
          <div className="compare-table" role="table" aria-label={`Changes in ${selectedVersion.name}`}>
            <div className="compare-table-heading" role="row"><span role="columnheader">Field</span><span role="columnheader">Current</span><span role="columnheader">Version</span></div>
            {changes.length ? changes.slice(0, 5).map((change) => <div className="compare-row" role="row" key={`${change.section}-${change.field}`}><strong>{change.field}</strong><span>{change.currentValue}</span><span>{change.selectedValue}</span></div>) : <p className="no-changes">This version matches the current profile.</p>}
          </div>
          {changes.length > 5 ? <p className="more-changes">+ {changes.length - 5} more changes</p> : null}
          <button className="restore-button" type="button" onClick={() => onRestore(selectedVersion)}>Restore version</button>
          <p className="restore-note">Restoring changes the editor only. Save profile when you are ready to commit it.</p>
          <div className="version-actions">
            {isRenaming ? <div className="inline-form"><input className="text-input" value={renameValue} onChange={(event) => setRenameValue(event.target.value)} aria-label="New version name" autoFocus /><button className="text-button" type="button" onClick={renameVersion}>Done</button></div> : <button className="text-button" type="button" onClick={() => { setRenameValue(selectedVersion.name); setIsRenaming(true); }}>Rename</button>}
            <button className="text-button danger-text" type="button" onClick={() => { if (window.confirm(`Delete “${selectedVersion.name}”? This cannot be undone.`)) onDelete(selectedVersion.id); }}>Delete version</button>
          </div>
        </div>
      ) : <div className="current-profile-note"><span className="note-mark">✓</span><p><strong>Editing current profile</strong><br />Create a version when you want a safe checkpoint before tailoring it.</p></div>}
    </aside>
  );
}
