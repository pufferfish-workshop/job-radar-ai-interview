import { NextResponse } from 'next/server';
import { isProfileData, mergeProfilePatch } from '@/lib/profile-data';
import { getProfile, replaceProfile } from '@/lib/profile-store';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ profile: getProfile() });
}

export async function PUT(request: Request) {
  const body = await readJson(request);
  if (!isProfileData(body)) {
    return NextResponse.json({ error: 'A complete, valid profile is required.' }, { status: 400 });
  }

  return NextResponse.json({ profile: replaceProfile(body) });
}

export async function PATCH(request: Request) {
  const body = await readJson(request);
  const profile = mergeProfilePatch(getProfile(), body);

  if (!profile) {
    return NextResponse.json({ error: 'The profile update is invalid.' }, { status: 400 });
  }

  return NextResponse.json({ profile: replaceProfile(profile) });
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
