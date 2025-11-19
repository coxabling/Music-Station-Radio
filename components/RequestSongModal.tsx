
import React, { useState } from 'react';

interface RequestSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
  onSubmit: () => void;
}

export const RequestSongModal: React.FC<RequestSongModalProps> = ({ isOpen, onClose, stationName, onSubmit }) => {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [dedication, setDedication] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        onSubmit();
        onClose();
        setArtist('');
        setTitle('');
        setDedication('');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-gray-800/90 backdrop-blur-lg border border-gray-600 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-slide-up-fast" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-1">Request a Song</h3>
        <p className="text-xs text-gray-400 mb-4">Sending request to <span className="text-[var(--accent-color)]">{stationName}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-xs text-gray-500 mb-1">Artist Name</label>
                <input type="text" value={artist} onChange={e => setArtist(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-[var(--accent-color)] outline-none" required />
            </div>
            <div>
                <label className="block text-xs text-gray-500 mb-1">Song Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-[var(--accent-color)] outline-none" required />
            </div>
            <div>
                <label className="block text-xs text-gray-500 mb-1">Dedication / Message (Optional)</label>
                <textarea value={dedication} onChange={e => setDedication(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-[var(--accent-color)] outline-none" rows={2} />
            </div>

            <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-3 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-[var(--accent-color)] text-black font-bold px-4 py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
