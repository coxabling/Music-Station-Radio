
import React from 'react';
import type { Station, EQBand, EQPreset, Theme, Achievement, AchievementID, LeaderboardEntry, TranslationLanguage, ListeningEvent, StationReview, CommunityEvent, MusicSubmission } from './types';

// --- Achievement Icons (using React.createElement to avoid JSX in .ts file) ---
const PlayIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.006v3.988a1 1 0 001.555.832l3.197-2.005a1 1 0 000-1.664L9.555 7.168z", clipRule: "evenodd" }));
export const ClockIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z", clipRule: "evenodd"}));
const HeartIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd"}));
const CompassIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527-1.912 6.01 6.01 0 012.436 5.332A6.01 6.01 0 0115.668 12a6.012 6.012 0 01-1.912 2.706C13.488 14.27 13.026 14 12.5 14a1.5 1.5 0 01-1.5-1.5V12a2 2 0 00-4 0 2 2 0 01-1.527 1.912 6.01 6.01 0 01-2.436-5.332z", clipRule: "evenodd"}));
const FireIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010-1.414l3-3a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0zm8.586 8.586a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414z", clipRule: "evenodd"}));
const PlusCircleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", clipRule: "evenodd"}));
const MoonIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"}));
const SunIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {fillRule: "evenodd", d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm-1.414-2.12a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z", clipRule: "evenodd"}));
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


// --- Sidebar Icons ---
export const ExploreIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5"}));
export const HomeIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"}));
export const CommunityIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"}));
export const StoreIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h19.5a.75.75 0 01.75.75v9.75a.75.75 0 01-.75-.75h-4.5m-4.5 0H9m-3.75 0H5.625m5.625 0v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21m12.75 0v-7.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21"}));
export const LeaderboardIconSidebar: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"}));
export const ChatBubbleIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor"}, React.createElement('path', {strokeLinecap: "round", strokeLinejoin: "round", d: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"}));
export const SendIcon: React.FC<{className?: string}> = ({className}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor"}, React.createElement('path', {d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"}));
export const AdminIcon: React.FC<{className?: string}> = ({className = ''}) => React.createElement('svg', {xmlns: "http://www.w3.org/2000/svg", className, fill:"none", viewBox:"0 0 24 24", strokeWidth:1.5, stroke:"currentColor"}, React.createElement('path', {strokeLinecap:"round", strokeLinejoin:"round", d: "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.39.44 1.052.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.893.149c-.425.07-.764.383-.93.78-.164.398-.142.854.108 1.204l.527.738c.32.397.27.96-.12 1.45l-.773.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.93l-.149.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894a1.725 1.725 0 0 1-.93-.78c-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.093c0 .55.398-1.02.94-1.11l.894-.149a1.725 1.725 0 0 1 .93-.78c.398-.164.854-.142 1.204.108l.738-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.39 1.052.44 1.45.12l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11V3.94Z"}));


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
        genre: 'Reggae',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),   // 4 hours from now
    },
    {
        id: 'evt2',
        title: 'Afropop Future Forward',
        description: 'Discover the future of Afropop. We\'re spinning the latest tracks from breakout artists across the continent.',
        stationName: 'Nam Radio',
        genre: 'Afropop',
        startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // 26 hours from now
        endTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // 28 hours from now
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