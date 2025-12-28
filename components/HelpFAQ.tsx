
import React from 'react';

interface HelpFAQProps {
    onContactClick?: () => void;
}

const faqs = [
  {
    question: "How do I tune in to a station?",
    answer: "Simply click the 'Tune In' button or the station card in the Explore or Home view. The player at the bottom will appear and start streaming your selected station."
  },
  {
    question: "How can I submit my own music?",
    answer: "If you are an Artist, you can submit music to stations that accept submissions. Look for the 'Submit' button on a station's detail panel. You'll need points to pay the submission fee."
  },
  {
    question: "What are Points and how do I earn them?",
    answer: "Points are the currency of Music Station Radio. You earn 5 points for every minute of listening time. You can use points to unlock new themes, avatar frames, player skins, and to submit music."
  },
  {
    question: "How does the Stock Market work?",
    answer: "The Stock Market allows you to invest your points in your favorite radio stations. Stock prices fluctuate based on listener activity. Buy low, sell high to grow your point balance!"
  },
  {
    question: "Can I create my own station?",
    answer: "Currently, you can suggest a station via the 'Suggest' button in the Explore view. If approved by an admin, it will be listed on the platform."
  },
  {
    question: "What is the 'HYPE' button?",
    answer: "The HYPE button lets you show your enthusiasm for the current track. Clicking it increases the global hype meter. If the meter fills up, a special visual effect is triggered for everyone listening!"
  }
];

export const HelpFAQ: React.FC<HelpFAQProps> = ({ onContactClick }) => {
  return (
    <div className="p-4 md:p-8 animate-fade-in h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold font-orbitron text-white mb-4">
            Help Center
          </h1>
          <p className="text-gray-400">Frequently Asked Questions & Guides</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-[var(--accent-color)]/30 transition-all duration-300 hover:bg-gray-900/80">
                <h3 className="text-lg font-bold text-white mb-3 text-[var(--accent-color)]">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{faq.answer}</p>
            </div>
            ))}
        </div>

        <div className="p-8 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl border border-white/10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">Our support team is always ready to help you with any issues or inquiries you might have.</p>
          <button 
            onClick={onContactClick}
            className="px-8 py-3 bg-[var(--accent-color)] text-black font-bold rounded-full hover:opacity-90 transition-transform transform hover:scale-105 shadow-lg shadow-[var(--accent-color)]/20"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
