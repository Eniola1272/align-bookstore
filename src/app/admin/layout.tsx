import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { getProfileById } from '@/lib/supabase/queries';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — Align Bookstore' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/signin');

  const profile = await getProfileById(user.id);
  if (profile?.role !== 'admin') redirect('/');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}
