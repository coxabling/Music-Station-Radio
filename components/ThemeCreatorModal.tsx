
import React, { useState } from 'react';
import type { Theme } from '../types';
import { StarIcon } from '../constants';

interface ThemeCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: Theme) => void;
  userPoints: number;
}

const CREATION_COST = 500;

export const ThemeCreatorModal: React.FC<ThemeCreatorModalProps> = ({ isOpen, onClose, onSave, userPoints }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#67e8f9');
  const [color2, setColor2] = useState('#a855f7');
  const [bgImage, setBgImage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
      if (userPoints < CREATION_COST) return;
      const newTheme: Theme = {
          name: `custom_${Date.now()}`,
          displayName: name || 'My Custom Theme',
          color: color,
          gradient: `linear-gradient(135deg, ${color}, ${color2})`,
          isCustom: true,
          backgroundImage: bgImage || undefined,
          description: 'Created by you.'
      };
      onSave(newTheme);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md overflow-hidden">
            <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold font-orbitron text-white">Theme Creator</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </header>
            <div className="p-6 space-y-6">
                {/* Preview */}
                <div className="h-32 rounded-lg relative overflow-hidden border border-gray-600 shadow-lg flex items-center justify-center" 
                     style={{ background: bgImage ? `url(${bgImage}) center/cover` : `linear-gradient(135deg, ${color}, ${color2})` }}>
                    <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded text-white font-bold">Preview</div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Theme Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" placeholder="Neon Nights" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Primary Color</label>
                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 bg-transparent border-none cursor-pointer" />
                    </div>
                    <div>
                         <label className="block text-sm text-gray-400 mb-2">Secondary Color</label>
                        <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-full h-10 bg-transparent border-none cursor-pointer" />
                    </div>
                </div>

                <div>
                     <label className="block text-sm text-gray-400 mb-2">Background Image/Video URL (Optional)</label>
                     <input type="url" value={bgImage} onChange={e => setBgImage(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm" placeholder="https://..." />
                     <p className="text-xs text-gray-500 mt-1">Supports .mp4 for video backgrounds.</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400">Cost: <span className="text-yellow-400 font-bold">{CREATION_COST} pts</span></div>
                    <button 
                        onClick={handleSave} 
                        disabled={userPoints < CREATION_COST || !name}
                        className="bg-[var(--accent-color)] text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
