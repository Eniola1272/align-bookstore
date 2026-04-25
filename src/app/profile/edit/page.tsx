import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { getProfileById } from '@/lib/supabase/queries';
import EditProfileForm from '@/components/profile/EditProfileForm';

export default async function EditProfilePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/signin');

  const profile = await getProfileById(user.id);
  if (!profile) redirect('/auth/signin');

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-brand-950">Edit Profile</h1>
          <p className="text-gray-500 mt-2">Update your personal information</p>
        </div>

        <EditProfileForm user={{ name: profile.name, username: profile.username, email: user.email!, avatar: profile.avatar ?? undefined }} />
      </div>
    </div>
  );
}
