
import React, { useState } from 'react';
import { StarIcon } from '../constants';

interface GiftPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: string;
  userPoints: number;
  onSendGift: (amount: number, recipient: string) => void;
}

export const GiftPointsModal: React.FC<GiftPointsModalProps> = ({ isOpen, onClose, targetUser, userPoints, onSendGift }) => {
  const [amount, setAmount] = useState(50);
  
  const handleSend = () => {
      if (amount > 0 && amount <= userPoints) {
          onSendGift(amount, targetUser);
          onClose();
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-slide-up-fast" onClick={e => e.stopPropagation()}>
         <h3 className="text-lg font-bold text-white mb-2">Gift Points to {targetUser}</h3>
         <p className="text-gray-400 text-sm mb-4">Show your appreciation by sending some points.</p>
         
         <div className="mb-4">
             <label className="text-xs text-gray-500 mb-1 block">Amount</label>
             <div className="flex items-center gap-2">
                 <input 
                    type="number" 
                    min="10" 
                    max={userPoints} 
                    step="10"
                    value={amount} 
                    onChange={e => setAmount(parseInt(e.target.value))} 
                    className="flex-grow bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-[var(--accent-color)]"
                 />
                 <span className="text-yellow-400"><StarIcon className="w-5 h-5"/></span>
             </div>
             <p className="text-xs text-gray-500 mt-1">Available: {userPoints}</p>
         </div>

         <div className="flex gap-3 justify-end">
             <button onClick={onClose} className="text-sm text-gray-300 hover:text-white px-3 py-2">Cancel</button>
             <button 
                onClick={handleSend} 
                disabled={amount <= 0 || amount > userPoints}
                className="bg-[var(--accent-color)] text-black font-bold rounded-md px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                 Send Gift
             </button>
         </div>
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
