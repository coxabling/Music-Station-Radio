
import React, { useState } from 'react';
import type { Station } from '../types';
import { ShieldCheckIcon } from '../constants';

interface ClaimOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: Station, reason: string) => void;
  station: Station | null;
}

export const ClaimOwnershipModal: React.FC<ClaimOwnershipModalProps> = ({ isOpen, onClose, onSubmit, station }) => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid contact email.');
      return;
    }
    if (additionalInfo.trim().length < 20) {
      setError('Please provide a detailed reason/proof (at least 20 chars).');
      return;
    }
    
    // Combine data into a formatted string
    const formattedReason = `Contact: ${email}\nWebsite: ${website || 'N/A'}\n\nProof: ${additionalInfo}`;
    
    if (station) {
        onSubmit(station, formattedReason);
    }
    // Reset
    setEmail('');
    setWebsite('');
    setAdditionalInfo('');
    setError('');
  };

  if (!isOpen || !station) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-yellow-500/30 rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-slide-up-fast overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
        <header className="p-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white font-orbitron tracking-wide">
              Claim Ownership
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-1">
            Verify your ownership of <span className="text-white font-semibold">{station.name}</span>.
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-xs text-yellow-200/80 leading-relaxed">
                  Claims are reviewed manually. Please provide verifiable proof (e.g., an email from the station's domain or a link to a social media post about this claim).
              </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Official Contact Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              placeholder="manager@station.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Verification URL (Website/Social)</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              placeholder="https://twitter.com/station/status/..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Additional Proof / Notes <span className="text-red-400">*</span></label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              placeholder="Tell us why you are claiming this station..."
              rows={4}
              required
            />
          </div>
          
          {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {error}
              </div>
          )}
          
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-yellow-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out; }
        @keyframes slide-up-fast { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-slide-up-fast { animation: slide-up-fast 0.3s ease-out; }
      `}</style>
    </div>
  );
};
