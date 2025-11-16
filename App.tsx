import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { RadioPlayer } from './components/RadioPlayer';
import { StationList } from './components/StationList';
import { Header } from './components/Header';
import { SubmitStationModal } from './components/SubmitStationModal';
import { ListeningPartyChat } from './components/ListeningPartyChat';
import { StatsModal } from './components/StatsModal';
import { AlarmModal } from './components/AlarmModal';
import { SettingsModal } from './components/SettingsModal';
import { MapModal } from './components/MapModal';
import { AchievementsModal } from './components/AchievementsModal';
import { ToastContainer } from './components/Toast';
import { LoginModal } from './components/LoginModal';
import { DashboardModal } from './components/DashboardModal';
import { TippingModal } from './components/TippingModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HistoryModal } from './components/HistoryModal';
import { GenreSpotlightModal } from './components/GenreSpotlightModal';
import { SongChartModal } from './components/SongChartModal';
import { StationDetailModal } from './components/StationDetailModal';
import { EventsModal } from './components/EventsModal';
import { stations as defaultStations, THEMES, ACHIEVEMENTS, StarIcon, TrophyIcon, UserIcon, MOCK_REVIEWS } from './constants';
import type { Station, NowPlaying, ListeningStats, Alarm, ThemeName, SongVote, UnlockedAchievement, AchievementID, ToastData, User, Theme, StationReview } from './types';
import { slugify } from './utils/slugify';
import { getDominantColor } from './utils/colorExtractor';
import { getLocationForGenre } from './utils/genreToLocation';
import { LandingPage } from './components/LandingPage';
import { getUserData, updateUserData } from './services/apiService';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '103, 232, 249';
};

const App: React.FC = () => {
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [backgrounds, setBackgrounds] = useState<[string | null, string | null]>([null, null]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  
  const [albumArtColor, setAlbumArtColor] = useState('#67e8f9');
  const [activeTheme, setActiveTheme] = useState<ThemeName>('dynamic');

  const [allStations, setAllStations] = useState<Station[]>(defaultStations);
  const [userStations, setUserStations] = useState<Station[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSongChartModalOpen, setIsSongChartModalOpen] = useState(false);
  const [isStationDetailModalOpen, setIsStationDetailModalOpen] = useState(false);
  const [stationForDetail, setStationForDetail] = useState<Station | null>(null);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  const [tippingModalStation, setTippingModalStation] = useState<Station | null>(null);
  const [genreForSpotlight, setGenreForSpotlight] = useState<string | null>(null);
  const [favoriteStationUrls, setFavoriteStationUrls] = useState<Set<string>>(new Set());
  const [unlockedThemes, setUnlockedThemes] = useState<Set<ThemeName>>(new Set(['dynamic']));

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);

  const [stats, setStats] = useState<ListeningStats>({ totalTime: 0, stationPlays: {}, points: 0 });
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [songVotes, setSongVotes] = useState<Record<string, SongVote>>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, UnlockedAchievement>>({});
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const statsUpdateInterval = useRef<number | null>(null);
  const alarmTimeout = useRef<number | null>(null);
  const pointsToastTimer = useRef<number>(0);
  
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
    
    const favUrls = new Set(data.favoriteStationUrls);
    const stationsWithFavorites = defaultStations.map(s => ({...s, isFavorite: favUrls.has(s.streamUrl)}));
    const userStationsWithFavorites = data.userStations.map(s => ({...s, isFavorite: favUrls.has(s.streamUrl)}));
    
    setAllStations([...stationsWithFavorites, ...userStationsWithFavorites]);
    setUserStations(data.userStations);
    setFavoriteStationUrls(favUrls);
    setActiveTheme(data.activeTheme);
    setUnlockedThemes(new Set(data.unlockedThemes));
    setStats(data.stats);
    setAlarm(data.alarm);
    setSongVotes(data.songVotes);
    setUnlockedAchievements(data.unlockedAchievements);
    
    const params = new URLSearchParams(window.location.search);
    const stationSlug = params.get('station');
    if (stationSlug) {
      setTimeout(() => {
        setAllStations(currentStations => {
          const stationToPlay = currentStations.find(s => slugify(s.name) === stationSlug);
          if (stationToPlay) setCurrentStation(stationToPlay);
          return currentStations;
        });
      }, 0);
    }
    if(params.get('party') === 'true') setIsChatOpen(true);
    
    setIsDataLoading(false);
  }, []);

  useEffect(() => {
    let user: User | null = null;
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) user = JSON.parse(storedUser);
    } catch (error) { console.error("Failed to load current user:", error); }

    if (user) {
      setCurrentUser(user);
      loadUserData(user.username);
    } else {
      setIsDataLoading(false);
    }
  }, [loadUserData]);

  useEffect(() => {
    if (hasEnteredApp && !currentUser && !isDataLoading) {
        setIsLoginModalOpen(true);
    }
  }, [hasEnteredApp, currentUser, isDataLoading]);

  // --- SEO Effect: Update title and meta tags ---
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


  const handleLogin = useCallback(async (username: string) => {
    const user = { username };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
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
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    
    setAllStations(defaultStations);
    setUserStations([]);
    setFavoriteStationUrls(new Set());
    setStats({ totalTime: 0, stationPlays: {}, points: 0 });
    setAlarm(null);
    setSongVotes({});
    setUnlockedAchievements({});
    setActiveTheme('dynamic');
    setUnlockedThemes(new Set(['dynamic']));
    
    setIsLoginModalOpen(true);
  }, []);

  // --- Achievements Logic ---
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
        const genresPlayed = new Set(prevStats.genresPlayed || []);
        genresPlayed.add(currentStation.genre.split('/')[0].trim());
        const newStats: ListeningStats = { ...prevStats, lastListenDate: today, currentStreak: currentStreak, maxStreak: Math.max(prevStats.maxStreak || 0, currentStreak), genresPlayed: Array.from(genresPlayed) };
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
                  pointsToastTimer.current = 0; // Reset timer so regular notification doesn't show
              }
          }
          
          pointsToastTimer.current += 1;
          if (pointsToastTimer.current >= 300) { // Every 5 minutes
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
  
  const filteredStations = useMemo(() => allStations.filter(station => station.name.toLowerCase().includes(searchQuery.toLowerCase()) || station.genre.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, allStations]);

  const handleSelectStation = (station: Station) => { if (currentStation?.streamUrl !== station.streamUrl) setCurrentStation(station); };
  const handleNextStation = () => { if (!currentStation) return; const currentIndex = filteredStations.findIndex(s => s.streamUrl === currentStation.streamUrl); const nextIndex = (currentIndex + 1) % filteredStations.length; handleSelectStation(filteredStations[nextIndex]); };
  const handlePreviousStation = () => { if (!currentStation) return; const currentIndex = filteredStations.findIndex(s => s.streamUrl === currentStation.streamUrl); const prevIndex = (currentIndex - 1 + filteredStations.length) % filteredStations.length; handleSelectStation(filteredStations[prevIndex]); };
  
  const handleNowPlayingUpdate = useCallback(async (nowPlaying: NowPlaying | null) => {
    const newArt = nowPlaying?.albumArt || null;
    if (newArt) {
      try {
        const color = await getDominantColor(newArt); setAlbumArtColor(color);
      } catch (error) { console.warn("Could not extract color from album art, using default.", error); setAlbumArtColor('#67e8f9'); }
    } else { setAlbumArtColor('#67e8f9'); }
    if (newArt !== backgrounds[activeBgIndex]) { const nextIndex = 1 - activeBgIndex; const newBackgrounds = [...backgrounds] as [string | null, string | null]; newBackgrounds[nextIndex] = newArt; setBackgrounds(newBackgrounds); setActiveBgIndex(nextIndex); }
    
    if (!currentUser) return;
    
    let updatedSongVotes = songVotes;
    let updatedStats = stats;

    if (nowPlaying?.songId && !songVotes[nowPlaying.songId]) {
        const newEntry: SongVote = { id: nowPlaying.songId!, artist: nowPlaying.artist, title: nowPlaying.title, albumArt: nowPlaying.albumArt || currentStation!.coverArt, likes: Math.floor(Math.random() * 15) + 1, dislikes: Math.floor(Math.random() * 5)};
        updatedSongVotes = { ...songVotes, [nowPlaying.songId!]: newEntry };
        setSongVotes(updatedSongVotes);
    }

    if (nowPlaying?.songId && currentStation && nowPlaying.title !== "Live Stream" && nowPlaying.title !== "Station Data Unavailable") {
        const history = stats.songHistory || [];
        if (history[0]?.songId !== nowPlaying.songId) {
            const newHistoryItem = { songId: nowPlaying.songId, title: nowPlaying.title, artist: nowPlaying.artist, albumArt: nowPlaying.albumArt || currentStation.coverArt, stationName: currentStation.name, playedAt: new Date().toISOString() };
            const updatedHistory = [newHistoryItem, ...history].slice(0, 50);
            updatedStats = { ...stats, songHistory: updatedHistory };
            setStats(updatedStats);
        }
    }
    
    // Batch update to storage if anything changed
    if (updatedSongVotes !== songVotes || updatedStats !== stats) {
        await updateUserData(currentUser.username, { songVotes: updatedSongVotes, stats: updatedStats });
    }

  }, [activeBgIndex, backgrounds, songVotes, stats, currentStation, currentUser]);
  
  const handleAddStation = async (newStation: Station) => {
    if (!currentUser) return;
    const stationWithFavorite = {...newStation, isFavorite: favoriteStationUrls.has(newStation.streamUrl)};
    
    const newUserStations = [...userStations, newStation];
    setUserStations(newUserStations);
    setAllStations(prev => [...prev, stationWithFavorite]);
    
    await updateUserData(currentUser.username, { userStations: newUserStations });

    setIsSubmitModalOpen(false);
    unlockAchievement('station_submit');
  };
  
  const toggleFavorite = (stationToToggle: Station) => {
    if (!currentUser) return;
    const newFavoriteUrls = new Set(favoriteStationUrls);
    if (newFavoriteUrls.has(stationToToggle.streamUrl)) newFavoriteUrls.delete(stationToToggle.streamUrl);
    else newFavoriteUrls.add(stationToToggle.streamUrl);
    setFavoriteStationUrls(newFavoriteUrls);
    setAllStations(prevStations => prevStations.map(s => s.streamUrl === stationToToggle.streamUrl ? { ...s, isFavorite: !s.isFavorite } : s));
    updateUserData(currentUser.username, { favoriteStationUrls: Array.from(newFavoriteUrls) });
  };

  const handleSetTheme = (themeName: ThemeName) => {
    if (!currentUser) return;
    setActiveTheme(themeName);
    updateUserData(currentUser.username, { activeTheme: themeName });
  };

  const handleSetAlarm = (newAlarm: Alarm | null) => {
    if (!currentUser) return;
    setAlarm(newAlarm);
    updateUserData(currentUser.username, { alarm: newAlarm });
  }
  
  const handleVote = useCallback(async (songId: string, voteType: 'like' | 'dislike') => {
    if (!currentUser) return;

    const previousVote = stats.songUserVotes?.[songId];
    if (previousVote === voteType) return; // Already voted this way, do nothing.

    const newUserVotes = { ...(stats.songUserVotes || {}), [songId]: voteType };
    const newPoints = previousVote ? (stats.points || 0) : (stats.points || 0) + 1;
    const newStats = { ...stats, songUserVotes: newUserVotes, points: newPoints };
    setStats(newStats);

    const newVotes = { ...songVotes };
    const songVote = { ...newVotes[songId] };
    if (voteType === 'like') songVote.likes += 1;
    else songVote.dislikes += 1;
    if (previousVote === 'like') songVote.likes = Math.max(0, songVote.likes - 1);
    if (previousVote === 'dislike') songVote.dislikes = Math.max(0, songVote.dislikes - 1);
    newVotes[songId] = songVote;
    setSongVotes(newVotes);
        
    await updateUserData(currentUser.username, { stats: newStats, songVotes: newVotes });
}, [currentUser, stats, songVotes]);

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
        
        await updateUserData(currentUser.username, { stats: newStats, unlockedThemes: Array.from(newUnlocked) });

        setToasts(prev => [...prev, {id: Date.now(), title: "Theme Unlocked!", message: `You can now use the ${theme.displayName} theme.`, icon: StarIcon, type: 'theme_unlocked'}]);
    }
  }, [currentUser, stats, unlockedThemes]);

  const favoriteStations = useMemo(() => allStations.filter(s => s.isFavorite), [allStations]);
  
  const mapLocation = useMemo(() => {
    if (currentStation?.location) {
      return { ...currentStation.location, zoom: 6 };
    }
    // Fallback if no station or location
    if (currentStation) {
      return getLocationForGenre(currentStation.genre);
    }
    return { lat: 5.6, lng: 23.3, zoom: 4 };
  }, [currentStation]);

  const handleOpenStationDetail = (station: Station) => {
    setStationForDetail(station);
    setIsStationDetailModalOpen(true);
  };
  
  const handleAddReview = async (stationUrl: string, review: Omit<StationReview, 'createdAt' | 'author'>) => {
    if (!currentUser) return;
    
    const newReview: StationReview = {
        ...review,
        author: currentUser.username,
        createdAt: new Date().toISOString(),
    };

    const userReviews = stats.stationReviews?.[stationUrl] || [];
    const updatedReviewsForStation = [...userReviews, newReview];
    
    const newStationReviews = { ...(stats.stationReviews || {}), [stationUrl]: updatedReviewsForStation };
    
    const newStats = { ...stats, stationReviews: newStationReviews };
    setStats(newStats);
    await updateUserData(currentUser.username, { stats: newStats });
    
    // Add toast notification
    setToasts(prev => [...prev, {
      id: Date.now(),
      title: "Review Submitted!",
      message: `Thanks for sharing your thoughts on ${stationForDetail?.name}.`,
      icon: StarIcon,
      type: 'points'
    }]);
  };

  if (!hasEnteredApp) {
    return <LandingPage onEnter={() => setHasEnteredApp(true)} />;
  }

  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setIsDashboardModalOpen(false);
    setter(true);
  };

  return (
    <div className="min-h-screen bg-gray-900" style={{ '--accent-color': accentColor, '--accent-color-rgb': accentColorRgb } as React.CSSProperties}>
      <div className="relative min-h-screen overflow-hidden">
        {backgrounds.map((bg, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${activeBgIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} style={{ backgroundImage: bg ? `url(${bg})` : 'none', animation: bg ? `${index === 0 ? 'kenburns-a' : 'kenburns-b'} 60s ease-in-out infinite` : 'none' }} />
        ))}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl"></div>
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-800/80 text-gray-200 flex flex-col">
          <Header currentUser={currentUser} onLogout={handleLogout} onOpenDashboard={() => setIsDashboardModalOpen(true)} points={stats.points || 0} />
          
          {isDataLoading ? (
             <main className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div></main>
          ) : currentUser ? (
            <>
              <main className={`flex-grow container mx-auto p-4 md:p-8 transition-all duration-300 ${isImmersiveMode ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isChatOpen ? 'md:pr-[356px]' : ''} ${currentStation ? 'pb-24 md:pb-32' : ''}`}>
                <StationList 
                  stations={filteredStations} 
                  currentStation={currentStation} 
                  onSelectStation={handleSelectStation} 
                  searchQuery={searchQuery} 
                  onSearchChange={setSearchQuery} 
                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)} 
                  onToggleFavorite={toggleFavorite} 
                  songVotes={songVotes} 
                  onOpenGenreSpotlight={setGenreForSpotlight}
                  onOpenDetailModal={handleOpenStationDetail}
                />
              </main>
              {currentStation && <ListeningPartyChat station={currentStation} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
              {currentStation && (
                <RadioPlayer station={currentStation} onNowPlayingUpdate={handleNowPlayingUpdate} onNextStation={handleNextStation} onPreviousStation={handlePreviousStation} isImmersive={isImmersiveMode} onToggleImmersive={() => setIsImmersiveMode(prev => !prev)} songVotes={songVotes} onVote={handleVote} onRateStation={handleRateStation} userRating={stats.stationRatings?.[currentStation.streamUrl] || 0} onOpenTippingModal={() => setTippingModalStation(currentStation)} allStations={allStations} userSongVotes={stats.songUserVotes} onSelectStation={handleSelectStation} onToggleChat={() => setIsChatOpen(p => !p)} />
              )}
              <footer className={`text-center p-4 text-xs text-gray-500 transition-opacity ${isImmersiveMode ? 'opacity-0' : 'opacity-100'}`}>
                <p>Powered by Music Station Radio</p>
              </footer>
            </>
          ) : (
            <main className="flex-grow flex items-center justify-center"><p className="text-gray-400">Please log in to continue.</p></main>
          )}
        </div>
      </div>
      
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      <LoginModal isOpen={isLoginModalOpen} onLogin={handleLogin} />
      <SubmitStationModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} onSubmit={handleAddStation} />
      <StatsModal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} stats={stats} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={() => setIsAlarmModalOpen(false)} alarm={alarm} onSetAlarm={handleSetAlarm} favoriteStations={favoriteStations} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} activeTheme={activeTheme} onSetTheme={handleSetTheme} onUnlockTheme={handleUnlockTheme} unlockedThemes={unlockedThemes} currentPoints={stats.points || 0}/>
      <MapModal 
        isOpen={isMapModalOpen} 
        onClose={() => setIsMapModalOpen(false)} 
        location={mapLocation}
        stations={allStations}
        currentStation={currentStation}
        onSelectStation={(station) => {
          handleSelectStation(station);
          setIsMapModalOpen(false);
        }}
      />
      <AchievementsModal isOpen={isAchievementsModalOpen} onClose={() => setIsAchievementsModalOpen(false)} unlockedAchievements={unlockedAchievements} />
      <TippingModal isOpen={!!tippingModalStation} onClose={() => setTippingModalStation(null)} station={tippingModalStation} />
      <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={() => setIsLeaderboardModalOpen(false)} currentUser={currentUser} userPoints={stats.points || 0} />
      <HistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={stats.songHistory || []} />
      <GenreSpotlightModal isOpen={!!genreForSpotlight} onClose={() => setGenreForSpotlight(null)} genre={genreForSpotlight} />
      <SongChartModal isOpen={isSongChartModalOpen} onClose={() => setIsSongChartModalOpen(false)} songVotes={songVotes} />
      <StationDetailModal 
        isOpen={isStationDetailModalOpen}
        onClose={() => setIsStationDetailModalOpen(false)}
        station={stationForDetail}
        allStations={allStations}
        mockReviews={MOCK_REVIEWS}
        userReviews={stats.stationReviews?.[stationForDetail?.streamUrl || ''] || []}
        onAddReview={handleAddReview}
        onSelectStation={(s) => {
            handleSelectStation(s);
            setIsStationDetailModalOpen(false);
        }}
        onRateStation={handleRateStation}
        userRating={stats.stationRatings?.[stationForDetail?.streamUrl || ''] || 0}
      />
      <EventsModal isOpen={isEventsModalOpen} onClose={() => setIsEventsModalOpen(false)} onSelectStation={(stationName) => {
        const stationToPlay = allStations.find(s => s.name === stationName);
        if (stationToPlay) handleSelectStation(stationToPlay);
        setIsEventsModalOpen(false);
      }} />
      <DashboardModal 
        isOpen={isDashboardModalOpen} 
        onClose={() => setIsDashboardModalOpen(false)}
        user={currentUser}
        stats={stats}
        favoritesCount={favoriteStationUrls.size}
        unlockedAchievements={unlockedAchievements}
        onOpenStats={openModal(setIsStatsModalOpen)}
        onOpenAlarm={openModal(setIsAlarmModalOpen)}
        onOpenSettings={openModal(setIsSettingsModalOpen)}
        onOpenMap={openModal(setIsMapModalOpen)}
        onOpenAchievements={openModal(setIsAchievementsModalOpen)}
        onOpenLeaderboard={openModal(setIsLeaderboardModalOpen)}
        onOpenHistory={openModal(setIsHistoryModalOpen)}
        onOpenSongChart={openModal(setIsSongChartModalOpen)}
        onOpenEvents={openModal(setIsEventsModalOpen)}
      />

      <style>{`
        .accent-color-text { color: var(--accent-color); }
        .accent-color-bg { background-color: var(--accent-color); }
        .accent-color-border { border-color: var(--accent-color); }
        .accent-color-ring:focus-visible { --tw-ring-color: var(--accent-color); }
        .accent-color-shadow { box-shadow: 0 0 15px 0 var(--accent-color); }
        .accent-color-shadow-hover:hover { box-shadow: 0 0 15px 0 var(--accent-color); }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
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
