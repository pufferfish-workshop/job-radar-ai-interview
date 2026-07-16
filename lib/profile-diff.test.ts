import { describe, expect, it } from 'vitest';
import { demoProfile } from '@/lib/demo-profile';
import { compareProfiles, summarizeProfile } from '@/lib/profile-diff';
import type { ProfileData } from '@/lib/profile-types';

describe('profile diff', () => {
  it('returns no changes for equivalent profiles', () => {
    expect(compareProfiles(demoProfile, structuredClone(demoProfile))).toEqual([]);
  });

  it('reports changed basic, collection, and application fields', () => {
    const selected: ProfileData = structuredClone(demoProfile);
    selected.basic.headline = 'Senior Product Manager building scalable SaaS platforms';
    selected.skills = [...selected.skills, 'Figma'];
    selected.application.workPreference = 'remote';

    expect(compareProfiles(demoProfile, selected)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ section: 'Basic info', field: 'Headline' }),
        expect.objectContaining({ section: 'Profile content', field: 'Skills' }),
        expect.objectContaining({ section: 'Application questions', field: 'Work preference' }),
      ]),
    );
  });

  it('summarizes the useful profile sections', () => {
    expect(summarizeProfile(demoProfile)).toBe('2 roles · 1 project · 5 skills');
  });
});
