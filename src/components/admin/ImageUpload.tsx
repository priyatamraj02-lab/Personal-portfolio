import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Loader2, X } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Upload Image or Enter URL',
  value,
  onChange,
  folder = 'portfolio'
}) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const { success, error: toastError } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('File too large', 'Please choose an image under 5MB.');
      return;
    }

    setUploading(true);
    try {
      const downloadUrl = await storageService.uploadFile(file, folder);
      onChange(downloadUrl);
      setUrlInput(downloadUrl);
      success('Image uploaded successfully!');
    } catch (err: any) {
      toastError('Image upload failed', err?.message || 'Check storage rules.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      success('Image URL applied!');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wide">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              mode === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
              mode === 'url' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Preview Thumbnail */}
        {value ? (
          <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                onChange('');
                setUrlInput('');
              }}
              className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-28 h-20 rounded-xl bg-muted/60 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground shrink-0">
            <ImageIcon className="w-6 h-6 stroke-[1.5]" />
            <span className="text-[10px] font-mono mt-1">No Image</span>
          </div>
        )}

        {/* Input Controls */}
        <div className="flex-1 w-full space-y-2">
          {mode === 'upload' ? (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                id="file-upload-input"
                className="hidden"
              />
              <label
                htmlFor="file-upload-input"
                className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-dashed border-border/80 bg-card/60 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Uploading file...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Choose PNG, JPG, or WEBP (Max 5MB)</span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="https://images.unsplash.com/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleUrlApply}>
                Set
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
