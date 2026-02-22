import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  compact?: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function ImageUploader({ value, onChange, folder = 'general', className = '', compact = false }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setError('Only JPG, PNG, WebP, and GIF files are supported.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File must be under 5 MB.');
      return;
    }

    setError('');
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }, [folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [upload]);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  if (compact) {
    return (
      <div className={className}>
        {value ? (
          <div className="relative group rounded-lg overflow-hidden border border-neutral-200">
            <img src={value} alt="" className="w-full h-24 object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full h-24 border border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-1 text-neutral-400 hover:border-mint-400 hover:text-mint-500 transition-all"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            <span className="text-[10px] uppercase tracking-wider">
              {uploading ? 'Uploading...' : 'Upload'}
            </span>
          </button>
        )}
        <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} onChange={handleFileChange} className="hidden" />
        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-neutral-200">
          <img src={value} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-white text-charcoal text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              {uploading ? 'Uploading...' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            dragOver
              ? 'border-mint-400 bg-mint-100/30'
              : 'border-neutral-300 hover:border-mint-400 hover:bg-mint-100/10'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-mint-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-neutral-400" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-charcoal">
              {uploading ? 'Uploading...' : 'Drop an image here or click to browse'}
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">
              JPG, PNG, WebP, GIF up to 5MB
            </p>
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} onChange={handleFileChange} className="hidden" />
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
