import { useState, useRef, useCallback } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  className?: string;
  max?: number;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function MultiImageUploader({ value, onChange, folder = 'general', className = '', max = 12 }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (files: FileList) => {
    const toUpload = Array.from(files).filter(f => {
      if (!ACCEPTED.includes(f.type)) return false;
      if (f.size > MAX_SIZE) return false;
      return true;
    });

    if (toUpload.length === 0) {
      setError('No valid files selected.');
      return;
    }

    if (value.length + toUpload.length > max) {
      setError(`Maximum ${max} images allowed.`);
      return;
    }

    setError('');
    setUploading(true);

    const newUrls: string[] = [];

    for (const file of toUpload) {
      const ext = file.name.split('.').pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(path, file, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
  }, [folder, onChange, value, max]);

  const handleRemove = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index));
  }, [value, onChange]);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-neutral-200">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-video border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-1.5 text-neutral-400 hover:border-mint-400 hover:text-mint-500 transition-all"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span className="text-[10px] uppercase tracking-wider">
              {uploading ? 'Uploading...' : 'Add Images'}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        onChange={(e) => { if (e.target.files) upload(e.target.files); if (inputRef.current) inputRef.current.value = ''; }}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
