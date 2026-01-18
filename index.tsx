
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Tv, 
  Mic2, 
  Monitor, 
  Camera, 
  Globe, 
  Loader2, 
  Move, 
  Video, 
  Armchair, 
  BoxSelect, 
  Lamp, 
  History, 
  Share2, 
  PlusCircle, 
  Music2, 
  Piano, 
  Bot, 
  Maximize2, 
  RotateCw, 
  Grip, 
  Signal,
  Shield,
  MapPin,
  ChevronRight,
  UserPlus,
  Play,
  Layers,
  Zap,
  DollarSign,
  Sun,
  Moon,
  MessageSquare,
  BarChart3,
  Clapperboard,
  FastForward,
  Info,
  Settings2,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Music,
  Disc,
  Activity,
  Maximize,
  Ratio as AspectIcon,
  Sparkles,
  Search,
  Eye,
  Volume2,
  Wand2,
  Users,
  Grid3X3,
  Palette,
  Image as ImageIcon,
  Dices,
  PenTool
} from 'lucide-react';

// --- Internationalization (i18n) ---
const TRANSLATIONS: Record<string, any> = {
  en: { 
    appTitle: "MY TV STAR", 
    tagline: "THE ULTIMATE BROADCASTING SIMULATION", 
    startSim: "START SIMULATION", 
    login: "LOGIN", 
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
    unlimited: "UNLIMITED MODE"
  },
  id: { appTitle: "BINTANG TV SAYA", settings: "PENGATURAN", language: "BAHASA", hub: "PUSAT", signTalent: "KONTRAK TALENTA BARU", treasury: "PERBENDAHARAAN" },
  'zh-Hant': { appTitle: "我的電視明星", settings: "設置", language: "語言", hub: "中心", signTalent: "簽約新藝人", treasury: "金庫" },
  'zh-Hans': { appTitle: "我的电视明星", settings: "设置", language: "语言", hub: "中心", signTalent: "签约新艺人", treasury: "金库" },
  es: { appTitle: "MI ESTRELLA DE TV", settings: "AJUSTES", language: "IDIOMA", hub: "CENTRO", signTalent: "CONTRATAR TALENTO", treasury: "TESORERÍA" },
  fr: { appTitle: "MA STAR DE LA TÉLÉ", settings: "PARAMÈTRES", language: "LANGUE", hub: "ACCUEIL", signTalent: "SIGNER UN TALENT", treasury: "TRÉSORERIE" },
  pt: { appTitle: "MINHA ESTRELA DA TV", settings: "CONFIGURAÇÕES", language: "IDIOMA", hub: "HUB", signTalent: "CONTRATAR TALENTO", treasury: "TESOURARIA" },
  ru: { appTitle: "МОЯ ТЕЛЕЗВЕЗДА", settings: "НАСТРОЙКИ", language: "ЯЗЫК", hub: "ХАБ", signTalent: "ПОДПИСАТЬ ТАЛАНТ", treasury: "КАЗНАЧЕЙСТВО" },
  ar: { appTitle: "نجم التلفزيون الخاص بي", settings: "الإعدادات", language: "اللغة", hub: "المحور", signTalent: "توقيع موهبة جديدة", treasury: "الخزينة" },
  hi: { appTitle: "मेरा टीवी स्टार", settings: "सेटिंग्स", language: "भाषा", hub: "हब", signTalent: "नई प्रतिभा साइन करें", treasury: "खजाना" },
  bn: { appTitle: "আমার টিভি তারকা", settings: "সেটিংস", language: "ভাষা", hub: "হাব", signTalent: "নতুন প্রতিভা স্বাক্ষর করুন", treasury: "কোষাগار" },
  ur: { appTitle: "میرا ٹی وی اسٹار", settings: "ترتیبات", language: "زبان", hub: "مرکز", signTalent: "نیا ٹیلنٹ سائن کریں", treasury: "خزانہ" },
  ja: { appTitle: "マイ・TV・スター", settings: "設定", language: "言語", hub: "ハブ", signTalent: "新しいスターと契約", treasury: "財務局" },
  ko: { appTitle: "마이 TV 스타", settings: "설정", language: "언어", hub: "허브", signTalent: "새로운 인재 영입", treasury: "재무" }
};

const LANGUAGES_LIST = [
  { code: 'en', label: 'ENGLISH' }, { code: 'id', label: 'BAHASA INDONESIA' }, { code: 'zh-Hant', label: '繁體中文' }, { code: 'zh-Hans', label: '简体中文' },
  { code: 'es', label: 'ESPAÑOL' }, { code: 'fr', label: 'FRANÇAIS' }, { code: 'pt', label: 'PORTUGUÊS' }, { code: 'ru', label: 'РУССКИЙ' },
  { code: 'ar', label: 'العربية' }, { code: 'hi', label: 'हिन्दी' }, { code: 'bn', label: 'বাংলা' }, { code: 'ur', label: 'اردو' },
  { code: 'ja', label: '日本語' }, { code: 'ko', label: '한국어' }
];

type View = 'home' | 'login' | 'onboarding' | 'customization' | 'dashboard' | 'settings' | 'roster';

interface StarAppearance {
  ageGroup: string; gender: string; skintone: string; bodySize: string; hairstyle: string; hairColor: string; eyeColor: string; pose: string; top: string; bottom: string; footwear: string; makeup: string; headwear: string; accessories: string; primaryColor: string; secondaryColor: string; imageUrl?: string; studioFurniture: string; studioProps: string; studioLighting: string; studioBackdrop: string; studioSound: string; studioFX: string; studioAudience: string; studioFlooring: string; studioMonitors: string; cameraAngle: string; studioTheme: string; aspectRatio: string; imageSize: string; groundingEnabled: boolean;
}

interface CharacterProfile {
  id: string; userName: string; role: string; bio: string; popularity: number; level: number; earnings: number; appearance: StarAppearance;
}

interface GameState {
  language: string; money: number; roster: CharacterProfile[]; activeStarId: string | null; currentProducer: string; tutorialSeen: boolean; baseEarningAmount: number; baseEarningIntervalMs: number; theme: 'dark' | 'light';
}

const INITIAL_INSPIRATIONS: Record<string, string[]> = {
  ageGroup: ["Young Adults (18-24)", "Teenagers (13-17)", "Adults (25-44)"],
  gender: ['Male', 'Female', 'Non-Binary', 'Androgynous'],
  skintone: ["Warm", "Neutral", "Cool", "Olive"],
  bodySize: ["Petite", "Slim", "Average", "Athletic", "Curvy", "Plus Size", "Muscular"],
  pose: ['Dynamic Hero Pose', 'Expressive Laugh', 'Dramatic Finger Point', 'Stage Bow', 'Confident Lean'],
  top: ['Heroic Cape Jacket', 'Retro Cartoon Hoodie', 'Neon Studio Vest'],
  bottom: ['Wide-Leg Cartoon Pants', 'High-Waist Space Leggings', 'Cargo Utility Shorts'],
  footwear: ['Oversized Red Boots', 'Winged Sneakers', 'Electric High-Tops'],
  makeup: ['Star Eye Decal', 'Glowing Face Lines', 'Bold Comic Contouring'],
  headwear: ['Backward Star Cap', 'Cyber-Antennae Headband', 'Glowing Crown'],
  accessories: ['Holographic Scarf', 'Cyber-Goggles', 'Expressive Cape'],
  hairstyle: ['Spiky Hero Hair', 'Gravity-Defying Curls', 'Neon Buzz Cut'],
  hairColor: ['Neon Pink', 'Electric Blue', 'Jet Black', 'Pure White'],
  eyeColor: ['Crimson', 'Cyan', 'Lime', 'Gold'],
  primaryColor: ['Magenta', 'Cyan', 'Yellow', 'Lime'],
  studioTheme: ['Cyberpunk', 'Retro TV', 'Clean Minimal', 'Gothic Cathedral'],
  studioFurniture: ['Floating Holographic Podium', 'Retro Neon Desk', 'Victorian Armchair'],
  studioProps: ['Oversized Silver Microphone', 'Floating Teleprompter Droid'],
  studioLighting: ['Vibrant Multi-Color Spots', 'Cool Blue Key Lights'],
  studioBackdrop: ['City Rooftop Skyline', 'Sci-Fi Control Room', 'Floating Cloud Kingdom'],
  studioSound: ['High-Tech Lavalier', 'Professional Boom Mic'],
  studioFX: ['Floating Digital Particles', 'Dry Ice Fog'],
  studioAudience: ['Empty Studio', 'Live Cheering Crowd'],
  studioFlooring: ['Polished Chrome', 'High-Gloss Hardwood'],
  studioMonitors: ['CRT TV Wall', 'Floating Holographic Screens'],
  cameraAngle: ['Standard Mid-Shot', 'Low Angle Heroic', 'High Angle Cinematic'],
  aspectRatio: ["1:1", "4:3", "16:9", "9:16"],
  imageSize: ["1K", "2K", "4K"]
};

const DEFAULT_APPEARANCE: StarAppearance = {
  ageGroup: 'Young Adults (18-24)', gender: 'Non-Binary', skintone: "Neutral", bodySize: 'Average', hairstyle: 'Spiky Hero Hair', hairColor: 'Neon Pink', eyeColor: 'Cyan', pose: 'Dynamic Hero Pose', top: 'Retro Cartoon Hoodie', bottom: 'Wide-Leg Cartoon Pants', footwear: 'Oversized Red Boots', makeup: 'Star Eye Decal', headwear: 'Backward Star Cap', accessories: 'Cyber-Goggles', primaryColor: 'Magenta', secondaryColor: 'Cyan', studioFurniture: 'Floating Holographic Podium', studioProps: 'Oversized Silver Microphone', studioLighting: 'Vibrant Multi-Color Spots', studioBackdrop: 'City Rooftop Skyline', studioSound: 'High-Tech Lavalier', studioFX: 'Floating Digital Particles', studioAudience: 'Empty Studio', studioFlooring: 'Polished Chrome', studioMonitors: 'CRT TV Wall', cameraAngle: 'Standard Mid-Shot', studioTheme: 'Cyberpunk', aspectRatio: '1:1', imageSize: '1K', groundingEnabled: false
};

const MyTVStar = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    const isLoggedIn = localStorage.getItem('myTVStar_isLoggedIn') === 'true';
    const stateStr = localStorage.getItem('myTVStar_state');
    const state = stateStr ? JSON.parse(stateStr) : null;
    if (!isLoggedIn) return 'home';
    if (!state?.roster || state.roster.length === 0) return 'onboarding';
    return 'roster';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('myTVStar_isLoggedIn') === 'true');
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('myTVStar_state');
    if (!saved) return {
      language: 'en', money: 0, roster: [], activeStarId: null, currentProducer: 'PROD-' + Math.floor(Math.random() * 9000 + 1000), 
      tutorialSeen: false, baseEarningAmount: 5.00, baseEarningIntervalMs: 10 * 60 * 1000, theme: 'dark'
    };
    return JSON.parse(saved);
  });

  const t = (key: string) => TRANSLATIONS[gameState.language]?.[key] || TRANSLATIONS['en'][key] || key;
  const isDark = gameState.theme === 'dark';
  const activeStar = useMemo(() => gameState.roster.find(s => s.id === gameState.activeStarId) || null, [gameState.roster, gameState.activeStarId]);

  const [onAir, setOnAir] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const [breakingNews, setBreakingNews] = useState<string>("SYSTEM BOOT COMPLETE // ALL CHANNELS ACTIVE");
  const [tempStar, setTempStar] = useState<Partial<CharacterProfile>>({ appearance: DEFAULT_APPEARANCE });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showPayoutToast, setShowPayoutToast] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const [nextPayTime, setNextPayTime] = useState<number>(() => {
    const saved = localStorage.getItem('myTVStar_nextPay');
    return saved ? parseInt(saved) : Date.now() + gameState.baseEarningIntervalMs;
  });

  useEffect(() => {
    localStorage.setItem('myTVStar_state', JSON.stringify(gameState));
    localStorage.setItem('myTVStar_isLoggedIn', String(isLoggedIn));
    localStorage.setItem('myTVStar_nextPay', nextPayTime.toString());
  }, [gameState, isLoggedIn, nextPayTime]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const timer = setInterval(() => {
      const now = Date.now();
      if (now >= nextPayTime) {
        processReward(gameState.baseEarningAmount);
        setNextPayTime(Date.now() + gameState.baseEarningIntervalMs);
        setPayoutMessage(`+$${gameState.baseEarningAmount.toFixed(2)} NETWORK UPTIME BONUS`);
        setShowPayoutToast(true);
        setTimeout(() => setShowPayoutToast(false), 5000);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextPayTime, isLoggedIn]);

  const processReward = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + amount,
      roster: prev.roster.map(star => star.id === prev.activeStarId ? { ...star, earnings: (star.earnings || 0) + amount } : star)
    }));
  };

  const enhanceAttribute = async (key: string, currentVal: string) => {
    setIsEnhancing(key);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given the TV character attribute "${key}" with current value "${currentVal}", generate a highly creative, unique, and visually descriptive replacement (under 10 words). Output only the replacement text.`,
      });
      const newText = response.text?.trim() || currentVal;
      setTempStar(prev => ({
        ...prev,
        appearance: { ...prev.appearance!, [key]: newText }
      }));
    } catch (e) { console.error(e); }
    finally { setIsEnhancing(null); }
  };

  const generateStarAsset = async () => {
    setIsGeneratingImage(true);
    const s = tempStar as CharacterProfile;
    const app = s.appearance;
    const isPro = app.imageSize !== '1K' || app.groundingEnabled;
    const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    if (isPro) {
      try {
        if (!await (window as any).aistudio.hasSelectedApiKey()) await (window as any).aistudio.openSelectKey();
      } catch (e) { console.error(e); }
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `TV Studio character: ${s.userName} (${s.role}). Appearance: ${app.ageGroup}, ${app.gender}, ${app.bodySize} build, ${app.skintone} skin, ${app.hairstyle} (${app.hairColor}), ${app.eyeColor} eyes. Pose: ${app.pose}. Outfit: ${app.top}, ${app.bottom}, ${app.footwear}, ${app.makeup}, ${app.headwear}, ${app.accessories}. Studio Theme: ${app.studioTheme}. Studio Details: ${app.studioFurniture}, ${app.studioProps}, ${app.studioLighting}, ${app.studioBackdrop}, ${app.studioSound}, ${app.studioFX}, ${app.studioAudience}, ${app.studioFlooring}, ${app.studioMonitors}. Camera: ${app.cameraAngle}. Art Style: Modern 2D Stylized Animation, Cel-shaded. Aspect Ratio: ${app.aspectRatio}.`;
    
    try {
      const response = await ai.models.generateContent({
        model: model as any,
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: app.aspectRatio as any, imageSize: isPro ? (app.imageSize as any) : undefined } }
      });
      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; break; }
      }
      
      setGameState(prev => {
        const existingIdx = prev.roster.findIndex(r => r.id === s.id);
        const finalized = { ...s, id: s.id || Math.random().toString(36).substr(2, 9), appearance: { ...app, imageUrl }, popularity: s.popularity || 0, level: s.level || 1, earnings: s.earnings || 0 };
        if (existingIdx > -1) {
          const newRoster = [...prev.roster];
          newRoster[existingIdx] = finalized;
          return { ...prev, roster: newRoster, activeStarId: finalized.id };
        }
        return { ...prev, roster: [...prev.roster, finalized], activeStarId: finalized.id };
      });
      setCurrentView('dashboard');
    } catch (err) { alert("Generation Failed: " + err); } 
    finally { setIsGeneratingImage(false); }
  };

  const Logo = ({ className = "w-12 h-12" }) => (
    <div className={`flex items-center justify-center bg-white border-4 border-[#FF0080] ${className}`}>
      <Tv className="w-full h-full text-[#FF0080] p-1" />
    </div>
  );

  const GlobalControls = () => (
    <div className="flex items-center gap-2 relative z-[110]">
      <button onClick={() => setGameState(p => ({...p, theme: p.theme === 'dark' ? 'light' : 'dark'}))} className={`p-3 border-4 border-black transition-all ${isDark ? 'bg-[#FF0080] text-white' : 'bg-[#00FF7F] text-black'}`}>
        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>
      <div className="relative">
        <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className={`p-3 border-4 border-black flex items-center gap-2 transition-all ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'}`}>
          <Globe className="w-5 h-5" />
          <span className="font-bebas text-lg uppercase hidden md:block">{gameState.language}</span>
        </button>
        {showLanguageDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-black border-4 border-[#FFFF00] p-2 flex flex-col gap-2 min-w-[160px] max-h-[400px] overflow-y-auto custom-scrollbar">
            {LANGUAGES_LIST.map(lang => (
              <button key={lang.code} onClick={() => { setGameState(p => ({...p, language: lang.code})); setShowLanguageDropdown(false); }} className={`w-full p-2 text-left font-bebas text-xl text-white hover:bg-[#FF0080] transition-colors ${gameState.language === lang.code ? 'text-[#FFFF00] border-l-4 border-[#FFFF00] pl-3' : ''}`}>
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const Ticker = () => (
    <div className="h-10 bg-[#FF0080] border-b-4 border-black flex items-center overflow-hidden z-[60] relative">
      <div className="whitespace-nowrap flex items-center gap-20 animate-marquee">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-white font-black text-[10px] uppercase tracking-[0.4em]">
            // {t('appTitle')} NETWORK // {currentTime.toLocaleTimeString()} // {t('revenue').toUpperCase()} STREAM ACTIVE // $5.00 PAYOUT EVERY 10 MINS //
          </span>
        ))}
      </div>
    </div>
  );

  const Header = ({ title, showSettings = true }: { title: string, showSettings?: boolean }) => (
    <header className={`h-24 border-b-8 ${isDark ? 'border-white bg-slate-900' : 'border-black bg-white'} flex items-center justify-between px-8 transition-colors`}>
      <div className="flex items-center gap-6">
        <Logo />
        <span className={`font-bebas text-5xl uppercase ${isDark ? 'text-white' : 'text-black'}`}>{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <GlobalControls />
        {showSettings && (
          <button onClick={() => setCurrentView('settings')} className={`p-4 border-4 border-black ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-black'} hover:border-[#FF0080]`}>
            <Zap className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );

  // --- Views ---
  if (currentView === 'home') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-black'} overflow-y-auto custom-scrollbar relative h-screen transition-colors`}>
        <nav className="h-20 border-b-4 border-black flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
          <div className="flex items-center gap-4"><Logo className="w-10 h-10" /><span className="font-bebas text-3xl text-black">{t('appTitle')}</span></div>
          <div className="flex items-center gap-4">
            <GlobalControls />
            <button onClick={() => setCurrentView('login')} className="btn-flat bg-[#00FF7F] text-black px-8 py-2 font-bebas text-xl border-4 border-black">{t('login')}</button>
          </div>
        </nav>
        <section className="flex-1 flex flex-col items-center justify-center p-8 bg-grid text-center">
          <div className="bg-[#FF0080] text-white font-bebas text-2xl px-8 py-1 border-4 border-black transform -skew-x-12 mb-8">{t('tagline')}</div>
          <h1 className="font-bebas text-[10rem] leading-[0.8] mb-12">{t('appTitle')}</h1>
          <button onClick={() => setCurrentView('login')} className="btn-flat py-10 px-24 text-5xl bg-[#FFFF00] text-black border-[10px] border-black font-bebas hover:scale-105 transition-all">{t('startSim')}</button>
        </section>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950' : 'bg-slate-50'} h-screen transition-colors`}>
        <nav className="h-20 border-b-4 border-black flex items-center justify-between px-8">
           <div className="flex items-center gap-4"><Logo className="w-10 h-10" /><span className={`font-bebas text-3xl ${isDark ? 'text-white' : 'text-black'}`}>{t('appTitle')}</span></div>
           <GlobalControls />
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-grid">
           <div className="bg-white border-[8px] border-black p-12 max-w-lg w-full space-y-8 text-black">
              <h2 className="text-6xl font-bebas uppercase text-center">{t('identitySync')}</h2>
              <input value={gameState.currentProducer} onChange={(e) => setGameState(p => ({...p, currentProducer: e.target.value}))} className="w-full border-4 border-black p-8 text-2xl font-mono text-center" placeholder="PRODUCER_ID" />
              <button onClick={() => { setIsLoggedIn(true); setCurrentView('roster'); }} className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-4xl font-bebas border-8 border-black">{t('enterTerminal')}</button>
           </div>
        </div>
      </div>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950' : 'bg-slate-50'} h-screen transition-colors`}>
        <Ticker />
        <main className="flex-1 p-8 bg-grid flex items-center justify-center">
          <div className="bg-[#00FF7F] border-[12px] border-black p-16 max-w-4xl w-full text-black">
            <h2 className="text-9xl font-bebas text-center mb-8">{t('signTalent')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="space-y-4">
                  <label className="font-black uppercase tracking-widest text-xs">TALENT_ALIAS</label>
                  <input value={tempStar.userName || ''} onChange={(e) => setTempStar(p => ({...p, userName: e.target.value}))} className="w-full border-4 border-black p-6 text-2xl font-bebas" placeholder="NAME" />
               </div>
               <div className="space-y-4">
                  <label className="font-black uppercase tracking-widest text-xs">NETWORK_ROLE</label>
                  <input value={tempStar.role || ''} onChange={(e) => setTempStar(p => ({...p, role: e.target.value}))} className="w-full border-4 border-black p-6 text-2xl font-bebas" placeholder="ROLE (e.g. Pop Star)" />
               </div>
            </div>
            <button onClick={() => setCurrentView('customization')} className="w-full btn-flat py-12 bg-black text-white text-6xl font-bebas border-black border-[10px]">{t('assetConfig')}</button>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'customization') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-black'} h-screen overflow-hidden transition-colors`}>
        <Ticker />
        <header className={`h-24 border-b-8 ${isDark ? 'border-white bg-slate-900' : 'border-black bg-white'} flex items-center justify-between px-8 transition-colors`}>
          <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-5xl">{t('assetConfig')}</span></div>
          <div className="flex items-center gap-4"><GlobalControls /><button onClick={() => setCurrentView('roster')} className={`btn-flat ${isDark ? 'bg-white text-black' : 'bg-black text-white'} px-8 py-3 font-bebas text-xl border-4 border-black`}>BACK</button></div>
        </header>
        <main className="flex-1 flex flex-col lg:flex-row gap-8 p-8 overflow-hidden bg-grid">
           <div className={`${isDark ? 'bg-slate-900 border-white' : 'bg-white border-black'} border-[8px] p-8 overflow-y-auto custom-scrollbar flex-1 space-y-12`}>
              <div className="bg-[#FFFF00] text-black p-4 font-black text-center text-xs uppercase border-4 border-black mb-8">Unlimited Customization Active // Describe Anything Below</div>
              
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {Object.keys(tempStar.appearance || {}).filter(k => !['imageUrl', 'groundingEnabled', 'imageSize', 'aspectRatio'].includes(k)).map(key => (
                   <div key={key} className="space-y-2 group">
                      <div className="flex justify-between items-center">
                        <label className="font-black text-[10px] uppercase opacity-60 group-hover:opacity-100 transition-opacity">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <button 
                          onClick={() => enhanceAttribute(key, (tempStar.appearance as any)[key])} 
                          className={`p-1 hover:text-[#FF0080] transition-colors ${isEnhancing === key ? 'animate-spin' : ''}`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          list={`list-${key}`}
                          value={(tempStar.appearance as any)[key]} 
                          onChange={(e) => setTempStar(p => ({...p, appearance: {...p.appearance!, [key]: e.target.value}}))} 
                          className="w-full border-4 border-black p-3 font-mono text-xs uppercase bg-slate-50 text-black focus:bg-white focus:border-[#FF0080] transition-all outline-none"
                        />
                        <datalist id={`list-${key}`}>
                           {(INITIAL_INSPIRATIONS[key] || []).map(opt => <option key={opt} value={opt} />)}
                        </datalist>
                      </div>
                   </div>
                 ))}
              </section>

              <section className="pt-8 border-t-8 border-black/10 space-y-6">
                 <h3 className="font-bebas text-4xl">BROADCAST FRAMING</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["1:1", "4:3", "16:9", "9:16"].map(ratio => (
                      <button 
                        key={ratio}
                        onClick={() => setTempStar(p => ({...p, appearance: {...p.appearance!, aspectRatio: ratio}}))}
                        className={`btn-flat p-4 font-bebas text-2xl flex flex-col items-center gap-2 transition-all ${tempStar.appearance?.aspectRatio === ratio ? 'bg-[#FF0080] text-white border-[#000]' : 'bg-white text-black hover:bg-slate-100'}`}
                      >
                        <div className={`border-2 border-current mb-1 ${
                          ratio === '1:1' ? 'w-6 h-6' : 
                          ratio === '4:3' ? 'w-8 h-6' : 
                          ratio === '16:9' ? 'w-10 h-6' : 'w-4 h-8'
                        }`} />
                        {ratio}
                      </button>
                    ))}
                 </div>
              </section>

              <section className="pt-8 border-t-8 border-black/10 space-y-6">
                 <h3 className="font-bebas text-4xl">TECHNICAL SPECS</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="font-black text-[10px] uppercase">QUALITY (API KEY REQUIRED FOR 2K/4K)</label>
                       <select value={tempStar.appearance?.imageSize} onChange={(e) => setTempStar(p => ({...p, appearance: {...p.appearance!, imageSize: e.target.value}}))} className="w-full border-4 border-black p-3 font-bebas text-xl text-black">
                          {INITIAL_INSPIRATIONS.imageSize.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                 </div>
              </section>
           </div>

           <aside className="w-full lg:w-[450px] flex flex-col gap-6">
              <div className="flex-1 bg-black border-8 border-black flex flex-col items-center justify-center p-8 relative group overflow-hidden">
                 <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                 {isGeneratingImage ? <Loader2 className="w-24 h-24 text-[#00FF7F] animate-spin z-10" /> : <Bot className="w-40 h-40 text-slate-800 z-10" />}
                 <div className="font-bebas text-white text-4xl mt-6 z-10">{isGeneratingImage ? "SYNTHESIZING..." : "READY TO BROADCAST"}</div>
                 <div className="mt-8 text-[10px] font-mono text-slate-500 uppercase leading-relaxed text-center px-4">
                    Prompting: {tempStar.userName} as {tempStar.role} in {tempStar.appearance?.studioTheme} studio...
                 </div>
              </div>
              <button disabled={isGeneratingImage} onClick={generateStarAsset} className="w-full btn-flat py-12 bg-[#00FF7F] text-black text-6xl font-bebas border-[10px] border-black hover:bg-[#FF0080] hover:text-white transition-all disabled:opacity-50">
                 {isGeneratingImage ? "PROCESSING..." : (tempStar.id ? "UPDATE ASSET" : "GENERATE STAR")}
              </button>
           </aside>
        </main>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-black'} h-screen overflow-hidden transition-colors`}>
         <Ticker />
         <header className={`h-24 border-b-8 ${isDark ? 'border-white bg-slate-900' : 'border-black bg-white'} flex items-center justify-between px-8 transition-colors`}>
            <div className="flex items-center gap-6">
              <Logo />
              <div className="flex flex-col">
                <span className="font-bebas text-4xl uppercase leading-none">{activeStar?.userName}</span>
                <span className="font-bebas text-xl text-[#FF0080] leading-none">{activeStar?.role}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => { setTempStar(activeStar!); setCurrentView('customization'); }} className="btn-flat bg-[#FFFF00] text-black px-6 py-3 font-bebas text-xl border-4 border-black">EDIT TALENT</button>
               <GlobalControls />
               <button onClick={() => setCurrentView('roster')} className={`btn-flat ${isDark ? 'bg-white text-black' : 'bg-black text-white'} px-8 py-3 font-bebas text-xl border-4 border-black`}>HUB</button>
            </div>
         </header>
         <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden bg-grid">
            <div className="flex-1 flex flex-col bg-black border-[12px] border-black overflow-hidden relative">
               {onAir && <div className="absolute inset-0 border-[24px] border-red-600 animate-pulse pointer-events-none z-50" />}
               <div className="flex-1 flex items-center justify-center relative bg-slate-900 overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--magenta)_0%,_transparent_70%)] animate-pulse" />
                  {activeStar?.appearance.imageUrl && (
                    <img src={activeStar.appearance.imageUrl} className={`max-w-full max-h-full object-contain ${onAir ? 'glitch-effect' : ''}`} alt="Broadcast Star" />
                  )}
                  {onAir && (
                    <div className="absolute top-8 left-8 flex flex-col gap-2 z-[60]">
                       <div className="bg-red-600 text-white font-bebas text-4xl px-6 py-2 border-4 border-black animate-pulse">LIVE FEED</div>
                       <div className="bg-black/80 text-white font-mono text-xl p-4 border-2 border-white">SYNCING ASSET...</div>
                    </div>
                  )}
               </div>
               <div className="h-40 bg-slate-900 border-t-8 border-black p-4 grid grid-cols-5 gap-4">
                  {['PHOTO', 'VIDEO', 'SING', 'DANCE', 'PLAY'].map(a => (
                     <button key={a} onClick={() => alert("Simulating Activity...")} className="btn-flat bg-slate-800 text-slate-300 font-bebas text-2xl md:text-3xl border-4 border-black hover:bg-[#FF0080] hover:text-white transition-all">{a}</button>
                  ))}
               </div>
            </div>
            <aside className="w-full lg:w-[450px] flex flex-col gap-6">
               <div className={`${isDark ? 'bg-slate-900 border-white text-white' : 'bg-white border-black text-black'} border-8 p-6 space-y-4 transition-colors`}>
                  <div className="flex justify-between items-center"><span className="font-black text-xs opacity-40 uppercase tracking-widest">NETWORK STATUS</span><span className="font-bebas text-4xl text-[#00FF7F]">ONLINE</span></div>
                  <div className="flex justify-between items-center"><span className="font-black text-xs opacity-40 uppercase tracking-widest">RANK</span><span className="font-bebas text-4xl">LVL {activeStar?.level}</span></div>
                  <div className="flex justify-between items-center"><span className="font-black text-xs opacity-40 uppercase tracking-widest">TREASURY</span><span className="font-bebas text-5xl text-[#00FF7F]">${activeStar?.earnings.toFixed(2)}</span></div>
               </div>
               {!onAir ? (
                 <button onClick={() => setOnAir(true)} className="w-full btn-flat py-12 bg-[#00FF7F] text-black text-7xl font-bebas border-[12px] border-black hover:scale-105 transition-transform">GO LIVE</button>
               ) : (
                 <button onClick={() => setOnAir(false)} className="w-full btn-flat py-12 bg-slate-700 text-white text-7xl font-bebas border-[12px] border-black">OFF AIR</button>
               )}
               <div className="flex-1 bg-black border-8 border-black p-6 font-mono text-xs text-[#00FF7F] overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  <div className="text-white border-b-2 border-[#00FF7F] pb-2 font-black">STUDIO SPECS (UNLIMITED):</div>
                  {Object.entries(activeStar?.appearance || {}).filter(([k]) => k.startsWith('studio')).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="opacity-50 text-[8px] uppercase">{k}</span>
                      <span className="text-[10px]">{v as string}</span>
                    </div>
                  ))}
               </div>
            </aside>
         </main>
      </div>
    );
  }

  if (currentView === 'roster') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-black'} h-screen transition-colors`}>
        <Ticker />
        <Header title={t('talentHub')} />
        <main className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 bg-grid overflow-y-auto">
          <button onClick={() => { setTempStar({ appearance: DEFAULT_APPEARANCE }); setCurrentView('onboarding'); }} className={`border-8 border-dashed ${isDark ? 'border-slate-700 text-slate-700' : 'border-slate-300 text-slate-300'} flex flex-col items-center justify-center p-12 hover:bg-[#FF0080]/10 hover:border-[#FF0080] transition-all h-[450px]`}>
            <PlusCircle className="w-20 h-20" /><span className="font-bebas text-4xl mt-8">{t('signTalent')}</span>
          </button>
          {gameState.roster.map(star => (
            <div key={star.id} className={`${isDark ? 'bg-slate-900 border-white text-white' : 'bg-white border-black text-black'} border-8 flex flex-col overflow-hidden h-[450px] group transition-all`}>
              <div onClick={() => { setGameState(p => ({...p, activeStarId: star.id})); setCurrentView('dashboard'); }} className="flex-1 bg-black overflow-hidden cursor-pointer relative">
                {star.appearance.imageUrl && <img src={star.appearance.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={star.userName} />}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-24 h-24 text-white" />
                </div>
              </div>
              <div className={`p-6 border-t-8 ${isDark ? 'border-white' : 'border-black'} flex justify-between items-center bg-inherit`}>
                 <div className="flex flex-col">
                    <h3 className="text-3xl font-bebas truncate max-w-[150px]">{star.userName}</h3>
                    <span className="text-[#FF0080] font-black text-[10px] tracking-widest">${star.earnings.toFixed(2)} EARNED</span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setTempStar(star); setCurrentView('customization'); }} className="p-3 border-2 border-black hover:bg-[#FFFF00] hover:text-black transition-colors"><Edit3 className="w-5 h-5" /></button>
                    <button onClick={() => setGameState(p => ({...p, roster: p.roster.filter(s => s.id !== star.id)}))} className="p-3 border-2 border-black hover:bg-red-600 hover:text-white transition-colors"><Trash2 className="w-5 h-5" /></button>
                 </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-black'} h-screen transition-colors`}>
        <Ticker />
        <Header title={t('settings')} showSettings={false} />
        <main className="flex-1 p-8 md:p-16 max-w-5xl mx-auto w-full space-y-8 bg-grid overflow-y-auto">
           <div className={`${isDark ? 'bg-slate-900 border-white' : 'bg-white border-black'} border-[8px] p-8 md:p-12 space-y-12 transition-colors`}>
             <section className="space-y-6">
                <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest block">{t('language')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {LANGUAGES_LIST.map(lang => (
                    <button key={lang.code} onClick={() => setGameState(p => ({...p, language: lang.code}))} className={`btn-flat p-4 font-bebas text-xl border-4 border-black transition-all ${gameState.language === lang.code ? 'bg-[#FFFF00] text-black' : (isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-black hover:bg-white')}`}>{lang.label}</button>
                  ))}
                </div>
             </section>
             <section className="space-y-6">
                <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest block">{t('theme')}</label>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                   <button onClick={() => setGameState(p => ({...p, theme: 'light'}))} className={`btn-flat p-6 font-bebas text-3xl border-4 border-black flex items-center justify-center gap-4 transition-all ${!isDark ? 'bg-[#00FF7F] text-black' : 'bg-slate-800 text-white'}`}><Sun /> {t('light')}</button>
                   <button onClick={() => setGameState(p => ({...p, theme: 'dark'}))} className={`btn-flat p-6 font-bebas text-3xl border-4 border-black flex items-center justify-center gap-4 transition-all ${isDark ? 'bg-[#FF0080] text-white' : 'bg-slate-800 text-white'}`}><Moon /> {t('dark')}</button>
                </div>
             </section>
             <div className="pt-12 border-t-4 border-black/10">
                <button onClick={() => setCurrentView('roster')} className={`w-full btn-flat py-8 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} border-4 border-black text-3xl font-bebas uppercase transition-all`}>BACK TO HUB</button>
             </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4 pointer-events-none">
       {showPayoutToast && (
          <div className="bg-[#00FF7F] border-4 border-black p-6 font-bebas text-3xl text-black animate-in slide-in-from-right-12 pointer-events-auto">
             <DollarSign className="w-8 h-8 inline mr-2" />{payoutMessage}
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
