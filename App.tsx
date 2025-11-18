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
import { stations as defaultStations, THEMES, ACHIEVEMENTS, StarIcon, TrophyIcon, UserIcon, ExploreIcon, RocketIcon, UploadIcon, ShieldCheckIcon, MUSIC_SUBMISSION_COST, XCircleIcon } from './constants';
import type { Station, NowPlaying, ListeningStats, Alarm, ThemeName, SongVote, UnlockedAchievement, AchievementID, ToastData, User, Theme, StationReview, ActiveView, UserData, MusicSubmission } from './types';
import { slugify } from './utils/slugify';
import { getDominantColor } from './utils/colorExtractor';
import { LandingPage } from './components/LandingPage';
import { getUserData, updateUserData, createUserData } from './services/apiService';
import { EditStationModal } from './components/EditStationModal';
import { MusicSubmissionModal } from './components/MusicSubmissionModal';
import { ClaimOwnershipModal } from './components/ClaimOwnershipModal';
import { BuyNowModal } from './components/BuyNowModal';
import { DashboardView } from './components/DashboardView';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '103, 232, 249';
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
  
  const [favoriteStationUrls, setFavoriteStationUrls] = useState<Set<string>>(new Set());
  const [unlockedThemes, setUnlockedThemes] = useState<Set<ThemeName>>(new Set(['dynamic']));

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);

  const [stats, setStats] = useState<ListeningStats>({ totalTime: 0, stationPlays: {}, points: 0, songHistory: [] });
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [songVotes, setSongVotes] = useState<Record<string, SongVote>>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, UnlockedAchievement>>({});
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [raidStatus, setRaidStatus] = useState<'idle' | 'voting'>('idle');
  const [raidTarget, setRaidTarget] = useState<Station | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const statsUpdateInterval = useRef<number | null>(null);
  const alarmTimeout = useRef<number | null>(null);
  const pointsToastTimer = useRef<number>(0);
  const mainContentRef = useRef<HTMLElement | null>(null);
  
  const handleToggleHeader = useCallback(() => {
    setIsHeaderVisible(p => !p);
  }, []);

  const accentColor = useMemo(() => {
    if (activeTheme === 'dynamic') {
      return albumArtColor;
    }
    return THEMES.find(t => t.name === activeTheme)?.color || '#67e8f9';
  }, [activeTheme, albumArtColor]);
  
  const accentColorRgb = useMemo(() => hexToRgb(accentColor), [accentColor]);

  const loadUserData = useCallback(async (username: string) => {
    setIsDataLoading(true);

    const data = await getUserData(username);
    if (!data) {
        console.error("Failed to load user data for", username);
        setIsDataLoading(false);
        handleLogout();
        return;
    }
    
    const favUrls = new Set(data.favoriteStationUrls);
    const stationsWithFavorites = defaultStations.map(s => ({...s, isFavorite: favUrls.has(s.streamUrl)}));
    const userStationsWithFavorites = data.userStations.map(s => ({...s, isFavorite: favUrls.has(s.streamUrl)}));
    const allKnownStations = [...stationsWithFavorites, ...userStationsWithFavorites];
    
    const user: User = { username, role: data.role };
    setCurrentUser(user);
    
    setAllStations(allKnownStations);
    setUserStations(data.userStations);
    setFavoriteStationUrls(favUrls);
    setActiveTheme(data.activeTheme);
    setUnlockedThemes(new Set(data.unlockedThemes));
    setStats(data.stats);
    setAlarm(data.alarm);
    setSongVotes(data.songVotes);
    setUnlockedAchievements(data.unlockedAchievements);
    
    let defaultView: ActiveView = 'dashboard';
    if (user.role === 'admin') defaultView = 'admin';
    else if (user.role === 'owner') defaultView = 'station_manager_dashboard';
    else if (user.role === 'artist') defaultView = 'artist_dashboard';

    setActiveView(data.activeView || defaultView);
    
    const params = new URLSearchParams(window.location.search);
    const stationSlug = params.get('station');
    if (stationSlug) {
      setTimeout(() => {
        setAllStations(currentStations => {
          const stationToPlay = currentStations.find(s => slugify(s.name) === stationSlug);
          if (stationToPlay) {
            setCurrentStation(stationToPlay);
            setStationForDetail(stationToPlay);
          }
          return currentStations;
        });
      }, 0);
    }
    if(params.get('party') === 'true') setIsChatOpen(true);
    
    setIsDataLoading(false);
  }, []);

  useEffect(() => {
    let storedUser: { username: string } | null = null;
    try {
      const storedUserJSON = localStorage.getItem('currentUser');
      if (storedUserJSON) storedUser = JSON.parse(storedUserJSON);
    } catch (error) { console.error("Failed to load current user:", error); }

    if (storedUser) {
      loadUserData(storedUser.username);
    } else {
      setIsDataLoading(false);
    }
  }, [loadUserData]);

  useEffect(() => {
    if (hasEnteredApp && !currentUser && !isDataLoading) {
        setIsLoginModalOpen(true);
    }
  }, [hasEnteredApp, currentUser, isDataLoading]);

  useEffect(() => {
    const defaultTitle = "Music Station Radio | Stream Your Favorite Genres";
    const defaultDescription = "Tune in to a world of music. Discover thousands of live radio stations, from Afropop to Reggae, with our modern, AI-enhanced web player. Your next favorite song is playing now.";

    if (currentStation) {
      const newTitle = `${currentStation.name} | Music Station Radio`;
      const newDescription = `Listening to ${currentStation.name} on Music Station Radio. ${currentStation.description}`;
      
      document.title = newTitle;
      document.querySelector('meta[name="description"]')?.setAttribute('content', newDescription);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', newTitle);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', newDescription);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', newTitle);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', newDescription);
    } else {
      document.title = defaultTitle;
      document.querySelector('meta[name="description"]')?.setAttribute('content', defaultDescription);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', defaultTitle);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', defaultDescription);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', defaultTitle);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', defaultDescription);
    }
  }, [currentStation]);


  const handleLogin = useCallback(async (username: string, role: UserData['role']) => {
    if (username.toLowerCase() === 'admin') {
        let userData = await getUserData(username);
        if (!userData) {
            await createUserData(username, 'admin');
        }
        localStorage.setItem('currentUser', JSON.stringify({ username }));
        setIsLoginModalOpen(false);
        await loadUserData(username);
        return;
    }
    
    let userData = await getUserData(username);
    if (!userData) {
        await createUserData(username, role);
    }

    localStorage.setItem('currentUser', JSON.stringify({ username }));
    setIsLoginModalOpen(false);
    await loadUserData(username);
    setToasts(prev => [...prev, {
      id: Date.now(),
      title: `Welcome, ${username}!`,
      message: "Your journey through sound continues.",
      icon: UserIcon,
      type: 'login'
    }]);
  }, [loadUserData]);
  
  const handleLogout = useCallback(() => {
    setCurrentStation(null);
    setStationForDetail(null);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    setAllStations(defaultStations);
    setUserStations([]);
    setFavoriteStationUrls(new Set());
    setStats({ totalTime: 0, stationPlays: {}, points: 0, songHistory: [] });
    setAlarm(null);
    setSongVotes({});
    setUnlockedAchievements({});
    setActiveTheme('dynamic');
    setUnlockedThemes(new Set(['dynamic']));
    setActiveView('explore');
    
    setIsLoginModalOpen(true);
  }, []);

  const unlockAchievement = useCallback((achievementId: AchievementID) => {
    if (!currentUser) return;
    setUnlockedAchievements(prev => {
      if (prev[achievementId]) return prev;

      const achievement = ACHIEVEMENTS[achievementId];
      if (!achievement) return prev;

      console.log(`%c[Achievement Unlocked] %c${achievement.name}`, "color: #67e8f9; font-weight: bold;", "color: white;");

      const newUnlocked: Record<string, UnlockedAchievement> = { ...prev, [achievementId]: { id: achievementId, unlockedAt: new Date().toISOString() }};
      updateUserData(currentUser.username, { unlockedAchievements: newUnlocked });

      setToasts(prevToasts => [...prevToasts, { id: Date.now(), title: achievement.name, icon: achievement.icon, type: 'achievement' }]);
      return newUnlocked;
    });
  }, [currentUser]);

  useEffect(() => {
    if (!hasEnteredApp || !currentUser) return;
    if (stats.totalTime > 1) unlockAchievement('first_listen');
    if (stats.totalTime >= 3600) unlockAchievement('one_hour');
    if (stats.totalTime >= 36000) unlockAchievement('ten_hours');
    if ((stats.genresPlayed?.length || 0) >= 3) unlockAchievement('explorer_3');
    if ((stats.genresPlayed?.length || 0) >= 5) unlockAchievement('explorer_5');
    if ((stats.currentStreak || 0) >= 3) unlockAchievement('streak_3');
    if ((stats.currentStreak || 0) >= 7) unlockAchievement('streak_7');
    if (favoriteStationUrls.size > 0) unlockAchievement('curator');
    if (isChatOpen) unlockAchievement('party_starter');
  }, [stats, favoriteStationUrls, isChatOpen, hasEnteredApp, unlockAchievement, currentUser]);

  useEffect(() => {
    if (currentStation && currentUser) {
      setStationForDetail(currentStation);
      setStats(prevStats => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = prevStats.lastListenDate;
        let currentStreak = prevStats.currentStreak || 0;
        if (!lastDate || today !== lastDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          if (lastDate === yesterdayStr) currentStreak += 1;
          else currentStreak = 1;
        }
        const genresPlayed = new Set<string>(prevStats.genresPlayed || []);
        genresPlayed.add(currentStation.genre.split('/')[0].trim());
        // FIX: Using Array.from() to prevent potential type inference issues with the spread operator on Sets in some TypeScript configurations.
        const newStats: ListeningStats = { ...prevStats, lastListenDate: today, currentStreak: currentStreak, maxStreak: Math.max(prevStats.maxStreak || 0, currentStreak), genresPlayed: Array.from(genresPlayed) as string[] };
        updateUserData(currentUser.username, { stats: newStats });
        return newStats;
      });
    }
  }, [currentStation, currentUser]);
  
  useEffect(() => {
    if (statsUpdateInterval.current) clearInterval(statsUpdateInterval.current);
    if (currentStation && currentUser) {
      statsUpdateInterval.current = window.setInterval(() => {
        setStats(prevStats => {
          const stationKey = currentStation.streamUrl;
          const currentStationPlayData = prevStats.stationPlays[stationKey] || { name: currentStation.name, genre: currentStation.genre, time: 0 };
          const newStationPlays = { ...prevStats.stationPlays, [stationKey]: { ...currentStationPlayData, time: currentStationPlayData.time + 1 } };
          const newTotalTime = prevStats.totalTime + 1;
          
          let newPoints = prevStats.points || 0;
          if (newTotalTime % 60 === 0) {
              newPoints += 1;
              if (newPoints % 10 === 0) {
                  setToasts(prev => [...prev, {id: Date.now(), title: `Milestone! ${newPoints} Points!`, message: "You're a dedicated listener!", icon: TrophyIcon, type: 'milestone'}]);
                  pointsToastTimer.current = 0;
              }
          }
          
          pointsToastTimer.current += 1;
          if (pointsToastTimer.current >= 300) {
              const pointsInLast5Mins = 5;
              setToasts(prev => [...prev, {id: Date.now(), title: `+${pointsInLast5Mins} Points!`, message: "Keep listening to earn more.", icon: StarIcon, type: 'points'}]);
              pointsToastTimer.current = 0;
          }
          
          const newStats: ListeningStats = { ...prevStats, totalTime: newTotalTime, points: newPoints, stationPlays: newStationPlays };
          updateUserData(currentUser.username, { stats: newStats });
          return newStats;
        });

        const currentHour = new Date().getHours();
        if (currentHour >= 0 && currentHour < 4) unlockAchievement('night_owl');
        if (currentHour >= 5 && currentHour < 8) unlockAchievement('early_bird');
      }, 1000);
    }
    return () => { if (statsUpdateInterval.current) clearInterval(statsUpdateInterval.current); };
  }, [currentStation, currentUser, unlockAchievement]);

  useEffect(() => {
    if (alarmTimeout.current) clearTimeout(alarmTimeout.current);
    if (alarm?.isActive && currentUser) {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      const alarmTime = new Date();
      alarmTime.setHours(hours, minutes, 0, 0);
      if (alarmTime <= now) alarmTime.setDate(alarmTime.getDate() + 1);
      const timeToAlarm = alarmTime.getTime() - now.getTime();
      alarmTimeout.current = window.setTimeout(() => {
        const stationToPlay = allStations.find(s => s.streamUrl === alarm.stationUrl);
        if (stationToPlay) handleSelectStation(stationToPlay);
        const newAlarm = { ...alarm, isActive: false };
        setAlarm(newAlarm);
        updateUserData(currentUser.username, { alarm: newAlarm });
      }, timeToAlarm);
    }
    return () => { if (alarmTimeout.current) clearTimeout(alarmTimeout.current); };
  }, [alarm, allStations, currentUser]);

  useEffect(() => {
    const mainContentEl = document.getElementById('main-content');
    if (mainContentEl) {
        mainContentRef.current = mainContentEl;

        const handleScroll = () => {
            if (mainContentRef.current) {
                setShowScrollToTop(mainContentRef.current.scrollTop > 300);
            }
        };
        
        mainContentEl.addEventListener('scroll', handleScroll);

        return () => {
            mainContentEl.removeEventListener('scroll', handleScroll);
        };
    }
  }, [currentUser, activeView]);

  const handleScrollToTop = () => {
      mainContentRef.current?.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  };
  
  const filteredStations = useMemo(() => allStations.filter(station => station.name.toLowerCase().includes(searchQuery.toLowerCase()) || station.genre.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, allStations]);

  const handleSelectStation = (station: Station) => { 
    if (currentStation?.streamUrl !== station.streamUrl) {
      setCurrentStation(station); 
    }
    setStationForDetail(station);
    setIsPlayerVisible(true);
  };
  const handleNextStation = () => { if (!currentStation) return; const currentIndex = filteredStations.findIndex(s => s.streamUrl === currentStation.streamUrl); const nextIndex = (currentIndex + 1) % filteredStations.length; handleSelectStation(filteredStations[nextIndex]); };
  const handlePreviousStation = () => { if (!currentStation) return; const currentIndex = filteredStations.findIndex(s => s.streamUrl === currentStation.streamUrl); const prevIndex = (currentIndex - 1 + filteredStations.length) % filteredStations.length; handleSelectStation(filteredStations[prevIndex]); };
  
  const handleNowPlayingUpdate = useCallback((nowPlayingUpdate: NowPlaying | null) => {
    setNowPlaying(nowPlayingUpdate);
    const newArt = nowPlayingUpdate?.albumArt || null;
    if (newArt) {
      try { getDominantColor(newArt).then(color => setAlbumArtColor(color)).catch(() => setAlbumArtColor('#67e8f9')); } 
      catch (error) { console.warn("Could not extract color from album art, using default.", error); setAlbumArtColor('#67e8f9'); }
    } else { setAlbumArtColor('#67e8f9'); }
    if (newArt !== backgrounds[activeBgIndex]) { const nextIndex = 1 - activeBgIndex; const newBackgrounds = [...backgrounds] as [string | null, string | null]; newBackgrounds[nextIndex] = newArt; setBackgrounds(newBackgrounds); setActiveBgIndex(nextIndex); }
    
    if (!currentUser || !nowPlayingUpdate?.songId) return;

    let updatesToSave: Partial<UserData> = {};

    setSongVotes(prevVotes => {
      if (prevVotes[nowPlayingUpdate.songId!]) return prevVotes;
      
      const newEntry: SongVote = { id: nowPlayingUpdate.songId!, artist: nowPlayingUpdate.artist, title: nowPlayingUpdate.title, albumArt: nowPlayingUpdate.albumArt || currentStation!.coverArt, likes: Math.floor(Math.random() * 15) + 1, dislikes: Math.floor(Math.random() * 5)};
      const newVotes = { ...prevVotes, [nowPlayingUpdate.songId!]: newEntry };
      updatesToSave.songVotes = newVotes;
      return newVotes;
    });

    if (currentStation && nowPlayingUpdate.title !== "Live Stream" && nowPlayingUpdate.title !== "Station Data Unavailable") {
      setStats(prevStats => {
        const history = prevStats.songHistory || [];
        if (history[0]?.songId === nowPlayingUpdate.songId) return prevStats;
        
        const newHistoryItem = { songId: nowPlayingUpdate.songId!, title: nowPlayingUpdate.title, artist: nowPlayingUpdate.artist, albumArt: nowPlayingUpdate.albumArt || currentStation.coverArt, stationName: currentStation.name, playedAt: new Date().toISOString() };
        const updatedHistory = [newHistoryItem, ...history].slice(0, 50);
        const newStats = { ...prevStats, songHistory: updatedHistory };
        updatesToSave.stats = newStats;

        // Since this setState runs after setSongVotes, we can combine updates.
        updateUserData(currentUser.username, updatesToSave);
        return newStats;
      });
    } else if (Object.keys(updatesToSave).length > 0) {
      // If only songVotes was updated
      updateUserData(currentUser.username, updatesToSave);
    }
  }, [activeBgIndex, backgrounds, currentStation, currentUser]);
  
  const handleAddStation = async (stationData: Omit<Station, 'owner' | 'isFavorite' | 'rating' | 'ratingsCount' | 'location'>) => {
    if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) return;
    const newStation: Station = {
      ...stationData,
      owner: currentUser.username,
      isFavorite: favoriteStationUrls.has(stationData.streamUrl),
    };
    
    const newUserStations = [...userStations, newStation];
    setUserStations(newUserStations);
    setAllStations(prev => [...prev, newStation]);
    
    await updateUserData(currentUser.username, { userStations: newUserStations });

    setIsSubmitModalOpen(false);
    unlockAchievement('station_submit');
  };
  
  const handleDeleteStation = useCallback(async (stationToDelete: Station) => {
    if (currentUser?.role !== 'admin') return;

    // Remove from global list
    const newAllStations = allStations.filter(s => s.streamUrl !== stationToDelete.streamUrl);
    setAllStations(newAllStations);

    // If it's a user submitted station, we might want to remove it from their userStations in DB
    if (stationToDelete.owner) {
        const ownerData = await getUserData(stationToDelete.owner);
        if (ownerData) {
             const updatedOwnerStations = ownerData.userStations.filter(s => s.streamUrl !== stationToDelete.streamUrl);
             await updateUserData(stationToDelete.owner, { userStations: updatedOwnerStations });
        }
    }
    
    // If the current user owns it (e.g. admin is testing), update local state
    if (stationToDelete.owner === currentUser.username) {
         setUserStations(prev => prev.filter(s => s.streamUrl !== stationToDelete.streamUrl));
    }

    setToasts(prev => [...prev, {
        id: Date.now(),
        title: "Station Deleted",
        message: `${stationToDelete.name} has been removed.`,
        icon: XCircleIcon,
        type: 'error'
    }]);
  }, [currentUser, allStations]);

  const toggleFavorite = (stationToToggle: Station) => {
    if (!currentUser) return;
    const newFavoriteUrls = new Set(favoriteStationUrls);
    if (newFavoriteUrls.has(stationToToggle.streamUrl)) newFavoriteUrls.delete(stationToToggle.streamUrl);
    else newFavoriteUrls.add(stationToToggle.streamUrl);
    setFavoriteStationUrls(newFavoriteUrls);
    setAllStations(prevStations => prevStations.map(s => s.streamUrl === stationToToggle.streamUrl ? { ...s, isFavorite: !s.isFavorite } : s));
    // FIX: Using Array.from() to convert the Set to an array. Spreading a Set (`...newFavoriteUrls`) can lead to type inference issues in some TypeScript configurations.
    updateUserData(currentUser.username, { favoriteStationUrls: Array.from(newFavoriteUrls) as string[] });
  };

  const handleSetTheme = (themeName: ThemeName) => {
    if (!currentUser) return;
    setActiveTheme(themeName);
    updateUserData(currentUser.username, { activeTheme: themeName });
  };
  
  const handleSetActiveView = useCallback((view: ActiveView) => {
    if (!currentUser) return;
    setActiveView(view);
    updateUserData(currentUser.username, { activeView: view });
  }, [currentUser]);

  const handleGoToHome = useCallback(() => {
    let targetView: ActiveView = 'dashboard';
    if (currentUser) {
        switch (currentUser.role) {
            case 'artist':
                targetView = 'artist_dashboard';
                break;
            case 'owner':
                targetView = 'station_manager_dashboard';
                break;
            case 'admin':
                targetView = 'admin';
                break;
            case 'user':
            default:
                targetView = 'dashboard';
                break;
        }
    }
    handleSetActiveView(targetView);
  }, [currentUser, handleSetActiveView]);

  const handleSetAlarm = (newAlarm: Alarm | null) => {
    if (!currentUser) return;
    setAlarm(newAlarm);
    updateUserData(currentUser.username, { alarm: newAlarm });
  }
  
  const handleVote = useCallback((songId: string, voteType: 'like' | 'dislike') => {
    if (!currentUser) return;

    setStats(prevStats => {
        const previousVote = prevStats.songUserVotes?.[songId];
        if (previousVote === voteType) {
            return prevStats; // No change
        }

        const newUserVotes = { ...(prevStats.songUserVotes || {}), [songId]: voteType };
        const newPoints = previousVote ? (prevStats.points || 0) : (prevStats.points || 0) + 1;
        const newStats = { ...prevStats, songUserVotes: newUserVotes, points: newPoints };
        
        setSongVotes(prevVotes => {
            const newVotes = { ...prevVotes };
            const songVote = { ...newVotes[songId] };

            // Increment new vote type
            if (voteType === 'like') songVote.likes += 1;
            else songVote.dislikes += 1;
            
            // Decrement old vote type if it existed
            if (previousVote === 'like') songVote.likes = Math.max(0, songVote.likes - 1);
            if (previousVote === 'dislike') songVote.dislikes = Math.max(0, songVote.dislikes - 1);
            
            newVotes[songId] = songVote;
            
            // Persist both changes
            updateUserData(currentUser.username, { stats: newStats, songVotes: newVotes });

            return newVotes;
        });

        return newStats;
    });
}, [currentUser]);

  const handleRateStation = useCallback((stationUrl: string, rating: number) => {
    if (!currentUser) return;
    
    setAllStations(prevStations => {
        return prevStations.map(s => {
            if (s.streamUrl === stationUrl) {
                const oldRatingTotal = (s.rating || 0) * (s.ratingsCount || 0);
                const userPreviousRating = stats.stationRatings?.[stationUrl] || 0;
                const newRatingsCount = userPreviousRating > 0 ? s.ratingsCount! : (s.ratingsCount || 0) + 1;
                const newTotal = oldRatingTotal - userPreviousRating + rating;
                const newAverage = newTotal / newRatingsCount;
                return { ...s, rating: parseFloat(newAverage.toFixed(2)), ratingsCount: newRatingsCount };
            }
            return s;
        });
    });

    setStats(prevStats => {
        const newRatings = { ...prevStats.stationRatings, [stationUrl]: rating };
        const newStats = { ...prevStats, stationRatings: newRatings };
        updateUserData(currentUser.username, { stats: newStats });
        return newStats;
    });

  }, [currentUser, stats.stationRatings]);
  
  const handleUnlockTheme = useCallback(async (theme: Theme) => {
    if (!currentUser || !theme.cost) return;
    const currentPoints = stats.points || 0;
    if (currentPoints >= theme.cost) {
        const newStats = {...stats, points: currentPoints - theme.cost};
        setStats(newStats);
        
        const newUnlocked = new Set<ThemeName>(unlockedThemes);
        newUnlocked.add(theme.name);
        setUnlockedThemes(newUnlocked);
        
        // Fix: Changed spread operator to Array.from() to prevent type inference issues when converting a Set to an array.
        await updateUserData(currentUser.username, { stats: newStats, unlockedThemes: Array.from(newUnlocked) });

        setToasts(prev => [...prev, {id: Date.now(), title: "Theme Unlocked!", message: `You can now use the ${theme.displayName} theme.`, icon: StarIcon, type: 'theme_unlocked'}]);
    }
  }, [currentUser, stats, unlockedThemes]);

  const handleStartRaid = (targetStation: Station) => {
      if (!currentStation || raidStatus === 'voting') return;
      
      setRaidTarget(targetStation);
      setRaidStatus('voting');
      
      setTimeout(() => {
          handleSelectStation(targetStation);
          setRaidStatus('idle');
          setRaidTarget(null);
          unlockAchievement('raid_leader');
          setToasts(prev => [...prev, {
              id: Date.now(),
              title: "Raid Successful!",
              message: `Now raiding ${targetStation.name}.`,
              icon: RocketIcon,
              type: 'raid'
          }]);
      }, 5000); // 5 second simulated vote
  }

  const favoriteStations = useMemo(() => allStations.filter(s => s.isFavorite), [allStations]);
  
  const handleAddReview = async (stationUrl: string, review: Omit<StationReview, 'createdAt' | 'author' | 'authorRole'>) => {
    if (!currentUser) return;
    
    const newReview: StationReview = {
        ...review,
        author: currentUser.username,
        authorRole: currentUser.role,
        createdAt: new Date().toISOString(),
    };

    setStats(prevStats => {
        const userReviews = prevStats.stationReviews?.[stationUrl] || [];
        const updatedReviewsForStation = [...userReviews, newReview];
        const newStationReviews = { ...(prevStats.stationReviews || {}), [stationUrl]: updatedReviewsForStation };
        const newStats = { ...prevStats, stationReviews: newStationReviews };
        updateUserData(currentUser.username, { stats: newStats });
        return newStats;
    });
    
    setToasts(prev => [...prev, {
      id: Date.now(),
      title: "Review Submitted!",
      message: `Thanks for sharing your thoughts on ${stationForDetail?.name}.`,
      icon: StarIcon,
      type: 'points'
    }]);
  };
  
  const handlePlayFromCommunity = useCallback((songId: string) => {
    const history = stats.songHistory || [];
    const songHistoryEntry = history.find(item => item.songId === songId);

    if (songHistoryEntry) {
      const stationToPlay = allStations.find(s => s.name === songHistoryEntry.stationName);
      if (stationToPlay) {
        handleSelectStation(stationToPlay);
        if (activeView !== 'explore') {
          handleSetActiveView('explore');
        }
      } else {
        setToasts(prev => [...prev, {
          id: Date.now(),
          title: "Station Not Found",
          message: `Could not find the station "${songHistoryEntry.stationName}".`,
          icon: ExploreIcon,
          type: 'error'
        }]);
      }
    } else {
      setToasts(prev => [...prev, {
        id: Date.now(),
        title: "Station Not Found",
        message: "Could not find which station played this song recently.",
        icon: ExploreIcon,
        type: 'error'
      }]);
    }
  }, [stats.songHistory, allStations, activeView, handleSetActiveView]);

  const handleOpenEditModal = useCallback((station: Station) => {
    setStationToEdit(station);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateStation = useCallback(async (updatedStation: Station) => {
    if (!currentUser || (updatedStation.owner !== currentUser.username && currentUser.role !== 'admin')) return;

    const newAllStations = allStations.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s);
    setAllStations(newAllStations);

    // If this station is in the user's personal list, update it there too
    if (userStations.some(s => s.streamUrl === updatedStation.streamUrl)) {
        const newUserStations = userStations.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s);
        setUserStations(newUserStations);
        await updateUserData(currentUser.username, { userStations: newUserStations });
    } 
    // If admin is editing someone else's station, we should persist this change to that user's data
    else if (updatedStation.owner) {
         const ownerData = await getUserData(updatedStation.owner);
         if (ownerData) {
             const updatedOwnerStations = ownerData.userStations.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s);
             await updateUserData(updatedStation.owner, { userStations: updatedOwnerStations });
         }
    }
    
    if (currentStation?.streamUrl === updatedStation.streamUrl) {
        setCurrentStation(updatedStation);
    }
    if (stationForDetail?.streamUrl === updatedStation.streamUrl) {
        setStationForDetail(updatedStation);
    }

    setIsEditModalOpen(false);
    setToasts(prev => [...prev, {
        id: Date.now(),
        title: "Station Updated!",
        message: `${updatedStation.name} has been successfully updated.`,
        icon: StarIcon,
        type: 'points',
    }]);
  }, [currentUser, allStations, userStations, currentStation, stationForDetail]);

  const handleOpenMusicSubmissionModal = useCallback((station: Station) => {
    setStationForSubmission(station);
    setIsMusicSubmissionModalOpen(true);
  }, []);

  const handleMusicSubmission = useCallback((stationStreamUrl: string, submission: Omit<MusicSubmission, 'id' | 'submittedAt' | 'status' | 'submittedBy' | 'stationStreamUrl' | 'stationName'>) => {
    if (!currentUser || currentUser.role !== 'artist' || (stats.points || 0) < MUSIC_SUBMISSION_COST) return;

    const targetStation = allStations.find(s => s.streamUrl === stationStreamUrl);
    if (!targetStation) return;

    const newSubmission: MusicSubmission = {
        ...submission,
        id: `sub_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        submittedBy: currentUser.username,
        stationStreamUrl: stationStreamUrl,
        stationName: targetStation.name,
    };

    setAllStations(prev => prev.map(s => {
        if (s.streamUrl === stationStreamUrl) {
            return { ...s, submissions: [...(s.submissions || []), newSubmission] };
        }
        return s;
    }));
    
    const newPoints = (stats.points || 0) - MUSIC_SUBMISSION_COST;
    setStats(prev => ({ ...prev, points: newPoints }));
    updateUserData(currentUser.username, { stats: { ...stats, points: newPoints } });

    setIsMusicSubmissionModalOpen(false);
    setToasts(prev => [...prev, {
        id: Date.now(),
        title: "Submission Sent!",
        message: `Your track "${submission.songTitle}" was sent to ${targetStation.name}.`,
        icon: UploadIcon,
        type: 'points',
    }]);
  }, [currentUser, stats.points, allStations]);

  const handleReviewSubmission = useCallback((stationStreamUrl: string, submissionId: string, status: 'approved' | 'rejected', comment?: string) => {
      if (!currentUser || currentUser.role !== 'owner') return;

      setAllStations(prev => prev.map(s => {
          if (s.streamUrl === stationStreamUrl) {
              const updatedSubmissions = (s.submissions || []).map(sub => {
                  if (sub.id === submissionId) {
                      return { ...sub, status, managerComment: comment, reviewedAt: new Date().toISOString() };
                  }
                  return sub;
              });
              return { ...s, submissions: updatedSubmissions };
          }
          return s;
      }));

       setToasts(prev => [...prev, {
        id: Date.now(),
        title: `Submission ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Feedback has been recorded.`,
        icon: status === 'approved' ? StarIcon : UploadIcon,
        type: 'points',
    }]);
  }, [currentUser]);

  const handleOpenClaimModal = useCallback((station: Station) => {
    setStationToClaim(station);
    setIsClaimModalOpen(true);
  }, []);

  const handleClaimStation = useCallback((station: Station, reason: string) => {
    if (!currentUser) return;
    
    const newClaimRequest = {
      username: currentUser.username,
      reason,
      submittedAt: new Date().toISOString(),
    };

    const newAllStations = allStations.map(s => s.streamUrl === station.streamUrl ? { ...s, claimRequest: newClaimRequest } : s);
    setAllStations(newAllStations);
    
    if (stationForDetail?.streamUrl === station.streamUrl) {
        setStationForDetail({ ...station, claimRequest: newClaimRequest });
    }

    setIsClaimModalOpen(false);
    setToasts(prev => [...prev, {
        id: Date.now(),
        title: "Claim Submitted!",
        message: `Your claim for ${station.name} is under review.`,
        icon: ShieldCheckIcon,
        type: 'points',
    }]);
  }, [currentUser, allStations, stationForDetail]);
  
  const handleApproveClaim = useCallback(async (station: Station, claimantUsername: string) => {
    if (currentUser?.role !== 'admin') return;

    const newAllStations = allStations.map(s => {
      if (s.streamUrl === station.streamUrl) {
        return { ...s, owner: claimantUsername, claimRequest: undefined };
      }
      return s;
    });
    setAllStations(newAllStations);

    await updateUserData(claimantUsername, { role: 'owner' });

    setToasts(prev => [...prev, {
      id: Date.now(),
      title: "Claim Approved",
      message: `${claimantUsername} is now the owner of ${station.name}.`,
      icon: ShieldCheckIcon,
      type: 'login'
    }]);
  }, [currentUser, allStations]);
  
  const handleDenyClaim = useCallback((station: Station) => {
    if (currentUser?.role !== 'admin') return;
    
    const newAllStations = allStations.map(s => {
      if (s.streamUrl === station.streamUrl) {
        return { ...s, claimRequest: undefined };
      }
      return s;
    });
    setAllStations(newAllStations);
    
    setToasts(prev => [...prev, {
      id: Date.now(),
      title: "Claim Denied",
      message: `The claim for ${station.name} has been denied.`,
      icon: ShieldCheckIcon,
      type: 'error'
    }]);
  }, [currentUser, allStations]);

  const handleUpdateUserRole = useCallback(async (username: string, role: UserData['role']) => {
    if (currentUser?.role !== 'admin' || currentUser.username === username) return;

    await updateUserData(username, { role });

    setToasts(prev => [...prev, {
      id: Date.now(),
      title: "User Role Updated",
      message: `${username}'s role has been changed to ${role}.`,
      icon: ShieldCheckIcon,
      type: 'login'
    }]);
  }, [currentUser]);

  const artistSubmissions = useMemo(() => {
      if (!currentUser || currentUser.role !== 'artist') return [];
      return allStations.flatMap(station => station.submissions || [])
          .filter(sub => sub.submittedBy === currentUser.username)
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [allStations, currentUser]);


  if (!hasEnteredApp) {
    return <LandingPage onEnter={() => setHasEnteredApp(true)} />;
  }
  
  const showRightPanel = ['explore', 'genre_chat'].includes(activeView);

  const renderActiveView = () => {
    switch (activeView) {
      case 'artist_dashboard':
        return <ArtistDashboardView user={currentUser} stats={stats} submissions={artistSubmissions} setActiveView={handleSetActiveView} />;
      case 'station_manager_dashboard':
        return <StationManagerDashboardView user={currentUser} allStations={allStations} onReviewSubmission={handleReviewSubmission} onEditStation={handleOpenEditModal} />;
      case 'store':
        return <StoreView activeTheme={activeTheme} onSetTheme={handleSetTheme} onUnlockTheme={handleUnlockTheme} unlockedThemes={unlockedThemes} currentPoints={stats.points || 0}/>;
      case 'leaderboard':
        return <LeaderboardView currentUser={currentUser} userPoints={stats.points || 0} />;
      case 'admin':
        return <AdminDashboardView stations={allStations} onApproveClaim={handleApproveClaim} onDenyClaim={handleDenyClaim} currentUser={currentUser} onUpdateUserRole={handleUpdateUserRole} onEditStation={handleOpenEditModal} onDeleteStation={handleDeleteStation} />;
      case 'dashboard':
        return <DashboardView user={currentUser} stats={stats} favoritesCount={favoriteStationUrls.size} unlockedAchievements={unlockedAchievements} />;
      case 'explore':
      case 'genre_chat':
      default:
        return (
          <StationList 
            stations={filteredStations}
            allStations={allStations}
            currentStation={currentStation} 
            onSelectStation={handleSelectStation} 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)} 
            onToggleFavorite={toggleFavorite} 
            songVotes={songVotes} 
            onOpenGenreSpotlight={setGenreForSpotlight}
            onShowDetails={setStationForDetail}
            onPlayFromCommunity={handlePlayFromCommunity}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900" style={{ '--accent-color': accentColor, '--accent-color-rgb': accentColorRgb } as React.CSSProperties}>
      <div className="relative h-screen w-screen overflow-hidden">
        {backgrounds.map((bg, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${activeBgIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} style={{ backgroundImage: bg ? `url(${bg})` : 'none', animation: bg ? `${index === 0 ? 'kenburns-a' : 'kenburns-b'} 60s ease-in-out infinite` : 'none' }} />
        ))}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl"></div>

        <div className={`relative text-gray-200 flex flex-col h-full transition-[padding-top] duration-300 ${isHeaderVisible ? 'pt-16' : 'pt-0'}`}>
          <Header currentUser={currentUser} onLogout={handleLogout} points={stats.points || 0} onGoToHome={handleGoToHome} isVisible={isHeaderVisible} />
          
          <div className={`flex flex-1 overflow-hidden transition-opacity duration-300 ${isImmersiveMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {currentUser && <Sidebar currentUser={currentUser} activeView={activeView} setActiveView={handleSetActiveView} onOpenAlarm={() => setIsAlarmModalOpen(true)} onOpenSongChart={() => setIsSongChartModalOpen(true)} onOpenEvents={() => setIsEventsModalOpen(true)} onOpenHistory={() => setIsHistoryModalOpen(true)} />}
            
            {isDataLoading ? (
              <main className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div></main>
            ) : currentUser ? (
              <>
                <main id="main-content" className="flex-1 overflow-y-auto pb-24">
                  {renderActiveView()}
                </main>
                {showRightPanel && (
                  <RightPanel 
                    station={stationForDetail} 
                    currentStation={currentStation}
                    allStations={allStations}
                    currentUser={currentUser}
                    stats={stats}
                    onAddReview={handleAddReview}
                    onSelectStation={handleSelectStation}
                    onRateStation={handleRateStation}
                    onEdit={handleOpenEditModal}
                    onOpenMusicSubmissionModal={handleOpenMusicSubmissionModal}
                    onOpenClaimModal={handleOpenClaimModal}
                    nowPlaying={nowPlaying}
                  />
                )}
              </>
            ) : (
              <main className="flex-1 flex items-center justify-center"><p className="text-gray-400">Please log in to continue.</p></main>
            )}
          </div>

          {currentStation && <ListeningPartyChat station={currentStation} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} nowPlaying={nowPlaying} />}

          {currentStation && (
            <RadioPlayer
              station={currentStation}
              onNowPlayingUpdate={handleNowPlayingUpdate}
              onNextStation={handleNextStation}
              onPreviousStation={handlePreviousStation}
              isImmersive={isImmersiveMode}
              onToggleImmersive={() => setIsImmersiveMode(prev => !prev)}
              songVotes={songVotes}
              onVote={handleVote}
              onRateStation={handleRateStation}
              userRating={stats.stationRatings?.[currentStation.streamUrl] || 0}
              onOpenTippingModal={() => setTippingModalStation(currentStation)}
              allStations={allStations}
              userSongVotes={stats.songUserVotes}
              onSelectStation={handleSelectStation}
              onToggleChat={() => setIsChatOpen(p => !p)}
              onStartRaid={handleStartRaid}
              raidStatus={raidStatus}
              raidTarget={raidTarget}
              onHidePlayer={() => setIsPlayerVisible(false)}
              isVisible={isPlayerVisible}
              onOpenBuyNow={() => setIsBuyNowModalOpen(true)}
              isHeaderVisible={isHeaderVisible}
              onToggleHeader={handleToggleHeader}
            />
          )}
        </div>
      </div>
      
      {currentStation && !isPlayerVisible && (
        <button
            onClick={() => setIsPlayerVisible(true)}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-800/80 backdrop-blur-md py-2 px-4 rounded-full shadow-lg text-white hover:bg-[var(--accent-color)] hover:text-black transition-all animate-fade-in"
            aria-label="Show player"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            <span className="hidden sm:inline">Show Player</span>
        </button>
      )}

      {showScrollToTop && (
        <button
            onClick={handleScrollToTop}
            className="fixed bottom-20 right-4 z-50 bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg text-white hover:bg-[var(--accent-color)] hover:text-black transition-all animate-fade-in"
            aria-label="Scroll to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
      )}

      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <LoginModal isOpen={isLoginModalOpen} onLogin={handleLogin} />
      <SubmitStationModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} onSubmit={handleAddStation} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={() => setIsAlarmModalOpen(false)} alarm={alarm} onSetAlarm={handleSetAlarm} favoriteStations={favoriteStations} />
      <TippingModal isOpen={!!tippingModalStation} onClose={() => setTippingModalStation(null)} station={tippingModalStation} />
      <GenreSpotlightModal isOpen={!!genreForSpotlight} onClose={() => setGenreForSpotlight(null)} genre={genreForSpotlight} />
      <SongChartModal isOpen={isSongChartModalOpen} onClose={() => setIsSongChartModalOpen(false)} songVotes={songVotes} />
      <BuyNowModal isOpen={isBuyNowModalOpen} onClose={() => setIsBuyNowModalOpen(false)} nowPlaying={nowPlaying} />
      <EditStationModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} station={stationToEdit} onSubmit={handleUpdateStation} />
      <MusicSubmissionModal isOpen={isMusicSubmissionModalOpen} onClose={() => setIsMusicSubmissionModalOpen(false)} station={stationForSubmission} onSubmit={handleMusicSubmission} userPoints={stats.points || 0} />
      <ClaimOwnershipModal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} station={stationToClaim} onSubmit={handleClaimStation} />
      <EventsModal isOpen={isEventsModalOpen} onClose={() => setIsEventsModalOpen(false)} onSelectStation={(stationName) => {
        const stationToPlay = allStations.find(s => s.name === stationName);
        if (stationToPlay) handleSelectStation(stationToPlay);
        setIsEventsModalOpen(false);
      }} />
      <SongHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={stats.songHistory || []} />

      <style>{`
        .accent-color-text { color: var(--accent-color); }
        .accent-color-bg { background-color: var(--accent-color); }
        .accent-color-border { border-color: var(--accent-color); }
        .accent-color-ring:focus-visible { --tw-ring-color: var(--accent-color); }
        .accent-color-shadow { box-shadow: 0 0 15px 0 var(--accent-color); }
        .accent-color-shadow-hover:hover { box-shadow: 0 0 15px 0 var(--accent-color); }
        
        #main-content, #right-panel-content {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 1rem, black calc(100% - 1rem), transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0, black 1rem, black calc(100% - 1rem), transparent 100%);
        }
        #main-content::-webkit-scrollbar, #right-panel-content::-webkit-scrollbar { width: 8px; }
        #main-content::-webkit-scrollbar-track, #right-panel-content::-webkit-scrollbar-track { background: transparent; }
        #main-content::-webkit-scrollbar-thumb, #right-panel-content::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; border: 2px solid transparent; background-clip: content-box; }
        #main-content::-webkit-scrollbar-thumb:hover, #right-panel-content::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }

        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out backwards; }
        @keyframes kenburns-a { 0%, 100% { transform: scale(1.1) translate(-2%, 2%); filter: brightness(0.9); } 50% { transform: scale(1.2) translate(2%, -2%); filter: brightness(1.1); } }
        @keyframes kenburns-b { 0%, 100% { transform: scale(1.2) translate(2%, -2%); filter: brightness(1.1); } 50% { transform: scale(1.1) translate(-2%, 2%); filter: brightness(0.9); } }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .group:hover .marquee-content {
          animation-play-state: paused;
        }
        @keyframes card-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .station-card-animate { animation: card-fade-in 0.5s ease-out backwards; }
      `}</style>
    </div>
  );
};

export default App;