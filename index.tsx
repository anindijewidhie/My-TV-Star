import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Tv, 
  Monitor, 
  Globe, 
  Loader2, 
  PlusCircle, 
  Bot, 
  Maximize2, 
  Signal,
  Shield,
  Play,
  Zap,
  DollarSign,
  Sun,
  Moon,
  Settings2,
  Edit3,
  Trash2,
  CheckCircle2,
  Activity,
  Sparkles,
  Volume2,
  Smartphone,
  Gamepad2,
  Cpu,
  Trophy,
  HardDrive,
  Accessibility,
  Ear,
  Keyboard as KeyboardIcon,
  PieChart,
  Heart,
  Coins,
  ArrowRight,
  QrCode,
  CreditCard,
  Wallet,
  Banknote,
  X,
  MousePointer2,
  ShieldCheck,
  SmartphoneNfc,
  Cast,
  LayoutGrid,
  Star,
  List,
  BarChart4,
  Hash,
  ChevronRight,
  Info
} from 'lucide-react';

// --- Internationalization (i18n) ---
const TRANSLATIONS: Record<string, any> = {
  en: { 
    appTitle: "MY TV STAR", 
    tagline: "THE ULTIMATE BROADCASTING SIMULATION", 
    startSim: "START SIMULATION", 
    login: "LOGIN", 
    enterHub: "ENTER HUB",
    identitySync: "IDENTITY SYNC", 
    enterTerminal: "ENTER TERMINAL", 
    hub: "HUB", 
    live: "LIVE", 
    revenue: "REVENUE", 
    goLive: "GO LIVE", 
    endStream: "END STREAM", 
    treasury: "TREASURY", 
    settings: "SETTINGS", 
    language: "LANGUAGE", 
    talentHub: "TALENT HUB", 
    signTalent: "SIGN NEW TALENT", 
    assetConfig: "ASSET CONFIG", 
    generateStar: "GENERATE STAR", 
    updateStar: "RE-GENERATE ASSET",
    stats: "STAR STATS", 
    lvl: "LVL", 
    earnings: "EARNINGS", 
    theme: "APPEARANCE MODE",
    light: "LIGHT MODE",
    dark: "DARK MODE",
    studioMaster: "STUDIO MASTER",
    aspectRatio: "ASPECT RATIO",
    resolution: "RESOLUTION",
    enhance: "ENHANCE WITH AI",
    editStar: "EDIT TALENT",
    unlimited: "UNLIMITED MODE",
    platformAvailability: "PLATFORM DEPLOYMENT STATUS",
    optimized: "OPTIMIZED FOR ALL DEVICES",
    rewardTitle: "REWARD ENGINE ACTIVE",
    rewardDesc: "Earn $5.00 every 10 minutes of network uptime. Your talent, your empire, your revenue.",
    unlimitedTitle: "UNLIMITED CREATIVITY",
    unlimitedDesc: "Customizable everything. Any body size, any style, any studio. Powered by Gemini AI.",
    systemReqs: "SYSTEM REQUIREMENTS",
    ramMin: "2GB RAM MINIMUM",
    ramRec: "4GB RAM RECOMMENDED",
    accessibility: "ACCESSIBILITY HUB",
    voiceGuidance: "VOICE GUIDANCE",
    closedCaptions: "CLOSED CAPTIONS",
    largeText: "ENHANCED LEGIBILITY",
    kbShortcuts: "KEYBOARD SHORTCUTS",
    narratorOn: "Narrator Active. Hover over elements for audio guidance.",
    narratorOff: "Narrator Disabled.",
    financialTitle: "FINANCIAL TRANSPARENCY",
    fundingModel: "FUNDING DISTRIBUTION MODEL",
    playerPayouts: "PLAYER PAYOUTS",
    maintenance: "MAINTENANCE",
    development: "DEVELOPMENT",
    siteOwner: "PLATFORM OWNER",
    donationInfo: "My TV Star is funded by community donations. Here is how every dollar is distributed to keep the network alive:",
    donationPageTitle: "NETWORK SUPPORT",
    supportTagline: "FUEL THE BROADCAST EMPIRE",
    donateNow: "SEND DONATION",
    selectTier: "SELECT CONTRIBUTION TIER",
    thankYou: "THANK YOU FOR YOUR SUPPORT!",
    supportDesc: "Your contributions ensure we can maintain a high-quality global network for all stars.",
    paymentTerminal: "PAYMENT TERMINAL",
    scanQr: "SCAN UNIVERSAL QR CODE",
    universalSupport: "SUPPORTS ALL BANKS & E-WALLETS",
    allCurrencies: "MULTI-CURRENCY AUTO-CONVERSION",
    accountDetails: "ACCOUNT DETAILS",
    bankName: "PAYPAL (dhea_wasisto@yahoo.com)",
    accountNo: "E-WALLET (+628567239000)",
    confirmPayment: "CONFIRM DEPOSIT",
    processing: "PROCESSING TRANSACTION...",
    customAmount: "CUSTOM AMOUNT",
    enterAmount: "ENTER USD AMOUNT",
    wallets: "GOPAY / OVO / SHOPEEPAY"
  },
};

type View = 'home' | 'login' | 'onboarding' | 'customization' | 'dashboard' | 'settings' | 'roster' | 'donation';

interface StarAppearance {
  ageGroup: string; gender: string; skintone: string; bodySize: string; hairstyle: string; hairColor: string; eyeColor: string; pose: string; top: string; bottom: string; footwear: string; makeup: string; headwear: string; accessories: string; primaryColor: string; secondaryColor: string; imageUrl?: string; studioFurniture: string; studioProps: string; studioLighting: string; studioBackdrop: string; studioSound: string; studioFX: string; studioAudience: string; studioFlooring: string; studioMonitors: string; cameraAngle: string; studioTheme: string; aspectRatio: string; imageSize: string; groundingEnabled: boolean;
}

interface CharacterProfile {
  id: string; userName: string; role: string; bio: string; popularity: number; level: number; earnings: number; appearance: StarAppearance;
}

interface AccessibilitySettings {
  voiceGuidance: boolean;
  closedCaptions: boolean;
  largeText: boolean;
  kbShortcuts: boolean;
}

interface GameState {
  language: string; 
  money: number; 
  roster: CharacterProfile[]; 
  activeStarId: string | null; 
  currentProducer: string; 
  tutorialSeen: boolean; 
  baseEarningAmount: number; 
  baseEarningIntervalMs: number; 
  theme: 'dark' | 'light';
  accessibility: AccessibilitySettings;
}

const DEFAULT_APPEARANCE: StarAppearance = {
  ageGroup: 'Younger Adults (18-24 years old)', gender: 'Non-Binary', skintone: "Neutral", bodySize: 'Average', hairstyle: 'Spiky Hero Hair', hairColor: 'Neon Pink', eyeColor: 'Cyan', pose: 'Dynamic Hero Pose', top: 'Retro Cartoon Hoodie', bottom: 'Wide-Leg Cartoon Pants', footwear: 'Oversized Red Boots', makeup: 'Star Eye Decal', headwear: 'Backward Star Cap', accessories: 'Cyber-Goggles', primaryColor: 'Magenta', secondaryColor: 'Cyan', studioFurniture: 'Floating Holographic Podium', studioProps: 'Oversized Silver Microphone', studioLighting: 'Vibrant Multi-Color Spots', studioBackdrop: 'City Rooftop Skyline', studioSound: 'High-Tech Lavalier', studioFX: 'Floating Digital Particles', studioAudience: 'Empty Studio', studioFlooring: 'Polished Chrome', studioMonitors: 'CRT TV Wall', cameraAngle: 'Standard Mid-Shot', studioTheme: 'Cyberpunk', aspectRatio: '1:1', imageSize: '1K', groundingEnabled: false
};

const PLATFORMS = [
  { name: 'WEB', icon: Globe, color: '#FF0080' },
  { name: 'ANDROID', icon: Smartphone, color: '#00FF7F' },
  { name: 'iOS', icon: Smartphone, color: '#00FFFF' },
  { name: 'HarmonyOS', icon: Cpu, color: '#FFFF00' },
  { name: 'STEAM', icon: Gamepad2, color: '#0000FF' }
];

const MyTVStar = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    const isLoggedIn = localStorage.getItem('myTVStar_isLoggedIn') === 'true';
    if (!isLoggedIn) return 'home';
    return 'roster';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('myTVStar_isLoggedIn') === 'true');
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('myTVStar_state');
    if (!saved) return {
      language: 'en', money: 0, roster: [], activeStarId: null, currentProducer: 'PROD-' + Math.floor(Math.random() * 9000 + 1000), 
      tutorialSeen: false, baseEarningAmount: 5.00, baseEarningIntervalMs: 10 * 60 * 1000, theme: 'dark',
      accessibility: { voiceGuidance: false, closedCaptions: true, largeText: false, kbShortcuts: true }
    };
    return JSON.parse(saved);
  });

  const [selectedTier, setSelectedTier] = useState<{amount: string, label: string, isCustom?: boolean} | null>(null);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const announce = (text: string) => {
    if (gameState.accessibility.voiceGuidance && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const t = (key: string) => TRANSLATIONS[gameState.language]?.[key] || TRANSLATIONS['en'][key] || key;
  const isDark = gameState.theme === 'dark';
  const activeStar = useMemo(() => gameState.roster.find(s => s.id === gameState.activeStarId) || null, [gameState.roster, gameState.activeStarId]);

  const [showPayoutToast, setShowPayoutToast] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');

  const ThemeStyles = {
    bg: isDark ? 'bg-[#020617]' : 'bg-[#fcfcfc]',
    surface: isDark ? 'bg-[#0f172a]' : 'bg-[#ffffff]',
    cardBorder: isDark ? 'border-white' : 'border-[#000000]',
    text: isDark ? 'text-white' : 'text-[#000000]',
    textMuted: isDark ? 'text-white/60' : 'text-[#000000]/60',
    border: isDark ? 'border-white' : 'border-[#000000]',
    accentBg: isDark ? 'bg-white' : 'bg-[#000000]',
    accentBtnText: isDark ? 'text-black' : 'text-white',
    headerSize: gameState.accessibility.largeText ? 'text-5xl' : 'text-4xl'
  };

  const Logo = ({ className = "w-12 h-12" }) => (
    <div className={`flex items-center justify-center bg-white border-4 border-[#FF0080] ${className}`}>
      <Tv className="w-full h-full text-[#FF0080] p-1" />
    </div>
  );

  const Ticker = () => (
    <div className={`h-10 bg-[#FF0080] border-b-4 flex items-center overflow-hidden z-[60] relative ${ThemeStyles.border}`} role="status">
      <div className="whitespace-nowrap flex items-center gap-20 animate-marquee">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-white font-black text-[12px] uppercase tracking-[0.2em]">
            // {t('appTitle')} NETWORK // $5.00 REWARDS ACTIVE // BROADCAST SIMULATION v3.4 // GLOBAL TERMINAL SYNCED //
          </span>
        ))}
      </div>
    </div>
  );

  const GlobalControls = () => (
    <div className="flex items-center gap-2 relative z-[110]">
      <button 
        aria-label="Toggle Theme"
        onClick={() => setGameState(p => ({...p, theme: p.theme === 'dark' ? 'light' : 'dark'}))} 
        className={`p-3 border-4 transition-all ${isDark ? 'bg-[#FF0080] text-white border-white' : 'bg-[#00FF7F] text-black border-black'}`}
      >
        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>
    </div>
  );

  if (currentView === 'home') {
    return (
        <div className={`flex-1 flex flex-col ${ThemeStyles.bg} ${ThemeStyles.text} overflow-y-auto min-h-screen transition-colors relative font-mono`}>
          <div className="scanline" />
          <Ticker />
          
          <nav className={`h-24 border-b-[6px] flex items-center justify-between px-8 sticky top-0 z-[100] transition-all backdrop-blur-md ${isDark ? 'bg-slate-950/90 border-white' : 'bg-white/95 border-black'}`}>
            <div className="flex items-center gap-5">
              <Logo className="w-14 h-14" />
              <div className="flex flex-col">
                <span className={`font-bebas text-5xl leading-none tracking-tight ${ThemeStyles.text}`}>{t('appTitle')}</span>
                <span className="text-[10px] text-[#FF0080] font-black uppercase tracking-[0.2em]">Talent Simulation Hub</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-10 font-bebas text-2xl">
                 <button onClick={() => setCurrentView('donation')} className="hover:text-[#FF0080] transition-colors uppercase tracking-widest decoration-4 hover:underline underline-offset-8">Support</button>
                 <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 px-4 py-2 border-2 border-current">
                    <div className="w-3 h-3 bg-[#00FF7F] animate-pulse rounded-full" />
                    <span className="text-sm font-black tracking-widest">NETWORK: ACTIVE</span>
                 </div>
              </div>
              <GlobalControls />
              {isLoggedIn ? (
                 <button onClick={() => setCurrentView('roster')} className={`btn-flat bg-[#00FF7F] text-black px-12 py-3 font-bebas text-3xl border-4 ${ThemeStyles.border} hover:bg-white hover:scale-105 transition-all`}>
                    {t('enterHub')}
                 </button>
              ) : (
                 <button onClick={() => setCurrentView('login')} className={`btn-flat bg-[#00FF7F] text-black px-12 py-3 font-bebas text-3xl border-4 ${ThemeStyles.border} hover:bg-white hover:scale-105 transition-all`}>
                    {t('login')}
                 </button>
              )}
            </div>
          </nav>

          <main className="flex-1 flex flex-col items-center justify-center py-28 px-10 text-center relative overflow-hidden">
            {/* Visual Flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-[#FF0080]/5 rounded-full blur-[200px] pointer-events-none" />
            
            <div className="z-10 flex flex-col items-center max-w-7xl w-full">
              <div className={`bg-black text-white font-bebas text-3xl px-16 py-4 border-[6px] border-[#00FF7F] mb-10 animate-in slide-in-from-bottom-12 duration-700 uppercase tracking-[0.3em]`}>
                {t('tagline')}
              </div>
              
              <h2 className={`font-bebas text-[12rem] md:text-[18rem] leading-[0.7] mb-16 animate-in zoom-in-95 duration-1000 tracking-tighter drop-shadow-2xl select-none`}>
                MY TV <span className="text-[#FFFF00]">STAR</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch justify-center w-full mb-28">
                 {/* Feature Card 1 */}
                 <div className={`border-4 ${ThemeStyles.cardBorder} p-12 ${ThemeStyles.surface} flex flex-col items-center text-center relative group transition-all hover:scale-[1.02] border-t-[12px] border-t-[#00FF7F]`}>
                    <div className="p-4 bg-black text-[#00FF7F] mb-8 border-4 border-[#00FF7F]">
                        <DollarSign className="w-14 h-14" />
                    </div>
                    <h3 className="font-bebas text-5xl mb-4">{t('rewardTitle')}</h3>
                    <p className="text-sm uppercase opacity-80 leading-relaxed font-black tracking-widest max-w-xs">{t('rewardDesc')}</p>
                 </div>

                 {/* Main CTA */}
                 <div className="flex flex-col gap-12 items-center justify-center bg-black/5 dark:bg-white/5 p-12 border-4 border-dashed border-current">
                    <button 
                      onClick={() => isLoggedIn ? setCurrentView('roster') : setCurrentView('login')} 
                      className="btn-flat bg-[#FFFF00] text-[#000000] px-24 py-14 text-8xl border-[16px] border-black font-bebas hover:bg-[#FF0080] hover:text-white transition-all transform hover:-translate-y-4 hover:scale-105 group active:translate-y-2"
                    >
                        {isLoggedIn ? t('enterHub') : t('startSim')}
                    </button>
                    <div className="text-[14px] font-black uppercase tracking-[0.5em] opacity-80 flex items-center gap-5">
                       <Signal className="w-8 h-8 text-[#FF0080] animate-pulse" />
                       TERMINAL STATUS: READY
                    </div>
                 </div>

                 {/* Feature Card 2 */}
                 <div className={`border-4 ${ThemeStyles.cardBorder} p-12 ${ThemeStyles.surface} flex flex-col items-center text-center relative group transition-all hover:scale-[1.02] border-t-[12px] border-t-[#FF0080]`}>
                    <div className="p-4 bg-black text-[#FF0080] mb-8 border-4 border-[#FF0080]">
                        <Cpu className="w-14 h-14" />
                    </div>
                    <h3 className="font-bebas text-5xl mb-4">SYNTHESIS CORE</h3>
                    <p className="text-sm uppercase opacity-80 leading-relaxed font-black tracking-widest max-w-xs">Global talent simulation powered by native Gemini 3 AI architectures.</p>
                 </div>
              </div>

              {/* Enhanced Platform Strip */}
              <div className={`w-full py-14 border-y-[8px] ${ThemeStyles.border} overflow-hidden bg-slate-200/50 dark:bg-slate-900/80`}>
                 <div className="whitespace-nowrap flex items-center gap-40 animate-marquee opacity-60 hover:opacity-100 transition-opacity">
                    {[...PLATFORMS, ...PLATFORMS].map((p, i) => (
                      <div key={i} className="flex items-center gap-8 grayscale hover:grayscale-0 transition-all">
                         <p.icon className="w-12 h-12" />
                         <span className="font-bebas text-5xl tracking-[0.3em]">{p.name}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </main>

          {/* Network Section - High Visibility Table */}
          <section className={`py-40 px-12 bg-black text-white relative`}>
             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
                <div className="space-y-16">
                   <div className="inline-block px-8 py-3 bg-[#00FF7F] text-black text-sm font-black uppercase tracking-[0.4em] border-4 border-white">Network Transparency</div>
                   <h3 className="font-bebas text-[10rem] md:text-[12rem] leading-[0.75] uppercase tracking-tighter">POWER THE <br/><span className="text-[#00FF7F]">EMPIRE</span></h3>
                   <div className="space-y-6">
                       <p className="text-lg opacity-80 leading-relaxed uppercase tracking-widest max-w-xl font-bold">
                          My TV Star is a decentralized community broadcast network. Every contribution scales our global synthesis nodes.
                       </p>
                       <div className="flex items-center gap-4 text-[#FFFF00] font-black text-xs uppercase tracking-widest">
                          <Info className="w-6 h-6" />
                          <span>Player payouts are guaranteed at $5.00 every 10 min session.</span>
                       </div>
                   </div>
                   <div className="flex flex-wrap gap-8 pt-10">
                      <button onClick={() => setCurrentView('donation')} className="btn-flat bg-[#FF0080] text-white px-16 py-8 font-bebas text-4xl border-[6px] border-white hover:bg-white hover:text-black transition-all">
                        SEND DONATION
                      </button>
                      <button className="btn-flat bg-white text-black px-16 py-8 font-bebas text-4xl border-[6px] border-[#00FF7F] hover:bg-[#00FF7F] transition-all">
                        STATS LOG
                      </button>
                   </div>
                </div>

                {/* Professional Data Terminal */}
                <div className="flex flex-col border-[10px] border-white/30 bg-white/5 backdrop-blur-xl overflow-hidden w-full transition-all hover:border-white">
                    {/* Header Row */}
                    <div className="flex items-center p-10 border-b-[8px] border-white/20 bg-white/10 font-black text-[12px] uppercase tracking-[0.5em] text-[#00FF7F]">
                        <div className="w-16 shrink-0 flex justify-center"><Hash className="w-6 h-6" /></div>
                        <div className="flex-1 px-6">PROTOCOL DISTRIBUTION PATH</div>
                        <div className="w-32 text-right">LOAD %</div>
                    </div>
                    
                    {/* Rows */}
                    {[
                      { label: 'PLAYER REVENUES', val: '40', icon: DollarSign, color: 'text-[#00FF7F]', barColor: 'bg-[#00FF7F]', width: 'w-[40%]' },
                      { label: 'NODE INFRASTRUCTURE', val: '20', icon: Activity, color: 'text-[#FFFF00]', barColor: 'bg-[#FFFF00]', width: 'w-[20%]' },
                      { label: 'AI CORE SYNTHESIS', val: '20', icon: Cpu, color: 'text-[#00FFFF]', barColor: 'bg-[#00FFFF]', width: 'w-[20%]' },
                      { label: 'PLATFORM GOVERNANCE', val: '20', icon: Heart, color: 'text-[#FF0080]', barColor: 'bg-[#FF0080]', width: 'w-[20%]' }
                    ].map((item, idx) => (
                      <div key={item.label} className={`flex items-center p-10 transition-all hover:bg-white/15 ${idx !== 3 ? 'border-b-4 border-white/10' : ''} group`}>
                          <div className="w-16 shrink-0 flex flex-col items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-300">
                              <span className="text-[12px] mb-2 font-black text-white/50">#0{idx+1}</span>
                              <item.icon className={`w-8 h-8 ${item.color} group-hover:scale-125 transition-transform`} />
                          </div>
                          
                          <div className="flex-1 px-10 space-y-6">
                              <div className="flex items-baseline justify-between">
                                  <span className="font-bebas text-5xl tracking-widest group-hover:text-[#FFFF00] transition-colors uppercase">{item.label}</span>
                                  <span className={`font-bebas text-6xl leading-none ${item.color} hidden sm:block`}>{item.val}%</span>
                              </div>
                              {/* Heavy Duty Bar */}
                              <div className="h-4 w-full bg-white/10 border-2 border-white/20 relative overflow-hidden">
                                  <div className={`absolute top-0 left-0 h-full ${item.barColor} ${item.width} transition-all duration-1000 ease-in-out group-hover:brightness-125 shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
                              </div>
                          </div>

                          <div className="w-32 text-right sm:hidden">
                              <span className={`font-bebas text-6xl leading-none ${item.color}`}>{item.val}%</span>
                          </div>
                      </div>
                    ))}
                    
                    {/* Aggregated Footer */}
                    <div className="p-12 bg-[#00FF7F] text-black flex justify-between items-center group cursor-default">
                        <div className="flex items-center gap-8">
                            <div className="p-6 bg-black text-[#00FF7F] border-4 border-white transform hover:rotate-6 transition-transform">
                                <BarChart4 className="w-12 h-12" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black uppercase tracking-[0.3em] leading-none mb-2 opacity-80">AGGREGATE SYNC</span>
                                <span className="font-bebas text-5xl leading-none tracking-tight">TOTAL LOAD</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-bebas text-[6rem] leading-none tracking-tighter">100.00%</span>
                            <span className="text-[11px] font-black uppercase opacity-100 tracking-[0.5em] mt-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> STATUS: OPERATIONAL
                            </span>
                        </div>
                    </div>
                </div>
             </div>
          </section>

          <footer className={`py-40 flex flex-col items-center justify-center gap-14 bg-black border-t-[12px] border-white`}>
              <div className="flex items-center gap-20 opacity-20 hover:opacity-100 transition-opacity duration-1000">
                 <Logo className="w-20 h-20 grayscale" />
                 <span className="font-bebas text-8xl text-white tracking-[0.6em]">MY TV STAR</span>
              </div>
              <div className="flex flex-col gap-5 items-center px-12">
                <div className="text-[13px] text-white/50 uppercase tracking-[1em] text-center max-w-4xl leading-loose font-black">
                   ENCRYPTED BROADCAST PROTOCOL // GLOBAL TALENT SYNTHESIS // UNIVERSAL NODE SYNC
                </div>
                <div className="h-1 w-60 bg-[#FF0080] my-8" />
                <div className="text-[12px] text-[#00FF7F] font-black uppercase tracking-[0.4em] flex flex-wrap justify-center items-center gap-6">
                   <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> SECURE DONATIONS</div>
                   <div className="flex items-center gap-2"><Globe className="w-5 h-5" /> GLOBAL NETWORK</div>
                   <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> VERIFIED PAYOUTS</div>
                </div>
              </div>
          </footer>
        </div>
    );
  }

  // --- Other views preserved with High Visibility Focus ---

  if (currentView === 'donation') {
    const fixedTiers = [
      { amount: "$1.00", label: "MICRO DONATION", icon: Zap },
      { amount: "$2.00", label: "BASIC SUPPORT", icon: Coins },
      { amount: "$5.00", label: "NETWORK FUEL", icon: Activity },
      { amount: "$10.00", label: "BOOSTER", icon: Signal },
      { amount: "$20.00", label: "PRO SUPPORTER", icon: Shield },
      { amount: "$50.00", label: "STUDIO PARTNER", icon: Trophy },
      { amount: "$100.00", label: "EXECUTIVE PRODUCER", icon: Star }
    ];

    return (
      <div className={`flex-1 flex flex-col ${ThemeStyles.bg} ${ThemeStyles.text} h-screen transition-colors overflow-y-auto custom-scrollbar font-mono`}>
         <Ticker />
         <header className={`h-24 border-b-8 flex items-center justify-between px-8 sticky top-0 z-[100] transition-colors ${isDark ? 'border-white bg-[#020617]' : 'border-black bg-white'}`}>
            <div className="flex items-center gap-8"><Logo className="w-14 h-14" /><h1 className={`font-bebas uppercase text-6xl tracking-tight`}>{t('donationPageTitle')}</h1></div>
            <div className="flex items-center gap-6">
              <GlobalControls />
              <button onClick={() => setCurrentView('home')} className={`btn-flat ${ThemeStyles.accentBg} ${ThemeStyles.accentBtnText} px-10 py-3 font-bebas text-2xl border-4 ${ThemeStyles.border}`}>BACK</button>
            </div>
         </header>

         <main className="max-w-7xl mx-auto w-full p-10 md:p-20 space-y-24">
            <section className="text-center space-y-10">
               <div className="inline-block bg-[#FF0080] text-white font-bebas text-3xl px-12 py-3 border-4 border-black mb-6">{t('supportTagline')}</div>
               <h2 className={`font-bebas text-9xl md:text-[12rem] leading-none tracking-tighter`}>COMMUNITY <span className="text-[#00FF7F]">TREASURY</span></h2>
               <p className="text-lg uppercase opacity-80 max-w-3xl mx-auto font-black tracking-widest leading-relaxed">{t('supportDesc')}</p>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {fixedTiers.map((tier, idx) => (
                 <button 
                  key={idx}
                  onClick={() => {
                    setSelectedTier(tier);
                    announce(`Initiating ${tier.amount} donation.`);
                  }}
                  className={`flex flex-col items-center justify-center p-12 border-4 ${ThemeStyles.border} transition-all hover:bg-[#00FF7F] hover:text-black hover:scale-105 active:scale-95 group bg-inherit`}
                 >
                    <tier.icon className="w-16 h-16 mb-6 group-hover:rotate-12 transition-transform" />
                    <span className="font-bebas text-6xl leading-none">{tier.amount}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest mt-4 opacity-70 group-hover:opacity-100">{tier.label}</span>
                 </button>
               ))}
               <button 
                onClick={() => {
                  setSelectedTier({amount: '', label: 'CUSTOM', isCustom: true});
                  announce("Entering custom amount mode.");
                }}
                className={`flex flex-col items-center justify-center p-12 border-4 ${ThemeStyles.border} transition-all hover:bg-[#FF0080] hover:text-white hover:scale-105 active:scale-95 group bg-inherit`}
               >
                  <MousePointer2 className="w-16 h-16 mb-6 group-hover:rotate-12 transition-transform" />
                  <span className="font-bebas text-6xl leading-none">{t('customAmount')}</span>
                  <span className="text-[11px] font-black uppercase tracking-widest mt-4 opacity-70 group-hover:opacity-100">ANY VALUE</span>
               </button>
            </section>

            {/* High Visibility QR Section */}
            <section className={`p-14 border-[12px] ${ThemeStyles.border} ${ThemeStyles.surface} grid grid-cols-1 lg:grid-cols-2 gap-20 relative overflow-hidden`}>
                <div className="space-y-12 relative z-10">
                    <div className="flex items-center gap-8 border-b-8 border-current pb-10">
                        <QrCode className="w-16 h-16 text-[#FF0080]" />
                        <h2 className="font-bebas text-7xl tracking-tight leading-none uppercase">{t('paymentTerminal')}</h2>
                    </div>
                    <div className="flex items-start gap-6 p-8 border-8 border-black bg-[#FFFF00] text-black text-[13px] font-black uppercase tracking-[0.2em] leading-loose">
                        <ShieldCheck className="w-12 h-12 shrink-0" />
                        <div>
                            {t('universalSupport')}<br/>
                            {t('allCurrencies')} - NO EXTRA FEES
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <div className="flex flex-col gap-4">
                                <span className="text-[12px] font-black opacity-60 uppercase tracking-[0.3em] border-l-4 border-[#FF0080] pl-3">PAYPAL ACCOUNT</span>
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-blue-600 border-4 border-black text-white"><CreditCard className="w-10 h-10" /></div>
                                    <span className="font-bebas text-3xl truncate tracking-wide text-blue-600 underline">dhea_wasisto@yahoo.com</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span className="text-[12px] font-black opacity-60 uppercase tracking-[0.3em] border-l-4 border-[#00FF7F] pl-3">E-WALLETS RECIPIENT</span>
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-[#00FF7F] border-4 border-black text-black"><SmartphoneNfc className="w-10 h-10" /></div>
                                    <span className="font-bebas text-4xl tracking-wide text-[#00FF7F] bg-black px-4 py-1">+628567239000</span>
                                </div>
                                <span className="text-[11px] font-black opacity-80 tracking-widest mt-2">{t('wallets')} (GOPAY/OVO)</span>
                            </div>
                        </div>

                        <div className="space-y-10">
                             <div className="p-8 border-4 border-black bg-white text-black text-[13px] font-black flex flex-col gap-5 uppercase tracking-widest">
                                <div className="flex items-center gap-4"><Globe className="w-6 h-6 text-blue-600" /> MULTI-CURRENCY SUPPORT</div>
                                <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-green-600" /> INSTANT VERIFICATION</div>
                             </div>
                             <div className="flex gap-4 flex-wrap">
                                 {['GoPay', 'OVO', 'ShopeePay', 'DANA', 'Bank Jago'].map(p => (
                                     <span key={p} className="px-5 py-2.5 bg-black text-white font-black text-[11px] border-2 border-white/20 uppercase tracking-[0.2em]">{p}</span>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center p-20 bg-black border-[12px] border-white relative group">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--green)_0%,_transparent_70%)] animate-pulse pointer-events-none" />
                    <div className="bg-white p-10 border-[6px] border-[#00FF7F] relative transition-transform duration-500 group-hover:scale-110">
                        <div className="w-72 h-72 flex items-center justify-center relative">
                            {/* Realistic QR Visualization */}
                            <div className="grid grid-cols-12 grid-rows-12 gap-0.5 w-full h-full p-2">
                                {Array.from({length: 144}).map((_, i) => (
                                    <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-10'}`} />
                                ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Logo className="w-24 h-24 border-4 border-black bg-white" />
                            </div>
                        </div>
                    </div>
                    <span className="text-[#00FF7F] font-bebas text-4xl mt-14 animate-pulse tracking-[0.3em]">{t('scanQr')}</span>
                    <span className="text-white/50 text-[11px] font-black uppercase mt-5 tracking-[0.5em]">UNIVERSAL BROADCAST GATEWAY ENABLED</span>
                </div>
            </section>
         </main>

         <footer className="h-48 flex items-center justify-center border-t-[12px] border-black bg-[#FFFF00] mt-24">
            <button onClick={() => setCurrentView('home')} className="btn-flat bg-black text-white px-24 py-10 text-6xl font-bebas border-[10px] border-white hover:scale-110 transition-transform active:scale-95">
               RETURN TO HUB
            </button>
         </footer>
      </div>
    );
  }

  // Login and Roster screens benefit from the high-visibility styling
  if (currentView === 'login') {
    return (
      <div className={`flex-1 flex flex-col ${ThemeStyles.bg} h-screen transition-colors font-mono`}>
        <nav className={`h-24 border-b-8 flex items-center justify-between px-8 transition-all ${isDark ? 'bg-slate-950 border-white' : 'bg-white border-black'}`}>
           <div className="flex items-center gap-6">
             <Logo className="w-14 h-14" />
             <span className={`font-bebas text-5xl leading-none tracking-tight ${ThemeStyles.text}`}>{t('appTitle')}</span>
           </div>
           <GlobalControls />
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
           <div className={`${ThemeStyles.surface} border-[16px] ${ThemeStyles.border} p-20 max-w-2xl w-full space-y-14 z-10 animate-in fade-in zoom-in-95`}>
              <div className="flex justify-between items-start border-b-[6px] border-current pb-10">
                <h2 className={`text-8xl font-bebas uppercase leading-none tracking-tight ${ThemeStyles.text}`}>{t('identitySync')}</h2>
                <div className="bg-[#00FF7F] px-5 py-2 font-black text-[13px] border-4 border-black text-black">ENCRYPTED</div>
              </div>
              <div className="space-y-4">
                 <span className="font-black text-[13px] uppercase tracking-[0.4em] opacity-60">PRODUCER_NODE_ID</span>
                 <input 
                   aria-label="Producer ID input"
                   value={gameState.currentProducer} 
                   onChange={(e) => setGameState(p => ({...p, currentProducer: e.target.value}))} 
                   className={`w-full border-[6px] ${ThemeStyles.border} p-10 text-5xl font-black text-center outline-none focus:border-[#FF0080] transition-all bg-slate-100 dark:bg-slate-800 text-current tracking-[0.2em] uppercase`} 
                   placeholder="ID_NULL" 
                 />
              </div>
              <button 
                onClick={() => { setIsLoggedIn(true); localStorage.setItem('myTVStar_isLoggedIn', 'true'); setCurrentView('roster'); announce("Sync complete. System online."); }} 
                className={`w-full btn-flat py-14 ${ThemeStyles.accentBg} ${ThemeStyles.accentBtnText} text-6xl font-bebas border-[10px] ${ThemeStyles.border} hover:bg-[#FF0080] hover:text-white transition-all transform hover:-translate-y-2`}
              >
                {t('enterTerminal')}
              </button>
              <div className={`text-center text-[12px] font-black opacity-50 uppercase tracking-[0.5em] ${ThemeStyles.text}`}>Universal Session Key v3.4.0-Stable</div>
           </div>
        </div>
      </div>
    );
  }

  if (currentView === 'roster') {
    return (
      <div className={`flex-1 flex flex-col ${ThemeStyles.bg} ${ThemeStyles.text} h-screen transition-colors font-mono`}>
        <Ticker />
        <header className={`h-28 border-b-8 flex items-center justify-between px-10 sticky top-0 z-[100] transition-colors ${isDark ? 'border-white bg-[#020617]' : 'border-black bg-white'}`}>
          <div className="flex items-center gap-8">
            <Logo className="w-16 h-16" />
            <h1 className={`font-bebas uppercase text-7xl tracking-tight leading-none ${ThemeStyles.text}`}>{t('talentHub')}</h1>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('donation')} className={`btn-flat bg-[#00FF7F] text-black px-10 py-3 font-bebas text-3xl border-4 border-black hover:bg-white`}>SUPPORT</button>
            <GlobalControls />
            <button onClick={() => setCurrentView('home')} className={`btn-flat ${ThemeStyles.accentBg} ${ThemeStyles.accentBtnText} px-10 py-3 font-bebas text-3xl border-4 ${ThemeStyles.border}`}>HOME</button>
          </div>
        </header>
        <main className="flex-1 p-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 overflow-y-auto relative custom-scrollbar">
          <button 
            onClick={() => { announce("Preparing talent contract."); }} 
            className={`border-[10px] border-dashed ${isDark ? 'border-slate-700 text-slate-700' : 'border-slate-300 text-slate-400'} flex flex-col items-center justify-center p-14 hover:bg-[#FF0080]/10 hover:border-[#FF0080] hover:text-[#FF0080] transition-all h-[580px] group`}
          >
            <PlusCircle className="w-32 h-32 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bebas text-6xl mt-12 tracking-tight uppercase">{t('signTalent')}</span>
          </button>
          {gameState.roster.map(star => (
            <div key={star.id} className={`${ThemeStyles.surface} border-[8px] ${ThemeStyles.border} ${ThemeStyles.text} flex flex-col overflow-hidden h-[580px] group transition-all hover:scale-[1.03]`}>
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative">
                 <div className="absolute top-6 left-6 z-20 bg-[#00FF7F] text-black px-4 py-2 text-[12px] font-black uppercase tracking-[0.2em] border-2 border-black">SYNC_LIVE</div>
                 {star.appearance.imageUrl ? (
                    <img src={star.appearance.imageUrl} alt={star.userName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                 ) : (
                    <Bot className="w-40 h-40 text-white/10 group-hover:text-[#FF0080]/40 transition-colors" />
                 )}
              </div>
              <div className={`p-10 border-t-8 ${ThemeStyles.border} flex justify-between items-center bg-inherit`}>
                 <div className="flex flex-col gap-2">
                    <h3 className="text-5xl font-bebas leading-none tracking-tight uppercase group-hover:text-[#FF0080] transition-colors">{star.userName}</h3>
                    <span className="text-[12px] font-black uppercase opacity-60 tracking-[0.3em]">{star.role}</span>
                 </div>
                 <button className="p-5 border-4 border-current hover:bg-[#FFFF00] hover:text-black transition-all hover:scale-110 active:scale-95">
                    <Cast className="w-8 h-8" />
                 </button>
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="fixed bottom-12 right-12 z-[300] flex flex-col items-end gap-8 pointer-events-none">
       {showPayoutToast && (
          <div className={`bg-[#00FF7F] border-[10px] border-black p-10 font-bebas text-5xl text-black animate-in slide-in-from-right-20 pointer-events-auto flex items-center gap-8 shadow-[0_0_50px_rgba(0,255,127,0.3)]`}>
             <div className="p-4 bg-black text-[#00FF7F] border-4 border-white"><DollarSign className="w-12 h-12" /></div>
             {payoutMessage}
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
