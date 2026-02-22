import { useState, useEffect } from 'react';
import { Loader2, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Skill } from '../../types/portfolio';

export default function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchSkills() {
    const { data } = await supabase.from('skills').select('*').order('display_order');
    setSkills(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchSkills(); }, []);

  async function handleSaveAll() {
    setSaving(true);
    setMessage('');

    for (const skill of skills) {
      const { id, ...updates } = skill;
      await supabase.from('skills').update(updates).eq('id', id);
    }

    setSaving(false);
    setMessage('All skills saved!');
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleAdd() {
    const newOrder = skills.length + 1;
    const { error } = await supabase.from('skills').insert({
      name: 'New Skill',
      display_order: newOrder,
    });
    if (!error) fetchSkills();
  }

  async function handleDelete(id: string) {
    await supabase.from('skills').delete().eq('id', id);
    fetchSkills();
  }

  if (loading) return <div className="p-8 text-neutral-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-charcoal">Skills (Marquee)</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-mint-400 text-charcoal text-xs uppercase tracking-[0.15em] px-4 py-2.5 rounded-lg hover:bg-mint-300 transition-all font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-charcoal text-white text-xs uppercase tracking-[0.15em] px-4 py-2.5 rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save All
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 text-sm px-4 py-2 rounded-lg bg-mint-100 text-mint-500">{message}</div>
      )}

      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={skill.id} className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3">
            <GripVertical className="w-4 h-4 text-neutral-300 shrink-0" />
            <input
              type="number"
              value={skill.display_order}
              onChange={(e) => setSkills(prev => prev.map((s, i) => i === index ? { ...s, display_order: Number(e.target.value) } : s))}
              className="w-16 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 transition-all text-center"
            />
            <input
              type="text"
              value={skill.name}
              onChange={(e) => setSkills(prev => prev.map((s, i) => i === index ? { ...s, name: e.target.value } : s))}
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 transition-all"
            />
            <button
              onClick={() => handleDelete(skill.id)}
              className="text-neutral-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
