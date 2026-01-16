
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
import { TradingPostView } from './components/TradingPostView';
import { PredictionMarketView } from './components/PredictionMarketView';
import { stations as defaultStations, THEMES, ACHIEVEMENTS, INITIAL_QUESTS, CARDS_DB, UserIcon, FireIcon, StarIcon, LockIcon, HeartIcon, BOUNTIES, ShieldCheckIcon, UploadIcon, CheckCircleIcon, XCircleIcon, MusicNoteIcon, CollectionIcon, TrophyIcon, MYSTERY_TRACK } from './constants';
import type { Station, NowPlaying, ListeningStats, Alarm, ThemeName, SongVote, UnlockedAchievement, AchievementID, ToastData, User, Theme, ActiveView, UserData, MusicSubmission, Bet, CollectorCard, Lounge, UserProfile, AvatarFrame, SkinID, Bounty, Jingle, PlayerSkin, GuestbookEntry, Quest, MarketListing } from './types';
import { getDominantColor } from './utils/colorExtractor';
import { LandingPage } from './components/LandingPage';
import { getUserData, updateUserData, createUserData, followUser, unfollowUser, fetchRadioBrowserStations } from './services/apiService';
import { EditStationModal } from './components/EditStationModal';
import { MusicSubmissionModal } from './components/MusicSubmissionModal';
import { ClaimOwnershipModal } from './components/ClaimOwnershipModal';
import { BuyNowModal } from './components/BuyNowModal';
import { DashboardView } from './components/DashboardView';
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
import { ContactUsView } from './components/ContactUsView';

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

  // Default to High Grade Radio on entry
  const highGradeStation = useMemo(() => defaultStations.find(s => s.name === "High Grade Radio") || defaultStations[0], []);
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
  
  const [albumArtColor, setAlbumArtColor] = useState('#facc15');
  const [activeTheme, setActiveTheme] = useState<ThemeName>('dynamic');

  const [allStations, setAllStations] = useState<Station[]>(defaultStations);
  const [userStations, setUserStations] = useState<Station[]>(defaultStations);
  
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
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [targetGiftUser, setTargetGiftUser] = useState<string | null>(null);

  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [targetUserProfile, setTargetUserProfile] = useState<UserProfile | undefined>(undefined);

  const [favoriteStationUrls, setFavoriteStationUrls] = useState<Set<string>>(new Set<string>());
  const [unlockedThemes, setUnlockedThemes] = useState<Set<ThemeName>>(new Set(['dynamic', 'reggae']));

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);

  const [stats, setStats] = useState<ListeningStats>({ totalTime: 0, stationPlays: {}, points: 0, songHistory: [], songUserVotes: {} });
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [songVotes, setSongVotes] = useState<Record<string, SongVote>>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, UnlockedAchievement>>({});
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [collection, setCollection] = useState<CollectorCard[]>([] as CollectorCard[]);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  
  const [activeFrame, setActiveFrame] = useState<string | undefined>(undefined);
  const [unlockedFrames, setUnlockedFrames] = useState<string[]>([]);
  const [hypeScore, setHypeScore] = useState(0);
  const [globalHype, setGlobalHype] = useState(45); // Start mid-way for demo
  const [isHypeStormActive, setIsHypeStormActive] = useState(false);
  const [stormTimeRemaining, setStormTimeRemaining] = useState(60);
  const [isHypeActive, setIsHypeActive] = useState(false);
  const [isCoinActive, setIsCoinActive] = useState(false);
  
  const [activeSkin, setActiveSkin] = useState<SkinID>('modern');
  const [unlockedSkins, setUnlockedSkins] = useState<SkinID[]>(['modern']);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [bounties, setBounties] = useState<Bounty[]>(BOUNTIES);
  const [jingles, setJingles] = useState<Jingle[]>([]);

  const [marketListings, setMarketListings] = useState<MarketListing[]>([
      { id: 'm1', seller: 'RetroFan', price: 1200, listedAt: new Date().toISOString(), card: { ...CARDS_DB[1], id: 'card_legacy_1', acquiredAt: '' } },
      { id: 'm2', seller: 'MusicCollector', price: 5000, listedAt: new Date().toISOString(), card: { ...CARDS_DB[0], id: 'card_legacy_2', acquiredAt: '' } }
  ]);

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
    return currentThemeObj?.color || '#facc15';
  }, [activeTheme, albumArtColor, currentThemeObj]);
  
  const rgbComponents = useMemo(() => {
      const parts = hexToRgb(accentColor).split(',');
      return {
          r: parts[0].trim(),
          g: parts[1].trim(),
          b: parts[2].trim()
      };
  }, [accentColor]);

  // Initial Data Loading
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

  // Global Hype Sim
  useEffect(() => {
      const hypeInterval = setInterval(() => {
          if (!isHypeStormActive) {
            setGlobalHype(prev => {
                const next = prev + (Math.random() * 0.5);
                if (next >= 100) {
                    setIsHypeStormActive(true);
                    setStormTimeRemaining(60);
                    setToasts(t => [...t, { id: Date.now(), title: 'VIBE TAKEOVER STARTED!', message: '2x Points Multiplier Active!', icon: FireIcon, type: 'hype' }]);
                    return 0;
                }
                return next;
            });
          }
      }, 5000);
      return () => clearInterval(hypeInterval);
  }, [isHypeStormActive]);

  // Storm Timer
  useEffect(() => {
      if (!isHypeStormActive) return;
      const timer = setInterval(() => {
          setStormTimeRemaining(prev => {
              if (prev <= 1) {
                  setIsHypeStormActive(false);
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
      return () => clearInterval(timer);
  }, [isHypeStormActive]);

  // Listen Time & Quest Progress tracking
  useEffect(() => {
    if (currentStation && isPlaying && currentUser) {
        statsUpdateInterval.current = window.setInterval(() => {
            setStats(prev => {
                const next = { ...prev };
                next.totalTime = (next.totalTime || 0) + 1;
                const sUrl = currentStation.streamUrl;
                const sStats = next.stationPlays[sUrl] || { name: currentStation.name, genre: currentStation.genre, time: 0 };
                next.stationPlays[sUrl] = { ...sStats, time: sStats.time + 1 };
                
                // Point calculation with Hype Storm Multiplier
                if (next.totalTime > 0 && next.totalTime % 60 === 0) {
                    const basePoints = 5;
                    const multiplier = isHypeStormActive ? 2 : 1;
                    next.points = (next.points || 0) + (basePoints * multiplier);
                    if (isHypeStormActive) {
                        setToasts(t => [...t, { id: Date.now(), title: 'Bonus Points!', message: `Earned ${basePoints * multiplier} pts (2x Multiplier)`, icon: StarIcon, type: 'points' }]);
                    }
                }
                return next;
            });

            // Quest Logic: Track Listen Time Quest (Daily Tune-In)
            setQuests(prev => prev.map(q => {
                if (q.id === 'q1' && !q.isClaimed) {
                    const newProgress = Math.min(q.goal, q.progress + 1);
                    if (newProgress === q.goal && q.progress < q.goal) {
                        setToasts(t => [...t, { id: Date.now(), title: 'Quest Complete!', message: q.title, icon: StarIcon, type: 'milestone' }]);
                    }
                    return { ...q, progress: newProgress };
                }
                return q;
            }));

            // Random Card Drop (1% chance every minute of listening)
            if (Math.random() < 0.01) {
                const randomCard = CARDS_DB[Math.floor(Math.random() * CARDS_DB.length)];
                const newCard: CollectorCard = { ...randomCard, id: `card_${Date.now()}`, acquiredAt: new Date().toISOString() };
                setCollection(prev => [...prev, newCard]);
                setToasts(t => [...t, { id: Date.now(), title: 'New Collector Card!', message: `You found a ${newCard.name}!`, icon: CollectionIcon, type: 'achievement' }]);
                setIsCoinActive(true);
            }
        }, 1000);
    } else {
        if (statsUpdateInterval.current) clearInterval(statsUpdateInterval.current);
    };
    return () => {
        if (statsUpdateInterval.current) clearInterval(statsUpdateInterval.current);
    };
  }, [currentStation, isPlaying, currentUser, isHypeStormActive]);

  useEffect(() => {
      if (currentUser && stats.totalTime > 0 && stats.totalTime % 10 === 0) {
          updateUserData(currentUser.username, { stats, quests, collection });
      }
  }, [stats.totalTime, currentUser, stats, quests, collection]);

  // Marketplace Handlers
  const handleBuyCard = useCallback((listingId: string) => {
    const listing = marketListings.find(m => m.id === listingId);
    if (!listing || !currentUser || (stats.points || 0) < listing.price) return;

    const newPoints = (stats.points || 0) - listing.price;
    setStats(prev => ({ ...prev, points: newPoints }));
    setCollection(prev => [...prev, { ...listing.card, acquiredAt: new Date().toISOString() }]);
    setMarketListings(prev => prev.filter(m => m.id !== listingId));
    
    setToasts(t => [...t, { id: Date.now(), title: 'Card Acquired!', message: `Purchased ${listing.card.name}`, icon: CollectionIcon, type: 'success' }]);
    setIsCoinActive(true);
  }, [marketListings, stats.points, currentUser]);

  const handleListCard = useCallback((cardId: string, price: number) => {
    if (!currentUser) return;
    const cardToList = collection.find(c => c.id === cardId);
    if (!cardToList) return;

    const newListing: MarketListing = {
        id: `listing_${Date.now()}`,
        card: cardToList,
        seller: currentUser.username,
        price,
        listedAt: new Date().toISOString()
    };

    setCollection(prev => prev.filter(c => c.id !== cardId));
    setMarketListings(prev => [newListing, ...prev]);
    setToasts(t => [...t, { id: Date.now(), title: 'Card Listed!', message: `Your ${cardToList.name} is now on the Trading Post`, icon: CollectionIcon, type: 'info' }]);
  }, [collection, currentUser]);

  // Quests & Betting Handlers
  const handleClaimQuest = useCallback((questId: string) => {
      const quest = quests.find(q => q.id === questId);
      if (!quest || quest.progress < quest.goal || quest.isClaimed) return;

      const newPoints = (stats.points || 0) + quest.reward;
      setStats(prev => ({ ...prev, points: newPoints }));
      setQuests(prev => prev.map(q => {
          if (q.id === questId) return { ...q, isClaimed: true };
          return q;
      }));
      setToasts(t => [...t, { id: Date.now(), title: 'Reward Claimed!', message: `Earned ${quest.reward} pts`, icon: StarIcon, type: 'success' }]);
      setIsCoinActive(true);
  }, [quests, stats]);

  const handlePlaceBet = useCallback((songTitle: string, artist: string, amount: number, odds: number) => {
      if (!currentUser || (stats.points || 0) < amount) return;
      
      const newBet: Bet = {
          id: `bet_${Date.now()}`,
          songTitle,
          artist,
          amount,
          odds,
          potentialPayout: Math.floor(amount * odds),
          placedAt: new Date().toISOString(),
          status: 'pending'
      };

      const newPoints = (stats.points || 0) - amount;
      setStats(prev => ({ ...prev, points: newPoints }));
      setActiveBets(prev => [...prev, newBet]);
      setToasts(t => [...t, { id: Date.now(), title: 'Wager Placed!', message: `You bet ${amount} on ${songTitle}`, icon: FireIcon, type: 'info' }]);
  }, [currentUser, stats.points]);

  const handleSendSuperChat = useCallback((amount: number, message: string) => {
      if (!currentUser || (stats.points || 0) < amount) return;
      const newPoints = (stats.points || 0) - amount;
      setStats(prev => ({ ...prev, points: newPoints }));
      // Super chat is handled by the component adding a special message type
      setToasts(t => [...t, { id: Date.now(), title: 'Super Chat Sent!', icon: StarIcon, type: 'points' }]);
  }, [currentUser, stats.points]);

  const handleSendGift = useCallback((amount: number, recipient: string) => {
      if (!currentUser || (stats.points || 0) < amount) return;
      const newPoints = (stats.points || 0) - amount;
      setStats(prev => ({ ...prev, points: newPoints }));
      setToasts(t => [...t, { id: Date.now(), title: 'Gift Dispatched!', message: `Sent ${amount} points to ${recipient}`, icon: StarIcon, type: 'success' }]);
  }, [currentUser, stats.points]);

  // Navigation Logic
  const handleBackToHome = useCallback(() => {
      setActiveView('explore');
  }, []);

  /* Fix: Added handleToggleFavorite function to manage favoriting stations and persisting to storage. */
  const handleToggleFavorite = useCallback(async (station: Station) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    const streamUrl = station.streamUrl;
    const isCurrentlyFavorite = favoriteStationUrls.has(streamUrl);

    const nextFavorites = new Set(favoriteStationUrls);
    if (isCurrentlyFavorite) {
      nextFavorites.delete(streamUrl);
    } else {
      nextFavorites.add(streamUrl);
    }

    setFavoriteStationUrls(nextFavorites);
    
    setAllStations(prev => prev.map(s => 
      s.streamUrl === streamUrl ? { ...s, isFavorite: !isCurrentlyFavorite } : s
    ));
    setUserStations(prev => prev.map(s => 
      s.streamUrl === streamUrl ? { ...s, isFavorite: !isCurrentlyFavorite } : s
    ));

    await updateUserData(currentUser.username, { 
      favoriteStationUrls: Array.from(nextFavorites) 
    });

    setToasts(t => [...t, { 
      id: Date.now(), 
      title: isCurrentlyFavorite ? 'Removed from Favorites' : 'Added to Favorites', 
      message: station.name, 
      icon: HeartIcon, 
      type: 'success' 
    }]);
  }, [currentUser, favoriteStationUrls]);

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
    const favUrls = new Set<string>((data.favoriteStationUrls as string[]) || ([] as string[]));
    const user: User = { username, role: data.role };
    setCurrentUser(user);
    setFavoriteStationUrls(favUrls);
    setActiveTheme(data.activeTheme);
    setUnlockedThemes(new Set<ThemeName>((data.unlockedThemes as ThemeName[]) || (['dynamic', 'reggae'] as ThemeName[])));
    setStats(data.stats as ListeningStats);
    setAlarm(data.alarm);
    setSongVotes(data.songVotes);
    setUnlockedAchievements(data.unlockedAchievements);
    setQuests(data.quests || INITIAL_QUESTS);
    setCollection(data.collection || []);
    setActiveFrame(data.activeFrame);
    // Fix: cast data.unlockedFrames to string[] explicitly to satisfy strict typing and resolve the unknown[] assignment error.
    setUnlockedFrames((data.unlockedFrames as string[]) || ([] as string[]));
    const profileData: UserProfile = (data.profile as UserProfile) || { bio: '', topArtists: [] as string[], favoriteGenres: [] as string[], following: [] as string[], followers: [] as string[], customAvatarUrl: '' };
    setUserProfile(profileData);
    setCustomThemes(data.customThemes || []);
    setActiveSkin(data.activeSkin || 'modern');
    setUnlockedSkins((data.unlockedSkins as SkinID[]) || (['modern'] as SkinID[]));
    setPortfolio(data.portfolio || {});
    setJingles(data.jingles || []);
    const completedBounties = (data.completedBounties as string[]) || ([] as string[]);
    if(completedBounties.length > 0) {
        setBounties(prev => prev.map(b => completedBounties.includes(b.id) ? { ...b, completed: true } : b));
    }
    setActiveView('explore');
    setIsDataLoading(false);

    if (!currentStation) {
        setCurrentStation(highGradeStation);
        setStationForDetail(highGradeStation);
    }
  }, [handleLogout, highGradeStation, currentStation]);

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
      getDominantColor(newArt).then(color => setAlbumArtColor(color)).catch(() => setAlbumArtColor('#facc15'));
    } else setAlbumArtColor('#facc15');
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
      updateUserData(currentUser.username, { stats: { ...stats, points: newPoints }, unlockedThemes: Array.from(newUnlocked) as ThemeName[] });
      setToasts(t => [...t, { id: Date.now(), title: 'Theme Unlocked!', message: `You purchased ${theme.displayName}`, icon: StarIcon, type: 'theme_unlocked' }]);
    } else setToasts(t => [...t, { id: Date.now(), title: 'Insufficient Points', message: `Need ${theme.cost - currentPoints} more points.`, icon: LockIcon, type: 'error' }]);
  };

  const handleUnlockFrame = useCallback((frame: AvatarFrame) => {
    if (!currentUser || !frame.cost) return;
    const currentPoints = stats.points || 0;
    if (currentPoints >= frame.cost) {
      const newPoints = currentPoints - frame.cost;
      const newUnlocked = [...unlockedFrames, frame.id];
      setStats(prev => ({ ...prev, points: newPoints }));
      setUnlockedFrames(newUnlocked);
      updateUserData(currentUser.username, { stats: { ...stats, points: newPoints }, unlockedFrames: newUnlocked });
      setToasts(t => [...t, { id: Date.now(), title: 'Frame Unlocked!', message: `You purchased ${frame.name}`, icon: UserIcon, type: 'success' }]);
    } else setToasts(t => [...t, { id: Date.now(), title: 'Insufficient Points', message: `Need ${frame.cost - currentPoints} more points.`, icon: LockIcon, type: 'error' }]);
  }, [currentUser, stats, unlockedFrames]);

  const handleUnlockSkin = useCallback((skin: PlayerSkin) => {
    if (!currentUser || !skin.cost) return;
    const currentPoints = stats.points || 0;
    if (currentPoints >= skin.cost) {
      const newPoints = currentPoints - skin.cost;
      const newUnlocked = [...unlockedSkins, skin.id];
      setStats(prev => ({ ...prev, points: newPoints }));
      setUnlockedSkins(newUnlocked);
      updateUserData(currentUser.username, { stats: { ...stats, points: newPoints }, unlockedSkins: newUnlocked });
      setToasts(t => [...t, { id: Date.now(), title: 'Skin Unlocked!', message: `You purchased ${skin.name}`, icon: StarIcon, type: 'success' }]);
    } else setToasts(t => [...t, { id: Date.now(), title: 'Insufficient Points', message: `Need ${skin.cost - currentPoints} more points.`, icon: LockIcon, type: 'error' }]);
  }, [currentUser, stats, unlockedSkins]);

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
        
        // Quest Logic: Check Vibe Check Quest
        setQuests(prev => prev.map(q => {
            if (q.id === 'q3' && !q.isClaimed && voteType === 'like') {
                return { ...q, progress: Math.min(q.goal, q.progress + 1) };
            }
            return q;
        }));
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
          if (data) setTargetUserProfile((data.profile as UserProfile) || { bio: '', topArtists: [] as string[], favoriteGenres: [] as string[], following: [] as string[], followers: [] as string[], customAvatarUrl: '' });
      }
  }, [currentUser, userProfile]);

  const handleClaimOwnership = useCallback((station: Station, reason: string) => {
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
      // Contribute to global hype
      setGlobalHype(prev => Math.min(100, prev + 1));
  }, []);

  const handleEditStation = useCallback((station: Station) => { setStationToEdit(station); setIsEditModalOpen(true); }, []);

  const handleUpdateStation = useCallback((updatedStation: Station) => {
      setAllStations(prev => prev.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s));
      if (currentUser) updateUserData(currentUser.username, { userStations: userStations.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s) });
      setIsEditModalOpen(false);
      setToasts(t => [...t, { id: Date.now(), title: 'Station Updated!', icon: ShieldCheckIcon, type: 'success' }]);
  }, [currentUser, userStations]);

  // --- Administrative Functions ---
  const handleApproveClaim = useCallback(async (station: Station, claimantUsername: string) => {
      setAllStations(prev => prev.map(s => s.streamUrl === station.streamUrl ? { ...s, owner: claimantUsername, claimRequest: undefined } : s));
      const userData = await getUserData(claimantUsername);
      if (userData && userData.role === 'user') {
          await updateUserData(claimantUsername, { role: 'owner' });
      }
      setToasts(t => [...t, { id: Date.now(), title: 'Claim Approved!', message: `${claimantUsername} is now the manager of ${station.name}.`, icon: ShieldCheckIcon, type: 'success' }]);
  }, []);

  const handleDenyClaim = useCallback((station: Station) => {
      setAllStations(prev => prev.map(s => s.streamUrl === station.streamUrl ? { ...s, claimRequest: undefined } : s));
      setToasts(t => [...t, { id: Date.now(), title: 'Claim Denied', icon: XCircleIcon, type: 'info' }]);
  }, []);

  const handleUpdateUserRole = useCallback(async (username: string, role: UserData['role']) => {
      await updateUserData(username, { role });
      if (currentUser?.username === username) {
          setCurrentUser({ ...currentUser, role });
      }
      setToasts(t => [...t, { id: Date.now(), title: 'Role Updated', message: `${username} is now a ${role}.`, icon: ShieldCheckIcon, type: 'success' }]);
  }, [currentUser]);

  const handleDeleteStation = useCallback((station: Station) => {
      setAllStations(prev => prev.filter(s => s.streamUrl !== station.streamUrl));
      setToasts(t => [...t, { id: Date.now(), title: 'Station Removed', icon: XCircleIcon, type: 'info' }]);
  }, []);

  const handleReviewSubmission = useCallback((stationStreamUrl: string, submissionId: string, status: 'approved' | 'rejected', managerComment?: string) => {
      setAllStations(prev => prev.map(s => {
          if (s.streamUrl === stationStreamUrl) {
              const updatedSubmissions = (s.submissions || []).map(sub =>
                  sub.id === submissionId ? { ...sub, status, managerComment, reviewedAt: new Date().toISOString() } : sub
              );
              return { ...s, submissions: updatedSubmissions };
          }
          return s;
      }));
      setToasts(t => [...t, { id: Date.now(), title: `Submission ${status}`, icon: status === 'approved' ? CheckCircleIcon : XCircleIcon, type: 'success' }]);
  }, []);

  const handleReviewJingle = useCallback((jingleId: string, status: 'approved' | 'rejected') => {
      setJingles(prev => prev.map(j => j.id === jingleId ? { ...j, status } : j));
      setToasts(t => [...t, { id: Date.now(), title: `Jingle ${status}`, icon: MusicNoteIcon, type: 'success' }]);
  }, []);

  const handleDeleteGuestbookEntry = useCallback((stationStreamUrl: string, entryId: string) => {
      setAllStations(prev => prev.map(s => {
          if (s.streamUrl === stationStreamUrl) {
              return { ...s, guestbook: (s.guestbook || []).filter(e => e.id !== entryId) };
          }
          return s;
      }));
      setToasts(t => [...t, { id: Date.now(), title: 'Entry Deleted', icon: XCircleIcon, type: 'info' }]);
  }, []);

  const handleAddJingle = useCallback((blob: Blob) => {
    if (!currentUser || !currentStation) return;
    const jingleId = `jingle_${Date.now()}`;
    const newJingle: Jingle = {
        id: jingleId,
        url: URL.createObjectURL(blob),
        stationUrl: currentStation.streamUrl,
        creator: currentUser.username,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    setJingles(prev => [...prev, newJingle]);
    setToasts(t => [...t, { id: Date.now(), title: 'Jingle Submitted!', message: 'Awaiting manager approval.', icon: MusicNoteIcon, type: 'success' }]);
  }, [currentUser, currentStation]);

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

  const allMusicSubmissions = useMemo<MusicSubmission[]>(() => {
    const subs: MusicSubmission[] = [];
    allStations.forEach((station: Station) => {
        const submissions = (station.submissions as MusicSubmission[]) || [];
        submissions.forEach((sub: MusicSubmission) => {
            subs.push({
                ...sub,
                stationName: station.name as string,
                stationStreamUrl: station.streamUrl as string
            });
        });
    });
    return subs;
  }, [allStations]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'artist_dashboard': 
        return <ArtistDashboardView user={currentUser} stats={stats} submissions={allMusicSubmissions.filter(s => s.submittedBy === currentUser?.username)} setActiveView={setActiveView} onBack={handleBackToHome} />;
      case 'station_manager_dashboard': 
        return <StationManagerDashboardView user={currentUser} allStations={allStations} onReviewSubmission={handleReviewSubmission} onEditStation={handleEditStation} jingles={jingles} onReviewJingle={handleReviewJingle} onDeleteGuestbookEntry={handleDeleteGuestbookEntry} onBack={handleBackToHome} />;
      case 'admin': 
        return <AdminDashboardView stations={allStations} onApproveClaim={handleApproveClaim} onDenyClaim={handleDenyClaim} onUpdateUserRole={handleUpdateUserRole} onEditStation={handleEditStation} onDeleteStation={handleDeleteStation} currentUser={currentUser} onOpenProfile={handleOpenProfile} onReviewSubmission={handleReviewSubmission} jingles={jingles} onReviewJingle={handleReviewJingle} onDeleteGuestbookEntry={handleDeleteGuestbookEntry} onBack={handleBackToHome} />;
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
                onBack={handleBackToHome}
            />
        );
      case 'leaderboard': 
        return <LeaderboardView currentUser={currentUser} userPoints={stats.points || 0} onBack={handleBackToHome} />;
      case 'dashboard': 
        return <DashboardView user={currentUser} stats={stats} favoritesCount={favoriteStationUrls.size} unlockedAchievements={unlockedAchievements} onBack={handleBackToHome} quests={quests} onClaimQuest={handleClaimQuest} />;
      case 'help': 
        return <HelpFAQ onContactClick={() => setActiveView('contact')} onBack={handleBackToHome} />;
      case 'contact':
        return <ContactUsView onSuccess={(msg) => setToasts(t => [...t, { id: Date.now(), title: 'Ticket Sent', message: msg, icon: CheckCircleIcon, type: 'success' }])} onBack={handleBackToHome} />;
      case 'trading_post':
        return <TradingPostView onBack={handleBackToHome} listings={marketListings} onBuy={handleBuyCard} userPoints={stats.points || 0} currentUser={currentUser} />;
      case 'prediction_market':
        return <PredictionMarketView onBack={handleBackToHome} userPoints={stats.points || 0} activeBets={activeBets} onPlaceBet={handlePlaceBet} trendingSongs={Object.values(songVotes)} />;
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
  
  if (!hasEnteredApp) {
      return <LandingPage onEnter={() => setHasEnteredApp(true)} />;
  }

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
      <HypeOverlay isActive={isHypeActive || isHypeStormActive} isStorm={isHypeStormActive} onComplete={() => setIsHypeActive(false)} />
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
            <Header 
                currentUser={currentUser} 
                onLogout={handleLogout} 
                points={stats.points || 0} 
                onGoToHome={() => setActiveView('dashboard')} 
                isVisible={isHeaderVisible && !isImmersiveMode} 
                customAvatarUrl={currentUser?.profile?.customAvatarUrl} 
                isHypeStormActive={isHypeStormActive}
                stormRemaining={stormTimeRemaining}
            />
            <div className={`flex flex-1 overflow-hidden transition-opacity duration-300 ${isImmersiveMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {currentUser && <Sidebar currentUser={currentUser} activeView={activeView} setActiveView={setActiveView} onOpenAlarm={() => setIsAlarmModalOpen(true)} onOpenSongChart={() => setIsSongChartModal(true)} onOpenEvents={() => setIsEventsModalOpen(true)} onOpenHistory={() => setIsHistoryModalOpen(true)} onOpenStockMarket={() => setActiveView('prediction_market')} onOpenCollection={() => setIsCollectionOpen(true)} />}
                <main id="main-content" className="flex-1 overflow-y-auto pb-24">{renderActiveView()}</main>
                <RightPanel station={stationForDetail} currentStation={currentStation} allStations={allStations} currentUser={currentUser} stats={stats} onAddReview={() => {}} onSelectStation={handleSelectStation} onRateStation={() => {}} onEdit={handleEditStation} onOpenMusicSubmissionModal={(s) => { setStationForSubmission(s); setIsMusicSubmissionModalOpen(true); }} onOpenClaimModal={(s) => { setStationToClaim(s); setIsClaimModalOpen(true); }} onToggleFavorite={handleToggleFavorite} nowPlaying={isHypeStormActive ? MYSTERY_TRACK : nowPlaying} bounties={bounties} onOpenJingleModal={() => setIsJingleModalOpen(true)} onAddGuestbookEntry={handleAddGuestbookEntry} />
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
             {currentStation && <RadioPlayer station={currentStation} allStations={allStations} onNowPlayingUpdate={handleNowPlayingUpdate} onNextStation={handleNextStation} onPreviousStation={handlePreviousStation} isImmersive={isImmersiveMode} onToggleImmersive={() => setIsImmersiveMode(!isImmersiveMode)} songVotes={songVotes} onVote={handleSongVote} onRateStation={() => {}} userRating={0} onOpenTippingModal={() => {}} onSelectStation={handleSelectStation} onToggleChat={() => setIsChatOpen(!isChatOpen)} onStartRaid={() => {}} raidStatus="idle" raidTarget={null} onHidePlayer={() => setIsPlayerVisible(false)} isVisible={isPlayerVisible} onOpenBuyNow={() => setIsBuyNowModalOpen(true)} isHeaderVisible={isHeaderVisible} onToggleHeader={handleToggleHeader} onHype={handleHype} hypeScore={hypeScore} isPlaying={isPlaying} onPlayPause={setIsPlaying} isDataSaver={isDataSaver} sleepTimerTarget={sleepTimerTarget} userSongVotes={stats.songUserVotes} activeSkin={activeSkin} globalHype={globalHype} isHypeStormActive={isHypeStormActive} />}
             {currentStation && <ListeningPartyChat station={currentStation} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} nowPlaying={isHypeStormActive ? MYSTERY_TRACK : nowPlaying} onSuperChat={handleSendSuperChat} userPoints={stats.points || 0} activeFrame={activeFrame} onUserClick={(u) => { setTargetGiftUser(u); setIsGiftModalOpen(true); }} currentUserAvatarUrl={currentUser?.profile?.customAvatarUrl} />}
        </div>
      </div>
      
      <BuyNowModal isOpen={isBuyNowModalOpen} onClose={() => setIsBuyNowModalOpen(false)} nowPlaying={nowPlaying} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} isDataSaver={isDataSaver} onToggleDataSaver={() => setIsDataSaver(!isDataSaver)} sleepTimerTarget={sleepTimerTarget} onSetSleepTimer={(min) => setSleepTimerTarget(min ? Date.now() + min * 60000 : null)} />
      <UserProfileModal isOpen={!!viewingProfile} onClose={() => setViewingProfile(null)} username={viewingProfile || ''} currentUser={currentUser} profile={targetUserProfile} onUpdateProfile={()=>{}} onMessage={()=>{}} onFollow={()=>{}} isFollowing={false} />
      <JingleModal isOpen={isJingleModalOpen} onClose={() => setIsJingleModalOpen(false)} onSubmit={handleAddJingle} />
      <ClaimOwnershipModal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} station={stationToClaim} onSubmit={handleClaimOwnership} />
      <EditStationModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={handleUpdateStation} station={stationToEdit} />
      <LoginModal isOpen={isLoginModalOpen} onLogin={handleLogin} />
      <SubmitStationModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} onSubmit={()=>{}} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={() => setIsAlarmModalOpen(false)} alarm={alarm} onSetAlarm={setAlarm} favoriteStations={userStations} />
      <GenreSpotlightModal isOpen={false} onClose={() => {}} genre={null} />
      <SongChartModal isOpen={isSongChartModalOpen} onClose={() => setIsSongChartModal(false)} songVotes={songVotes} />
      <EventsModal isOpen={isEventsModalOpen} onClose={() => setIsEventsModalOpen(false)} onSelectStation={(name) => { const s = allStations.find(st=>st.name===name); if(s) handleSelectStation(s); setIsEventsModalOpen(false); }} />
      <SongHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={stats.songHistory} />
      <MusicSubmissionModal isOpen={isMusicSubmissionModalOpen} onClose={() => setIsMusicSubmissionModalOpen(false)} onSubmit={handleAddMusicSubmission} station={stationForSubmission} userPoints={stats.points || 0} />
      
      <CollectionModal isOpen={isCollectionOpen} onClose={() => setIsCollectionOpen(false)} collection={collection} onListCard={handleListCard} />
      <GiftPointsModal isOpen={isGiftModalOpen} onClose={() => setIsGiftModalOpen(false)} targetUser={targetGiftUser || ''} userPoints={stats.points || 0} onSendGift={handleSendGift} />
    </div>
  );
};
