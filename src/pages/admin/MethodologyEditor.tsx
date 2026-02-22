import { useState, useEffect } from 'react';
import { Loader2, Save, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { MethodologyItem } from '../../types/portfolio';

export default function MethodologyEditor() {
  const [items, setItems] = useState<MethodologyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchItems() {
    const { data } = await supabase.from('methodology_items').select('*').order('display_order');
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleSave(item: MethodologyItem) {
    setSaving(true);
    setMessage('');
    const { id, ...updates } = item;
    const { error } = await supabase.from('methodology_items').update(updates).eq('id', id);
    setSaving(false);
    setMessage(error ? error.message : 'Saved!');
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleAdd() {
    const newOrder = items.length + 1;
    const { error } = await supabase.from('methodology_items').insert({
      number: String(newOrder).padStart(2, '0'),
      title: 'New Item',
      items: ['Item 1'],
      display_order: newOrder,
    });
    if (!error) fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    await supabase.from('methodology_items').delete().eq('id', id);
    fetchItems();
  }

  function updateItem(index: number, key: keyof MethodologyItem, value: string | string[] | number) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  }

  function addBulletPoint(index: number) {
    const item = items[index];
    updateItem(index, 'items', [...item.items, '']);
  }

  function removeBulletPoint(itemIndex: number, bulletIndex: number) {
    const item = items[itemIndex];
    updateItem(itemIndex, 'items', item.items.filter((_, i) => i !== bulletIndex));
  }

  function updateBulletPoint(itemIndex: number, bulletIndex: number, value: string) {
    const item = items[itemIndex];
    const newItems = [...item.items];
    newItems[bulletIndex] = value;
    updateItem(itemIndex, 'items', newItems);
  }

  if (loading) return <div className="p-8 text-neutral-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-charcoal">Methodology Items</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-mint-400 text-charcoal text-xs uppercase tracking-[0.15em] px-4 py-2.5 rounded-lg hover:bg-mint-300 transition-all font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      {message && (
        <div className={`mb-4 text-sm px-4 py-2 rounded-lg ${message === 'Saved!' ? 'bg-mint-100 text-mint-500' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-charcoal">{item.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(item)}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 bg-charcoal text-white text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Number</label>
                <input
                  type="text"
                  value={item.number}
                  onChange={(e) => updateItem(index, 'number', e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Title</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Order</label>
                <input
                  type="number"
                  value={item.display_order}
                  onChange={(e) => updateItem(index, 'display_order', Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-2">Bullet Points</label>
              <div className="space-y-2">
                {item.items.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 transition-all"
                    />
                    <button
                      onClick={() => removeBulletPoint(index, bulletIndex)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addBulletPoint(index)}
                  className="text-xs text-mint-500 hover:text-mint-400 transition-colors"
                >
                  + Add point
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
