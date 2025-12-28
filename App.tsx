
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { RadioPlayer } from './components/RadioPlayer';
import { StationList } from './components/StationList';
import { Header } from './components/Header';
import { SubmitStationModal } from './components/SubmitStationModal';
import { ListeningPartyChat } from './components/ListeningPartyChat';
import { AlarmModal } from './components/AlarmModal';
import { ToastContainer } from './components/Toast';
import { LoginModal } from './components/LoginModal';
import { TippingModal } from './components/TippingModal';
import { GenreSpotlightModal } from './components/GenreSpotlightModal';
import { SongChartModal } from './components/SongChartModal';
import { EventsModal } from './components/EventsModal';
import { Sidebar } from './components/Sidebar';
import { CommunityFeed } from './components/CommunityFeed';
import { StoreView } from './components/StoreView';
import { LeaderboardView } from './components/LeaderboardView';
import { MapView } from './components/MapView';
import { SongHistoryModal } from './components/SongHistoryModal';
import { GenreChatView } from './components/GenreChatView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { StationManagerDashboardView } from './components/StationManagerDashboardView';
import { ArtistDashboardView } from './components/ArtistDashboardView';
import { RightPanel } from './components/RightPanel';
import { stations as defaultStations, THEMES, ACHIEVEMENTS, INITIAL_QUESTS, UserIcon, FireIcon, StarIcon, LockIcon, HeartIcon, BOUNTIES, ShieldCheckIcon, UploadIcon } from './constants';
import type { Station, NowPlaying, ListeningStats, Alarm, ThemeName, SongVote, UnlockedAchievement, AchievementID, ToastData, User, Theme, ActiveView, UserData, MusicSubmission, Bet, CollectorCard, Lounge, UserProfile, AvatarFrame, SkinID, Bounty, Jingle, PlayerSkin, GuestbookEntry, Quest } from './types';
import { getDominantColor } from './utils/colorExtractor';
import { LandingPage } from './components/LandingPage';
import { getUserData, updateUserData, createUserData, followUser, unfollowUser, fetchRadioBrowserStations } from './services/apiService';
import { EditStationModal } from './components/EditStationModal';
import { MusicSubmissionModal } from './components/MusicSubmissionModal';
import { ClaimOwnershipModal } from './components/ClaimOwnershipModal';
import { BuyNowModal } from './components/BuyNowModal';
import { DashboardView } from './components/DashboardView';
import { PredictionMarketModal } from './components/PredictionMarketModal';
import { CollectionModal } from './components/CollectionModal';
import { GiftPointsModal } from './components/GiftPointsModal';
import { HypeOverlay } from './components/HypeOverlay';
import { LoungeModal } from './components/LoungeModal';
import { ThemeCreatorModal } from './components/ThemeCreatorModal';
import { WeatherOverlay } from './components/WeatherOverlay';
import { CoinExplosionOverlay } from './components/CoinExplosionOverlay';
import { UserProfileModal } from './components/UserProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { RequestSongModal } from './components/RequestSongModal';
import { JingleModal } from './components/JingleModal';
import { HelpFAQ } from './components/HelpFAQ';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '103, 232, 249';
};

export const App: React.FC = () => {
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('explore');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [stationForDetail, setStationForDetail] = useState<Station | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDataSaver, setIsDataSaver] = useState(false);
  const [sleepTimerTarget, setSleepTimerTarget] = useState<number | null>(null);
  
  const [backgrounds, setBackgrounds] = useState<[string | null, string | null]>([null, null]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  
  const [albumArtColor, setAlbumArtColor] = useState('#67e8f9');
  const [activeTheme, setActiveTheme] = useState<ThemeName>('dynamic');

  const [allStations, setAllStations] = useState<Station[]>(defaultStations);
  const [userStations, setUserStations] = useState<Station[]>([]);
  
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isSongChartModalOpen, setIsSongChartModal] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stationToEdit, setStationToEdit] = useState<Station | null>(null);
  const [isMusicSubmissionModalOpen, setIsMusicSubmissionModalOpen] = useState(false);
  const [stationForSubmission, setStationForSubmission] = useState<Station | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [stationToClaim, setStationToClaim] = useState<Station | null>(null);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [isJingleModalOpen, setIsJingleModalOpen] = useState(false);

  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [targetUserProfile, setTargetUserProfile] = useState<UserProfile | undefined>(undefined);

  const [favoriteStationUrls, setFavoriteStationUrls] = useState<Set<string>>(new Set<string>());
  const [unlockedThemes, setUnlockedThemes] = useState<Set<ThemeName>>(new Set(['dynamic']));

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);

  const [stats, setStats] = useState<ListeningStats>({ totalTime: 0, stationPlays: {}, points: 0, songHistory: [], songUserVotes: {} });
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [songVotes, setSongVotes] = useState<Record<string, SongVote>>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, UnlockedAchievement>>({});
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [collection, setCollection] = useState<CollectorCard[]>([] as CollectorCard[]);
  
  const [activeFrame, setActiveFrame] = useState<string | undefined>(undefined);
  // Correctly initialized state as string[] to ensure consistency throughout the app
  const [unlockedFrames, setUnlockedFrames] = useState<string[]>([] as string[]);
  const [hypeScore, setHypeScore] = useState(0);
  const [isHypeActive, setIsHypeActive] = useState(false);
  const [isCoinActive, setIsCoinActive] = useState(false);
  
  const [activeSkin, setActiveSkin] = useState<SkinID>('modern');
  const [unlockedSkins, setUnlockedSkins] = useState<SkinID[]>(['modern'] as SkinID[]);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [bounties, setBounties] = useState<Bounty[]>(BOUNTIES);
  const [jingles, setJingles] = useState<Jingle[]>([]);

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);

  const statsUpdateInterval = useRef<number | null>(null);
  const availableThemes = useMemo(() => [...THEMES, ...customThemes], [customThemes]);
  
  const currentThemeObj = useMemo(() => {
      return availableThemes.find(t => t.name === activeTheme);
  }, [activeTheme, availableThemes]);

  const handleToggleHeader = useCallback(() => {
    setIsHeaderVisible(p => !p);
  }, []);

  const accentColor = useMemo(() => {
    if (activeTheme === 'dynamic') return albumArtColor;
    return currentThemeObj?.color || '#67e8f9';
  }, [activeTheme, albumArtColor, currentThemeObj]);
  
  const rgbComponents = useMemo(() => {
      const parts = hexToRgb(accentColor).split(',');
      return {
          r: parts[0].trim(),
          g: parts[1].trim(),
          b: parts[2].trim()
      };
  }, [accentColor]);

  // Load Radio Browser stations with mirror fallbacks
  useEffect(() => {
    const initStations = async () => {
        const browserStations = await fetchRadioBrowserStations(100);
        if (browserStations && browserStations.length > 0) {
            setAllStations(prev => {
                const existingUrls = new Set(prev.map(s => s.streamUrl));
                const newOnes = browserStations.filter(s => !existingUrls.has(s.streamUrl));
                return [...prev, ...newOnes];
            });
        }
    };
    initStations();
  }, []);

  useEffect(() => {
    if (currentStation && isPlaying && currentUser) {
        statsUpdateInterval.current = window.setInterval(() => {
            setStats(prev => {
                const next = { ...prev };
                next.totalTime = (next.totalTime || 0) + 1;
                const sUrl = currentStation.streamUrl;
                const sStats = next.stationPlays[sUrl] || { name: currentStation.name, genre: currentStation.genre, time: 0 };
                next.stationPlays[sUrl] = { ...sStats, time: sStats.time + 1 };
                if (next.totalTime > 0 && next.totalTime % 60 === 0) {
                    next.points = (next.points || 0) + 5;
                }
                return next;
            });
        }, 1000);
    } else {
        if (statsUpdateInterval.current) clearInterval(statsUpdateInterval.current);
    };
    return () => {
        if (statsUpdateInterval.current) clearInterval(statsUpdateInterval.current);
    };
  }, [currentStation, isPlaying, currentUser, unlockedAchievements]);

  useEffect(() => {
      if (currentUser && stats.totalTime > 0 && stats.totalTime % 10 === 0) {
          updateUserData(currentUser.username, { stats });
      }
  }, [stats.totalTime, currentUser, stats]);

  useEffect(() => {
      if (!nowPlaying || !currentUser) return;
      const activeBounties = bounties.filter(b => !b.completed);
      activeBounties.forEach(bounty => {
          let matched = false;
          if (bounty.targetType === 'artist' && nowPlaying.artist.toLowerCase().includes(bounty.targetValue.toLowerCase())) matched = true;
          if (bounty.targetType === 'station' && currentStation?.name.toLowerCase().includes(bounty.targetValue.toLowerCase())) matched = true;
          if (bounty.targetType === 'genre' && currentStation?.genre.toLowerCase().includes(bounty.targetValue.toLowerCase())) matched = true;

          if (matched) {
              const newBounties = bounties.map(b => b.id === bounty.id ? { ...b, completed: true } : b);
              setBounties(newBounties);
              const newPoints = (stats.points || 0) + bounty.reward;
              setStats(prev => ({ ...prev, points: newPoints }));
              updateUserData(currentUser.username, { stats: { ...stats, points: newPoints }, completedBounties: newBounties.filter(b => b.completed).map(b => b.id) });
              setToasts(t => [...t, { id: Date.now(), title: 'Bounty Complete!', message: `Earned ${bounty.reward} pts`, icon: StarIcon, type: 'success' }]);
          }
      });
  }, [nowPlaying, currentStation, bounties, currentUser, stats]);

  const unlockAchievement = useCallback((achievementId: AchievementID) => {
    if (!currentUser) return;
    setUnlockedAchievements(prev => {
      if (prev[achievementId]) return prev;
      const achievement = ACHIEVEMENTS[achievementId];
      if (!achievement) return prev;
      const newUnlocked: Record<string, UnlockedAchievement> = { ...prev, [achievementId]: { id: achievementId, unlockedAt: new Date().toISOString() }};
      updateUserData(currentUser.username, { unlockedAchievements: newUnlocked });
      setToasts(prevToasts => [...prevToasts, { id: Date.now(), title: achievement.name, icon: achievement.icon, type: 'achievement' }]);
      return newUnlocked;
    });
  }, [currentUser]);

  const handleToggleFavorite = useCallback((station: Station) => {
      setFavoriteStationUrls(prev => {
          const newSet = new Set(prev);
          const isFav = newSet.has(station.streamUrl);
          if (isFav) {
              newSet.delete(station.streamUrl);
              setToasts(t => [...t, { id: Date.now(), title: 'Removed from Favorites', icon: HeartIcon, type: 'info' }]);
          } else {
              newSet.add(station.streamUrl);
              setToasts(t => [...t, { id: Date.now(), title: 'Added to Favorites', icon: HeartIcon, type: 'success' }]);
               if (newSet.size === 1) unlockAchievement('curator');
          }
          if (currentUser) updateUserData(currentUser.username, { favoriteStationUrls: Array.from(newSet) });
          return newSet;
      });
      setAllStations(prev => prev.map(s => s.streamUrl === station.streamUrl ? { ...s, isFavorite: !s.isFavorite } : s));
      setStationForDetail(prev => (prev?.streamUrl === station.streamUrl ? { ...prev, isFavorite: !prev.isFavorite } : prev));
  }, [currentUser, unlockAchievement]);

  const handleLogout = useCallback(() => {
    setCurrentStation(null);
    setStationForDetail(null);
    setCurrentUser(null);
    setIsPlaying(false);
    localStorage.removeItem('currentUser');
    setIsLoginModalOpen(true);
  }, []);

  const loadUserData = useCallback(async (username: string) => {
    setIsDataLoading(true);
    const data = await getUserData(username);
    if (!data) {
        setIsDataLoading(false);
        handleLogout();
        return;
    }
    const favUrls = new Set<string>(data.favoriteStationUrls || []);
    const user: User = { username, role: data.role };
    setCurrentUser(user);
    setFavoriteStationUrls(favUrls);
    setActiveTheme(data.activeTheme);
    setUnlockedThemes(new Set<ThemeName>(data.unlockedThemes ? (data.unlockedThemes as ThemeName[]) : ([] as ThemeName[])));
    setStats(data.stats);
    setAlarm(data.alarm);
    setSongVotes(data.songVotes);
    setUnlockedAchievements(data.unlockedAchievements);
    setQuests((data.quests as Quest[]) || INITIAL_QUESTS);
    setCollection((data.collection as CollectorCard[]) || []);
    setActiveFrame(data.activeFrame);
    // Fix inference mismatch by providing an explicit cast to string[] for data.unlockedFrames
    const framesData = (data.unlockedFrames || [] as string[]) as string[];
    setUnlockedFrames(framesData);
    // Fix: Explicitly cast to UserProfile and ensure nested arrays are cast to string[] to prevent unknown[] errors
    setUserProfile((data.profile as UserProfile) || { bio: '', topArtists: [] as string[], favoriteGenres: [] as string[], following: [] as string[], followers: [] as string[], customAvatarUrl: '' });
    setCustomThemes(data.customThemes || []);
    setActiveSkin(data.activeSkin || 'modern');
    setUnlockedSkins(data.unlockedSkins ? (data.unlockedSkins as SkinID[]) : ([] as SkinID[]));
    setPortfolio(data.portfolio || {});
    setJingles(data.jingles || []);
    if(data.completedBounties) setBounties(prev => prev.map(b => (data.completedBounties as string[]).includes(b.id) ? { ...b, completed: true } : b));
    let defaultView: ActiveView = 'dashboard';
    if (user.role === 'admin') defaultView = 'admin';
    else if (user.role === 'owner') defaultView = 'station_manager_dashboard';
    else if (user.role === 'artist') defaultView = 'artist_dashboard';
    setActiveView(data.activeView || defaultView);
    setIsDataLoading(false);
  }, [handleLogout]);

  useEffect(() => {
      let storedUser: { username: string } | null = null;
      try {
        const storedUserJSON = localStorage.getItem('currentUser');
        if (storedUserJSON) storedUser = JSON.parse(storedUserJSON);
      } catch (error) {}
      if (storedUser) loadUserData(storedUser.username);
      else setIsDataLoading(false);
  }, [loadUserData]);

  useEffect(() => {
      if (hasEnteredApp && !currentUser && !isDataLoading) setIsLoginModalOpen(true);
  }, [hasEnteredApp, currentUser, isDataLoading]);

  const handleLogin = useCallback(async (username: string, role: UserData['role']) => {
    let userData = await getUserData(username.trim());
    if (!userData) await createUserData(username.trim(), role);
    localStorage.setItem('currentUser', JSON.stringify({ username: username.trim() }));
    setIsLoginModalOpen(false);
    await loadUserData(username.trim());
  }, [loadUserData]);

  const handleSelectStation = (station: Station) => { 
      if (currentStation?.streamUrl !== station.streamUrl) {
          setCurrentStation(station);
          setIsPlaying(true);
      } else if (!isPlaying) setIsPlaying(true);
      setStationForDetail(station);
      setIsPlayerVisible(true);
  };
  
  const handleNextStation = () => {
    if (!currentStation) return;
    const currentIndex = allStations.findIndex(s => s.streamUrl === currentStation.streamUrl);
    if (currentIndex === -1) return;
    handleSelectStation(allStations[(currentIndex + 1) % allStations.length]);
  };

  const handlePreviousStation = () => {
    if (!currentStation) return;
    const currentIndex = allStations.findIndex(s => s.streamUrl === currentStation.streamUrl);
    if (currentIndex === -1) return;
    handleSelectStation(allStations[(currentIndex - 1 + allStations.length) % allStations.length]);
  };

  const handleNowPlayingUpdate = useCallback((nowPlayingUpdate: NowPlaying | null) => {
    setNowPlaying(nowPlayingUpdate);
    const newArt = nowPlayingUpdate?.albumArt || null;
    if (newArt) {
      getDominantColor(newArt).then(color => setAlbumArtColor(color)).catch(() => setAlbumArtColor('#67e8f9'));
    } else setAlbumArtColor('#67e8f9');
    if (currentThemeObj?.backgroundImage) {
         setBackgrounds([currentThemeObj.backgroundImage, null]);
         return;
    }
    if (newArt !== backgrounds[activeBgIndex]) { 
        const nextIndex = 1 - activeBgIndex; 
        const newBackgrounds = [...backgrounds] as [string | null, string | null]; 
        newBackgrounds[nextIndex] = newArt; 
        setBackgrounds(newBackgrounds); 
        setActiveBgIndex(nextIndex); 
    }
  }, [activeBgIndex, backgrounds, currentThemeObj]);

  const handleUnlockTheme = (theme: Theme) => {
    if (!currentUser || !theme.cost) return;
    const currentPoints = stats.points || 0;
    if (currentPoints >= theme.cost) {
      const newPoints = currentPoints - theme.cost;
      const newUnlocked = new Set(unlockedThemes);
      newUnlocked.add(theme.name);
      setStats(prev => ({ ...prev, points: newPoints }));
      setUnlockedThemes(newUnlocked);
      updateUserData(currentUser.username, { stats: { ...stats, points: newPoints }, unlockedThemes: Array.from(newUnlocked) });
      setToasts(t => [...t, { id: Date.now(), title: 'Theme Unlocked!', message: `You purchased ${theme.displayName}`, icon: StarIcon, type: 'theme_unlocked' }]);
    } else setToasts(t => [...t, { id: Date.now(), title: 'Insufficient Points', message: `Need ${theme.cost - currentPoints} more points.`, icon: LockIcon, type: 'error' }]);
  };

  const handleSongVote = (songId: string, voteType: 'like' | 'dislike') => {
    if (!currentUser || !nowPlaying || nowPlaying.songId !== songId) return;
    const currentVote = stats.songUserVotes?.[songId];
    let newSongVotes = { ...songVotes };
    let newStats = { ...stats };
    let newUserVotes = { ...(newStats.songUserVotes || {}) };
    if (!newSongVotes[songId]) {
        newSongVotes[songId] = { id: songId, artist: nowPlaying.artist, title: nowPlaying.title, albumArt: nowPlaying.albumArt || '', likes: 0, dislikes: 0 };
    }
    if (currentVote === voteType) {
        delete newUserVotes[songId];
        if (voteType === 'like') newSongVotes[songId].likes = Math.max(0, newSongVotes[songId].likes - 1);
        else newSongVotes[songId].dislikes = Math.max(0, newSongVotes[songId].dislikes - 1);
    } else {
        if (currentVote) {
            if (currentVote === 'like') newSongVotes[songId].likes = Math.max(0, newSongVotes[songId].likes - 1);
            else newSongVotes[songId].dislikes = Math.max(0, newSongVotes[songId].dislikes - 1);
        }
        newUserVotes[songId] = voteType;
        if (voteType === 'like') newSongVotes[songId].likes++;
        else newSongVotes[songId].dislikes++;
    }
    setSongVotes(newSongVotes);
    setStats({ ...newStats, songUserVotes: newUserVotes });
    updateUserData(currentUser.username, { stats: { ...newStats, songUserVotes: newUserVotes }, songVotes: newSongVotes });
    const action = currentVote === voteType ? 'Removed vote' : `Voted ${voteType}`;
    setToasts(t => [...t, { id: Date.now(), title: action, icon: voteType === 'like' ? StarIcon : FireIcon, type: 'success' }]);
  };
  
  const handleOpenProfile = useCallback(async (username: string) => {
      setViewingProfile(username);
      if (currentUser && username === currentUser.username) setTargetUserProfile(userProfile || undefined);
      else {
          const data = await getUserData(username);
          if (data) setTargetUserProfile(data.profile || { bio: '', topArtists: [] as string[], favoriteGenres: [] as string[], following: [] as string[], followers: [] as string[], customAvatarUrl: '' });
      }
  }, [currentUser, userProfile]);

  const handleClaimStation = useCallback((station: Station, reason: string) => {
      if (!currentUser) return;
      setAllStations(prev => prev.map(s => s.streamUrl === station.streamUrl ? { ...s, claimRequest: { username: currentUser.username, reason, submittedAt: new Date().toISOString() } } : s));
      setToasts(t => [...t, { id: Date.now(), title: 'Claim Submitted', message: 'Admins will review your request.', icon: ShieldCheckIcon, type: 'success' }]);
      setIsClaimModalOpen(false);
  }, [currentUser]);

  const handleAddMusicSubmission = useCallback((stationStreamUrl: string, submission: any) => {
    if (!currentUser) return;
    const newSubmission: MusicSubmission = { id: `sub_${Date.now()}`, submittedAt: new Date().toISOString(), status: 'pending', submittedBy: currentUser.username, stationStreamUrl, stationName: allStations.find(s=>s.streamUrl===stationStreamUrl)?.name || '', ...submission };
    setAllStations(prev => prev.map(s => s.streamUrl === stationStreamUrl ? { ...s, submissions: [...(s.submissions || []), newSubmission] } : s));
    setStats(prev => ({ ...prev, points: (prev.points || 0) - 500 }));
    setToasts(t => [...t, { id: Date.now(), title: 'Music Submission Sent!', message: 'Station manager will review your track.', icon: UploadIcon, type: 'success' }]);
    setIsMusicSubmissionModalOpen(false);
  }, [currentUser, allStations]);

  const handleAddGuestbookEntry = useCallback((stationStreamUrl: string, message: string) => {
      if (!currentUser) return;
      const newEntry: GuestbookEntry = { id: `guest_${Date.now()}`, username: currentUser.username, message, timestamp: new Date().toISOString(), stationUrl: stationStreamUrl, stationName: allStations.find(s => s.streamUrl === stationStreamUrl)?.name || 'Unknown' };
      setAllStations(prev => prev.map(s => s.streamUrl === stationStreamUrl ? { ...s, guestbook: [...(s.guestbook || []), newEntry] } : s));
  }, [currentUser, allStations]);

  const handleHype = useCallback(() => {
      setHypeScore(prev => {
          const newScore = prev + 10; 
          if (newScore >= 100) {
              setIsHypeActive(true);
              setToasts(t => [...t, { id: Date.now(), title: 'HYPE OVERLOAD!', message: 'The crowd is going wild!', icon: FireIcon, type: 'hype' }]);
              return 0;
          }
          return newScore;
      });
  }, []);

  const handleEditStation = useCallback((station: Station) => { setStationToEdit(station); setIsEditModalOpen(true); }, []);

  const handleUpdateStation = useCallback((updatedStation: Station) => {
      setAllStations(prev => prev.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s));
      if (currentUser) updateUserData(currentUser.username, { userStations: userStations.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s) });
      setIsEditModalOpen(false);
      setToasts(t => [...t, { id: Date.now(), title: 'Station Updated!', icon: ShieldCheckIcon, type: 'success' }]);
  }, [currentUser, userStations]);

  useEffect(() => {
      const decay = setInterval(() => setHypeScore(prev => Math.max(0, prev - 1)), 200);
      return () => clearInterval(decay);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        switch(e.code) {
            case 'Space': e.preventDefault(); setIsPlaying(prev => !prev); break;
            case 'KeyF': if (currentStation) handleToggleFavorite(currentStation); break;
            case 'ArrowRight': handleNextStation(); break;
            case 'ArrowLeft': handlePreviousStation(); break;
            case 'Escape': setIsSettingsModalOpen(false); setStationForDetail(null); setViewingProfile(null); setIsEditModalOpen(false); break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStation, allStations, handleToggleFavorite]);

  const allMusicSubmissions = useMemo<MusicSubmission[]>(() => 
    allStations.flatMap(station => (station.submissions || []).map(sub => ({ ...sub, stationName: station.name, stationStreamUrl: station.streamUrl }))) as MusicSubmission[]
  , [allStations]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'artist_dashboard': 
        return <ArtistDashboardView user={currentUser} stats={stats} submissions={allMusicSubmissions.filter(s => s.submittedBy === currentUser?.username)} setActiveView={setActiveView} />;
      case 'station_manager_dashboard': 
        return <StationManagerDashboardView user={currentUser} allStations={allStations} onReviewSubmission={()=>{}} onEditStation={handleEditStation} jingles={jingles} onReviewJingle={()=>{}} onDeleteGuestbookEntry={()=>{}} />;
      case 'admin': 
        return <AdminDashboardView stations={allStations} onApproveClaim={()=>{}} onDenyClaim={() => {}} onUpdateUserRole={()=>{}} onEditStation={()=>{}} onDeleteStation={()=>{}} currentUser={currentUser} onOpenProfile={handleOpenProfile} onReviewSubmission={()=>{}} jingles={jingles} onReviewJingle={()=>{}} onDeleteGuestbookEntry={()=>{}} />;
      case 'store': 
        return (
            <StoreView 
                activeTheme={activeTheme} 
                onSetTheme={(t) => { setActiveTheme(t); if(currentUser) updateUserData(currentUser.username, { activeTheme: t }); }} 
                onUnlockTheme={handleUnlockTheme} 
                unlockedThemes={unlockedThemes} 
                currentPoints={stats.points || 0} 
                activeFrame={activeFrame} 
                // Fix line 378: Explicitly cast to string[] to satisfy component prop requirements
                unlockedFrames={unlockedFrames as string[]} 
                onSetFrame={(f) => { setActiveFrame(f); if(currentUser) updateUserData(currentUser.username, { activeFrame: f }); }} 
                onUnlockFrame={()=>{}} 
                activeSkin={activeSkin} 
                unlockedSkins={unlockedSkins as SkinID[]} 
                onSetSkin={(s) => { setActiveSkin(s); if(currentUser) updateUserData(currentUser.username, { activeSkin: s }); }} 
                onUnlockSkin={()=>{}} 
            />
        );
      case 'leaderboard': 
        return <LeaderboardView currentUser={currentUser} userPoints={stats.points || 0} />;
      case 'dashboard': 
        return <DashboardView user={currentUser} stats={stats} favoritesCount={favoriteStationUrls.size} unlockedAchievements={unlockedAchievements} />;
      case 'help': 
        return <HelpFAQ />;
      default: 
        return (
            <StationList 
                stations={allStations.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.genre.toLowerCase().includes(searchQuery.toLowerCase()))} 
                allStations={allStations} 
                currentStation={currentStation} 
                onSelectStation={handleSelectStation} 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)} 
                onToggleFavorite={handleToggleFavorite} 
                songVotes={songVotes} 
                onOpenGenreSpotlight={()=>{}} 
                onShowDetails={setStationForDetail} 
                onPlayFromCommunity={() => {}} 
                currentUser={currentUser} 
            />
        );
    }
  };
  
  const isVideoBg = (url: string | undefined) => url?.endsWith('.mp4') || url?.endsWith('.webm');
  const currentBg = currentThemeObj?.backgroundImage || backgrounds[activeBgIndex];
  
  return (
    <div 
        className="min-h-screen bg-gray-900" 
        style={{ 
            '--accent-color': accentColor, 
            '--accent-color-r': rgbComponents.r, 
            '--accent-color-g': rgbComponents.g, 
            '--accent-color-b': rgbComponents.b 
        } as React.CSSProperties}
    >
      <HypeOverlay isActive={isHypeActive} onComplete={() => setIsHypeActive(false)} />
      <CoinExplosionOverlay isActive={isCoinActive} onComplete={() => setIsCoinActive(false)} />
      <WeatherOverlay lat={currentStation?.location?.lat} lng={currentStation?.location?.lng} />
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      
      <div className="relative h-screen w-screen overflow-hidden">
        {!isDataSaver && (isVideoBg(currentBg || undefined) ? (
            <video src={currentBg!} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" />
        ) : backgrounds.map((bg, index) => (
            <div key={index} className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${activeBgIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} style={{ backgroundImage: bg ? `url(${bg})` : 'none' }} />
        )))}
        <div className={`absolute inset-0 bg-black/${isDataSaver ? '90' : '70'} backdrop-blur-${isDataSaver ? 'none' : '2xl'}`}></div>

        <div className={`relative text-gray-200 flex flex-col h-full transition-[padding-top] duration-300 ${isHeaderVisible && !isImmersiveMode ? 'pt-16' : 'pt-0'}`}>
            <Header currentUser={currentUser} onLogout={handleLogout} points={stats.points || 0} onGoToHome={() => setActiveView('dashboard')} isVisible={isHeaderVisible && !isImmersiveMode} customAvatarUrl={currentUser?.profile?.customAvatarUrl} />
            <div className={`flex flex-1 overflow-hidden transition-opacity duration-300 ${isImmersiveMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {currentUser && <Sidebar currentUser={currentUser} activeView={activeView} setActiveView={setActiveView} onOpenAlarm={() => setIsAlarmModalOpen(true)} onOpenSongChart={() => setIsSongChartModal(true)} onOpenEvents={() => setIsEventsModalOpen(true)} onOpenHistory={() => setIsHistoryModalOpen(true)} onOpenStockMarket={() => {}} />}
                <main id="main-content" className="flex-1 overflow-y-auto pb-24">{renderActiveView()}</main>
                <RightPanel station={stationForDetail} currentStation={currentStation} allStations={allStations} currentUser={currentUser} stats={stats} onAddReview={() => {}} onSelectStation={handleSelectStation} onRateStation={() => {}} onEdit={handleEditStation} onOpenMusicSubmissionModal={(s) => { setStationForSubmission(s); setIsMusicSubmissionModalOpen(true); }} onOpenClaimModal={(s) => { setStationToClaim(s); setIsClaimModalOpen(true); }} onToggleFavorite={handleToggleFavorite} nowPlaying={nowPlaying} bounties={bounties} onOpenJingleModal={() => setIsJingleModalOpen(true)} onAddGuestbookEntry={handleAddGuestbookEntry} />
            </div>
            {isImmersiveMode && currentStation && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-center pointer-events-auto">
                         <img src={nowPlaying?.albumArt || currentStation.coverArt} className="w-64 h-64 rounded-lg shadow-2xl mb-8 mx-auto animate-pulse" alt="Album Art" />
                         <h1 className="text-4xl font-bold text-white mb-2">{nowPlaying?.title}</h1>
                         <p className="text-xl text-gray-300">{nowPlaying?.artist}</p>
                         <div className="mt-8"><button onClick={() => setIsImmersiveMode(false)} className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md">Exit Zen Mode</button></div>
                     </div>
                 </div>
             )}
             {currentStation && <RadioPlayer station={currentStation} allStations={allStations} onNowPlayingUpdate={handleNowPlayingUpdate} onNextStation={handleNextStation} onPreviousStation={handlePreviousStation} isImmersive={isImmersiveMode} onToggleImmersive={() => setIsImmersiveMode(!isImmersiveMode)} songVotes={songVotes} onVote={handleSongVote} onRateStation={() => {}} userRating={0} onOpenTippingModal={() => {}} onSelectStation={handleSelectStation} onToggleChat={() => setIsChatOpen(!isChatOpen)} onStartRaid={() => {}} raidStatus="idle" raidTarget={null} onHidePlayer={() => setIsPlayerVisible(false)} isVisible={isPlayerVisible} onOpenBuyNow={() => setIsBuyNowModalOpen(true)} isHeaderVisible={isHeaderVisible} onToggleHeader={handleToggleHeader} onHype={handleHype} hypeScore={hypeScore} isPlaying={isPlaying} onPlayPause={setIsPlaying} isDataSaver={isDataSaver} sleepTimerTarget={sleepTimerTarget} userSongVotes={stats.songUserVotes} activeSkin={activeSkin} />}
             {currentStation && <ListeningPartyChat station={currentStation} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} nowPlaying={nowPlaying} onSuperChat={() => {}} userPoints={stats.points || 0} activeFrame={activeFrame} onUserClick={handleOpenProfile} currentUserAvatarUrl={currentUser?.profile?.customAvatarUrl} />}
        </div>
      </div>
      
      <BuyNowModal isOpen={isBuyNowModalOpen} onClose={() => setIsBuyNowModalOpen(false)} nowPlaying={nowPlaying} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} isDataSaver={isDataSaver} onToggleDataSaver={() => setIsDataSaver(!isDataSaver)} sleepTimerTarget={sleepTimerTarget} onSetSleepTimer={(min) => setSleepTimerTarget(min ? Date.now() + min * 60000 : null)} />
      <UserProfileModal isOpen={!!viewingProfile} onClose={() => setViewingProfile(null)} username={viewingProfile || ''} currentUser={currentUser} profile={targetUserProfile} onUpdateProfile={()=>{}} onMessage={()=>{}} onFollow={()=>{}} isFollowing={false} />
      <JingleModal isOpen={isJingleModalOpen} onClose={() => setIsJingleModalOpen(false)} onSubmit={()=>{}} />
      <ClaimOwnershipModal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} station={stationToClaim} onSubmit={handleClaimStation} />
      <EditStationModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={handleUpdateStation} station={stationToEdit} />
      <LoginModal isOpen={isLoginModalOpen} onLogin={handleLogin} />
      <SubmitStationModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} onSubmit={()=>{}} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={() => setIsAlarmModalOpen(false)} alarm={alarm} onSetAlarm={setAlarm} favoriteStations={userStations} />
      <GenreSpotlightModal isOpen={false} onClose={() => {}} genre={null} />
      <SongChartModal isOpen={isSongChartModalOpen} onClose={() => setIsSongChartModal(false)} songVotes={songVotes} />
      <EventsModal isOpen={isEventsModalOpen} onClose={() => setIsEventsModalOpen(false)} onSelectStation={(name) => { const s = allStations.find(st=>st.name===name); if(s) handleSelectStation(s); setIsEventsModalOpen(false); }} />
      <SongHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={stats.songHistory} />
      <MusicSubmissionModal isOpen={isMusicSubmissionModalOpen} onClose={() => setIsMusicSubmissionModalOpen(false)} onSubmit={handleAddMusicSubmission} station={stationForSubmission} userPoints={stats.points || 0} />
    </div>
  );
};
