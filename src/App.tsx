import React, { useState, useEffect } from 'react';
import { View, GameState, CharacterProfile, StarProfile } from './types';
import { getRandomStarFallback } from './services/aiService';
import { Navbar } from './components/Navbar';
import { Ticker } from './components/Ticker';
import { CharacterCard } from './components/CharacterCard';
import { CharacterCustomizer } from './components/CharacterCustomizer';
import { StudioView } from './components/StudioView';
import { DonationView } from './components/DonationView';
import { XHomeLanding } from './components/XHomeLanding';
import { XFeedView } from './components/XFeedView';
import { 
  Tv, PlusCircle, Bot, Signal, DollarSign, CheckCircle2, 
  Play, Sparkles, ShieldCheck, Briefcase, Zap, User, Users 
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    const isLoggedIn = localStorage.getItem('myTVStar_isLoggedIn') === 'true';
    return isLoggedIn ? 'roster' : 'home';
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('myTVStar_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.roster && parsed.roster.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing saved state:", e);
      }
    }

    // Default initial roster with iconic 1990s/2000s Cartoon Network inspired stars
    const star1: CharacterProfile = {
      id: 'star-1',
      profile: {
        name: 'Johnny Bravo',
        stageTitle: 'The Bravo Icon',
        bio: 'The legendary smooth-talking, hair-combing superstar of Prime Time Cartoon Network.',
        appearance: {
          gender: 'Male',
          avatarStyle: 'Johnny Bravo Glamour',
          hairStyle: 'Johnny Bravo Towering Pompadour',
          hairColor: 'Johnny Golden Blonde',
          skinTone: 'Townsville Peach',
          eyeColor: 'Johnny Black Shades Dots',
          expression: 'Johnny Bravo Cool Smirk',
          makeupFacialHair: 'Johnny Bravo Stubble',
          height: 'Johnny Bravo Muscle (6\'2")'
        },
        outfit: {
          outfit: 'Johnny Bravo Black Tee & Jeans',
          outfitColor: 'Johnny Black & Blue',
          eyewear: 'Johnny Bravo Cool Sunglasses',
          headwear: 'None',
          prop: 'Golden Microphone',
          badge: 'Cartoon Network Legend'
        },
        skills: {
          charisma: 98,
          humor: 92,
          dramatics: 75,
          intelligence: 60,
          musicality: 80,
          stunts: 90
        },
        contract: {
          preferredGenre: 'Johnny Bravo Romance Hotline',
          personalityTrait: 'Egotistical Charm (Johnny)',
          catchphrase: 'Ooh Mama! Check out the hair!',
          signatureMove: 'The Johnny Bravo Flex & Hair Comb',
          voiceTone: 'Deep Johnny Bravo Baritone',
          fanbaseDemographic: '90s Cartoon Network Kids',
          perks: ['Custom Luxury Dressing Trailer', 'Personal Stylist & Makeup Crew'],
          baseSalaryRate: 2.2,
          stamina: 100,
          morale: 100
        }
      },
      level: 5,
      earnings: 1500.00,
      totalBroadcastMinutes: 300,
      showsHostedCount: 30,
      createdAt: Date.now() - 1000000
    };

    const star2: CharacterProfile = {
      id: 'star-2',
      profile: {
        name: 'Blossom Townsville',
        stageTitle: 'Leader of Townsville',
        bio: 'The fearless leader made of sugar, spice, and everything nice, plus Chemical X!',
        appearance: {
          gender: 'Female',
          avatarStyle: 'Powerpuff Heroic (Townsville)',
          hairStyle: 'Blossom Long Flame Red Ponytail',
          hairColor: 'Blossom Crimson Red',
          skinTone: 'Townsville Peach',
          eyeColor: 'Powerpuff Giant Pink Eyes',
          expression: 'Powerpuff Heroic Glare',
          makeupFacialHair: 'Townsville Hero Rosy Cheeks',
          height: 'Petite Townsville Hero (4\'8")'
        },
        outfit: {
          outfit: 'Powerpuff Heroic Dress',
          outfitColor: 'Townsville Blossom Pink',
          eyewear: 'None',
          headwear: 'Blossom Giant Red Hair Bow',
          prop: 'Chemical X Flask',
          badge: 'Townsville City Savior'
        },
        skills: {
          charisma: 95,
          humor: 82,
          dramatics: 88,
          intelligence: 98,
          musicality: 75,
          stunts: 96
        },
        contract: {
          preferredGenre: 'City of Townsville Crime Fighters',
          personalityTrait: 'Fearless Leader (Blossom)',
          catchphrase: 'And so the day is saved!',
          signatureMove: 'The Powerpuff Laser Eye Blast',
          voiceTone: 'High-Pitched Cartoon Energy',
          fanbaseDemographic: 'Townsville Citizens',
          perks: ['Unlimited Chemical X Supply', 'Treehouse Command Center'],
          baseSalaryRate: 2.5,
          stamina: 100,
          morale: 100
        }
      },
      level: 6,
      earnings: 1850.00,
      totalBroadcastMinutes: 360,
      showsHostedCount: 36,
      createdAt: Date.now() - 500000
    };

    const star3: CharacterProfile = {
      id: 'star-3',
      profile: {
        name: 'Dexter Genius',
        stageTitle: 'Master of the Lab',
        bio: 'The boy genius creator of secret laboratories, supercomputers, and high-tech gadgets.',
        appearance: {
          gender: 'Male',
          avatarStyle: 'Dexter Genius Lab',
          hairStyle: 'Dexter Flame Red Spikes',
          hairColor: 'Dexter Fire Red',
          skinTone: 'Porcelain Ivory',
          eyeColor: 'Obsidian Black',
          expression: 'Dexter Evil Genius Grin',
          makeupFacialHair: 'Dexter Lab Goggles Tan',
          height: 'Petite Townsville Hero (4\'8")'
        },
        outfit: {
          outfit: 'Dexter White Lab Coat & Purple Gloves',
          outfitColor: 'Dexter Lab White & Violet',
          eyewear: 'Dexter Thick Lab Glasses',
          headwear: 'None',
          prop: 'Golden Lab Beaker',
          badge: 'Genius Lab Inventor'
        },
        skills: {
          charisma: 88,
          humor: 85,
          dramatics: 90,
          intelligence: 100,
          musicality: 70,
          stunts: 60
        },
        contract: {
          preferredGenre: 'Dexter Genius Lab Inventions',
          personalityTrait: 'Evil Genius (Dexter)',
          catchphrase: 'Dee Dee! Get out of my laboratory!',
          signatureMove: 'The Dexter Dramatic Lab Laugh',
          voiceTone: 'High-Pitched Cartoon Energy',
          fanbaseDemographic: 'Saturday Morning Toon Lovers',
          perks: ['Private Lab & Supercomputer', 'Gold Room Gourmet Catering'],
          baseSalaryRate: 2.3,
          stamina: 100,
          morale: 100
        }
      },
      level: 4,
      earnings: 1100.00,
      totalBroadcastMinutes: 200,
      showsHostedCount: 20,
      createdAt: Date.now() - 200000
    };

    return {
      language: 'en',
      money: 150.00,
      roster: [star1, star2, star3],
      currentProducer: 'ID-' + Math.floor(Math.random() * 9000 + 1000),
      theme: 'light',
      parentalControlUnder18: true
    };
  });

  const [activeStar, setActiveStar] = useState<CharacterProfile | null>(null);
  const [editingStar, setEditingStar] = useState<CharacterProfile | null>(null);
  const [isCreatingNewStar, setIsCreatingNewStar] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showPayoutToast, setShowPayoutToast] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');

  // Persist state
  useEffect(() => {
    localStorage.setItem('myTVStar_state', JSON.stringify(gameState));
  }, [gameState]);

  // Session reward payout timer (Every 600s = 10 mins = $5.00)
  useEffect(() => {
    let interval: number;
    if (currentView === 'studio' && activeStar) {
      interval = window.setInterval(() => {
        setSessionTime(prev => {
          const next = prev + 1;
          if (next % 600 === 0) {
            const reward = 5.00 * (activeStar.profile.contract.baseSalaryRate || 1);
            setGameState(gs => ({
              ...gs,
              money: gs.money + reward,
              roster: gs.roster.map(star => star.id === activeStar.id ? {
                ...star,
                earnings: star.earnings + reward,
                totalBroadcastMinutes: star.totalBroadcastMinutes + 10
              } : star)
            }));
            setPayoutMessage(`SESSION REWARD COLLECTED: $${reward.toFixed(2)}`);
            setShowPayoutToast(true);
            setTimeout(() => setShowPayoutToast(false), 4000);
          }
          return next;
        });
      }, 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [currentView, activeStar]);

  const isDark = gameState.theme === 'dark';
  const themeStyle = {
    bg: isDark ? 'bg-black' : 'bg-white',
    text: isDark ? 'text-white' : 'text-black',
    border: isDark ? 'border-white' : 'border-black',
    accent: isDark ? 'bg-white text-black' : 'bg-black text-white'
  };

  // Launch Star Customizer workshop for a brand new star
  const handleOpenNewStarCustomizer = () => {
    const randomStar = getRandomStarFallback();
    const newStarProfile: CharacterProfile = {
      id: Math.random().toString(36).substring(2, 11),
      profile: randomStar,
      level: 1,
      earnings: 0,
      totalBroadcastMinutes: 0,
      showsHostedCount: 0,
      createdAt: Date.now()
    };
    setEditingStar(newStarProfile);
    setIsCreatingNewStar(true);
    setCurrentView('customizer');
  };

  // Launch Star Customizer workshop for editing an existing star
  const handleEditStar = (star: CharacterProfile) => {
    setEditingStar(star);
    setIsCreatingNewStar(false);
    setCurrentView('customizer');
  };

  // Save customized star back to roster
  const handleSaveCustomizedStar = (updatedProfile: StarProfile) => {
    if (!editingStar) return;

    setGameState(prev => {
      const exists = prev.roster.some(s => s.id === editingStar.id);
      if (exists) {
        return {
          ...prev,
          roster: prev.roster.map(s => s.id === editingStar.id ? { ...s, profile: updatedProfile } : s)
        };
      } else {
        const newStar: CharacterProfile = {
          ...editingStar,
          profile: updatedProfile
        };
        return {
          ...prev,
          roster: [newStar, ...prev.roster]
        };
      }
    });

    setEditingStar(null);
    setIsCreatingNewStar(false);
    setCurrentView('roster');
  };

  // Update star in place during live stream or quick edits
  const handleUpdateCharacterInPlace = (updatedCharacter: CharacterProfile) => {
    setGameState(prev => ({
      ...prev,
      roster: prev.roster.map(s => s.id === updatedCharacter.id ? updatedCharacter : s)
    }));
    if (activeStar?.id === updatedCharacter.id) {
      setActiveStar(updatedCharacter);
    }
  };

  // Route 1: Home View (X Landing Page)
  if (currentView === 'home') {
    return (
      <XHomeLanding 
        themeStyle={themeStyle}
        onEnterRoster={() => {
          localStorage.setItem('myTVStar_isLoggedIn', 'true');
          setCurrentView('roster');
        }}
        onOpenNewStarCustomizer={handleOpenNewStarCustomizer}
        onLoginProducer={() => setCurrentView('login')}
        gameState={gameState}
      />
    );
  }

  // Route 2: Character Customizer Workshop View
  if (currentView === 'customizer' && editingStar) {
    return (
      <div className={`min-h-screen ${themeStyle.bg}`}>
        <CharacterCustomizer 
          initialProfile={editingStar.profile}
          onSave={handleSaveCustomizedStar}
          onCancel={() => {
            setEditingStar(null);
            setIsCreatingNewStar(false);
            setCurrentView('roster');
          }}
          isNewStar={isCreatingNewStar}
          themeStyle={themeStyle}
          parentalControlMode={gameState.parentalControlUnder18}
        />
      </div>
    );
  }

  // Route 3: Live TV Studio View
  if (currentView === 'studio' && activeStar) {
    return (
      <StudioView 
        character={activeStar}
        sessionTime={sessionTime}
        onEndStream={() => setCurrentView('roster')}
        onUpdateCharacter={handleUpdateCharacterInPlace}
        parentalControlMode={gameState.parentalControlUnder18}
      />
    );
  }

  // Route 4: Donation / Support View
  if (currentView === 'donation') {
    return (
      <div className={`min-h-screen ${themeStyle.bg}`}>
        <Ticker borderStyle={themeStyle.border} />
        <Navbar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          gameState={gameState}
          setGameState={setGameState}
          themeStyle={themeStyle}
          onOpenNewStarCustomizer={handleOpenNewStarCustomizer}
        />
        <DonationView 
          onReturnHome={() => setCurrentView('roster')}
          themeStyle={themeStyle}
          producerId={gameState.currentProducer}
        />
      </div>
    );
  }

  // Route 5: Producer Login View
  if (currentView === 'login') {
    return (
      <div className={`min-h-screen ${themeStyle.bg} ${themeStyle.text} flex flex-col font-mono`}>
        <Navbar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          gameState={gameState}
          setGameState={setGameState}
          themeStyle={themeStyle}
          onOpenNewStarCustomizer={handleOpenNewStarCustomizer}
        />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className={`${themeStyle.bg} border-8 ${themeStyle.border} p-12 lg:p-16 max-w-xl w-full flex flex-col gap-8 animate-in fade-in duration-300`}>
            <div className="border-b-4 border-current pb-6 space-y-2">
              <h2 className="font-bebas text-6xl tracking-tighter uppercase leading-none">PRODUCER LOGIN</h2>
              <span className="text-xs font-bold tracking-widest uppercase opacity-50 block">GLOBAL TERMINAL AUTHENTICATION</span>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest block opacity-60">PRODUCER UID IDENTIFIER</label>
              <input 
                value={gameState.currentProducer}
                onChange={(e) => setGameState(p => ({ ...p, currentProducer: e.target.value }))}
                className={`w-full p-6 text-4xl font-bebas border-4 ${themeStyle.border} bg-zinc-100 dark:bg-zinc-800 outline-none focus:border-[#FF0080]`}
              />
            </div>

            <button 
              onClick={() => {
                localStorage.setItem('myTVStar_isLoggedIn', 'true');
                setCurrentView('roster');
              }}
              className={`w-full py-8 font-bebas text-5xl border-4 ${themeStyle.border} ${themeStyle.accent} hover:bg-[#FF0080] hover:text-white transition-all`}
            >
              ACCESS TALENT HUB
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Route 6: Roster / Talent Hub View (X Feed Layout)
  return (
    <>
      <XFeedView 
        gameState={gameState}
        setGameState={setGameState}
        themeStyle={themeStyle}
        onOpenNewStarCustomizer={handleOpenNewStarCustomizer}
        onEditStar={handleEditStar}
        onSelectActiveStar={(star) => setActiveStar(star)}
        onNavigateView={(view) => setCurrentView(view)}
      />

      {/* Global Toast Payout Popup */}
      {showPayoutToast && (
        <div className="fixed bottom-8 right-8 z-[300] bg-[#00FF7F] border-4 border-black p-6 font-bebas text-4xl text-black flex items-center gap-6 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-10 h-10 shrink-0" />
          <div>
            <div className="leading-none">{payoutMessage}</div>
            <span className="text-xs font-mono font-bold tracking-widest mt-1 block uppercase opacity-70">10-Minute Gameplay Payout Credited</span>
          </div>
        </div>
      )}
    </>
  );
};
