import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  Cpu, 
  Radio, 
  Globe, 
  Award, 
  X,
  MessageSquare,
  BookOpen
} from 'lucide-react';

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

interface FAQItem {
  question: string;
  answer: string;
  category: 'features' | 'frequencies' | 'uk_intl' | 'general';
}

interface HelpFAQProps {
  onContactClick?: () => void;
  onBack: () => void;
}

// Complete set of original and new SEO FAQs
const faqs: FAQItem[] = [
  // --- Category: features (App Guide & Platform mechanics) ---
  {
    category: 'features',
    question: "How do I tune in to a station?",
    answer: "Simply click the 'Tune In' button or the station card in the Explore or Home view. The player at the bottom will appear and start streaming your selected station across the Music Station network."
  },
  {
    category: 'features',
    question: "How can I submit my own music?",
    answer: "If you are an Artist, you can submit music to stations that accept submissions. Look for the 'Submit' button on a station's detail panel. You'll need points to pay the submission fee."
  },
  {
    category: 'features',
    question: "What are Points and how do I earn them?",
    answer: "Points are the currency of Music Station Radio. You earn points for every minute of listening time. You can use points to unlock new themes, avatar frames, player skins, and to submit music."
  },
  {
    category: 'features',
    question: "How does the Stock Market work?",
    answer: "The Stock Market allows you to invest your points in your favorite radio stations. Stock prices fluctuate based on listener activity across the network. Buy low, sell high to grow your point balance!"
  },
  {
    category: 'features',
    question: "Can I create my own station?",
    answer: "Currently, you can suggest a station via the 'Suggest' button in the Explore view. If approved by our network administrators, it will be listed on the platform."
  },
  {
    category: 'features',
    question: "What is the 'HYPE' button?",
    answer: "The HYPE button lets you show your enthusiasm for the current track. Clicking it increases the global hype meter for that station. If the meter fills up, a special visual effect is triggered for everyone listening!"
  },

  // --- Category: frequencies (General & Frequencies) ---
  {
    category: 'frequencies',
    question: "What is the best radio station for music?",
    answer: "The best radio station for music depends on your personal taste and preferred genres. Music Station Radio offers access to a wide variety of stations featuring pop, rock, dance, hip hop, Afrobeats, gospel, jazz, classical music, electronic music, country, and international hits from around the world."
  },
  {
    category: 'frequencies',
    question: "What radio station is 98.2 FM?",
    answer: "98.2 FM frequencies vary depending on your country, city, and local broadcaster. Use Music Station Radio's online radio directory to search for stations by frequency, station name, genre, or location."
  },
  {
    category: 'frequencies',
    question: "What is 94.2 radio station?",
    answer: "94.2 FM is used by different broadcasters in different regions and countries. Music Station Radio allows listeners to discover and stream radio stations regardless of frequency limitations by providing access through internet streaming."
  },
  {
    category: 'frequencies',
    question: "What is 93.5 FM?",
    answer: "93.5 FM may refer to different local radio stations depending on your location. Search our station directory to find 93.5 FM broadcasters and listen online from anywhere in the world."
  },
  {
    category: 'frequencies',
    question: "What is internet radio?",
    answer: "Internet radio is digital audio broadcasting delivered over the internet rather than traditional FM or AM frequencies, allowing listeners to access stations globally."
  },

  // --- Category: uk_intl (UK & International) ---
  {
    category: 'uk_intl',
    question: "What are the best UK radio stations?",
    answer: "Popular UK radio stations include BBC Radio 1, BBC Radio 2, Capital FM, Heart FM, Kiss FM, Smooth Radio, Classic FM, LBC, Absolute Radio, and many independent community stations available through Music Station Radio."
  },
  {
    category: 'uk_intl',
    question: "Where can I find a UK radio stations list?",
    answer: "Music Station Radio provides an extensive directory of UK radio stations including national broadcasters, regional stations, community radio, online-only stations, and niche music channels."
  },
  {
    category: 'uk_intl',
    question: "How can I listen to UK radio stations online?",
    answer: "Simply search for your favourite station on Music Station Radio and start listening instantly through your browser or mobile device without installing additional software."
  },
  {
    category: 'uk_intl',
    question: "Can I listen to international radio stations in the UK?",
    answer: "Yes. Music Station Radio gives UK listeners access to radio stations from Europe, Africa, North America, Asia, Australia, and many other regions worldwide."
  },
  {
    category: 'uk_intl',
    question: "What is the best free radio app in the UK?",
    answer: "The best radio app depends on your listening habits. Music Station Radio offers live streaming, station discovery, favourites, podcasts, and global radio access in a single platform."
  },

  // --- Category: general (General Streaming) ---
  {
    category: 'general',
    question: "Can I listen to radio online for free?",
    answer: "Yes. Music Station Radio provides free access to thousands of internet radio stations and live streams without requiring expensive subscriptions or specialist equipment."
  },
  {
    category: 'general',
    question: "Is there a free radio player app available?",
    answer: "Yes. Music Station Radio supports web browsers, smartphones, tablets, smart TVs, smart speakers, and in-car entertainment systems, making it easy to listen anywhere."
  },
  {
    category: 'general',
    question: "Can I listen to FM radio stations online?",
    answer: "Yes. Many FM broadcasters now simulcast their stations online. Music Station Radio aggregates internet streams from FM, DAB, community, and digital radio stations."
  },
  {
    category: 'general',
    question: "What is the best online radio station for music?",
    answer: "The best online radio station depends on your music preferences. Music Station Radio helps listeners discover trending stations, genres, curated playlists, and new music from around the world."
  },
  {
    category: 'general',
    question: "Which radio station plays the latest hits?",
    answer: "Many contemporary hit radio stations specialise in current chart music and trending artists. Music Station Radio allows listeners to browse stations by genre, popularity, and country."
  },
  {
    category: 'general',
    question: "What genres are available on Music Station Radio?",
    answer: "Listeners can enjoy Pop, Rock, Afrobeats, Gospel, Jazz, Hip-Hop, R&B, EDM, House, Drum and Bass, Reggae, Country, Classical, Talk Radio, Sports, News, and many other genres."
  },
  {
    category: 'general',
    question: "Is Music Station Radio free to use?",
    answer: "Yes. Listening to radio stations through Music Station Radio is free for listeners, with premium services available for broadcasters and station owners."
  },
  {
    category: 'general',
    question: "Can I submit my own radio station to Music Station Radio?",
    answer: "Yes. Broadcasters can submit Shoutcast, Icecast, HLS, and other compatible streams to increase visibility and reach new audiences worldwide."
  },
  {
    category: 'general',
    question: "Does Music Station Radio support internet radio stations?",
    answer: "Yes. The platform supports internet radio, online-only broadcasters, FM simulcasts, podcasts, and digital audio channels."
  },
  {
    category: 'general',
    question: "Can I listen to radio without downloading an app?",
    answer: "Yes. Music Station Radio works directly in modern web browsers, allowing instant listening without installing software."
  },
  {
    category: 'general',
    question: "Why choose Music Station Radio?",
    answer: "Music Station Radio combines global radio discovery, free online listening, station aggregation, podcast support, broadcaster tools, and modern streaming technology in one platform."
  }
];

const categoryMeta = [
  { id: 'all', name: 'All Topics', icon: HelpCircle, description: 'Explore the complete directory' },
  { id: 'features', name: 'App Guide', icon: Cpu, description: 'Learn about points, hype, and mechanics' },
  { id: 'frequencies', name: 'Frequencies', icon: Radio, description: 'Understand FM tuning & locations' },
  { id: 'uk_intl', name: 'UK & International', icon: Globe, description: 'Browse UK lists and global feeds' },
  { id: 'general', name: 'General Streaming', icon: Award, description: 'Free player help & broadcaster support' }
];

export const HelpFAQ: React.FC<HelpFAQProps> = ({ onContactClick, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Inject FAQ Schema JSON-LD dynamically into document head for perfect SEO indexing
  useEffect(() => {
    const scriptId = 'faq-schema-jsonld';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    scriptElement.textContent = JSON.stringify(schemaData);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Filter FAQs based on search input and selected category
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleQuestion = (question: string) => {
    if (expandedQuestion === question) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(question);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto pb-16">
        
        {/* Back navigation */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-6 group"
        >
          <BackIcon />
          <span className="uppercase tracking-widest group-hover:pl-1 transition-all">Back to Explore</span>
        </button>

        {/* Support Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-[var(--accent-color)]/10 rounded-full mb-4 border border-[var(--accent-color)]/20">
            <BookOpen className="w-8 h-8 text-[var(--accent-color)]" />
          </div>
          <h1 className="text-4xl font-black font-orbitron text-white tracking-tight mb-3">
            Network Support
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Get instant answers regarding FM frequencies, online live streaming, points currency, and broadcaster support.
          </p>
        </header>

        {/* Interactive Search & Filter Station */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 md:p-6 mb-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/5 rounded-full filter blur-2xl pointer-events-none"></div>
          
          {/* Real-time search bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics, FM frequencies, UK streams, etc..."
              className="w-full bg-black/50 border border-gray-800 rounded-xl py-3.5 pl-12 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]/20 transition-all duration-300"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Quick Pills */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-800">
            {categoryMeta.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setExpandedQuestion(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                    isSelected 
                      ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-[var(--accent-color)]/35 shadow-sm shadow-[var(--accent-color)]/10' 
                      : 'bg-black/30 text-gray-400 border-gray-800/80 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Dynamic Accordion List */}
        <div className="space-y-3 mb-10">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isExpanded = expandedQuestion === faq.question;
                return (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isExpanded 
                        ? 'bg-gray-900/70 border-[var(--accent-color)]/30 shadow-md shadow-black/30' 
                        : 'bg-gray-950/40 border-gray-900/80 hover:bg-gray-900/40 hover:border-gray-800'
                    }`}
                  >
                    <button
                      onClick={() => toggleQuestion(faq.question)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors"
                    >
                      <span className="font-bold text-white text-sm md:text-base tracking-wide font-sans hover:text-[var(--accent-color)] transition-colors pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'transform rotate-180 text-[var(--accent-color)]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-5 pt-1 text-gray-300 border-t border-gray-800/40 leading-relaxed text-sm md:text-sm font-sans bg-black/25">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-gray-900/10"
              >
                <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-white font-bold text-lg mb-1">No topics found</p>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  We couldn't find any questions matching "{searchQuery}". Try selecting "All Topics" or searching for basic keywords like "Points" or "FM".
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Support block */}
        <div className="p-8 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 rounded-2xl border border-gray-800/60 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[var(--accent-color)]/5 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <div className="inline-flex items-center justify-center p-3 bg-[var(--accent-color)]/10 rounded-full mb-4">
            <MessageSquare className="w-6 h-6 text-[var(--accent-color)]" />
          </div>
          
          <h3 className="text-xl font-extrabold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
            Our support desk is operational 24/7. Get in touch directly with our radio station operators and network administrators.
          </p>
          <button 
            onClick={onContactClick}
            className="px-8 py-3.5 bg-[var(--accent-color)] hover:bg-white text-black font-extrabold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[var(--accent-color)]/10 tracking-wider uppercase text-xs"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
