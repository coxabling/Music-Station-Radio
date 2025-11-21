
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
import { stations as defaultStations, THEMES, ACHIEVEMENTS, INITIAL_QUESTS, UserIcon, FireIcon, StarIcon, LockIcon, HeartIcon, STOCKS, BOUNTIES, ShieldCheckIcon, UploadIcon } from './constants';
import type { Station, NowPlaying, ListeningStats, Alarm, ThemeName, SongVote, UnlockedAchievement, AchievementID, ToastData, User, Theme, ActiveView, UserData, MusicSubmission, Bet, Quest, CollectorCard, Lounge, UserProfile, AvatarFrame, SkinID, Stock, Bounty, Jingle, PlayerSkin, GuestbookEntry } from './types';
import { getDominantColor } from './utils/colorExtractor';
import { LandingPage } from './components/LandingPage';
import { getUserData, updateUserData, createUserData, followUser, unfollowUser } from './services/apiService';
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
import { StockMarketModal } from './components/StockMarketModal';
import { JingleModal } from './components/JingleModal';
import { HelpFAQ } from './components/HelpFAQ';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, parseInt(result[3], 16)}` : '103, 232, 249';
};

const App: React.FC = () => {
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
  
  // Settings & Preferences
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDataSaver, setIsDataSaver] = useState(false);
  const [sleepTimerTarget, setSleepTimerTarget] = useState<number | null>(null);
  
  const [backgrounds, setBackgrounds] = useState<[string | null, string | null]>([null, null]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  
  const [albumArtColor, setAlbumArtColor] = useState('#67e8f9');
  const [activeTheme, setActiveTheme] = useState<ThemeName>('dynamic');

  const [allStations, setAllStations] = useState<Station[]>(defaultStations);
  const [userStations, setUserStations] = useState<Station[]>([]);
  
  // --- Modals ---
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isSongChartModalOpen, setIsSongChartModalOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [tippingModalStation, setTippingModalStation] = useState<Station | null>(null);
  const [genreForSpotlight, setGenreForSpotlight] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stationToEdit, setStationToEdit] = useState<Station | null>(null);
  const [isMusicSubmissionModalOpen, setIsMusicSubmissionModalOpen] = useState(false);
  const [stationForSubmission, setStationForSubmission] = useState<Station | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [stationToClaim, setStationToClaim] = useState<Station | null>(null);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState<string | null>(null);
  const [isLoungeModalOpen, setIsLoungeModalOpen] = useState(false);
  const [isThemeCreatorOpen, setIsThemeCreatorOpen] = useState(false);
  const [isStockMarketOpen, setIsStockMarketOpen] = useState(false);
  const [isJingleModalOpen, setIsJingleModalOpen] = useState(false);

  
  // Profile state
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [targetUserProfile, setTargetUserProfile] = useState<UserProfile | undefined>(undefined);

  const [favoriteStationUrls, setFavoriteStationUrls] = useState<Set<string>>(new Set());
  const [unlockedThemes, setUnlockedThemes] = useState<Set<ThemeName>>(new Set(['dynamic']));

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);

  const [stats, setStats] = useState<ListeningStats>({ totalTime: 0, stationPlays: {}, points: 0, songHistory: [], songUserVotes: {} });
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [songVotes, setSongVotes] = useState<Record<string, SongVote>>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, UnlockedAchievement>>({});
  const [quests, setQuests] = useState([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [collection, setCollection] = useState<CollectorCard[]>([]);
  
  // Social State
  const [activeFrame, setActiveFrame] = useState<string | undefined>(undefined);
  const [unlockedFrames, setUnlockedFrames] = useState<string[]>([]);
  const [activeLounge, setActiveLounge] = useState<Lounge | null>(null);
  const [hypeScore, setHypeScore] = useState(0);
  const [isHypeActive, setIsHypeActive] = useState(false);
  const [isCoinActive, setIsCoinActive] = useState(false);
  
  // New Feature State
  const [activeSkin, setActiveSkin] = useState<SkinID>('modern');
  const [unlockedSkins, setUnlockedSkins] = useState<SkinID[]>(['modern']);
  const [stocks, setStocks] = useState<Stock[]>(STOCKS);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [bounties, setBounties] = useState<Bounty[]>(BOUNTIES);
  const [jingles, setJingles] = useState<Jingle[]>([]); // Global Jingle state

  
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [raidStatus, setRaidStatus] = useState<'idle' | 'voting'>('idle');
  const [raidTarget, setRaidTarget] = useState<Station | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);

  const statsUpdateInterval = useRef<number | null>(null);
  
  // Combine stock themes with user custom themes
  const availableThemes = useMemo(() => [...THEMES, ...customThemes], [customThemes]);
  
  // Determine current theme object
  const currentThemeObj = useMemo(() => {
      return availableThemes.find(t => t.name === activeTheme);
  }, [activeTheme, availableThemes]);

  const handleToggleHeader = useCallback(() => {
    setIsHeaderVisible(p => !p);
  }, []);

  const accentColor = useMemo(() => {
    if (activeTheme === 'dynamic') {
      return albumArtColor;
    }
    return currentThemeObj?.color || '#67e8f9';
  }, [activeTheme, albumArtColor, currentThemeObj]);
  
  const accentColorRgb = useMemo(() => hexToRgb(accentColor), [accentColor]);

  // Listening Time & Stats Tracker
  useEffect(() => {
    if (currentStation && isPlaying && currentUser) {
        statsUpdateInterval.current = window.setInterval(() => {
            setStats(prev => {
                const next = { ...prev };
                
                // Total Time
                next.totalTime = (next.totalTime || 0) + 1;
                
                // Station Time
                const sUrl = currentStation.streamUrl;
                const sStats = next.stationPlays[sUrl] || { name: currentStation.name, genre: currentStation.genre, time: 0 };
                next.stationPlays[sUrl] = { ...sStats, time: sStats.time + 1 };
                
                // Points System: 5 points every minute
                if (next.totalTime > 0 && next.totalTime % 60 === 0) {
                    next.points = (next.points || 0) + 5;
                }

                // Check for time-based achievements (simplified)
                if (next.totalTime === 3600 && !unlockedAchievements['one_hour']) {
                   // Trigger achievement unlock would go here
                }

                return next;
            });
        }, 1000);
    } else {
        if (statsUpdateInterval.current) {
            clearInterval(statsUpdateInterval.current);
        }
    }
    return () => {
        if (statsUpdateInterval.current) {
            clearInterval(statsUpdateInterval.current);
        }
    };
  }, [currentStation, isPlaying, currentUser, unlockedAchievements]);

  // Persist Stats Periodically (Every 10s)
  useEffect(() => {
      if (currentUser && stats.totalTime > 0 && stats.totalTime % 10 === 0) {
          updateUserData(currentUser.username, { stats });
      }
  }, [stats.totalTime, currentUser, stats]); // Added stats as dependency

  // Check Bounties
  useEffect(() => {
      if (!nowPlaying || !currentUser) return;
      
      const activeBounties = bounties.filter(b => !b.completed);
      activeBounties.forEach(bounty => {
          let matched = false;
          if (bounty.targetType === 'artist' && nowPlaying.artist.toLowerCase().includes(bounty.targetValue.toLowerCase())) matched = true;
          if (bounty.targetType === 'station' && currentStation?.name.toLowerCase().includes(bounty.targetValue.toLowerCase())) matched = true;
          if (bounty.targetType === 'genre' && currentStation?.genre.toLowerCase().includes(bounty.targetValue.toLowerCase())) matched = true;

          if (matched) {
              // Claim bounty
              const newBounties = bounties.map(b => b.id === bounty.id ? { ...b, completed: true } : b);
              setBounties(newBounties);
              const newPoints = (stats.points || 0) + bounty.reward;
              setStats(prev => ({ ...prev, points: newPoints }));
              updateUserData(currentUser.username, { stats: { ...stats, points: newPoints }, completedBounties: newBounties.filter(b => b.completed).map(b => b.id) });
              
              setToasts(t => [...t, { id: Date.now(), title: 'Bounty Complete!', message: `Earned ${bounty.reward} pts`, icon: StarIcon, type: 'success' }]);
          }
      });
  }, [nowPlaying, currentStation, bounties, currentUser, stats]);

  // Dynamic Favicon Logic
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    
    if (ctx && link) {
        let frame = 0;
        const animateFavicon = () => {
            if (!currentStation || !isPlaying) return;
            ctx.clearRect(0, 0, 32, 32);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillStyle = accentColor;
            
            // Simple visualizer simulation
            const height = 10 + Math.sin(frame / 5) * 10;
            ctx.fillRect(10, 16 - height/2, 4, height);
            ctx.fillRect(18, 16 - height/3, 4, height * 0.8);
            
            link.href = canvas.toDataURL();
            frame++;
            requestAnimationFrame(animateFavicon);
        };
        if (currentStation && isPlaying) animateFavicon();
    }
  }, [currentStation, isPlaying, accentColor]);

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
          
          if (currentUser) {
              updateUserData(currentUser.username, { favoriteStationUrls: Array.from(newSet) });
          }
          
          return newSet;
      });
      
      // Optimistic UI update
      setAllStations(prev => prev.map(s => s.streamUrl === station.streamUrl ? { ...s, isFavorite: !s.isFavorite } : s));
      
      // Update detail panel if open
      setStationForDetail(prev => {
          if (prev && prev.streamUrl === station.streamUrl) {
              return { ...prev, isFavorite: !prev.isFavorite };
          }
          return prev;
      });
  }, [currentUser, unlockAchievement]);

  // Moved handleLogout before loadUserData to fix "used before declaration" error
  const handleLogout = useCallback(() => {
    setCurrentStation(null);
    setStationForDetail(null);
    setCurrentUser(null);
    setIsPlaying(false);
    localStorage.removeItem('currentUser');
    setIsLoginModalOpen(true);
    setAllStations(defaultStations);
  }, []);

  const loadUserData = useCallback(async (username: string) => {
    setIsDataLoading(true);

    const data = await getUserData(username);
    if (!data) {
        console.error("Failed to load user data for", username);
        setIsDataLoading(false);
        handleLogout(); // `handleLogout` is now declared
        return;
    }
    
    const favUrls = new Set<string>(data.favoriteStationUrls || []);
    // Ensure allStations are always loaded with default values first, then merge user data
    const updatedAllStations = defaultStations.map(s => ({...s, isFavorite: favUrls.has(s.streamUrl)}));
    const userStationsWithFavorites = (data.userStations || []).map(s => ({...s, isFavorite: favUrls.has(s.streamUrl)}));

    // Merge default and user-owned stations, prioritizing user-owned for existing streams
    const combinedStationsMap = new Map<string, Station>();
    updatedAllStations.forEach(s => combinedStationsMap.set(s.streamUrl, s));
    userStationsWithFavorites.forEach(s => combinedStationsMap.set(s.streamUrl, s));
    const allKnownStations = Array.from(combinedStationsMap.values());
    
    const user: User = { username, role: data.role };
    setCurrentUser(user);
    
    setAllStations(allKnownStations);
    setUserStations(data.userStations);
    setFavoriteStationUrls(favUrls);
    setActiveTheme(data.activeTheme);
    // Fix: Explicitly cast to ThemeName[]
    setUnlockedThemes(new Set<ThemeName>((data.unlockedThemes || []) as ThemeName[]));
    setStats(data.stats);
    setAlarm(data.alarm);
    setSongVotes(data.songVotes);
    setUnlockedAchievements(data.unlockedAchievements);
    setQuests((data.quests as Quest[]) || INITIAL_QUESTS);
    setBets(data.bets || []);
    setCollection(data.collection || []);
    setActiveFrame(data.activeFrame);
    // Fix: Explicitly cast to string[]
    setUnlockedFrames((data.unlockedFrames || []) as string[]);
    setUserProfile(data.profile || { 
        bio: '', 
        topArtists: [], 
        favoriteGenres: [], 
        following: [], 
        followers: [] 
    });
    setCustomThemes(data.customThemes || []);
    setActiveSkin(data.activeSkin || 'modern');
    // Fix: Explicitly cast to SkinID[]
    setUnlockedSkins((data.unlockedSkins || ['modern']) as SkinID[]);
    setPortfolio(data.portfolio || {});
    setJingles(data.jingles || []); // Initialize jingles from user data

    
    // Restore completed bounties
    if(data.completedBounties) {
        setBounties(prev => prev.map(b => data.completedBounties.includes(b.id) ? { ...b, completed: true } : b));
    }

    let defaultView: ActiveView = 'dashboard';
    if (user.role === 'admin') defaultView = 'admin';
    else if (user.role === 'owner') defaultView = 'station_manager_dashboard';
    else if (user.role === 'artist') defaultView = 'artist_dashboard';

    setActiveView(data.activeView || defaultView);
    setIsDataLoading(false);
  }, [handleLogout]); // Dependency is fine now because handleLogout is declared above

  useEffect(() => {
      let storedUser: { username: string } | null = null;
      try {
        const storedUserJSON = localStorage.getItem('currentUser');
        if (storedUserJSON) storedUser = JSON.parse(storedUserJSON);
      } catch (error) { console.error("Failed to load current user:", error); }
      if (storedUser) loadUserData(storedUser.username);
      else setIsDataLoading(false);
  }, [loadUserData]);

  useEffect(() => {
      if (hasEnteredApp && !currentUser && !isDataLoading) setIsLoginModalOpen(true);
  }, [hasEnteredApp, currentUser, isDataLoading]);

  const handleLogin = useCallback(async (username: string, role: UserData['role']) => {
      if (username.toLowerCase() === 'admin') {
        let userData = await getUserData(username);
        if (!userData) await createUserData(username, 'admin');
        localStorage.setItem('currentUser', JSON.stringify({ username }));
        setIsLoginModalOpen(false);
        await loadUserData(username);
        return;
    }
    let userData = await getUserData(username);
    if (!userData) await createUserData(username, role);
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    setIsLoginModalOpen(false);
    await loadUserData(username);
  }, [loadUserData]);

  const handleSelectStation = (station: Station) => { 
      if (currentStation?.streamUrl !== station.streamUrl) {
          setCurrentStation(station);
          setIsPlaying(true); // Auto-play new station
      } else {
          // If clicking same station, toggle play/pause if needed, or just open details
          if (!isPlaying) setIsPlaying(true);
      }
      setStationForDetail(station);
      setIsPlayerVisible(true);
  };
  
  const handleNextStation = () => {
    if (!currentStation) return;
    const currentIndex = allStations.findIndex(s => s.streamUrl === currentStation.streamUrl);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % allStations.length;
    handleSelectStation(allStations[nextIndex]);
  };

  const handlePreviousStation = () => {
    if (!currentStation) return;
    const currentIndex = allStations.findIndex(s => s.streamUrl === currentStation.streamUrl);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + allStations.length) % allStations.length;
    handleSelectStation(allStations[prevIndex]);
  };

  const handleNowPlayingUpdate = useCallback((nowPlayingUpdate: NowPlaying | null) => {
    setNowPlaying(nowPlayingUpdate);
    const newArt = nowPlayingUpdate?.albumArt || null;
    if (newArt) {
      getDominantColor(newArt).then(color => setAlbumArtColor(color)).catch(() => setAlbumArtColor('#67e8f9'));
    } else { setAlbumArtColor('#67e8f9'); }
    
    // Background handling with Video Support
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
  }, [activeBgIndex, backgrounds, currentStation, currentUser, currentThemeObj]);

  const handleCreateTheme = (newTheme: Theme) => {
      if (!currentUser) return;
      
      // Safely update state and calculate derived values for update
      const updatedCustomThemes = [...customThemes, newTheme];
      const updatedUnlockedThemesSet = new Set(unlockedThemes);
      updatedUnlockedThemesSet.add(newTheme.name);
      
      const newPoints = (stats.points || 0) - (newTheme.cost || 0);

      // Update React state
      setCustomThemes(updatedCustomThemes);
      setUnlockedThemes(updatedUnlockedThemesSet);
      setStats(prev => ({ ...prev, points: newPoints }));
      
      // Persist to backend
      updateUserData(currentUser.username, { 
          customThemes: updatedCustomThemes, 
          unlockedThemes: Array.from(updatedUnlockedThemesSet),
          stats: { ...stats, points: newPoints } 
        });
  };

  const handleUnlockTheme = (theme: Theme) => {
    if (!currentUser || !theme.cost) return;
    const currentPoints = stats.points || 0;
    
    if (currentPoints >= theme.cost) {
      const newPoints = currentPoints - theme.cost;
      const newUnlocked = new Set(unlockedThemes);
      newUnlocked.add(theme.name);
      
      setStats(prev => ({ ...prev, points: newPoints }));
      setUnlockedThemes(newUnlocked);
      
      updateUserData(currentUser.username, {
        stats: { ...stats, points: newPoints },
        unlockedThemes: Array.from(newUnlocked)
      });
      
      setToasts(t => [...t, { 
        id: Date.now(), 
        title: 'Theme Unlocked!', 
        message: `You purchased ${theme.displayName}`, 
        icon: StarIcon, 
        type: 'theme_unlocked' 
      }]);
    } else {
       setToasts(t => [...t, { 
        id: Date.now(), 
        title: 'Insufficient Points', 
        message: `Need ${theme.cost - currentPoints} more points.`, 
        icon: LockIcon, 
        type: 'error' 
      }]);
    }
  };

  const handleUnlockFrame = (frame: AvatarFrame) => {
    if (!currentUser) return;
    const currentPoints = stats.points || 0;
    
    if (currentPoints >= frame.cost) {
      const newPoints = currentPoints - frame.cost;
      const newUnlocked = [...unlockedFrames, frame.id];
      
      setStats(prev => ({ ...prev, points: newPoints }));
      setUnlockedFrames(newUnlocked);
      
      updateUserData(currentUser.username, {
        stats: { ...stats, points: newPoints },
        unlockedFrames: newUnlocked
      });
      
       setToasts(t => [...t, { 
        id: Date.now(), 
        title: 'Avatar Unlocked!', 
        message: `You purchased ${frame.name}`, 
        icon: StarIcon, 
        type: 'theme_unlocked' 
      }]);
    } else {
       setToasts(t => [...t, { 
        id: Date.now(), 
        title: 'Insufficient Points', 
        message: `Need ${frame.cost - currentPoints} more points.`, 
        icon: LockIcon, 
        type: 'error' 
      }]);
    }
  };
  
  const handleUnlockSkin = (skin: PlayerSkin) => {
      if (!currentUser) return;
      const currentPoints = stats.points || 0;
      
      if (currentPoints >= skin.cost) {
          const newPoints = currentPoints - skin.cost;
          const newUnlocked: SkinID[] = [...unlockedSkins, skin.id];
          
          setStats(prev => ({ ...prev, points: newPoints }));
          setUnlockedSkins(newUnlocked);
          
          updateUserData(currentUser.username, {
            stats: { ...stats, points: newPoints },
            unlockedSkins: newUnlocked
          });
          
           setToasts(t => [...t, { 
            id: Date.now(), 
            title: 'Skin Unlocked!', 
            message: `You purchased ${skin.name}`, 
            icon: StarIcon, 
            type: 'theme_unlocked' 
          }]);
      } else {
          setToasts(t => [...t, { 
            id: Date.now(), 
            title: 'Insufficient Points', 
            message: `Need ${skin.cost - currentPoints} more points.`, 
            icon: LockIcon, 
            type: 'error' 
          }]);
      }
  };

  const handleSongVote = (songId: string, voteType: 'like' | 'dislike') => {
    if (!currentUser || !nowPlaying || nowPlaying.songId !== songId) return;

    const currentVote = stats.songUserVotes?.[songId];
    let newSongVotes = { ...songVotes };
    let newStats = { ...stats };
    let newUserVotes = { ...(newStats.songUserVotes || {}) };
    
    // Ensure song entry exists
    if (!newSongVotes[songId]) {
        newSongVotes[songId] = {
            id: songId,
            artist: nowPlaying.artist,
            title: nowPlaying.title,
            albumArt: nowPlaying.albumArt || '',
            likes: 0,
            dislikes: 0
        };
    }

    if (currentVote === voteType) {
        // Toggle off (remove vote)
        delete newUserVotes[songId];
        if (voteType === 'like') newSongVotes[songId].likes = Math.max(0, newSongVotes[songId].likes - 1);
        else newSongVotes[songId].dislikes = Math.max(0, newSongVotes[songId].dislikes - 1);
    } else {
        // Add or Change vote
        if (currentVote) {
            // Remove previous vote count
            if (currentVote === 'like') newSongVotes[songId].likes = Math.max(0, newSongVotes[songId].likes - 1);
            else newSongVotes[songId].dislikes = Math.max(0, newSongVotes[songId].dislikes - 1);
        }
        // Add new vote count
        newUserVotes[songId] = voteType;
        if (voteType === 'like') newSongVotes[songId].likes++;
        else newSongVotes[songId].dislikes++;
    }

    setSongVotes(newSongVotes);
    setStats({ ...newStats, songUserVotes: newUserVotes });
    
    updateUserData(currentUser.username, { 
        stats: { ...newStats, songUserVotes: newUserVotes },
        songVotes: newSongVotes
    });

    const action = currentVote === voteType ? 'Removed vote' : `Voted ${voteType}`;
    setToasts(t => [...t, { id: Date.now(), title: action, icon: voteType === 'like' ? StarIcon : FireIcon, type: 'success' }]);
  };
  
  const handleUpdateProfile = (newProfile: UserProfile) => {
      if (!currentUser) return;
      setUserProfile(newProfile);
      updateUserData(currentUser.username, { profile: newProfile });
  };

  const handleOpenProfile = useCallback(async (username: string) => {
      setViewingProfile(username);
      if (currentUser && username === currentUser.username) {
          setTargetUserProfile(userProfile || undefined);
      } else {
          const data = await getUserData(username);
          if (data) setTargetUserProfile(data.profile || { bio: '', topArtists: [], favoriteGenres: [], following: [], followers: [] });
      }
  }, [currentUser, userProfile]);

  const handleToggleFollow = async (targetUsername: string) => {
      if (!currentUser || !userProfile) return;
      
      const isFollowing = userProfile.following.includes(targetUsername);
      
      if (isFollowing) {
          await unfollowUser(currentUser.username, targetUsername);
          // Update local state
          const newFollowing = userProfile.following.filter(u => u !== targetUsername);
          setUserProfile({ ...userProfile, following: newFollowing });
          
          // Update target profile if viewing
          if (targetUserProfile && viewingProfile === targetUsername) {
               setTargetUserProfile({
                   ...targetUserProfile,
                   followers: targetUserProfile.followers.filter(u => u !== currentUser.username)
               });
          }
          setToasts(t => [...t, { id: Date.now(), title: `Unfollowed ${targetUsername}`, icon: UserIcon, type: 'success' }]);
      } else {
          await followUser(currentUser.username, targetUsername);
           // Update local state
          const newFollowing = [...userProfile.following, targetUsername];
          setUserProfile({ ...userProfile, following: newFollowing });
          
          // Update target profile if viewing
          if (targetUserProfile && viewingProfile === targetUsername) {
               setTargetUserProfile({
                   ...targetUserProfile,
                   followers: [...targetUserProfile.followers, currentUser.username]
               });
          }
           setToasts(t => [...t, { id: Date.now(), title: `Following ${targetUsername}`, icon: UserIcon, type: 'success' }]);
      }
  };

  const handleClaimStation = useCallback((station: Station, reason: string) => {
      if (!currentUser) return;
      
      setAllStations(prevStations => prevStations.map(s => {
          if (s.streamUrl === station.streamUrl) {
              return {
                  ...s,
                  claimRequest: {
                      username: currentUser.username,
                      reason: reason,
                      submittedAt: new Date().toISOString()
                  }
              };
          }
          return s;
      }));
      
      setToasts(t => [...t, { 
          id: Date.now(), 
          title: 'Claim Submitted', 
          message: 'Admins will review your request.', 
          icon: ShieldCheckIcon, 
          type: 'success' 
      }]);
      
      setIsClaimModalOpen(false);
      setStationToClaim(null);
  }, [currentUser]);

  const handleAddMusicSubmission = useCallback((stationStreamUrl: string, submission: Omit<MusicSubmission, 'id' | 'submittedAt' | 'status' | 'submittedBy' | 'stationStreamUrl' | 'stationName'>) => {
    if (!currentUser || !stationForSubmission) return;

    const newSubmission: MusicSubmission = {
        id: `sub_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        submittedBy: currentUser.username,
        stationStreamUrl,
        stationName: stationForSubmission.name,
        ...submission,
    };

    setAllStations(prevStations => prevStations.map(s => {
        if (s.streamUrl === stationStreamUrl) {
            return { ...s, submissions: [...(s.submissions || []), newSubmission] };
        }
        return s;
    }));

    setStats(prev => ({ ...prev, points: (prev.points || 0) - (500) })); // Assuming a cost, 500 for now

    setToasts(t => [...t, {
        id: Date.now(),
        title: 'Music Submission Sent!',
        message: 'Station manager will review your track.',
        icon: UploadIcon,
        type: 'success',
    }]);

    setIsMusicSubmissionModalOpen(false);
    setStationForSubmission(null);
  }, [currentUser, stationForSubmission, stats.points]);

  const handleReviewMusicSubmission = useCallback((stationStreamUrl: string, submissionId: string, status: 'approved' | 'rejected', managerComment?: string) => {
    if (!currentUser) return;
    setAllStations(prevStations => prevStations.map(s => {
        if (s.streamUrl === stationStreamUrl) {
            const updatedSubmissions = (s.submissions || []).map(sub => {
                if (sub.id === submissionId) {
                    return { ...sub, status, managerComment, reviewedAt: new Date().toISOString() };
                }
                return sub;
            });
            return { ...s, submissions: updatedSubmissions };
        }
        return s;
    }));
    // In a real app, this would trigger a backend update for the station owner
    // For this demo, we're relying on allStations update and periodic user data saves.
  }, [currentUser]);

  const handleAddGuestbookEntry = useCallback((stationStreamUrl: string, message: string) => {
      if (!currentUser) return;
      const newEntry: GuestbookEntry = {
          id: `guest_${Date.now()}`,
          username: currentUser.username,
          message,
          timestamp: new Date().toISOString(),
          stationUrl: stationStreamUrl,
          stationName: allStations.find(s => s.streamUrl === stationStreamUrl)?.name || 'Unknown Station'
      };
      setAllStations(prevStations => prevStations.map(s => {
          if (s.streamUrl === stationStreamUrl) {
              return { ...s, guestbook: [...(s.guestbook || []), newEntry] };
          }
          return s;
      }));
       // In a real app, this would trigger a backend update for the station owner
  }, [currentUser, allStations]);

  const handleDeleteGuestbookEntry = useCallback((stationStreamUrl: string, entryId: string) => {
      setAllStations(prevStations => prevStations.map(s => {
          if (s.streamUrl === stationStreamUrl) {
              const updatedGuestbook = (s.guestbook || []).filter(entry => entry.id !== entryId);
              return { ...s, guestbook: updatedGuestbook };
          }
          return s;
      }));
      // In a real app, this would trigger a backend update for the station owner
  }, []);
  
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

  const handleSetSleepTimer = (minutes: number | null) => {
      if (minutes === null) {
          setSleepTimerTarget(null);
          setToasts(t => [...t, { id: Date.now(), title: 'Sleep Timer Off', icon: UserIcon, type: 'info' }]);
      } else {
          const target = Date.now() + minutes * 60000;
          setSleepTimerTarget(target);
          setToasts(t => [...t, { id: Date.now(), title: `Sleep Timer Set`, message: `Stopping in ${minutes} mins`, icon: UserIcon, type: 'success' }]);
      }
  };
  
  const handleStockTransaction = (symbol: string, amount: number, type: 'buy' | 'sell') => {
      if (!currentUser) return;
      const stock = stocks.find(s => s.symbol === symbol);
      if (!stock) return;
      
      const totalCost = stock.price * amount;
      let newPoints = stats.points || 0;
      let newPortfolio = { ...portfolio };
      
      if (type === 'buy') {
          if (newPoints < totalCost) {
              setToasts(t => [...t, { id: Date.now(), title: 'Insufficient Points', icon: LockIcon, type: 'error' }]);
              return;
          }
          newPoints -= totalCost;
          newPortfolio[symbol] = (newPortfolio[symbol] || 0) + amount;
           setToasts(t => [...t, { id: Date.now(), title: `Bought ${amount} ${symbol}`, message: `Spent ${totalCost.toFixed(0)} pts`, icon: StarIcon, type: 'success' }]);
      } else {
          if ((newPortfolio[symbol] || 0) < amount) {
              setToasts(t => [...t, { id: Date.now(), title: 'Insufficient Stock', icon: LockIcon, type: 'error' }]);
              return;
          }
          newPoints += totalCost;
          newPortfolio[symbol] -= amount;
          if (newPortfolio[symbol] === 0) delete newPortfolio[symbol];
           setToasts(t => [...t, { id: Date.now(), title: `Sold ${amount} ${symbol}`, message: `Earned ${totalCost.toFixed(0)} pts`, icon: StarIcon, type: 'success' }]);
      }
      
      setStats(prev => ({ ...prev, points: newPoints }));
      setPortfolio(newPortfolio);
      updateUserData(currentUser.username, { stats: { ...stats, points: newPoints }, portfolio: newPortfolio });
  }
  
  const handleSubmitJingle = (blob: Blob) => {
      // In a real app, this would upload the blob. Here we just mock it.
      if (!currentUser || !currentStation) return;
      const newJingle: Jingle = {
          id: `jingle_${Date.now()}`,
          url: URL.createObjectURL(blob),
          stationUrl: currentStation?.streamUrl, // Link jingle to current station
          creator: currentUser.username,
          status: 'pending',
          timestamp: new Date().toISOString()
      };
      setJingles(prev => [...prev, newJingle]); // Add to global jingles state
      updateUserData(currentUser.username, { jingles: [...jingles, newJingle] }); // Persist global jingles state
      setToasts(t => [...t, { id: Date.now(), title: 'Jingle Submitted!', message: 'Waiting for station manager approval.', icon: FireIcon, type: 'success' }]);
  }

  const handleReviewJingle = useCallback((jingleId: string, status: 'approved' | 'rejected') => {
      if (!currentUser) return;
      setJingles(prevJingles => prevJingles.map(j => {
          if (j.id === jingleId) {
              return { ...j, status };
          }
          return j;
      }));
      // In a real app, this would trigger a backend update for the jingle state.
      // For this demo, we're relying on allStations update and periodic user data saves.
  }, [currentUser]);

  // Hype Logic: Decay & Simulation
  useEffect(() => {
      const decay = setInterval(() => {
          setHypeScore(prev => Math.max(0, prev - 1));
      }, 200);
      
      const sim = setInterval(() => {
          if(Math.random() > 0.6) {
               setHypeScore(prev => {
                   // Cap simulated hype so it doesn't auto-trigger explosion easily
                   if (prev >= 95) return prev;
                   return prev + Math.floor(Math.random() * 3) + 1;
               });
          }
      }, 1000);

      return () => { clearInterval(decay); clearInterval(sim); };
  }, []);
  
  // Stock Price Simulation
  useEffect(() => {
      const interval = setInterval(() => {
          setStocks(prev => prev.map(s => {
              const change = (Math.random() - 0.5) * 2;
              const newPrice = Math.max(10, s.price + change);
              return { ...s, price: parseFloat(newPrice.toFixed(2)), change: parseFloat(change.toFixed(2)) };
          }));
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  // Friend Notifications Simulation
  useEffect(() => {
      if (!userProfile?.following.length) return;
      
      const interval = setInterval(() => {
          if (Math.random() > 0.7) { // 30% chance every check
              const randomFriend = userProfile.following[Math.floor(Math.random() * userProfile.following.length)];
              const actions = [
                  { msg: 'came online', type: 'info' },
                  { msg: 'started a Listening Party', type: 'party' },
                  { msg: `is listening to ${currentStation ? 'a new station' : 'High Grade Radio'}`, type: 'music' }
              ];
              const action = actions[Math.floor(Math.random() * actions.length)];
              
              setToasts(prev => [...prev, {
                  id: Date.now(),
                  title: randomFriend,
                  message: action.msg,
                  icon: UserIcon,
                  type: 'milestone'
              }]);
          }
      }, 45000); // Check every 45s
      
      return () => clearInterval(interval);
  }, [userProfile?.following, currentStation]);
  
  // Sleep Timer Logic
  useEffect(() => {
      if (!sleepTimerTarget) return;
      const checkTimer = setInterval(() => {
          if (Date.now() >= sleepTimerTarget) {
              setIsPlaying(false);
              setSleepTimerTarget(null);
              setToasts(t => [...t, { id: Date.now(), title: 'Sleep Timer', message: 'Playback stopped.', icon: UserIcon, type: 'info' }]);
          }
      }, 1000);
      return () => clearInterval(checkTimer);
  }, [sleepTimerTarget]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                setIsPlaying(prev => !prev);
                break;
            case 'KeyM':
                setToasts(t => [...t, { id: Date.now(), title: 'Use Player controls', message: 'Mute is handled in player bar.', icon: UserIcon, type: 'info' }]);
                break;
            case 'KeyF':
                if (currentStation) {
                   handleToggleFavorite(currentStation);
                }
                break;
            case 'ArrowRight':
                 handleNextStation();
                 break;
            case 'ArrowLeft':
                 handlePreviousStation();
                 break;
            case 'Escape':
                 setIsSettingsModalOpen(false);
                 setStationForDetail(null);
                 setViewingProfile(null);
                 setIsStockMarketOpen(false);
                 setIsJingleModalOpen(false);
                 break;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStation, allStations, handleToggleFavorite, handleNextStation, handlePreviousStation]); // Re-bind when stations change for next/prev

  // Fix: Define allMusicSubmissions for ArtistDashboardView
  const allMusicSubmissions = useMemo(() => 
    allStations.flatMap(station => 
      (station.submissions || []).map(sub => ({ ...sub, stationName: station.name, stationStreamUrl: station.streamUrl }))
    ),
    [allStations]
  );

  if (!hasEnteredApp) {
    return <LandingPage onEnter={() => setHasEnteredApp(true)} />;
  }

  const renderActiveView = () => {
      switch (activeView) {
      case 'artist_dashboard':
        return <ArtistDashboardView user={currentUser} stats={stats} submissions={allMusicSubmissions.filter(s => s.submittedBy === currentUser?.username)} setActiveView={setActiveView} />;
      case 'station_manager_dashboard':
        return <StationManagerDashboardView user={currentUser} allStations={allStations} onReviewSubmission={handleReviewMusicSubmission} onEditStation={() => {}} />;
      case 'admin':
        return (
          <AdminDashboardView 
            stations={allStations} 
            onApproveClaim={()=>{}} 
            onDenyClaim={()=>{}} 
            onUpdateUserRole={()=>{}} 
            onEditStation={()=>{}} 
            onDeleteStation={()=>{}} 
            currentUser={currentUser} 
            onOpenProfile={handleOpenProfile} // Passed to AdminDashboardView
            onReviewSubmission={handleReviewMusicSubmission}
            jingles={jingles} // Passed global jingles
            onReviewJingle={handleReviewJingle}
            onDeleteGuestbookEntry={handleDeleteGuestbookEntry}
          />
        );
      case 'store':
        return (
            <StoreView 
                activeTheme={activeTheme} 
                onSetTheme={(t) => { setActiveTheme(t); if(currentUser) updateUserData(currentUser.username, { activeTheme: t }); }} 
                onUnlockTheme={handleUnlockTheme} 
                unlockedThemes={unlockedThemes} 
                currentPoints={stats.points || 0}
                activeFrame={activeFrame}
                unlockedFrames={unlockedFrames}
                onSetFrame={(f) => { setActiveFrame(f); if(currentUser) updateUserData(currentUser.username, { activeFrame: f }); }}
                onUnlockFrame={handleUnlockFrame}
                activeSkin={activeSkin}
                unlockedSkins={unlockedSkins}
                onSetSkin={(s) => { setActiveSkin(s); if(currentUser) updateUserData(currentUser.username, { activeSkin: s }); }}
                onUnlockSkin={handleUnlockSkin}
            />
        );
      case 'leaderboard':
        return <LeaderboardView currentUser={currentUser} userPoints={stats.points || 0} />;
      case 'dashboard':
          return (
              <DashboardView 
                user={currentUser} 
                stats={stats} 
                favoritesCount={favoriteStationUrls.size} 
                unlockedAchievements={unlockedAchievements} 
                // onOpenSettings={() => setIsSettingsModalOpen(true)} // Removed to open settings from sidebar
              />
          );
      case 'help':
          return <HelpFAQ />;
      default:
        return (
             <StationList 
                stations={allStations} 
                allStations={allStations}
                currentStation={currentStation} 
                onSelectStation={handleSelectStation} 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)} 
                onToggleFavorite={handleToggleFavorite} 
                songVotes={songVotes} 
                onOpenGenreSpotlight={setGenreForSpotlight}
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
    <div className="min-h-screen bg-gray-900" style={{ '--accent-color': accentColor, '--accent-color-rgb': accentColorRgb } as React.CSSProperties}>
      <HypeOverlay isActive={isHypeActive} onComplete={() => setIsHypeActive(false)} />
      <CoinExplosionOverlay isActive={isCoinActive} onComplete={() => setIsCoinActive(false)} />
      <WeatherOverlay lat={currentStation?.location?.lat} lng={currentStation?.location?.lng} />
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Background Handling */}
        {!isDataSaver && (
             isVideoBg(currentBg || undefined) ? (
                <video 
                    src={currentBg!} 
                    autoPlay loop muted className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                />
            ) : (
                 backgrounds.map((bg, index) => (
                  <div key={index} className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${activeBgIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} style={{ backgroundImage: bg ? `url(${bg})` : 'none', animation: bg ? `${index === 0 ? 'kenburns-a' : 'kenburns-b'} 60s ease-in-out infinite` : 'none' }} />
                ))
            )
        )}
        <div className={`absolute inset-0 bg-black/${isDataSaver ? '90' : '70'} backdrop-blur-${isDataSaver ? 'none' : '2xl'}`}></div>

        <div className={`relative text-gray-200 flex flex-col h-full transition-[padding-top] duration-300 ${isHeaderVisible && !isImmersiveMode ? 'pt-16' : 'pt-0'}`}>
            {/* ... Header ... */}
            <Header currentUser={currentUser} onLogout={handleLogout} points={stats.points || 0} onGoToHome={() => setActiveView('dashboard')} isVisible={isHeaderVisible && !isImmersiveMode} />

            <div className={`flex flex-1 overflow-hidden transition-opacity duration-300 ${isImmersiveMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {/* Sidebar */}
                {currentUser && <Sidebar currentUser={currentUser} activeView={activeView} setActiveView={setActiveView} onOpenAlarm={() => setIsAlarmModalOpen(true)} onOpenSongChart={() => setIsSongChartModalOpen(true)} onOpenEvents={() => setIsEventsModalOpen(true)} onOpenHistory={() => setIsHistoryModalOpen(true)} onOpenStockMarket={() => setIsStockMarketOpen(true)} />}
                
                <main id="main-content" className="flex-1 overflow-y-auto pb-24">
                    {renderActiveView()}
                </main>
                
                <RightPanel 
                    station={stationForDetail} 
                    currentStation={currentStation}
                    allStations={allStations}
                    currentUser={currentUser}
                    stats={stats}
                    onAddReview={() => {}} 
                    onSelectStation={handleSelectStation}
                    onRateStation={() => {}} 
                    onEdit={() => {}} 
                    onOpenMusicSubmissionModal={(s) => { setStationForSubmission(s); setIsMusicSubmissionModalOpen(true); }} 
                    onOpenClaimModal={(s) => { setStationToClaim(s); setIsClaimModalOpen(true); }} 
                    onToggleFavorite={handleToggleFavorite}
                    nowPlaying={nowPlaying}
                    bounties={bounties}
                    onOpenJingleModal={() => setIsJingleModalOpen(true)}
                    onAddGuestbookEntry={handleAddGuestbookEntry} // Pass new handler
                />
            </div>
            
             {/* Zen Mode UI when Immersive */}
             {isImmersiveMode && currentStation && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-center pointer-events-auto">
                         <img src={nowPlaying?.albumArt || currentStation.coverArt} className="w-64 h-64 rounded-lg shadow-2xl mb-8 mx-auto animate-pulse" alt="Album Art" />
                         <h1 className="text-4xl font-bold text-white mb-2">{nowPlaying?.title}</h1>
                         <p className="text-xl text-gray-300">{nowPlaying?.artist}</p>
                         <div className="mt-8">
                             <button onClick={() => setIsImmersiveMode(false)} className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md">Exit Zen Mode</button>
                         </div>
                     </div>
                 </div>
             )}

             {currentStation && (
                <RadioPlayer
                  station={currentStation}
                  allStations={allStations}
                  onNowPlayingUpdate={handleNowPlayingUpdate}
                  onNextStation={handleNextStation}
                  onPreviousStation={handlePreviousStation}
                  isImmersive={isImmersiveMode}
                  onToggleImmersive={() => setIsImmersiveMode(!isImmersiveMode)}
                  songVotes={songVotes}
                  onVote={handleSongVote} 
                  onRateStation={() => {}}
                  userRating={0}
                  onOpenTippingModal={() => {}}
                  onSelectStation={handleSelectStation}
                  onToggleChat={() => setIsChatOpen(!isChatOpen)}
                  onStartRaid={() => {}}
                  raidStatus="idle"
                  raidTarget={null}
                  onHidePlayer={() => setIsPlayerVisible(false)}
                  isVisible={isPlayerVisible}
                  onOpenBuyNow={() => setIsBuyNowModalOpen(true)}
                  isHeaderVisible={isHeaderVisible}
                  onToggleHeader={handleToggleHeader}
                  onHype={handleHype}
                  hypeScore={hypeScore}
                  isPlaying={isPlaying}
                  onPlayPause={setIsPlaying}
                  isDataSaver={isDataSaver}
                  sleepTimerTarget={sleepTimerTarget}
                  userSongVotes={stats.songUserVotes}
                  activeSkin={activeSkin} // New prop
                />
              )}

            {/* Chat */}
             {currentStation && (
                <ListeningPartyChat 
                    station={currentStation} 
                    isOpen={isChatOpen} 
                    onClose={() => setIsChatOpen(false)} 
                    nowPlaying={nowPlaying} 
                    onSuperChat={() => {}} 
                    userPoints={stats.points || 0} 
                    activeFrame={activeFrame}
                    onUserClick={handleOpenProfile}
                />
            )}
        </div>
      </div>
      
      <BuyNowModal isOpen={isBuyNowModalOpen} onClose={() => setIsBuyNowModalOpen(false)} nowPlaying={nowPlaying} onPurchase={() => { 
          if(currentUser && nowPlaying && nowPlaying.albumArt) {
               // Simulate digital vinyl addition
              const newCard: CollectorCard = {
                  id: `vinyl_${Date.now()}`,
                  name: nowPlaying.title,
                  description: `Digital Vinyl for ${nowPlaying.title}`,
                  image: nowPlaying.albumArt,
                  rarity: 'rare',
                  acquiredAt: new Date().toISOString()
              };
              setCollection([...collection, newCard]);
              updateUserData(currentUser.username, { collection: [...collection, newCard] });
              setToasts(t => [...t, { id: Date.now(), title: 'Digital Vinyl Added!', message: `You collected ${nowPlaying.title}`, icon: StarIcon, type: 'success' }]);
          }
      }} />
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        isDataSaver={isDataSaver}
        onToggleDataSaver={() => setIsDataSaver(!isDataSaver)}
        sleepTimerTarget={sleepTimerTarget}
        onSetSleepTimer={handleSetSleepTimer}
      />
      
      <ThemeCreatorModal isOpen={isThemeCreatorOpen} onClose={() => setIsThemeCreatorOpen(false)} onSave={handleCreateTheme} userPoints={stats.points || 0} />
      <UserProfileModal 
        isOpen={!!viewingProfile} 
        onClose={() => setViewingProfile(null)} 
        username={viewingProfile || ''} 
        currentUser={currentUser}
        profile={targetUserProfile}
        onUpdateProfile={handleUpdateProfile}
        onMessage={(u) => console.log('msg', u)}
        onFollow={handleToggleFollow}
        isFollowing={!!(userProfile && viewingProfile && userProfile.following.includes(viewingProfile))}
      />
      <StockMarketModal 
          isOpen={isStockMarketOpen} 
          onClose={() => setIsStockMarketOpen(false)} 
          stocks={stocks} 
          portfolio={portfolio} 
          userPoints={stats.points || 0} 
          onTransaction={handleStockTransaction} 
      />
      <JingleModal 
        isOpen={isJingleModalOpen}
        onClose={() => setIsJingleModalOpen(false)}
        onSubmit={handleSubmitJingle}
      />
      
      <ClaimOwnershipModal 
          isOpen={isClaimModalOpen} 
          onClose={() => setIsClaimModalOpen(false)} 
          station={stationToClaim} 
          onSubmit={handleClaimStation} 
      />

      <LoginModal isOpen={isLoginModalOpen} onLogin={handleLogin} />
      <SubmitStationModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} onSubmit={()=>{}} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={() => setIsAlarmModalOpen(false)} alarm={alarm} onSetAlarm={setAlarm} favoriteStations={userStations} />
      <GenreSpotlightModal isOpen={!!genreForSpotlight} onClose={() => setGenreForSpotlight(null)} genre={genreForSpotlight} />
      <SongChartModal isOpen={isSongChartModalOpen} onClose={() => setIsSongChartModalOpen(false)} songVotes={songVotes} />
      <EventsModal isOpen={isEventsModalOpen} onClose={() => setIsEventsModalOpen(false)} onSelectStation={(name) => { const s = allStations.find(st=>st.name===name); if(s) handleSelectStation(s); setIsEventsModalOpen(false); }} />
      <SongHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={stats.songHistory} />
      <RequestSongModal isOpen={false} onClose={() => {}} stationName="" onSubmit={() => {}} />
      <MusicSubmissionModal 
        isOpen={isMusicSubmissionModalOpen} 
        onClose={() => setIsMusicSubmissionModalOpen(false)} 
        onSubmit={handleAddMusicSubmission} 
        station={stationForSubmission} 
        userPoints={stats.points || 0} 
      />
    </div>
  );
};

export default App;
