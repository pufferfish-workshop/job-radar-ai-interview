import { demoProfile } from '@/lib/demo-profile';
import { cloneProfile } from '@/lib/profile-data';
import type { ProfileData } from '@/lib/profile-types';

type ProfileGlobal = typeof globalThis & {
  __resumeStudioProfile?: ProfileData;
};

const profileGlobal = globalThis as ProfileGlobal;

export function getProfile(): ProfileData {
  profileGlobal.__resumeStudioProfile ??= cloneProfile(demoProfile);
  return cloneProfile(profileGlobal.__resumeStudioProfile);
}

export function replaceProfile(profile: ProfileData): ProfileData {
  profileGlobal.__resumeStudioProfile = cloneProfile(profile);
  return getProfile();
}
