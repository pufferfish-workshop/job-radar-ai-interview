import { ProfileWorkspace } from '@/components/profile-workspace';
import { getProfile } from '@/lib/profile-store';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return <ProfileWorkspace initialProfile={getProfile()} />;
}
