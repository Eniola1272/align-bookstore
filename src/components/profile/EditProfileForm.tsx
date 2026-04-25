'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface EditProfileFormProps {
  user: {
    name: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    avatar: user.avatar || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully.');
      router.push('/profile');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-soft p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-brand-950 mb-2">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-gray-400 outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-950 mb-2">
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-gray-400 outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-950 mb-2">
          Email (read-only)
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2.5 border border-brand-100 rounded-lg bg-brand-50 text-gray-400 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-950 mb-2">
          Avatar URL (optional)
        </label>
        <input
          type="url"
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 bg-brand-50/30 text-brand-950 placeholder-gray-400 outline-none transition-colors"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-600 text-white py-3 rounded-pill font-semibold hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-glow"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="px-6 py-3 border border-brand-200 rounded-pill font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
