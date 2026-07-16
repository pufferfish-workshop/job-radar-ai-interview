'use client';

import { useMemo, useState } from 'react';
import { ProfileEditor } from '@/components/profile-editor';
import { cloneProfile, isProfileData } from '@/lib/profile-data';
import type { ProfileData, SectionId } from '@/lib/profile-types';

type Notice = { type: 'success' | 'warning' | 'error'; message: string } | null;

interface ProfileWorkspaceProps {
  initialProfile: ProfileData;
}

export function ProfileWorkspace({ initialProfile }: ProfileWorkspaceProps) {
  const [profile, setProfile] = useState<ProfileData>(() => cloneProfile(initialProfile));
  const [savedProfile, setSavedProfile] = useState<ProfileData>(() => cloneProfile(initialProfile));
  const [activeSection, setActiveSection] = useState<SectionId>('basic');
  const [notice, setNotice] = useState<Notice>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(savedProfile), [profile, savedProfile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const saved = await readProfileResponse(response);
      setProfile(cloneProfile(saved));
      setSavedProfile(cloneProfile(saved));
      setNotice({ type: 'success', message: 'Profile saved to the API.' });
    } catch (error: unknown) {
      setNotice({ type: 'error', message: getRequestErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshProfile = async () => {
    if (isDirty && !window.confirm('Refresh from the API and discard your unsaved changes?')) return;

    setIsRefreshing(true);
    try {
      const response = await fetch('/api/profile', { cache: 'no-store' });
      const latest = await readProfileResponse(response);
      setProfile(cloneProfile(latest));
      setSavedProfile(cloneProfile(latest));
      setNotice({ type: 'success', message: 'Profile refreshed from the API.' });
    } catch (error: unknown) {
      setNotice({ type: 'error', message: getRequestErrorMessage(error) });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/profile"><span className="brand-mark">RS</span><span className="brand-name">Resume Studio</span></a>
        <div className="topbar-actions">
          <span className={`save-state ${isDirty ? 'is-dirty' : ''}`}><span className="save-state-dot" aria-hidden="true" />{isDirty ? 'Unsaved changes' : 'Synced with API'}</span>
          <button className="secondary-button topbar-refresh-button" type="button" onClick={handleRefreshProfile} disabled={isSaving || isRefreshing}>{isRefreshing ? 'Refreshing…' : 'Refresh from API'}</button>
          <button className="primary-button" type="button" onClick={handleSaveProfile} disabled={!isDirty || isSaving || isRefreshing}>{isSaving ? 'Saving…' : isDirty ? 'Save profile' : 'Profile saved'}</button>
        </div>
      </header>
      <div className="workspace-grid">
        <ProfileEditor profile={profile} activeSection={activeSection} onSectionChange={setActiveSection} onChange={(nextProfile) => { setProfile(nextProfile); setNotice(null); }} />
      </div>
      {notice ? <div className={`notice notice-${notice.type}`} role="status"><span aria-hidden="true">{notice.type === 'success' ? '✓' : notice.type === 'warning' ? '!' : '×'}</span><p>{notice.message}</p><button className="notice-close" type="button" aria-label="Dismiss message" onClick={() => setNotice(null)}>×</button></div> : null}
    </div>
  );
}

async function readProfileResponse(response: Response): Promise<ProfileData> {
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = isRecord(body) && typeof body.error === 'string'
      ? body.error
      : 'The profile API request failed.';
    throw new Error(message);
  }

  if (!isRecord(body) || !isProfileData(body.profile)) {
    throw new Error('The profile API returned an invalid response.');
  }

  return body.profile;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getRequestErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The profile API request failed.';
}
