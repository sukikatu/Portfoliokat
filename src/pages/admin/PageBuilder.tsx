import { useState, useEffect, useCallback } from 'react';
import { Plus, Save, Trash2, ChevronUp, ChevronDown, Loader2, Copy, Type, Image, LayoutGrid, Columns, Quote, Minus, Monitor, Smartphone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SectionBlockForm from './SectionBlockForm';
import SectionRenderer from '../../components/sections/SectionRenderer';
import type { PortfolioSection, SectionType } from '../../types/portfolio';

const SECTION_TYPES: { type: SectionType; label: string; icon: typeof Type }[] = [
  { type: 'text_block', label: 'Text Block', icon: Type },
  { type: 'full_image', label: 'Full Image', icon: Image },
  { type: 'image_gallery', label: 'Gallery', icon: LayoutGrid },
  { type: 'two_column', label: 'Two Column', icon: Columns },
  { type: 'quote', label: 'Quote', icon: Quote },
  { type: 'divider', label: 'Divider', icon: Minus },
];

function makeNewSection(type: SectionType, parent: string, order: number): Omit<PortfolioSection, 'id' | 'created_at' | 'updated_at'> {
  return {
    section_type: type,
    title: null,
    content: null,
    image_url: null,
    images: [],
    display_order: order,
    parent,
    settings: {},
  };
}

interface PageBuilderProps {
  parent?: string;
}

export default function PageBuilder({ parent = 'home' }: PageBuilderProps) {
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | null>(null);
  const [parentFilter, setParentFilter] = useState(parent);
  const [availableParents, setAvailableParents] = useState<string[]>([]);

  const fetchSections = useCallback(async () => {
    const { data } = await supabase
      .from('portfolio_sections')
      .select('*')
      .eq('parent', parentFilter)
      .order('display_order');
    setSections((data as PortfolioSection[]) || []);
    setLoading(false);
  }, [parentFilter]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    async function loadParents() {
      const [{ data: projectData }, { data: sectionData }] = await Promise.all([
        supabase.from('projects').select('slug'),
        supabase.from('portfolio_sections').select('parent'),
      ]);

      const parents = new Set<string>(['home']);
      projectData?.forEach((p: { slug: string }) => parents.add(p.slug));
      sectionData?.forEach((s: { parent: string }) => parents.add(s.parent));
      setAvailableParents(Array.from(parents).sort());
    }
    loadParents();
  }, []);

  function showMsg(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleAdd(type: SectionType) {
    setShowPicker(false);
    const order = sections.length > 0 ? Math.max(...sections.map(s => s.display_order)) + 1 : 0;
    const payload = makeNewSection(type, parentFilter, order);

    const { data, error } = await supabase
      .from('portfolio_sections')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      showMsg(error.message);
      return;
    }

    if (data) {
      setSections(prev => [...prev, data as PortfolioSection]);
      setExpandedId(data.id);
    }
  }

  async function handleSave(section: PortfolioSection) {
    setSaving(true);
    const { id, created_at, updated_at, ...updates } = section;
    void created_at;
    void updated_at;
    const { error } = await supabase
      .from('portfolio_sections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    setSaving(false);
    showMsg(error ? error.message : 'Saved!');
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this section?')) return;
    await supabase.from('portfolio_sections').delete().eq('id', id);
    setSections(prev => prev.filter(s => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  async function handleDuplicate(section: PortfolioSection) {
    const order = sections.length > 0 ? Math.max(...sections.map(s => s.display_order)) + 1 : 0;
    const { id, created_at, updated_at, ...rest } = section;
    void id;
    void created_at;
    void updated_at;
    const { data, error } = await supabase
      .from('portfolio_sections')
      .insert({ ...rest, display_order: order })
      .select()
      .maybeSingle();

    if (!error && data) {
      setSections(prev => [...prev, data as PortfolioSection]);
      setExpandedId(data.id);
    }
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const updated = [...sections];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    updated.forEach((s, i) => { s.display_order = i; });
    setSections(updated);
  }

  async function saveOrder() {
    setSaving(true);
    for (const section of sections) {
      await supabase.from('portfolio_sections').update({ display_order: section.display_order }).eq('id', section.id);
    }
    setSaving(false);
    showMsg('Order saved!');
  }

  function updateSection(id: string, updated: PortfolioSection) {
    setSections(prev => prev.map(s => s.id === id ? updated : s));
  }

  const sectionLabel = (type: SectionType) =>
    SECTION_TYPES.find(t => t.type === type)?.label || type;

  const SectionIcon = (type: SectionType) =>
    SECTION_TYPES.find(t => t.type === type)?.icon || Type;

  if (loading) return <div className="p-8 text-neutral-500">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      <div className={`${previewMode !== null ? 'lg:w-1/2' : 'w-full'} shrink-0`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-charcoal">Page Builder</h2>
            <select
              value={parentFilter}
              onChange={(e) => { setParentFilter(e.target.value); setLoading(true); }}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50"
            >
              {availableParents.map(p => (
                <option key={p} value={p}>{p === 'home' ? 'Home Page' : p}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(previewMode === null ? 'desktop' : null)}
              className={`p-2 rounded-lg transition-all ${
                previewMode !== null ? 'bg-charcoal text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
              title="Toggle preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            {sections.length > 1 && (
              <button
                onClick={saveOrder}
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-neutral-100 text-charcoal text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Save Order
              </button>
            )}
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="inline-flex items-center gap-2 bg-mint-400 text-charcoal text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-lg hover:bg-mint-300 transition-all font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Block
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-3 text-sm px-4 py-2 rounded-lg ${
            message.includes('!') && !message.includes('error') ? 'bg-mint-100 text-mint-500' : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

        {showPicker && (
          <div className="mb-4 bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-3">Choose a block type</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SECTION_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => handleAdd(type)}
                  className="flex items-center gap-2 p-3 bg-white border border-neutral-200 rounded-lg hover:border-mint-400 hover:bg-mint-100/20 transition-all text-left"
                >
                  <Icon className="w-4 h-4 text-mint-500 shrink-0" />
                  <span className="text-sm text-charcoal font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sections.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <LayoutGrid className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No sections yet. Add your first block to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section, index) => {
              const Icon = SectionIcon(section.section_type);
              const isExpanded = expandedId === section.id;

              return (
                <div key={section.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : section.id)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }}
                        disabled={index === 0}
                        className="text-neutral-400 hover:text-charcoal disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }}
                        disabled={index === sections.length - 1}
                        className="text-neutral-400 hover:text-charcoal disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Icon className="w-4 h-4 text-mint-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-charcoal">
                        {section.title || sectionLabel(section.section_type)}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 ml-2">
                        {sectionLabel(section.section_type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDuplicate(section)}
                        className="p-1.5 text-neutral-400 hover:text-charcoal transition-colors rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSave(section)}
                        disabled={saving}
                        className="p-1.5 text-neutral-400 hover:text-mint-500 transition-colors rounded"
                        title="Save"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-neutral-100 pt-4">
                      <SectionBlockForm
                        section={section}
                        onChange={(updated) => updateSection(section.id, updated)}
                      />
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleSave(section)}
                          disabled={saving}
                          className="inline-flex items-center gap-1.5 bg-charcoal text-white text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          Save Block
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {previewMode !== null && (
        <div className="flex-1 border border-neutral-200 rounded-xl bg-cream overflow-hidden">
          <div className="bg-white border-b border-neutral-200 px-4 py-2 flex items-center gap-2">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded transition-all ${previewMode === 'desktop' ? 'bg-charcoal text-white' : 'text-neutral-400 hover:text-charcoal'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded transition-all ${previewMode === 'mobile' ? 'bg-charcoal text-white' : 'text-neutral-400 hover:text-charcoal'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 ml-2">Live Preview</span>
          </div>
          <div className={`overflow-y-auto h-[calc(100vh-220px)] ${previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
            <SectionRenderer sections={sections} />
            {sections.length === 0 && (
              <div className="flex items-center justify-center h-64 text-neutral-400 text-sm">
                Add blocks to see a preview
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
