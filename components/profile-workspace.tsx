'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProfileEditor } from '@/components/profile-editor';
import { VersionManager } from '@/components/version-manager';
import { demoProfile } from '@/lib/demo-profile';
import { cloneProfile, createVersionId, loadProfile, loadVersions, saveProfile, saveVersions, ProfileStorageError } from '@/lib/profile-storage';
import type { ProfileData, ResumeVersion, SectionId } from '@/lib/profile-types';

type Notice = { type: 'success' | 'warning' | 'error'; message: string } | null;

const MAX_VERSIONS = 10;

export function ProfileWorkspace() {
  const [profile, setProfile] = useState<ProfileData>(demoProfile);
  const [savedProfile, setSavedProfile] = useState<ProfileData>(demoProfile);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('basic');
  const [notice, setNotice] = useState<Notice>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initializeWorkspace = () => {
      const profileResult = loadProfile();
      const versionsResult = loadVersions();
      setProfile(profileResult.value);
      setSavedProfile(cloneProfile(profileResult.value));
      setVersions(versionsResult.value.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      const warning = profileResult.warning ?? versionsResult.warning;
      if (warning) setNotice({ type: 'warning', message: warning });
      setHydrated(true);
    };

    window.setTimeout(initializeWorkspace, 0);
  }, []);

  const isDirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(savedProfile), [profile, savedProfile]);

  const handleSaveProfile = () => {
    try {
      saveProfile(profile);
      setSavedProfile(cloneProfile(profile));
      setNotice({ type: 'success', message: 'Profile saved locally.' });
    } catch (error: unknown) {
      setNotice({ type: 'error', message: getStorageErrorMessage(error) });
    }
  };

  const handleCreateVersion = (name: string): boolean => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNotice({ type: 'error', message: 'Give this version a name before saving it.' });
      return false;
    }

    const newVersion: ResumeVersion = {
      id: createVersionId(),
      name: trimmedName,
      createdAt: new Date().toISOString(),
      schemaVersion: 1,
      profile: cloneProfile(profile),
    };
    const nextVersions = [newVersion, ...versions].slice(0, MAX_VERSIONS);

    try {
      saveVersions(nextVersions);
      setVersions(nextVersions);
      setSelectedVersionId(newVersion.id);
      setNotice({ type: 'success', message: nextVersions.length === MAX_VERSIONS ? 'Version saved. The oldest checkpoint was removed to keep the list at 10.' : 'Version saved locally.' });
      return true;
    } catch (error: unknown) {
      setNotice({ type: 'error', message: getStorageErrorMessage(error) });
      return false;
    }
  };

  const handleRestore = (version: ResumeVersion) => {
    setProfile(cloneProfile(version.profile));
    setActiveSection('basic');
    setNotice({ type: 'warning', message: `“${version.name}” is loaded into the editor. Save profile to keep the change.` });
  };

  const handleRename = (versionId: string, name: string): boolean => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNotice({ type: 'error', message: 'A version name cannot be empty.' });
      return false;
    }

    const nextVersions = versions.map((version) => version.id === versionId ? { ...version, name: trimmedName } : version);
    try {
      saveVersions(nextVersions);
      setVersions(nextVersions);
      setNotice({ type: 'success', message: 'Version renamed.' });
      return true;
    } catch (error: unknown) {
      setNotice({ type: 'error', message: getStorageErrorMessage(error) });
      return false;
    }
  };

  const handleDelete = (versionId: string) => {
    const nextVersions = versions.filter((version) => version.id !== versionId);
    try {
      saveVersions(nextVersions);
      setVersions(nextVersions);
      setSelectedVersionId(null);
      setNotice({ type: 'success', message: 'Version deleted.' });
    } catch (error: unknown) {
      setNotice({ type: 'error', message: getStorageErrorMessage(error) });
    }
  };

  if (!hydrated) {
    return <div className="loading-screen"><div className="loading-mark">RS</div><p>Loading your profile workspace…</p></div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/profile"><span className="brand-mark">RS</span><span>Resume Studio</span></a>
        <div className="topbar-actions"><span className={`save-state ${isDirty ? 'is-dirty' : ''}`}><span className="save-state-dot" aria-hidden="true" />{isDirty ? 'Unsaved changes' : 'All changes saved'}</span><button className="primary-button" type="button" onClick={handleSaveProfile} disabled={!isDirty}>{isDirty ? 'Save profile' : 'Profile saved'}</button></div>
      </header>
      <div className="workspace-grid">
        <ProfileEditor profile={profile} activeSection={activeSection} onSectionChange={setActiveSection} onChange={(nextProfile) => { setProfile(nextProfile); setNotice(null); }} />
        <VersionManager currentProfile={profile} versions={versions} selectedVersionId={selectedVersionId} onSelectVersion={setSelectedVersionId} onCreateVersion={handleCreateVersion} onRestore={handleRestore} onRename={handleRename} onDelete={handleDelete} />
      </div>
      {notice ? <div className={`notice notice-${notice.type}`} role="status"><span aria-hidden="true">{notice.type === 'success' ? '✓' : notice.type === 'warning' ? '!' : '×'}</span><p>{notice.message}</p><button className="notice-close" type="button" aria-label="Dismiss message" onClick={() => setNotice(null)}>×</button></div> : null}
    </div>
  );
}

function getStorageErrorMessage(error: unknown): string {
  if (error instanceof ProfileStorageError) return error.message;
  return 'This change could not be saved. Please try again.';
}
