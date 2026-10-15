import React, { useState } from 'react';
import { api } from '../../api/client';
import { ContentRecord } from '../../types';
import { X, Send, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

interface ManualIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostIngested: (newRecord: ContentRecord) => void;
}

export const ManualIntakeModal: React.FC<ManualIntakeModalProps> = ({
  isOpen,
  onClose,
  onPostIngested
}) => {
  const [publicText, setPublicText] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [platform, setPlatform] = useState('Telegram');
  const [topic, setTopic] = useState('Banking & Financial Rumors');
  const [mediaType, setMediaType] = useState<'text_only' | 'image_graphic' | 'video_clip' | 'external_link'>('text_only');
  const [caption, setCaption] = useState('');
  const [region, setRegion] = useState('Eastern District');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicText.trim()) {
      setError('Please provide public post text.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await api.submitContent({
        publicText: publicText.trim(),
        publicUrl: publicUrl.trim() || undefined,
        platform,
        topic,
        mediaType,
        region,
        mediaMetadata: mediaType !== 'text_only' ? {
          userSuppliedCaption: caption.trim() || undefined,
          dimensions: '1080 × 1080 px'
        } : undefined
      });

      onPostIngested(created);
      onClose();
      setPublicText('');
      setPublicUrl('');
      setCaption('');
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#203B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-[#DCE4DE] max-w-xl w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DE]">
          <div>
            <h3 className="text-base font-bold text-[#203B3A]">Manual Public Post Intake</h3>
            <p className="text-xs text-[#303B3B]/70">Submit a public message or link for explainable threat scoring</p>
          </div>
          <button onClick={onClose} className="text-[#829B8B] hover:text-[#203B3A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#203B3A] mb-1">
              Public Post Text *
            </label>
            <textarea
              rows={3}
              value={publicText}
              onChange={e => setPublicText(e.target.value)}
              placeholder="Paste public message, social text, or SMS alert..."
              className="w-full p-2.5 text-xs border border-[#DCE4DE] rounded-md bg-[#F8F6F0] text-[#203B3A] focus:outline-none focus:ring-1 focus:ring-[#203B3A]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-[#829B8B] uppercase mb-1">
                Platform Channel
              </label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#DCE4DE] rounded-md bg-white text-[#303B3B]"
              >
                <option value="Telegram">Telegram</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Facebook">Facebook</option>
                <option value="Reddit">Reddit</option>
                <option value="Web Forum">Web Forum</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#829B8B] uppercase mb-1">
                Narrative Topic Tag
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#DCE4DE] rounded-md text-[#303B3B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-[#829B8B] uppercase mb-1">
                Public URL (Optional)
              </label>
              <input
                type="url"
                value={publicUrl}
                onChange={e => setPublicUrl(e.target.value)}
                placeholder="https://t.me/channel/post/..."
                className="w-full px-2.5 py-1.5 border border-[#DCE4DE] rounded-md text-[#303B3B]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#829B8B] uppercase mb-1">
                Media Content Type
              </label>
              <select
                value={mediaType}
                onChange={e => setMediaType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-[#DCE4DE] rounded-md bg-white text-[#303B3B]"
              >
                <option value="text_only">Text Only</option>
                <option value="image_graphic">Image / Graphic Flyer</option>
                <option value="external_link">Embedded External Link</option>
                <option value="video_clip">Video Clip</option>
              </select>
            </div>
          </div>

          {mediaType !== 'text_only' && (
            <div>
              <label className="block text-[10px] font-semibold text-[#829B8B] uppercase mb-1">
                User-Supplied Media Caption / OCR Text
              </label>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Brief description or text shown inside graphic..."
                className="w-full px-2.5 py-1.5 text-xs border border-[#DCE4DE] rounded-md"
              />
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-[#B96D70]/10 border border-[#B96D70] rounded-md text-xs text-[#B96D70]">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE4DE]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#303B3B] hover:text-[#203B3A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#203B3A] hover:bg-[#203B3A]/90 rounded-md transition-colors"
            >
              {isSubmitting ? 'Evaluating Threat...' : 'Ingest & Run Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
