import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import MultiImageUploader from '../../components/MultiImageUploader';
import type { PortfolioSection, SectionType } from '../../types/portfolio';

interface Props {
  section: PortfolioSection;
  onChange: (updated: PortfolioSection) => void;
}

const SPACING_OPTIONS: { value: string; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
];

const COLUMN_OPTIONS = [2, 3, 4];

function updateSettings(section: PortfolioSection, key: string, value: unknown): PortfolioSection {
  return { ...section, settings: { ...section.settings, [key]: value } };
}

export default function SectionBlockForm({ section, onChange }: Props) {
  const type = section.section_type as SectionType;

  return (
    <div className="space-y-4">
      {(type === 'text_block' || type === 'two_column' || type === 'full_image') && (
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Title</label>
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) => onChange({ ...section, title: e.target.value || null })}
            placeholder="Optional title..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all"
          />
        </div>
      )}

      {(type === 'text_block' || type === 'two_column') && (
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Content</label>
          <textarea
            value={section.content || ''}
            onChange={(e) => onChange({ ...section, content: e.target.value || null })}
            rows={4}
            placeholder="Write your content..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all resize-none"
          />
        </div>
      )}

      {type === 'quote' && (
        <>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Quote Text</label>
            <textarea
              value={section.content || ''}
              onChange={(e) => onChange({ ...section, content: e.target.value || null })}
              rows={3}
              placeholder="Enter the quote..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Attribution</label>
            <input
              type="text"
              value={section.title || ''}
              onChange={(e) => onChange({ ...section, title: e.target.value || null })}
              placeholder="Who said it..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all"
            />
          </div>
        </>
      )}

      {(type === 'full_image' || type === 'two_column') && (
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Image</label>
          <ImageUploader
            value={section.image_url || ''}
            onChange={(url) => onChange({ ...section, image_url: url || null })}
            folder="sections"
          />
        </div>
      )}

      {type === 'image_gallery' && (
        <>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Gallery Title</label>
            <input
              type="text"
              value={section.title || ''}
              onChange={(e) => onChange({ ...section, title: e.target.value || null })}
              placeholder="Optional gallery title..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Images</label>
            <MultiImageUploader
              value={section.images || []}
              onChange={(urls) => onChange({ ...section, images: urls })}
              folder="galleries"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Columns</label>
            <div className="flex gap-2">
              {COLUMN_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange(updateSettings(section, 'columns', n))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    (section.settings.columns || 3) === n
                      ? 'bg-charcoal text-white'
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  {n} col
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {type === 'two_column' && (
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Image Position</label>
          <div className="flex gap-2">
            {(['left', 'right'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => onChange(updateSettings(section, 'image_position', pos))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  (section.settings.image_position || 'right') === pos
                    ? 'bg-charcoal text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === 'text_block' && (
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Alignment</label>
          <div className="flex gap-2">
            {([
              { value: 'left', icon: AlignLeft },
              { value: 'center', icon: AlignCenter },
              { value: 'right', icon: AlignRight },
            ] as const).map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange(updateSettings(section, 'alignment', value))}
                className={`p-2 rounded-lg transition-all ${
                  (section.settings.alignment || 'left') === value
                    ? 'bg-charcoal text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      {type === 'divider' && (
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Spacing</label>
          <div className="flex gap-2">
            {SPACING_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange(updateSettings(section, 'spacing', value))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (section.settings.spacing || 'medium') === value
                    ? 'bg-charcoal text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-1">Background Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={section.settings.bg_color || '#ffffff'}
            onChange={(e) => onChange(updateSettings(section, 'bg_color', e.target.value === '#ffffff' ? undefined : e.target.value))}
            className="w-8 h-8 rounded border border-neutral-200 cursor-pointer"
          />
          <input
            type="text"
            value={section.settings.bg_color || ''}
            onChange={(e) => onChange(updateSettings(section, 'bg_color', e.target.value || undefined))}
            placeholder="transparent"
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-mint-400/50 focus:border-mint-400 transition-all"
          />
          {section.settings.bg_color && (
            <button
              type="button"
              onClick={() => onChange(updateSettings(section, 'bg_color', undefined))}
              className="text-[10px] text-neutral-400 hover:text-charcoal uppercase tracking-wider transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
