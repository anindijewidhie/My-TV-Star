import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Tv, 
  PlusCircle, 
  Bot, 
  Signal,
  DollarSign,
  Sun,
  Moon,
  CheckCircle2,
  Activity,
  Smartphone,
  Gamepad2,
  Cpu,
  Trophy,
  Heart,
  Coins,
  QrCode,
  CreditCard,
  SmartphoneNfc,
  Cast,
  Star,
  BarChart4,
  Hash,
  X,
  MousePointer2,
  ShieldCheck,
  Building2,
  Briefcase,
  ChevronRight,
  Globe,
  Loader2,
  Sparkles,
  Zap,
  Play,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRANSLATIONS: Record<string, any> = {
  en: { 
    appTitle: "MY TV STAR", 
    tagline: "ULTIMATE BROADCAST SIMULATION", 
    startSim: "START SIMULATION", 
    login: "LOGIN", 
    enterHub: "ENTER HUB",
    identitySync: "IDENTITY SYNC", 
    enterTerminal: "PRODUCER LOGIN", 
    talentHub: "TALENT HUB", 
    signTalent: "NEW CONTRACT", 
    rewardTitle: "REWARD ENGINE",
    rewardDesc: "Earn $5.00 every 10 minutes of network uptime. Your talent, your empire.",
    donationPageTitle: "NETWORK SUPPORT",
    supportTagline: "FUEL THE EMPIRE",
    supportDesc: "Direct contributions scale our global broadcast node infrastructure. We support all currencies including corporate funding.",
    paymentTerminal: "PAYMENT GATEWAY",
    scanQr: "SCAN UNIVERSAL QR",
    universalSupport: "SUPPORTS ALL BANKS & WALLETS",
    allCurrencies: "MULTI-CURRENCY ENABLED",
    wallets: "GOPAY / OVO / SHOPEEPAY / DANA",
    corporateTitle: "CORPORATE PARTNERS",
    corporateDesc: "Scalable infrastructure support for big companies and organizations to fund global broadcast nodes."
  },
};

type View = 'home' | 'login' | 'roster' | 'donation' | 'studio';

interface StarAppearance {
  name: string;
  role: string;
  style: string;
  description: string;
}

interface CharacterProfile {
  id: string;
  profile: StarAppearance;
  level: number;
  earnings: number;
}

interface GameState {
  language: string; 
  money: number; 
  roster: CharacterProfile[]; 
  currentProducer: string; 
  theme: 'dark' | 'light';
}

const MyTVStar = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    const isLoggedIn = localStorage.getItem('myTVStar_isLoggedIn') === 'true';
    return isLoggedIn ? 'roster' : 'home';
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('myTVStar_state');
    if (!saved) return {
      language: 'en', money: 0, roster: [], currentProducer: 'ID-' + Math.floor(Math.random() * 9000 + 1000), 
      theme: 'light'
    };
    return JSON.parse(saved);
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStar, setActiveStar] = useState<CharacterProfile | null>(null);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPayoutToast, setShowPayoutToast] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');

  // Simulation timer for reward
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    localStorage.setItem('myTVStar_state', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    let interval: number;
    if (currentView === 'studio' && activeStar) {
      interval = window.setInterval(() => {
        setSessionTime(prev => {
          const next = prev + 1;
          // Every 10 minutes (600 seconds), payout $5
          if (next % 600 === 0) {
            setGameState(gs => ({ ...gs, money: gs.money + 5 }));
            setPayoutMessage("SESSION REWARD COLLECTED: $5.00");
            setShowPayoutToast(true);
            setTimeout(() => setShowPayoutToast(false), 3000);
          }
          return next;
        });
      }, 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [currentView, activeStar]);

  const t = (key: string) => TRANSLATIONS[gameState.language]?.[key] || TRANSLATIONS['en'][key] || key;
  const isDark = gameState.theme === 'dark';

  const ThemeStyles = {
    bg: isDark ? 'bg-black' : 'bg-white',
    text: isDark ? 'text-white' : 'text-black',
    border: isDark ? 'border-white' : 'border-black',
    accent: isDark ? 'bg-white text-black' : 'bg-black text-white',
    muted: isDark ? 'text-white/40' : 'text-black/40',
    surface: isDark ? 'bg-zinc-900' : 'bg-zinc-50'
  };

  const generateTalent = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate a unique TV host or performer profile for a simulation game. Include Name, Role (e.g. News Anchor, Idol, Magician, Chef), Style, and a short Description.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              style: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["name", "role", "style", "description"]
          }
        }
      });
      
      const talent = JSON.parse(response.text);
      const newStar: CharacterProfile = {
        id: Math.random().toString(36).substr(2, 9),
        profile: talent,
        level: 1,
        earnings: 0
      };

      setGameState(prev => ({
        ...prev,
        roster: [...prev.roster, newStar]
      }));
    } catch (error) {
      console.error("Talent generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const Ticker = () => (
    <div className={`h-12 border-b-2 flex items-center overflow-hidden z-[60] bg-black text-white ${ThemeStyles.border}`} role="status">
      <div className="whitespace-nowrap flex items-center gap-20 animate-marquee">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
            // {t('appTitle')} // $5.00 REWARDS ACTIVE // ALL CURRENCIES // CORPORATE FUNDING ENABLED //
          </span>
        ))}
      </div>
    </div>
  );

  const Nav = () => (
    <nav className={`h-20 border-b-2 flex items-center justify-between px-10 sticky top-0 z-[100] ${ThemeStyles.bg} ${ThemeStyles.border}`}>
      <div className="flex items-center gap-6 cursor-pointer" onClick={() => setCurrentView('home')}>
        <div className="bg-black border-2 border-white w-10 h-10 flex items-center justify-center">
          <Tv className="w-6 h-6 text-white" />
        </div>
        <span className="font-bebas text-4xl tracking-tighter">{t('appTitle')}</span>
      </div>
      <div className="flex items-center gap-8">
        <button onClick={() => setGameState(p => ({...p, theme: p.theme === 'dark' ? 'light' : 'dark'}))} className="p-2 transition-transform hover:rotate-12">
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <button onClick={() => setCurrentView('donation')} className="font-bebas text-xl uppercase tracking-widest hover:text-[#FF0080]">Support</button>
        {(gameState.roster.length > 0 || localStorage.getItem('myTVStar_isLoggedIn') === 'true') ? (
          <button onClick={() => setCurrentView('roster')} className={`px-8 py-2 font-bebas text-2xl border-2 ${ThemeStyles.border} ${ThemeStyles.accent}`}>Hub</button>
        ) : (
          <button onClick={() => setCurrentView('login')} className={`px-8 py-2 font-bebas text-2xl border-2 ${ThemeStyles.border} ${ThemeStyles.accent}`}>{t('login')}</button>
        )}
      </div>
    </nav>
  );

  if (currentView === 'home') {
    return (
      <div className={`min-h-screen ${ThemeStyles.bg} ${ThemeStyles.text} flex flex-col font-mono`}>
        <Ticker />
        <Nav />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-10">
          <div className="text-center max-w-6xl w-full">
            <span className="font-mono text-xs font-bold tracking-[0.5em] opacity-40 mb-6 block uppercase">{t('tagline')}</span>
            <h1 className="font-bebas text-[14rem] leading-[0.8] tracking-tighter mb-16 select-none animate-in zoom-in-95 duration-500">
              MY TV <span className="text-[#FF0080]">STAR</span>
            </h1>
            <div className="flex flex-col items-center gap-12 mb-24">
              <button 
                onClick={() => {
                  localStorage.setItem('myTVStar_isLoggedIn', 'true');
                  setCurrentView('roster');
                }}
                className={`px-20 py-8 text-7xl font-bebas border-4 ${ThemeStyles.border} ${ThemeStyles.accent} hover:scale-105 transition-all`}
              >
                {t('startSim')}
              </button>
              <div className="flex items-center gap-4 text-xs font-bold opacity-40 tracking-widest uppercase">
                <Signal className="w-5 h-5 animate-pulse text-[#00FF7F]" /> SYSTEM OPERATIONAL // NODE ACTIVE
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'donation') {
    const tiers = [
      { amount: "1 USD", icon: Zap },
      { amount: "2 USD", icon: Coins },
      { amount: "5 USD", icon: Activity },
      { amount: "10 USD", icon: Signal },
      { amount: "20 USD", icon: ShieldCheck },
      { amount: "50 USD", icon: Trophy },
      { amount: "100 USD", icon: Star }
    ];

    return (
      <div className={`min-h-screen ${ThemeStyles.bg} ${ThemeStyles.text} flex flex-col font-mono`}>
        <Ticker />
        <Nav />
        <main className="max-w-6xl mx-auto w-full p-10 pt-20">
          <section className="mb-24 text-center">
            <h1 className="font-bebas text-9xl tracking-tighter mb-4 leading-none uppercase">Network Support</h1>
            <p className="text-xs font-bold tracking-widest uppercase opacity-40 max-w-2xl mx-auto">{t('supportDesc')}</p>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {tiers.map((tier, idx) => (
              <button key={idx} onClick={() => setSelectedTier(tier)} className={`p-10 border-4 ${ThemeStyles.border} flex flex-col items-center gap-4 hover:bg-black hover:text-white transition-all`}>
                <tier.icon className="w-10 h-10" />
                <span className="font-bebas text-5xl">{tier.amount}</span>
              </button>
            ))}
            <button onClick={() => setSelectedTier({isCustom: true, amount: ''})} className={`p-10 border-4 ${ThemeStyles.border} flex flex-col items-center gap-4 hover:bg-[#FF0080] hover:text-white transition-all`}>
              <MousePointer2 className="w-10 h-10" />
              <span className="font-bebas text-5xl">Custom</span>
            </button>
          </div>

          <div className={`border-4 ${ThemeStyles.border} p-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20`}>
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                 <QrCode className="w-12 h-12 text-[#FF0080]" />
                 <h2 className="font-bebas text-6xl tracking-tight leading-none">{t('paymentTerminal')}</h2>
              </div>
              
              <div className="space-y-10">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block border-l-2 border-[#00FF7F] pl-4 mb-4">Bank Jago Direct (Global)</span>
                  <div className="flex items-center gap-6">
                    <Building2 className="w-10 h-10 text-orange-500" />
                    <span className="font-bebas text-5xl tracking-widest bg-zinc-100 dark:bg-zinc-800 px-4 py-1">107863277869</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block border-l-2 border-blue-500 pl-4 mb-4">PayPal (Instant Sync)</span>
                  <a href="https://paypal.me/anindijewidhie" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 hover:opacity-80 transition-opacity group">
                    <CreditCard className="w-10 h-10 text-blue-600" />
                    <span className="font-bebas text-4xl text-blue-600 underline decoration-2 underline-offset-4">paypal.me/anindijewidhie</span>
                    <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block border-l-2 border-magenta pl-4 mb-4">E-Wallet (GoPay / OVO / DANA)</span>
                  <div className="flex items-center gap-6">
                    <SmartphoneNfc className="w-10 h-10 text-[#00FF7F]" />
                    <span className="font-bebas text-5xl tracking-widest">+628567239000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-12 flex flex-col items-center justify-center border-4 border-white gap-10">
              <div className="bg-white p-8 border-4 border-[#00FF7F]">
                <QrCode className="w-56 h-56 text-black" />
              </div>
              <div className="text-center">
                <span className="font-bebas text-4xl tracking-widest animate-pulse block mb-2">{t('scanQr')}</span>
                <span className="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase">Supports Banks, Organizations & Companies</span>
              </div>
            </div>
          </div>

          {/* Corporate section with more emphasis */}
          <div className={`p-16 border-4 border-dashed ${ThemeStyles.border} bg-zinc-50 dark:bg-zinc-900/50 flex flex-col md:flex-row items-center gap-12 group`}>
            <div className="bg-black text-white p-8 border-4 border-white group-hover:bg-[#FF0080] transition-colors">
              <Briefcase className="w-20 h-20" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bebas text-6xl leading-none">{t('corporateTitle')}</h3>
              <p className="text-sm font-bold opacity-60 uppercase leading-loose max-w-xl">{t('corporateDesc')}</p>
              <div className="flex items-center gap-6 text-[10px] font-bold opacity-40 uppercase tracking-widest pt-4">
                 <CheckCircle2 className="w-5 h-5 text-[#00FF7F]" /> Institutional Grants
                 <CheckCircle2 className="w-5 h-5 text-[#00FF7F]" /> Large Enterprise Support
              </div>
            </div>
          </div>
        </main>

        <footer className="h-40 flex items-center justify-center border-t-4 border-black bg-[#FFFF00] mt-20">
          <button onClick={() => setCurrentView('home')} className="bg-black text-white px-20 py-8 text-5xl font-bebas border-4 border-white hover:scale-105 transition-all">
            Return to Hub
          </button>
        </footer>

        {selectedTier && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm">
            <div className={`${ThemeStyles.bg} border-4 ${ThemeStyles.border} p-16 max-w-3xl w-full flex flex-col gap-12 animate-in zoom-in-95 duration-200`}>
              <div className="flex justify-between items-start border-b-4 border-current pb-8">
                <div>
                  <h2 className="font-bebas text-7xl tracking-tighter uppercase mb-2">Sync Payment</h2>
                  <span className="font-bebas text-4xl text-[#FF0080] uppercase tracking-widest">
                    {selectedTier.isCustom ? 'Custom Grant' : selectedTier.amount}
                  </span>
                </div>
                <button onClick={() => setSelectedTier(null)} className="p-4 hover:bg-red-500 hover:text-white transition-colors">
                  <X className="w-10 h-10" />
                </button>
              </div>

              {selectedTier.isCustom && (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Manual Amount Entry (USD)</span>
                  <input 
                    autoFocus
                    type="number" 
                    value={customAmountInput}
                    onChange={(e) => setCustomAmountInput(e.target.value)}
                    className={`w-full p-8 border-4 ${ThemeStyles.border} text-6xl font-bebas bg-zinc-100 dark:bg-zinc-800 outline-none focus:border-[#00FF7F] tracking-tighter`}
                    placeholder="0.00"
                  />
                </div>
              )}

              <div className="p-10 bg-zinc-100 dark:bg-zinc-900 border-4 border-current space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Network ID</span>
                  <span className="opacity-40">{gameState.currentProducer}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Merchant</span>
                  <span>MY TV STAR FOUNDATION</span>
                </div>
              </div>

              <button 
                disabled={isProcessingPayment || (selectedTier.isCustom && (!customAmountInput || parseFloat(customAmountInput) <= 0))}
                onClick={() => {
                  setIsProcessingPayment(true);
                  setTimeout(() => {
                    setPayoutMessage(`LOGGED CONTRIBUTION: ${selectedTier.isCustom ? customAmountInput : selectedTier.amount}`);
                    setShowPayoutToast(true);
                    setSelectedTier(null);
                    setIsProcessingPayment(false);
                    setTimeout(() => setShowPayoutToast(false), 5000);
                  }, 2500);
                }}
                className={`w-full py-10 font-bebas text-6xl border-4 ${ThemeStyles.border} ${ThemeStyles.accent} hover:bg-[#00FF7F] hover:text-black transition-all disabled:opacity-50`}
              >
                {isProcessingPayment ? 'Processing Node Sync...' : 'Finalize Transfer'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'roster') {
    return (
      <div className={`min-h-screen ${ThemeStyles.bg} ${ThemeStyles.text} flex flex-col font-mono`}>
        <Ticker />
        <Nav />
        <main className="flex-1 p-16 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-16 border-b-8 border-current pb-8">
            <h1 className="font-bebas text-[10rem] tracking-tighter leading-none">{t('talentHub')}</h1>
            <div className="flex items-center gap-10">
               <div className="text-right">
                  <span className="text-xs font-bold opacity-40 block uppercase tracking-widest mb-2">Network Treasury</span>
                  <span className="font-bebas text-7xl text-[#00FF7F]">${gameState.money.toFixed(2)}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <button 
              onClick={generateTalent}
              disabled={isGenerating}
              className={`border-4 border-dashed ${ThemeStyles.border} h-[600px] flex flex-col items-center justify-center gap-10 group hover:bg-[#FF0080]/5 hover:border-[#FF0080] transition-all disabled:opacity-50`}
            >
              {isGenerating ? <Loader2 className="w-24 h-24 animate-spin" /> : <PlusCircle className="w-24 h-24 group-hover:scale-110 transition-transform" />}
              <span className="font-bebas text-6xl tracking-tight uppercase">{isGenerating ? 'Drafting...' : t('signTalent')}</span>
            </button>
            
            {gameState.roster.map(star => (
               <div key={star.id} className={`border-4 ${ThemeStyles.border} h-[600px] flex flex-col overflow-hidden group hover:scale-[1.02] transition-transform`}>
                  <div className="flex-1 bg-black flex flex-col items-center justify-center p-12 text-center gap-8">
                    <div className="relative">
                      <Bot className="w-32 h-32 text-white opacity-10 group-hover:opacity-100 group-hover:text-[#FF0080] transition-all duration-500" />
                      <div className="absolute -top-4 -right-4 bg-[#00FF7F] text-black px-3 py-1 font-bebas text-2xl border-2 border-black">LIVE</div>
                    </div>
                    <div>
                       <h3 className="font-bebas text-6xl text-white leading-none mb-3 uppercase tracking-tight">{star.profile.name}</h3>
                       <div className="inline-block border-2 border-[#00FF7F] px-4 py-1 text-xs font-bold text-[#00FF7F] tracking-widest uppercase">{star.profile.role}</div>
                    </div>
                    <p className="text-xs text-white/40 uppercase leading-relaxed font-bold tracking-widest">{star.profile.description}</p>
                  </div>
                  <div className="p-10 border-t-4 border-current flex justify-between items-center bg-zinc-100 dark:bg-zinc-900">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold opacity-40 tracking-widest uppercase">Contract Level {star.level}</span>
                      <div className="font-bebas text-5xl tracking-tight">${star.earnings.toFixed(2)}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveStar(star);
                        setCurrentView('studio');
                      }}
                      className="p-8 border-4 border-black bg-black text-white hover:bg-[#FF0080] transition-all group-hover:rotate-6"
                    >
                      <Play className="w-10 h-10 fill-current" />
                    </button>
                  </div>
               </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'studio' && activeStar) {
    const progress = (sessionTime % 600) / 600 * 100;
    const remainingSeconds = 600 - (sessionTime % 600);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return (
      <div className={`min-h-screen bg-black text-white flex flex-col font-mono selection:bg-[#FF0080]`}>
        <div className="h-2 bg-[#FF0080] w-full" />
        <header className="h-24 border-b-2 border-white/20 flex items-center justify-between px-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse" />
              <span className="font-bebas text-3xl tracking-widest">ON AIR</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <span className="font-bold text-xs tracking-widest opacity-40">STUDIO_7 NODE_SYNC_{gameState.currentProducer}</span>
          </div>
          <button 
            onClick={() => setCurrentView('roster')} 
            className="font-bebas text-4xl border-4 border-white px-12 py-3 hover:bg-white hover:text-black transition-all"
          >
            End Stream
          </button>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
             <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--magenta)_0%,_transparent_70%)] animate-pulse" />
          </div>
          <div className="z-10 text-center space-y-20 max-w-4xl">
            <div className="space-y-6">
              <span className="text-xl font-bold tracking-[0.6em] text-[#00FF7F] uppercase">{activeStar.profile.role}</span>
              <h2 className="font-bebas text-[14rem] leading-none tracking-tighter uppercase">{activeStar.profile.name}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-40">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold opacity-40 uppercase tracking-[0.4em] mb-4">Network Load</span>
                <span className="font-bebas text-8xl">92.8%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold opacity-40 uppercase tracking-[0.4em] mb-4">Session Yield</span>
                <span className="font-bebas text-8xl text-[#00FF7F]">$5.00</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8">
               <div className="w-[600px] h-4 bg-white/10 border-2 border-white/20 relative">
                  <div className="h-full bg-[#00FF7F] transition-all duration-1000" style={{ width: `${progress}%` }} />
               </div>
               <div className="flex flex-col items-center gap-2">
                 <span className="font-bebas text-5xl tracking-widest">{minutes}:{seconds.toString().padStart(2, '0')}</span>
                 <span className="text-[10px] font-bold tracking-[0.5em] opacity-40 uppercase">Next Reward Distribution</span>
               </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className={`min-h-screen ${ThemeStyles.bg} ${ThemeStyles.text} flex flex-col font-mono`}>
        <Nav />
        <main className="flex-1 flex items-center justify-center p-10">
          <div className={`${ThemeStyles.bg} border-8 ${ThemeStyles.border} p-20 max-w-2xl w-full flex flex-col gap-12 animate-in fade-in duration-500`}>
            <div className="border-b-4 border-current pb-10 space-y-4">
              <h2 className="font-bebas text-[8rem] tracking-tighter uppercase leading-none">{t('identitySync')}</h2>
              <span className="text-xs font-bold tracking-[0.4em] uppercase opacity-40">Accessing Node 3.4 // Global Terminal</span>
            </div>
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest opacity-40">Producer UID</span>
              <input 
                value={gameState.currentProducer}
                onChange={(e) => setGameState(p => ({...p, currentProducer: e.target.value}))}
                className={`w-full p-10 text-6xl font-bebas border-4 ${ThemeStyles.border} bg-zinc-100 dark:bg-zinc-800 outline-none focus:border-[#FF0080] tracking-widest`}
              />
            </div>

            <button 
              onClick={() => {
                localStorage.setItem('myTVStar_isLoggedIn', 'true');
                setCurrentView('roster');
              }}
              className={`w-full py-12 font-bebas text-6xl border-4 ${ThemeStyles.border} ${ThemeStyles.accent} hover:bg-[#FF0080] hover:text-white transition-all`}
            >
              {t('enterTerminal')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed bottom-12 right-12 z-[300] pointer-events-none">
       {showPayoutToast && (
          <div className="bg-[#00FF7F] border-8 border-black p-12 font-bebas text-6xl text-black flex items-center gap-10 animate-in slide-in-from-right-10 pointer-events-auto">
             <CheckCircle2 className="w-16 h-16" />
             <div className="flex flex-col">
               <span className="leading-none">{payoutMessage}</span>
               <span className="text-xl font-bold tracking-widest mt-2 uppercase opacity-60">Network Wallet Updated</span>
             </div>
          </div>
       )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<MyTVStar />);
}
