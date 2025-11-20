import React, { useState } from 'react';
import { FAQ_DATA, HelpIcon } from '../constants';

interface HelpViewProps {}

export const HelpView: React.FC<HelpViewProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold font-orbitron accent-color-text flex items-center justify-center gap-3">
            <HelpIcon className="w-8 h-8"/>
            Help & FAQ
          </h1>
          <p className="text-gray-400 mt-2">Everything you need to know about Music Station Radio.</p>
        </header>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg"
            >
              <button
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="font-semibold text-white text-lg pr-4">{item.question}</h3>
                <span className="text-gray-400">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openIndex === index && (
                <div id={`faq-answer-${index}`} className="p-4 pt-0 text-gray-300 leading-relaxed animate-fade-in-down">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
