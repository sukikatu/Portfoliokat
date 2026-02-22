import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/ImageUploader';
import type { Profile } from '../../types/portfolio';

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.from('profile').select('*').maybeSingle().then(({ data }) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage('');

    const { id, ...updates } = profile;
    const { error } = await supabase
      .from('profile')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    setSaving(false);
    setMessage(error ? error.message : 'Profile saved!');
    setTimeout(() => setMessage(''), 3000);
  }

  if (loading) return <div className="p-8 text-neutral-500">Loading...</div>;
  if (!profile) return <div className="p-8 text-neutral-500">No profile found.</div>;

  const fields: { key: keyof Profile; label: string; multiline?: boolean }[] = [
    { key: 'name', label: 'Name' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'role_title', label: 'Role Title' },
    { key: 'headline', label: 'Headline' },
    { key: 'headline_accent', label: 'Headline Accent (cursive)' },
    { key: 'description', label: 'Description', multiline: true },
    { key: 'job_title', label: 'Job Title' },
    { key: 'location', label: 'Location' },
    { key: 'experience', label: 'Experience' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'email', label: 'Email' },
    { key: 'linkedin_url', label: 'LinkedIn URL' },
    { key: 'twitter_url', label: 'Twitter URL' },
    { key: 'github_url', label: 'GitHub URL' },
    { key: 'methodology_quote', label: 'Methodology Quote' },
    { key: 'methodology_description', label: 'Methodology Description', multiline: true },
    { key: 'cta_headline', label: 'CTA Headline' },
    { key: 'cta_accent', label: 'CTA Accent (cursive)' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-charcoal">Profile</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-charcoal text-white text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </button>
      </div>

      {message && (
        <div className={`mb-4 text-sm px-4 py-2 rounded-lg ${message.includes('!') ? 'bg-mint-100 text-mint-500' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Avatar Photo</label>
          <ImageUploader
            value={profile.avatar_url || ''}
            onChange={(url) => setProfile({ ...profile, avatar_url: url })}
            folder="profile"
            compact
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Hero Background Image</label>
          <ImageUploader
            value={profile.hero_image_url || ''}
            onChange={(url) => setProfile({ ...profile, hero_image_url: url })}
            folder="profile"
            compact
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ key, label, multiline }) => (
          <div key={key} className={multiline ? 'md:col-span-2' : ''}>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">
              {label}
            </label>
            {multiline ? (
              <textarea
                value={(profile[key] as string) || ''}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                rows={3}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all resize-none"
              />
            ) : (
              <input
                type="text"
                value={(profile[key] as string) || ''}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
