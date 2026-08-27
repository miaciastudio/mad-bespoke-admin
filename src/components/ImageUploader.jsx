import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react';
import { uploadImageToImageKit } from '../services/adminApi';

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const uploadedUrl = await uploadImageToImageKit(file);
      onChange([...images, uploadedUrl]);
    } catch (err) {
      console.error('ImageKit upload error:', err);
      setError(err.message || 'Failed to upload image to ImageKit');
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange([...images, customUrl.trim()]);
      setCustomUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-burgundy-950 block">
        Product Images (Cloudflare R2 Storage)
      </label>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 bg-burgundy-900 text-gold-200 text-[9px] font-bold px-1.5 py-0.5 rounded">
                Cover
              </span>
            )}
          </div>
        ))}

        {/* Upload Button Box */}
        <label className="aspect-square rounded-xl border-2 border-dashed border-gold-400 hover:border-burgundy-700 bg-white hover:bg-canvas-card flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors shadow-sm">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-1.5 text-xs text-burgundy-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Uploading to R2...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-ink-secondary">
              <UploadCloud className="w-6 h-6 text-gold-600" />
              <span className="text-[11px] font-semibold text-burgundy-900">Upload to Cloudflare R2</span>
              <span className="text-[9px] text-gray-400">PNG, JPG, WebP</span>
            </div>
          )}
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Paste Direct URL option */}
      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="url"
            placeholder="Or paste direct image URL (Unsplash / CDN link)..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-burgundy-700"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Add URL
        </button>
      </div>
    </div>
  );
}
