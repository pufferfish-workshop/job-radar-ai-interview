import type { ProfileData } from '@/lib/profile-types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasStringFields(value: unknown, fields: readonly string[]): boolean {
  return isRecord(value) && fields.every((field) => typeof value[field] === 'string');
}

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === 'string' && options.includes(value as T);
}

export function isProfileData(value: unknown): value is ProfileData {
  if (!isRecord(value)) return false;

  return (
    hasStringFields(value.basic, ['firstName', 'lastName', 'headline', 'email', 'location', 'summary']) &&
    Array.isArray(value.experience) &&
    value.experience.every((item) => hasStringFields(item, ['id', 'company', 'role', 'location', 'startDate', 'endDate', 'description'])) &&
    Array.isArray(value.education) &&
    value.education.every((item) => hasStringFields(item, ['id', 'school', 'degree', 'field', 'startYear', 'endYear'])) &&
    Array.isArray(value.projects) &&
    value.projects.every((item) => hasStringFields(item, ['id', 'name', 'description', 'url', 'technologies'])) &&
    Array.isArray(value.skills) &&
    value.skills.every((skill) => typeof skill === 'string') &&
    Array.isArray(value.languages) &&
    value.languages.every((language) => typeof language === 'string') &&
    isRecord(value.application) &&
    isOneOf(value.application.authorizedToWork, ['', 'yes', 'no']) &&
    isOneOf(value.application.requiresSponsorship, ['', 'yes', 'no']) &&
    isOneOf(value.application.workPreference, ['', 'remote', 'hybrid', 'onsite']) &&
    isOneOf(value.application.willingToRelocate, ['', 'yes', 'no'])
  );
}

export function cloneProfile(profile: ProfileData): ProfileData {
  return structuredClone(profile);
}

export function mergeProfilePatch(current: ProfileData, patch: unknown): ProfileData | null {
  if (!isRecord(patch)) return null;

  const allowedFields = new Set<keyof ProfileData>([
    'basic',
    'experience',
    'education',
    'projects',
    'skills',
    'languages',
    'application',
  ]);

  if (Object.keys(patch).some((field) => !allowedFields.has(field as keyof ProfileData))) return null;

  const candidate = {
    ...current,
    ...patch,
    basic: isRecord(patch.basic) ? { ...current.basic, ...patch.basic } : current.basic,
    application: isRecord(patch.application)
      ? { ...current.application, ...patch.application }
      : current.application,
  };

  return isProfileData(candidate) ? candidate : null;
}
