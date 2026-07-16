import { demoProfile } from '@/lib/demo-profile';
import type { ProfileData, ResumeVersion } from '@/lib/profile-types';

export const PROFILE_STORAGE_KEY = 'resume-version-manager:profile:v1';
export const VERSIONS_STORAGE_KEY = 'resume-version-manager:versions:v1';

export class ProfileStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ProfileStorageError';
  }
}

export interface LoadResult<T> {
  value: T;
  warning?: string;
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProfileData(value: unknown): value is ProfileData {
  if (!isRecord(value)) return false;
  return (
    isRecord(value.basic) &&
    typeof value.basic.firstName === 'string' &&
    typeof value.basic.lastName === 'string' &&
    typeof value.basic.headline === 'string' &&
    typeof value.basic.email === 'string' &&
    typeof value.basic.location === 'string' &&
    typeof value.basic.summary === 'string' &&
    Array.isArray(value.experience) &&
    Array.isArray(value.education) &&
    Array.isArray(value.projects) &&
    Array.isArray(value.skills) &&
    value.skills.every((skill) => typeof skill === 'string') &&
    Array.isArray(value.languages) &&
    value.languages.every((language) => typeof language === 'string') &&
    isRecord(value.application)
  );
}

function isResumeVersion(value: unknown): value is ResumeVersion {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.createdAt === 'string' &&
    value.schemaVersion === 1 &&
    isProfileData(value.profile)
  );
}

export function loadProfile(): LoadResult<ProfileData> {
  const storage = getStorage();
  if (!storage) return { value: clone(demoProfile) };

  try {
    const raw = storage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { value: clone(demoProfile) };

    const parsed: unknown = JSON.parse(raw);
    if (isProfileData(parsed)) return { value: parsed };

    return {
      value: clone(demoProfile),
      warning: 'Saved profile data was not recognized, so the demo profile was restored.',
    };
  } catch {
    return {
      value: clone(demoProfile),
      warning: 'Saved profile data could not be read, so the demo profile was restored.',
    };
  }
}

export function loadVersions(): LoadResult<ResumeVersion[]> {
  const storage = getStorage();
  if (!storage) return { value: [] };

  try {
    const raw = storage.getItem(VERSIONS_STORAGE_KEY);
    if (!raw) return { value: [] };

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Versions must be an array');

    const versions = parsed.filter(isResumeVersion);
    if (versions.length !== parsed.length) {
      return {
        value: versions,
        warning: 'Some saved versions were skipped because their data was invalid.',
      };
    }

    return { value: versions };
  } catch {
    return {
      value: [],
      warning: 'Saved resume versions could not be read, so the version list was reset.',
    };
  }
}

function write(key: string, value: unknown): void {
  const storage = getStorage();
  if (!storage) {
    throw new ProfileStorageError('Browser storage is unavailable in this environment.');
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error: unknown) {
    throw new ProfileStorageError(
      'The browser could not save this change. Check available storage and try again.',
      { cause: error },
    );
  }
}

export function saveProfile(profile: ProfileData): void {
  write(PROFILE_STORAGE_KEY, profile);
}

export function saveVersions(versions: ResumeVersion[]): void {
  write(VERSIONS_STORAGE_KEY, versions);
}

export function createVersionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `version-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function cloneProfile(profile: ProfileData): ProfileData {
  return clone(profile);
}
