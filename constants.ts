
import React from 'react';
import type { Station, EQBand, EQPreset, Theme, Achievement, AchievementID, LeaderboardEntry, TranslationLanguage, ListeningEvent, StationReview, CommunityEvent, MusicSubmission, ShopItem, Quest, BattleContestant, TrackAnalytics } from './types';

// --- Achievement Icons (using React.createElement to avoid JSX in .ts file) ---
export const PlayIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z", clipRule: "evenodd" }));
export const ClockIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z", clipRule: "evenodd"}));
const HeartIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd"}));
const CompassIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527-1.912 6.01 6.01 0 012.436 5.332A6.01 6.01 0 0115.668 12a6.012 6.012 0 01-1.912 2.706C13.488 14.27 13.026 14 12.5 14a1.5 1.5 0 01-1.5-1.5V12a2 2 0 00-4 0 2 2 0 01-1.527 1.912 6.01 6.01 0 01-2.436-5.332z", clipRule: "evenodd"}));
const FireIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010-1.414l3-3a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0zm8.586 8.586a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414z", clipRule: "evenodd"}));
const PlusCircleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", clipRule: "evenodd"}));
export const MoonIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"}));
export const SunIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm-1.414-2.12a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z", clipRule: "evenodd"}));
const SparklesIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z", clipRule: "evenodd"}));
export const UserIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"}));
export const StarIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"}));
export const TrophyIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule:"evenodd", d: "M11.68 1.33a1 1 0 011.64 0l1.35 2.22a1 1 0 00.82.55l2.45.36a1 1 0 01.56 1.7l-1.78 1.73a1 1 0 00-.29.89l.42 2.44a1 1 0 01-1.45 1.05L12 11.45a1 1 0 00-.94 0l-2.19 1.15a1 1 0 01-1.45-1.05l.42-2.44a1 1 0 00-.29-.89L5.78 6.16a1 1 0 01.56-1.7l2.45-.36a1 1 0 00.82-.55L11.68 1.33zM10 14a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM6 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM14 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z", clipRule: "evenodd"}));
export const LockIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule:"evenodd", d: "M10 2a3 3 0 00-3 3v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002 2V8a2 2 0 00-2-2h-1V5a3 3 0 00-3-3zm-1 5v1h2V7a1 1 0 00-2 0z", clipRule: "evenodd"}));
export const RocketIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M15.59 14.37a6 6 0 01-5.84 7.38v.01l-.001.001l-.001.001a5.98 5.98 0 01-5.03-1.93l-1.5-1.5a5.984 5.984 0 01-1.42-2.37l-.29-1.01a5.982 5.982 0 01-1.04-3.12 5.982 5.982 0 013.12-1.04l1.01-.29a5.984 5.984 0 012.37-1.42l1.5-1.5a5.984 5.984 0 011.93-5.03l.001-.001.001-.001.01 0a6 6 0 017.38 5.84z"}));
export const UploadIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"}));
export const ShieldCheckIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z"}));
export const MusicNoteIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 009 5.25v1.5"}));
export const BriefcaseIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 14.15v4.075c0 1.313-.943 2.5-2.25 2.5h-10.5c-1.307 0-2.25-.937-2.25-2.25V14.15M15.75 18.225v-2.175a1.5 1.5 0 00-1.5-1.5h-3a1.5 1.5 0 00-1.5 1.5v2.175M15.75 12.75v-1.5a3 3 0 00-3-3h-3a3 3 0 00-3 3v1.5m10.5-3.375C17.25 7.625 14.75 5.25 12 5.25S6.75 7.625 6.75 9.375"}));
export const CheckCircleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {fillRule:"evenodd", d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule:"evenodd"}));
export const XCircleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {fillRule:"evenodd", d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule:"evenodd"}));
export const UserCircleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {fillRule:"evenodd", d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z", clipRule:"evenodd"}));
export const TicketIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, viewBox:"0 0 24 24", fill:"currentColor"}, React.createElement('path', {fillRule:"evenodd", d:"M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z", clipRule:"evenodd"})); 
export const RealTicketIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v9.642a2.418 2.418 0 001.117 2.096 2.416 2.416 0 01.298 4.486 2.421 2.421 0 002.965 2.945 2.417 2.417 0 014.367.865 2.416 2.416 0 004.435-1.061 2.417 2.417 0 011.154-3.936 2.418 2.418 0 002.204-3.607 2.417 2.417 0 01-.685-4.334 2.417 2.417 0 00-1.421-4.02 2.417 2.417 0 01-3.635-2.682 2.418 2.418 0 00-3.607-2.204 2.417 2.417 0 01-3.936 1.154 2.416 2.416 0 00-1.061 4.435z"}));
export const MegaphoneIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.467a23.873 23.873 0 00-1.014-5.395m0 3.467c-.006.135-.013.271-.021.407"}));
export const CalendarDaysIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zM14.25 15h.008v.008H14.25V15zm0 2.25h.008v.008H14.25v-.008zM16.5 15h.008v.008H16.5V15zm0 2.25h.008v.008H16.5v-.008z"}));
export const ChartPieIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"}), React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"}));
export const MapPinIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"}), React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"}));
export const TrashIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"}));
export const GlobeIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d:"M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"}));

// Weather and Mood Icons
export const CloudIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox:"0 0 24 24", fill:"currentColor"}, React.createElement('path', {d: "M19.5 21a2.5 2.5 0 0 1-2.5-2.5v-1.5a1 1 0 0 0-2 0v1.5a2.5 2.5 0 0 1-5 0v-1.5a1 1 0 0 0-2 0v1.5a2.5 2.5 0 0 1-5 0v-1.5a1 1 0 0 0-2 0v1.5a2.5 2.5 0 0 1-1-.206V18.5a4.5 4.5 0 0 1 4.5-4.5h.284a5.483 5.483 0 0 1-.284-1.75 5.5 5.5 0 0 1 10.15-2.475A4.502 4.502 0 0 1 19.5 18.5v2.5zM12.25 4.75a3.5 3.5 0 0 0-3.39 4.357 5.477 5.477 0 0 1 2.457-.96 3.501 3.501 0 0 0 .933-3.397z"}));
export const LightningIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox:"0 0 24 24", fill:"currentColor"}, React.createElement('path', {d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"}));
export const BrainIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"}));
export const ConfettiIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox:"0 0 20 20", fill:"currentColor"}, React.createElement('path', {fillRule:"evenodd", d:"M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z", clipRule:"evenodd"}));
export const CoffeeIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})); // Placeholder for relax
export const DumbbellIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"})); // Placeholder for workout/energy
export const SadFaceIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"}));

// --- Sidebar Icons ---
export const ExploreIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5"}));
export const HomeIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"}));
export const CommunityIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"}));
export const StoreIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h19.5a.75.75 0 01.75.75v9.75a.75.75 0 01-.75-.75h-4.5m-4.5 0H9m-3.75 0H5.625m5.625 0v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21m12.75 0v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21"}));
export const LeaderboardIconSidebar: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"}));
export const ChatBubbleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"}));
export const SendIcon: React.FC<{className?: string}> = ({className}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"}));
export const AdminIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d: "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.39.44 1.052.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.893.149c-.425.07-.764.383-.93.78-.164.398-.142.854.108 1.204l.527.738c.32.397.27.96-.12 1.45l-.773.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.93l-.149.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894a1.725 1.725 0 0 1-.93-.78c-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11V3.94Z"}));

// Gamification Icons
export const ShopIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h19.5a.75.75 0 01.75.75v9.75a.75.75 0 01-.75-.75h-4.5m-4.5 0H9"}));
export const QuestIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"}));
export const BattleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"}));
export const CrownIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"}));
export const CoinIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.912 6 10.5 6c1.08 0 2.015.794 2.376 1.879.28.842.107 1.65-.213 2.234a2.602 2.602 0 01-1.09.956c-.543.286-1.09.48-1.573.665l-.528.195c-.482.179-.917.342-1.256.58-.348.244-.516.564-.516.991 0 .495.243.865.556 1.09.277.2.636.298 1.048.298.652 0 1.195-.24 1.596-.618.054-.051.106-.106.153-.162a.75.75 0 111.15.96 4.48 4.48 0 01-1.143 1.015c-.776.463-1.688.626-2.555.455a3.5 3.5 0 01-2.36-1.722c-.453-.85-.38-1.79.12-2.527.45-.664 1.165-1.083 1.883-1.382l.528-.216c.434-.178.814-.335 1.136-.526.338-.2.463-.433.463-.694 0-.336-.19-.58-.378-.715-.222-.16-.487-.213-.755-.213-.61 0-1.1.327-1.39.77a.75.75 0 11-1.252-.816z", clipRule: "evenodd"}));


export const ACHIEVEMENTS: Record<AchievementID, Achievement> = {
  'first_listen': { id: 'first_listen', name: 'Welcome to the Club', description: 'Tune in for the first time.', icon: PlayIcon },
  'one_hour': { id: 'one_hour', name: 'Hour of Power', description: 'Listen for a total of 1 hour.', icon: ClockIcon },
  'ten_hours': { id: 'ten_hours', name: 'Dedicated Listener', description: 'Listen for a total of 10 hours.', icon: ClockIcon },
  'curator': { id: 'curator', name: 'Curator', description: 'Favorite your first station.', icon: HeartIcon },
  'explorer_3': { id: 'explorer_3', name: 'Genre Explorer', description: 'Listen to 3 different genres.', icon: CompassIcon },
  'explorer_5': { id: 'explorer_5', name: 'Genre Master', description: 'Listen to 5 different genres.', icon: CompassIcon },
  'streak_3': { id: 'streak_3', name: 'Vibe Streak', description: 'Listen for 3 consecutive days.', icon: FireIcon },
  'streak_7': { id: 'streak_7', name: 'Week-Long Vibe', description: 'Listen for 7 consecutive days.', icon: FireIcon },
  'station_submit': { id: 'station_submit', name: 'Contributor', description: 'Suggest a new station.', icon: PlusCircleIcon },
  'night_owl': { id: 'night_owl', name: 'Night Owl', description: 'Listen between midnight and 4 AM.', icon: MoonIcon },
  'early_bird': { id: 'early_bird', name: 'Early Bird', description: 'Listen between 5 AM and 8 AM.', icon: SunIcon },
  'party_starter': { id: 'party_starter', name: 'Party Starter', description: 'Engage with the Listening Party.', icon: SparklesIcon },
  'raid_leader': { id: 'raid_leader', name: 'Raid Leader', description: 'Initiate your first station raid.', icon: RocketIcon },
};

const initialStations: Station[] = [
  {
    name: "CRW Radio",
    genre: "World music",
    description: "Your global sound connection, playing hits from every corner of the earth.",
    streamUrl: "https://music-station.live/listen/crw_radio/radio.mp3",
    coverArt: "https://picsum.photos/seed/crw/200",
    tippingUrl: "https://ko-fi.com/example_crw_radio",
    rating: 4.5,
    ratingsCount: 128,
    location: { lat: 51.5072, lng: -0.1276 },
    submissions: [],
    schedule: [
        { id: 's1', day: 'Mon', startTime: '08:00', endTime: '10:00', title: 'Morning Global News' },
        { id: 's2', day: 'Mon', startTime: '18:00', endTime: '20:00', title: 'World Hits Top 40' },
    ]
  },
  {
    name: "High Grade Radio",
    genre: "Premium Reggae & Dancehall",
    description: "The finest selection of reggae and dancehall rhythms, 24/7.",
    streamUrl: "https://music-station.live/listen/high_grade_radio/radio.mp3",
    coverArt: "https://picsum.photos/seed/highgrade/200",
    tippingUrl: "https://ko-fi.com/example_hg_radio",
    rating: 4.8,
    ratingsCount: 256,
    location: { lat: 18.1096, lng: -77.2975 },
    owner: 'DJ_VibeMaster',
    acceptsSubmissions: true,
    submissions: [],
    schedule: [
        { id: 'h1', day: 'Fri', startTime: '20:00', endTime: '23:00', title: 'Friday Night Dancehall Bash' },
        { id: 'h2', day: 'Sun', startTime: '10:00', endTime: '14:00', title: 'Easy Sunday Reggae Roots' },
    ]
  },
  {
    name: "Nam Radio",
    genre: "Afropop",
    description: "The pulse of Africa, bringing you the best in Afropop and contemporary hits.",
    streamUrl: "https://music-station.live/listen/namradio/radio.mp3",
    coverArt: "https://picsum.photos/seed/namradio/200",
    rating: 4.2,
    ratingsCount: 94,
    location: { lat: -22.9585, lng: 18.4904 },
    submissions: [],
  },
  {
    name: "Pamtengo Radio",
    genre: "Afrobeat & African Hits",
    description: "Non-stop Afrobeat and the biggest tracks from across the continent.",
    streamUrl: "https://music-station.live/listen/pamtengo_radio/radio.mp3",
    coverArt: "https://picsum.photos/seed/pamtengo/200",
    rating: 4.6,
    ratingsCount: 182,
    location: { lat: 9.0820, lng: 8.6753 },
    submissions: [],
  },
  {
    name: "Nam Radio Local",
    genre: "Afropop",
    description: "Celebrating local talent with a curated mix of Namibian and Afropop stars.",
    streamUrl: "https://music-station.live/listen/nam_radio_local/radio.mp3",
    coverArt: "https://picsum.photos/seed/namradiolocal/200",
    rating: 4.0,
    ratingsCount: 55,
    location: { lat: -22.5709, lng: 17.0836 },
    submissions: [],
  },
  {
    name: "Power Ace Radio",
    genre: "Indie & Afrobeat",
    description: "A unique blend of independent artists and infectious Afrobeat grooves.",
    streamUrl: "https://music-station.live/listen/poweraceradio/radio.mp3",
    coverArt: "https://picsum.photos/seed/poweraceradio/200",
    rating: 4.3,
    ratingsCount: 78,
    location: { lat: 5.6037, lng: -0.1870 },
    submissions: [],
  },
  {
    name: "Namibian Radio",
    genre: "Namibian & African Hits",
    description: "The sound of Namibia, featuring top local charts and African anthems.",
    streamUrl: "https://64575.airadiostream.com/namibianradio",
    coverArt: "https://picsum.photos/seed/namibianradio/200",
    rating: 3.9,
    ratingsCount: 43,
    location: { lat: -22.5594, lng: 17.0872 },
    submissions: [],
  },
  {
    name: "Global Groove Radio",
    genre: "Eclectic Mix / World Music",
    description: "An eclectic journey through sound, from hidden gems to global grooves.",
    streamUrl: "https://s2.stationplaylist.com:7094/listen.aac",
    coverArt: "https://picsum.photos/seed/globalgroove/200",
    rating: 4.7,
    ratingsCount: 201,
    location: { lat: 34.0522, lng: -118.2437 },
    owner: 'GrooveMachine',
    acceptsSubmissions: false,
    submissions: [],
  }
];

export const stations: Station[] = initialStations;


// Constants for the Audio Equalizer
export const EQ_BANDS: EQBand[] = [
  { freq: 60, type: 'lowshelf' },
  { freq: 310, type: 'peaking' },
  { freq: 1000, type: 'peaking' },
  { freq: 6000, type: 'peaking' },
  { freq: 16000, type: 'highshelf' },
];

export const EQ_PRESETS: EQPreset[] = [
    { name: 'Flat', values: [0, 0, 0, 0, 0] },
    { name: 'Bass Boost', values: [6, 4, 0, 0, 0] },
    { name: 'Vocal Booster', values: [0, 2, 4, 3, 0] },
    { name: 'Treble Boost', values: [0, 0, 0, 4, 6] },
    { name: 'Rock', values: [4, 2, -2, 3, 4] },
    { name: 'Pop', values: [-1, 3, 4, 2, -1] },
];

// Constants for UI Themes
export const THEMES: Theme[] = [
  { name: 'dynamic', displayName: 'Dynamic (Default)', color: '#67e8f9' },
  { name: 'kente', displayName: 'Kente Cloth', color: '#FBBF24', cost: 100 }, // amber-400
  { name: 'sahara', displayName: 'Sahara Sunset', color: '#F97316', cost: 100 }, // orange-600
  { name: 'naija', displayName: 'Naija Pop', color: '#22C55E', cost: 150 }, // green-500
  { name: 'galaxy', displayName: 'Galaxy', color: '#8b5cf6', cost: 300 }, // violet-500
];

// Cost for submitting a music track
export const MUSIC_SUBMISSION_COST = 50;
export const BOOST_COST = 100;
export const BOOST_DURATION_MS = 60 * 60 * 1000; // 1 hour
export const FAN_CLUB_COST = 200;

// Simulated leaderboard data
export const LEADERBOARD_DATA: Omit<LeaderboardEntry, 'rank'>[] = [
    { username: "DJ_VibeMaster", points: 12543, role: 'owner' },
    { username: "AudioPhile", points: 11892, role: 'user' },
    { username: "GrooveMachine", points: 10567, role: 'owner' },
    { username: "Tuner_Pro", points: 9872, role: 'user' },
    { username: "BeatSeeker", points: 8501, role: 'user' },
    { username: "Radio_Head", points: 7634, role: 'user' },
    { username: "EchoChamber", points: 6921, role: 'artist' },
    { username: "SoundSurfer", points: 5432, role: 'user' },
    { username: "MixMaestro", points: 4987, role: 'artist' },
    { username: "RhythmRider", points: 3210, role: 'user' },
];

// Constants for Lyric Translation
export const SUPPORTED_TRANSLATION_LANGUAGES: TranslationLanguage[] = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'ko', name: 'Korean' },
];

// New mock data for scheduled events
export const LISTENING_EVENTS: ListeningEvent[] = [
    {
        id: 'evt1',
        title: 'Reggae Roots Revival',
        description: 'Join us for a two-hour deep dive into classic roots reggae and dub from the 70s and 80s.',
        stationName: 'High Grade Radio',
        stationStreamUrl: "https://music-station.live/listen/high_grade_radio/radio.mp3",
        genre: 'Reggae',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),   // 4 hours from now
        isPremium: false,
    },
    {
        id: 'evt2',
        title: 'Afropop Future Forward',
        description: 'Discover the future of Afropop. We\'re spinning the latest tracks from breakout artists across the continent.',
        stationName: 'Nam Radio',
        stationStreamUrl: "https://music-station.live/listen/namradio/radio.mp3",
        genre: 'Afropop',
        startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // 26 hours from now
        endTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // 28 hours from now
        isPremium: true,
        ticketCost: 50,
    },
];

// New mock data for station reviews
export const MOCK_REVIEWS: Record<string, StationReview[]> = {
    "https://music-station.live/listen/high_grade_radio/radio.mp3": [
        { author: 'ReggaeFan', authorRole: 'user', rating: 5, text: 'Best reggae station on the web, hands down. The selection is always on point.', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { author: 'DubWise', authorRole: 'artist', rating: 4, text: 'Solid grooves, but I wish they played more deep cuts from the 70s.', createdAt: new Date(Date.now() - 172800000).toISOString() }
    ],
    "https://music-station.live/listen/namradio/radio.mp3": [
        { author: 'AfroQueen', authorRole: 'user', rating: 5, text: 'My daily dose of Afropop! Always keeps me dancing.', createdAt: new Date(Date.now() - 259200000).toISOString() },
    ]
};

// New mock data for community feed
export const COMMUNITY_EVENTS: CommunityEvent[] = [
    { id: 1, username: 'GrooveMachine', role: 'owner', action: 'unlocked achievement', details: 'Hour of Power', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: ClockIcon },
    { id: 2, username: 'DJ_VibeMaster', role: 'owner', action: 'favorited a station', details: 'High Grade Radio', timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), icon: HeartIcon },
    { id: 3, username: 'AudioPhile', role: 'user', action: 'discovered a new genre', details: 'Afropop', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), icon: CompassIcon },
    { id: 4, username: 'BeatSeeker', role: 'user', action: 'reached a 3-day streak', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), icon: FireIcon },
    { id: 5, username: 'RhythmRider', role: 'user', action: 'submitted a new station', details: 'Indie Wave FM', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), icon: PlusCircleIcon },
];

// --- Gamification Data ---

export const SHOP_ITEMS: ShopItem[] = [
    { id: 'nc_gold', name: 'Golden Name', type: 'name_color', cost: 500, value: '#fbbf24', description: 'Your name shines in gold in chat.' },
    { id: 'nc_neon', name: 'Neon Blue Name', type: 'name_color', cost: 300, value: '#22d3ee', description: 'A cool cyber-blue look.' },
    { id: 'nc_pink', name: 'Hot Pink Name', type: 'name_color', cost: 300, value: '#f472b6', description: 'Stand out with bright pink.' },
    { id: 'fr_cyber', name: 'Cyber Border', type: 'frame', cost: 800, value: 'border-cyan-400 border-2 shadow-[0_0_10px_cyan]', description: 'A glowing futuristic border for your avatar.' },
    { id: 'fr_royal', name: 'Royal Frame', type: 'frame', cost: 1000, value: 'border-yellow-500 border-4', description: 'Fit for a king or queen.' },
];

export const QUEST_TEMPLATES: { daily: Omit<Quest, 'id' | 'progress' | 'completed' | 'claimed'>[], weekly: Omit<Quest, 'id' | 'progress' | 'completed' | 'claimed'>[] } = {
    daily: [
        { title: 'Power Hour', description: 'Listen to radio for 60 minutes.', target: 60, reward: 50, type: 'daily', metric: 'minutes_listened' },
        { title: 'Station Hopper', description: 'Play 3 different stations.', target: 3, reward: 30, type: 'daily', metric: 'stations_played' },
        { title: 'Critic', description: 'Vote on 5 songs.', target: 5, reward: 40, type: 'daily', metric: 'votes_cast' },
    ],
    weekly: [
        { title: 'Marathon Listener', description: 'Listen for 10 hours this week.', target: 600, reward: 500, type: 'weekly', metric: 'minutes_listened' },
        { title: 'Genre Explorer', description: 'Explore 5 different genres.', target: 5, reward: 300, type: 'weekly', metric: 'genres_played' },
    ]
};

export const BATTLE_CONTESTANTS: BattleContestant[] = [
    { id: 'b1', artist: 'Neon Drifters', song: 'Cyber Sunset', coverArt: 'https://picsum.photos/seed/neon/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'b2', artist: 'The Analog Souls', song: 'Dusty Vinyl', coverArt: 'https://picsum.photos/seed/analog/300', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
];

// Mock Analytics Data
export const MOCK_ARTIST_ANALYTICS: TrackAnalytics[] = [
    {
        songId: 't1',
        title: 'Midnight City Vibes',
        playCount: 1250,
        skipRate: 15,
        listeners: 850,
        geographicData: [
            { country: 'USA', count: 400 },
            { country: 'UK', count: 250 },
            { country: 'Germany', count: 100 },
            { country: 'Other', count: 100 },
        ]
    },
    {
        songId: 't2',
        title: 'Summer Haze',
        playCount: 3200,
        skipRate: 5,
        listeners: 2100,
        geographicData: [
            { country: 'Brazil', count: 800 },
            { country: 'USA', count: 600 },
            { country: 'Spain', count: 400 },
            { country: 'Portugal', count: 300 },
        ]
    }
];
