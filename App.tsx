
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { RadioPlayer } from './components/RadioPlayer';
import { StationList } from './components/StationList';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { StoreView } from './components/StoreView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ArtistDashboardView } from './components/ArtistDashboardView';
import { StationManagerDashboardView } from './components/StationManagerDashboardView';
import { GenreChatView } from './components/GenreChatView';
import { MapView } from './components/MapView';
import { LandingPage } from './components/LandingPage';

import { EventsModal } from './components/EventsModal';
import { StatsModal } from './components/StatsModal';
import { AlarmModal } from './components/AlarmModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SongChartModal } from './components/SongChartModal';
import { SongHistoryModal } from './components/SongHistoryModal';
import { SubmitStationModal } from './components/SubmitStationModal';
import { MusicSubmissionModal } from './components/MusicSubmissionModal';
import { ClaimOwnershipModal } from './components/ClaimOwnershipModal';
import { EditStationModal } from './components/EditStationModal';
import { TippingModal } from './components/TippingModal';
import { GenreSpotlightModal } from './components/GenreSpotlightModal';
import { ToastContainer } from './components/Toast';

import { stations as initialStations, THEMES, ACHIEVEMENTS } from './constants';
import { getUserData, updateUserData, createUserData } from './services/apiService';
import type { User, Station, UserData, ActiveView, NowPlaying, ListeningStats, ThemeName, ToastData, Theme, SongVote, StationReview, Alarm, MusicSubmission } from './types';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  
  const [activeView, setActiveView] = useState<ActiveView>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [activeTheme, setActiveTheme] = useState<ThemeName>('dynamic');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isImmersive, setIsImmersive] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isSongChartModalOpen, setIsSongChartModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isTippingModalOpen, setIsTippingModalOpen] = useState(false);
  const [isMusicSubmissionModalOpen, setIsMusicSubmissionModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isEditStationModalOpen, setIsEditStationModalOpen] = useState(false);
  const [genreSpotlight, setGenreSpotlight] = useState<string | null>(null);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [submittingToStation, setSubmittingToStation] = useState<Station | null>(null);
  const [claimingStation, setClaimingStation] = useState<Station | null>(null);
  const [buyNowStation, setBuyNowStation] = useState<Station | null>(null);

  // Raid State
  const [raidStatus, setRaidStatus] = useState<'idle' | 'voting'>('idle');
  const [raidTarget, setRaidTarget] = useState<Station | null>(null);

  // Listening Stats Timer
  const listeningTimerRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  // --- Initialization ---
  useEffect(() => {
    // Restore theme from local storage if available, otherwise default
    const savedTheme = localStorage.getItem('activeTheme') as ThemeName;
    if (savedTheme && THEMES.find(t => t.name === savedTheme)) {
        setActiveTheme(savedTheme);
        document.body.className = `theme-${savedTheme}`;
    }
  }, []);

  useEffect(() => {
      document.body.className = `theme-${activeTheme}`;
      localStorage.setItem('activeTheme', activeTheme);
  }, [activeTheme]);

  // --- User Management ---
  const handleLogin = async (username: string, role: UserData['role']) => {
      let data = await getUserData(username);
      if (!data) {
          data = await createUserData(username, role);
      }
      
      setCurrentUser({ username, role: data.role });
      setUserData(data);
      
      // Merge user stations/favorites if needed
      // For now, just ensure stats and unlocks are loaded
      if (data.activeTheme) setActiveTheme(data.activeTheme);
      
      setIsLoginOpen(false);
      addToast({ id: Date.now(), title: `Welcome, ${username}!`, type: 'login', icon: () => <span>👋</span> });
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setUserData(null);
      setActiveView('explore');
      addToast({ id: Date.now(), title: 'Logged out', message: 'See you next time!', icon: () => <span>👋</span> });
  };

  const addToast = (toast: ToastData) => {
      setToasts(prev => [...prev, toast]);
  };

  // --- Station Logic ---
  const handleStationSelect = (station: Station) => {
      if (currentStation?.streamUrl === station.streamUrl) return;
      
      setCurrentStation(station);
      setNowPlaying(null); // Reset now playing until fetched
      
      // Update Stats logic
      if (currentUser && userData) {
          const now = Date.now();
          const today = new Date().toISOString().split('T')[0];
          
          setUserData(prevData => {
              if(!prevData) return null;
              
              const prevStats = prevData.stats;
              const prevPlayData = prevStats.stationPlays[station.streamUrl] || { name: station.name, genre: station.genre, time: 0 };
              
              // Calculate streak
              let currentStreak = prevStats.currentStreak || 0;
              if (prevStats.lastListenDate !== today) {
                  const lastDate = new Date(prevStats.lastListenDate || 0);
                  const yesterdaysDate = new Date();
                  yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
                  
                  if (lastDate.toDateString() === yesterdaysDate.toDateString()) {
                      currentStreak += 1;
                  } else {
                      currentStreak = 1; // Reset or start new
                  }
              }

              const genresPlayed = new Set<string>(prevStats.genresPlayed || []);
              genresPlayed.add(station.genre.split('/')[0].trim());

              const newStats: ListeningStats = {
                  ...prevStats,
                  stationPlays: {
                      ...prevStats.stationPlays,
                      [station.streamUrl]: prevPlayData
                  },
                  lastListenDate: today,
                  currentStreak: currentStreak,
                  maxStreak: Math.max(prevStats.maxStreak || 0, currentStreak),
                  genresPlayed: Array.from(genresPlayed) // Fix: Convert Set to Array explicitly
              };
              
              updateUserData(currentUser.username, { stats: newStats });
              return { ...prevData, stats: newStats };
          });
      }
  };

  const handleStationSelectByName = (stationName: string) => {
      const station = stations.find(s => s.name === stationName);
      if (station) handleStationSelect(station);
  };

  // Listening Time Accumulator
  useEffect(() => {
      if (!currentStation || !currentUser) {
          if (listeningTimerRef.current) clearInterval(listeningTimerRef.current);
          return;
      }

      listeningTimerRef.current = window.setInterval(() => {
          setUserData(prev => {
              if (!prev) return null;
              const stats = prev.stats;
              const stationUrl = currentStation.streamUrl;
              const currentStationStats = stats.stationPlays[stationUrl] || { name: currentStation.name, genre: currentStation.genre, time: 0 };
              
              const newStats = {
                  ...stats,
                  totalTime: stats.totalTime + 1,
                  stationPlays: {
                      ...stats.stationPlays,
                      [stationUrl]: { ...currentStationStats, time: currentStationStats.time + 1 }
                  },
                  points: (stats.points || 0) + 1 // 1 point per second for demo speed (usually slower)
              };
              
              // Batch updates could be better here in a real app
              // updateUserData(currentUser.username, { stats: newStats }); 
              return { ...prev, stats: newStats };
          });
      }, 1000);

      return () => {
          if (listeningTimerRef.current) clearInterval(listeningTimerRef.current);
          // Sync on unmount/change
          if (currentUser && userData) {
             updateUserData(currentUser.username, { stats: userData.stats });
          }
      };
  }, [currentStation, currentUser]);

  // --- Feature Handlers ---

  const handleUnlockTheme = (theme: Theme) => {
      if (!currentUser || !userData) return;
      if (userData.stats.points && userData.stats.points >= (theme.cost || 0)) {
          const newPoints = userData.stats.points - (theme.cost || 0);
          const newUnlocked = [...userData.unlockedThemes, theme.name];
          const newStats = { ...userData.stats, points: newPoints };
          
          updateUserData(currentUser.username, { 
              stats: newStats, 
              unlockedThemes: newUnlocked 
          });
          
          setUserData({ 
              ...userData, 
              stats: newStats, 
              unlockedThemes: newUnlocked 
          });
          
          addToast({ id: Date.now(), title: 'Theme Unlocked!', message: `You can now use ${theme.displayName}`, type: 'theme_unlocked', icon: () => <span>🎨</span> });
      } else {
           addToast({ id: Date.now(), title: 'Not enough points', type: 'error', icon: () => <span>🔒</span> });
      }
  };

  const handleSetTheme = (name: ThemeName) => {
      setActiveTheme(name);
      if (currentUser) {
          updateUserData(currentUser.username, { activeTheme: name });
      }
  };

  const handleRateStation = (stationUrl: string, rating: number) => {
      if (!currentUser || !userData) return;
      const newRatings = { ...userData.stats.stationRatings, [stationUrl]: rating };
      const newStats = { ...userData.stats, stationRatings: newRatings };
      updateUserData(currentUser.username, { stats: newStats });
      setUserData({ ...userData, stats: newStats });
  };

  const handleAddReview = (stationUrl: string, review: Omit<StationReview, 'createdAt' | 'author' | 'authorRole'>) => {
      if (!currentUser || !userData) return;
      const newReview: StationReview = {
          ...review,
          createdAt: new Date().toISOString(),
          author: currentUser.username,
          authorRole: currentUser.role
      };
      
      const currentReviews = userData.stats.stationReviews?.[stationUrl] || [];
      const newReviews = { ...userData.stats.stationReviews, [stationUrl]: [...currentReviews, newReview] };
      const newStats = { ...userData.stats, stationReviews: newReviews };
      
      updateUserData(currentUser.username, { stats: newStats });
      setUserData({ ...userData, stats: newStats });
      addToast({ id: Date.now(), title: 'Review Posted', icon: () => <span>✍️</span> });
  };
  
  const handleSongVote = (songId: string, voteType: 'like' | 'dislike') => {
      if (!currentUser || !userData) return;
      
      // Update user specific vote
      const newSongUserVotes = { ...userData.stats.songUserVotes, [songId]: voteType };
      const newStats = { ...userData.stats, songUserVotes: newSongUserVotes };
      updateUserData(currentUser.username, { stats: newStats });
      setUserData({ ...userData, stats: newStats });

      // In a real app, we'd update a global song vote counter here too
      // For now, we assume the 'songVotes' in types are global and managed elsewhere or mocked
      addToast({ id: Date.now(), title: voteType === 'like' ? 'Liked!' : 'Disliked', icon: () => <span>{voteType === 'like' ? '👍' : '👎'}</span> });
  };

  const handleToggleFavorite = (station: Station) => {
      if (!currentUser || !userData) {
           setIsLoginOpen(true);
           return;
      }
      // Toggle logic would be checking userData.favoriteStationUrls and updating
      // Simulating local update for UI
      const isFav = userData.favoriteStationUrls.includes(station.streamUrl);
      let newFavs;
      if (isFav) {
          newFavs = userData.favoriteStationUrls.filter(url => url !== station.streamUrl);
      } else {
          newFavs = [...userData.favoriteStationUrls, station.streamUrl];
          addToast({ id: Date.now(), title: 'Added to Favorites', icon: () => <span>❤️</span> });
      }
      updateUserData(currentUser.username, { favoriteStationUrls: newFavs });
      setUserData({ ...userData, favoriteStationUrls: newFavs });
  };

  const handleStartRaid = (target: Station) => {
      setRaidTarget(target);
      setRaidStatus('voting');
      addToast({ id: Date.now(), title: 'Raid Started!', message: `Raid on ${target.name} initiating...`, type: 'raid', icon: () => <span>🚀</span> });
      
      setTimeout(() => {
          handleStationSelect(target);
          setRaidStatus('idle');
          setRaidTarget(null);
      }, 5000);
  };

  const handleAdminAction = {
      approveClaim: (station: Station, claimant: string) => {
          // Logic to transfer ownership
          const updatedStations = stations.map(s => s.streamUrl === station.streamUrl ? { ...s, owner: claimant, claimRequest: undefined } : s);
          setStations(updatedStations);
          addToast({ id: Date.now(), title: 'Claim Approved', message: `${claimant} is now the owner.`, icon: () => <span>✅</span> });
      },
      denyClaim: (station: Station) => {
          const updatedStations = stations.map(s => s.streamUrl === station.streamUrl ? { ...s, claimRequest: undefined } : s);
          setStations(updatedStations);
           addToast({ id: Date.now(), title: 'Claim Denied', icon: () => <span>🚫</span> });
      },
      updateRole: (username: string, role: UserData['role']) => {
          updateUserData(username, { role });
          addToast({ id: Date.now(), title: 'Role Updated', message: `${username} is now a ${role}.`, icon: () => <span>👤</span> });
      }
  }
  
  const handleManagerAction = {
      reviewSubmission: (stationStreamUrl: string, subId: string, status: 'approved' | 'rejected', comment?: string) => {
          // Find station and update submission
          const updatedStations = stations.map(s => {
              if (s.streamUrl === stationStreamUrl) {
                  const updatedSubs = (s.submissions || []).map(sub => 
                      sub.id === subId 
                      ? { ...sub, status, managerComment: comment, reviewedAt: new Date().toISOString() } 
                      : sub
                  );
                  return { ...s, submissions: updatedSubs };
              }
              return s;
          });
          setStations(updatedStations);
           addToast({ id: Date.now(), title: `Submission ${status}`, icon: () => <span>📝</span> });
      },
      editStation: (station: Station) => {
          setEditingStation(station);
          setIsEditStationModalOpen(true);
      }
  }
  
  const handleArtistAction = {
      submitMusic: (stationUrl: string, subData: any) => {
          if (!currentUser || !userData) return;
          
          const cost = 50; 
          const newPoints = (userData.stats.points || 0) - cost;
          updateUserData(currentUser.username, { stats: { ...userData.stats, points: newPoints } });
          setUserData({ ...userData, stats: { ...userData.stats, points: newPoints } });

          const updatedStations = stations.map(s => {
              if (s.streamUrl === stationUrl) {
                  const newSub: MusicSubmission = {
                      id: Date.now().toString(),
                      ...subData,
                      submittedAt: new Date().toISOString(),
                      submittedBy: currentUser.username,
                      stationStreamUrl: stationUrl,
                      stationName: s.name,
                      status: 'pending'
                  };
                  return { ...s, submissions: [...(s.submissions || []), newSub] };
              }
              return s;
          });
          setStations(updatedStations);
          setIsMusicSubmissionModalOpen(false);
          addToast({ id: Date.now(), title: 'Music Submitted!', icon: () => <span>🎵</span> });
      }
  }

  const handleSubmitStation = (newStationData: any) => {
      // In a real app, this would go to admin for approval
      const newStation: Station = {
          ...newStationData,
          rating: 0,
          ratingsCount: 0,
          location: { lat: 0, lng: 0 }, // Default or geocoded
          submissions: []
      };
      setStations(prev => [...prev, newStation]);
      setIsSubmitModalOpen(false);
      addToast({ id: Date.now(), title: 'Station Submitted', message: 'Thanks for the suggestion!', icon: () => <span>📡</span> });
  };

  const handleEditStationSubmit = (updatedStation: Station) => {
      setStations(prev => prev.map(s => s.streamUrl === updatedStation.streamUrl ? updatedStation : s));
      setIsEditStationModalOpen(false);
      addToast({ id: Date.now(), title: 'Station Updated', icon: () => <span>💾</span> });
  };

  const handleClaimSubmit = (station: Station, reason: string) => {
      if (!currentUser) return;
      const updatedStations = stations.map(s => s.streamUrl === station.streamUrl ? { 
          ...s, 
          claimRequest: { username: currentUser.username, reason, submittedAt: new Date().toISOString() } 
      } : s);
      setStations(updatedStations);
      setIsClaimModalOpen(false);
      addToast({ id: Date.now(), title: 'Claim Submitted', message: 'Admins will review your request.', icon: () => <span>🛡️</span> });
  };


  // Derived State
  const favoriteStations = React.useMemo(() => {
      if (!userData) return [];
      return stations.filter(s => userData.favoriteStationUrls.includes(s.streamUrl));
  }, [stations, userData]);

  const stationWithFavorites = React.useMemo(() => {
      return stations.map(s => ({
          ...s,
          isFavorite: userData?.favoriteStationUrls.includes(s.streamUrl)
      }));
  }, [stations, userData]);

  // --- Rendering ---

  if (!hasEntered) {
      return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-950 text-white font-poppins transition-colors duration-500 theme-${activeTheme}`}>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent-color)]/10 via-gray-950/50 to-gray-950 pointer-events-none z-0"></div>
      
      <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          points={userData?.stats.points || 0} 
          onGoToHome={() => setActiveView(currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'owner' ? 'station_manager_dashboard' : currentUser?.role === 'artist' ? 'artist_dashboard' : 'dashboard')} 
          isVisible={isHeaderVisible}
      />

      <div className={`flex flex-1 overflow-hidden pt-16 transition-all duration-300 ${isImmersive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onOpenAlarm={() => setIsAlarmModalOpen(true)}
            onOpenSongChart={() => setIsSongChartModalOpen(true)}
            onOpenEvents={() => setIsEventsModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            currentUser={currentUser}
        />

        <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
            {activeView === 'explore' && (
                <StationList 
                    stations={stationWithFavorites} 
                    allStations={stationWithFavorites}
                    currentStation={currentStation}
                    onSelectStation={handleStationSelect}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                    onToggleFavorite={handleToggleFavorite}
                    songVotes={{}} // Global votes needed here
                    onOpenGenreSpotlight={setGenreSpotlight}
                    onShowDetails={(s) => { 
                        if(window.innerWidth < 1024) { /* Mobile handling could go here */ } 
                        else { setShowRightPanel(true); } 
                    }}
                    onPlayFromCommunity={(id) => console.log("Play from community", id)}
                    currentUser={currentUser}
                />
            )}
            {activeView === 'dashboard' && (
                <DashboardView 
                    user={currentUser} 
                    stats={userData?.stats || { totalTime: 0, stationPlays: {}, genresPlayed: [], points: 0, stationRatings: {}, songHistory: [] }} 
                    favoritesCount={userData?.favoriteStationUrls.length || 0}
                    unlockedAchievements={userData?.unlockedAchievements || {}}
                />
            )}
            {activeView === 'store' && (
                <StoreView 
                    activeTheme={activeTheme} 
                    onSetTheme={handleSetTheme} 
                    unlockedThemes={new Set(userData?.unlockedThemes || ['dynamic'])}
                    onUnlockTheme={handleUnlockTheme}
                    currentPoints={userData?.stats.points || 0}
                />
            )}
            {activeView === 'leaderboard' && (
                <LeaderboardView currentUser={currentUser} userPoints={userData?.stats.points || 0} />
            )}
            {activeView === 'admin' && currentUser?.role === 'admin' && (
                <AdminDashboardView 
                    stations={stations} 
                    onApproveClaim={handleAdminAction.approveClaim} 
                    onDenyClaim={handleAdminAction.denyClaim} 
                    onUpdateUserRole={handleAdminAction.updateRole}
                    currentUser={currentUser}
                />
            )}
             {activeView === 'artist_dashboard' && currentUser?.role === 'artist' && (
                <ArtistDashboardView 
                    user={currentUser}
                    stats={userData?.stats || { totalTime: 0, stationPlays: {}, genresPlayed: [], points: 0, stationRatings: {}, songHistory: [] }} 
                    submissions={stations.flatMap(s => s.submissions || [])} // Filter in component
                    setActiveView={setActiveView}
                />
            )}
            {activeView === 'station_manager_dashboard' && currentUser?.role === 'owner' && (
                <StationManagerDashboardView 
                     user={currentUser}
                     allStations={stations}
                     onReviewSubmission={handleManagerAction.reviewSubmission}
                     onEditStation={handleManagerAction.editStation}
                />
            )}
            {activeView === 'genre_chat' && (
                <GenreChatView 
                    allStations={stations} 
                    onSelectStation={handleStationSelect} 
                    currentStation={currentStation} 
                    nowPlaying={nowPlaying} 
                />
            )}
        </main>

        <RightPanel 
             station={currentStation}
             currentStation={currentStation}
             allStations={stations}
             currentUser={currentUser}
             stats={userData?.stats || { totalTime: 0, stationPlays: {}, genresPlayed: [], points: 0, stationRatings: {}, songHistory: [] }}
             onAddReview={handleAddReview}
             onSelectStation={handleStationSelect}
             onRateStation={handleRateStation}
             onEdit={handleManagerAction.editStation}
             onOpenMusicSubmissionModal={(s) => { setSubmittingToStation(s); setIsMusicSubmissionModalOpen(true); }}
             onOpenClaimModal={(s) => { setClaimingStation(s); setIsClaimModalOpen(true); }}
             nowPlaying={nowPlaying}
        />
      </div>

      {currentStation && (
          <RadioPlayer 
              station={currentStation} 
              allStations={stations}
              onNowPlayingUpdate={setNowPlaying}
              onNextStation={() => { /* Logic to find next station */ }}
              onPreviousStation={() => { /* Logic to find prev station */ }}
              isImmersive={isImmersive}
              onToggleImmersive={() => setIsImmersive(!isImmersive)}
              songVotes={{}}
              onVote={handleSongVote}
              onRateStation={handleRateStation}
              userRating={userData?.stats.stationRatings?.[currentStation.streamUrl] || 0}
              onOpenTippingModal={() => setIsTippingModalOpen(true)}
              onSelectStation={handleStationSelect}
              userSongVotes={userData?.stats.songUserVotes}
              onToggleChat={() => setActiveView('genre_chat')}
              onStartRaid={handleStartRaid}
              raidStatus={raidStatus}
              raidTarget={raidTarget}
              onHidePlayer={() => { /* Hide player logic */ }}
              isVisible={true}
              onOpenBuyNow={() => { /* Buy now logic - set modal */ }}
              isHeaderVisible={isHeaderVisible}
              onToggleHeader={() => setIsHeaderVisible(!isHeaderVisible)}
          />
      )}

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onLogin={handleLogin} />
      <EventsModal 
        isOpen={isEventsModalOpen} 
        onClose={() => setIsEventsModalOpen(false)} 
        stations={stations} 
        currentStation={currentStation}
        onSelectStation={handleStationSelectByName}
      />
      <StatsModal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} stats={userData?.stats || { totalTime: 0, stationPlays: {}, genresPlayed: [], points: 0, stationRatings: {}, songHistory: [] }} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={() => setIsAlarmModalOpen(false)} alarm={userData?.alarm || null} onSetAlarm={(alarm) => setUserData(userData ? { ...userData, alarm } : null)} favoriteStations={favoriteStations} />
      <AchievementsModal isOpen={isAchievementsModalOpen} onClose={() => setIsAchievementsModalOpen(false)} unlockedAchievements={userData?.unlockedAchievements || {}} />
      <SongChartModal isOpen={isSongChartModalOpen} onClose={() => setIsSongChartModalOpen(false)} songVotes={{}} />
      <SongHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={userData?.stats.songHistory || []} />
      <SubmitStationModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} onSubmit={handleSubmitStation} />
      <MusicSubmissionModal isOpen={isMusicSubmissionModalOpen} onClose={() => setIsMusicSubmissionModalOpen(false)} onSubmit={handleArtistAction.submitMusic} station={submittingToStation} userPoints={userData?.stats.points || 0} />
      <ClaimOwnershipModal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} onSubmit={handleClaimSubmit} station={claimingStation} />
      <EditStationModal isOpen={isEditStationModalOpen} onClose={() => setIsEditStationModalOpen(false)} onSubmit={handleEditStationSubmit} station={editingStation} />
      <TippingModal isOpen={isTippingModalOpen} onClose={() => setIsTippingModalOpen(false)} station={currentStation} />
      <GenreSpotlightModal isOpen={!!genreSpotlight} onClose={() => setGenreSpotlight(null)} genre={genreSpotlight} />
      
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      
      {!currentUser && !isLoginOpen && hasEntered && (
          <button onClick={() => setIsLoginOpen(true)} className="fixed bottom-24 left-4 z-50 bg-[var(--accent-color)] text-black font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-transform animate-bounce">
              Login to Save Progress
          </button>
      )}
    </div>
  );
}
