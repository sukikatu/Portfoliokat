import { useState, useEffect } from 'react';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/ImageUploader';
import MultiImageUploader from '../../components/MultiImageUploader';
import type { Project } from '../../types/portfolio';

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('display_order');
    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchProjects(); }, []);

  async function handleSave(project: Project) {
    setSaving(true);
    setMessage('');
    const { id, ...updates } = project;
    const { error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    setSaving(false);
    setMessage(error ? error.message : 'Saved!');
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleAdd() {
    const newOrder = projects.length + 1;
    const slug = `project-${Date.now()}`;
    const { error } = await supabase.from('projects').insert({
      slug,
      number: String(newOrder).padStart(2, '0'),
      title: 'New Project',
      category: 'CATEGORY',
      description: 'Project description',
      long_description: 'Full case study description.',
      stat_label_1: 'STAT',
      stat_value_1: '0',
      stat_label_2: 'STAT',
      stat_value_2: '0',
      bg_color: '#e8f5e9',
      display_order: newOrder,
      thumbnail_url: '',
      images: [],
    });
    if (!error) fetchProjects();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  }

  function updateProject(index: number, key: keyof Project, value: string | number | string[]) {
    setProjects(prev => prev.map((p, i) => i === index ? { ...p, [key]: value } : p));
  }

  if (loading) return <div className="p-8 text-neutral-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-charcoal">Projects</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-mint-400 text-charcoal text-xs uppercase tracking-[0.15em] px-4 py-2.5 rounded-lg hover:bg-mint-300 transition-all font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {message && (
        <div className={`mb-4 text-sm px-4 py-2 rounded-lg ${message === 'Saved!' ? 'bg-mint-100 text-mint-500' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={project.id} className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-charcoal">{project.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(project)}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 bg-charcoal text-white text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Thumbnail</label>
                <ImageUploader
                  value={project.thumbnail_url || ''}
                  onChange={(url) => updateProject(index, 'thumbnail_url', url)}
                  folder={`projects/${project.slug}`}
                  compact
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Project Images</label>
                <MultiImageUploader
                  value={project.images || []}
                  onChange={(urls) => updateProject(index, 'images', urls)}
                  folder={`projects/${project.slug}`}
                  max={8}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([
                ['slug', 'Slug'],
                ['number', 'Number'],
                ['category', 'Category'],
                ['title', 'Title'],
                ['stat_label_1', 'Stat Label 1'],
                ['stat_value_1', 'Stat Value 1'],
                ['stat_label_2', 'Stat Label 2'],
                ['stat_value_2', 'Stat Value 2'],
                ['bg_color', 'Background Color'],
                ['display_order', 'Order'],
              ] as [keyof Project, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">
                    {label}
                  </label>
                  <input
                    type={key === 'display_order' ? 'number' : 'text'}
                    value={project[key] as string}
                    onChange={(e) => updateProject(index, key, key === 'display_order' ? Number(e.target.value) : e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Long Description</label>
                <textarea
                  value={project.long_description}
                  onChange={(e) => updateProject(index, 'long_description', e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
