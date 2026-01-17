
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
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
  Twitter, 
  Facebook, 
  Instagram, 
  X, 
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
  DollarSign
} from 'lucide-react';

// --- Internationalization (i18n) ---
const TRANSLATIONS: Record<string, any> = {
  en: { 
    appTitle: "MY TV STAR", 
    tagline: "THE ULTIMATE BROADCASTING SIMULATION", 
    startSim: "START SIMULATION", 
    login: "LOGIN", 
    identitySync: "IDENTITY SYNC", 
    producerName: "Producer Identity", 
    age: "Age (5+)", 
    enterTerminal: "ENTER TERMINAL", 
    hub: "HUB", 
    live: "LIVE", 
    revenue: "REVENUE", 
    goLive: "GO LIVE", 
    endStream: "END STREAM", 
    snap: "SNAP ($1)", 
    video: "VIDEO ($2)", 
    sing: "SING ($3)",
    dance: "DANCE ($4)",
    instrument: "PLAY ($5)",
    share: "SHARE", 
    treasury: "TREASURY", 
    balance: "BALANCE", 
    withdraw: "WITHDRAW", 
    minWithdraw: "MIN WITHDRAWAL", 
    history: "HISTORY", 
    settings: "SETTINGS", 
    language: "LANGUAGE", 
    wipeData: "WIPE DATA", 
    talentHub: "TALENT HUB", 
    signTalent: "SIGN NEW TALENT", 
    assetConfig: "ASSET CONFIG", 
    generateStar: "GENERATE STAR", 
    talentPhysicality: "TALENT PHYSICALITY", 
    wardrobeStyle: "WARDROBE & STYLE", 
    studioSetup: "STUDIO SETUP", 
    broadcastSpecs: "BROADCAST SPECS", 
    stats: "STAR STATS", 
    lvl: "LVL", 
    popularity: "POPULARITY", 
    earnings: "EARNINGS", 
    manual: "NETWORK MANUAL", 
    acknowledge: "ACKNOWLEDGE", 
    rating: "For 5 Years and Above | Play-to-Earn Simulation Game", 
    instantPayout: "INSTANT PAYOUT", 
    success: "Instant Payout Successful!", 
    close: "CLOSE",
    editStudio: "EDIT STUDIO ITEMS",
    done: "DONE",
    placement: "PLACEMENT",
    scale: "SCALE",
    rotation: "ROTATION",
    furniture: "FURNITURE",
    props: "PROPS",
    lighting: "LIGHTING",
    sigAction: "SIGNATURE STYLE",
    statusReady: "STATUS: READY",
    encryptionActive: "ENCRYPTION: ACTIVE",
    uplinkConnected: "UPLINK: CONNECTED",
    featTalentTitle: "SIGN ELITE TALENT",
    featTalentDesc: "Discover and manage your own roster of rising stars.",
    featStudioTitle: "CUSTOM STUDIOS",
    featStudioDesc: "Drag-and-drop items to build your unique broadcast environment.",
    featEarnTitle: "EARN BIG REVENUE",
    featEarnDesc: "Monetize your streams and withdraw earnings instantly."
  },
  id: { 
    appTitle: "BINTANG TV SAYA", tagline: "SIMULASI PENYIARAN TERBAIK", startSim: "MULAI SIMULASI", login: "MASUK", identitySync: "SINKRONISASI IDENTITAS", producerName: "Identitas Produser", age: "Usia (5+)", enterTerminal: "MASUK TERMINAL", hub: "HUB", live: "LIVE", revenue: "PENDAPATAN", goLive: "SIARAN LANGSUNG", endStream: "AKHIRI SIARAN", snap: "FOTO ($1)", video: "VIDEO ($2)", sing: "NYANYI ($3)", dance: "JOGET ($4)", instrument: "MAIN ($5)", share: "BAGIKAN", treasury: "PERBENDAHARAAN", balance: "SALDO", withdraw: "TARIK TUNAI", minWithdraw: "MIN PENARIKAN", history: "RIWAYAT", settings: "PENGATURAN", language: "BAHASA", wipeData: "HAPUS DATA", talentHub: "PUSAT TALENTA", signTalent: "KONTRAK TALENTA BARU", assetConfig: "KONFIGURASI ASET", generateStar: "BUAT BINTANG", talentPhysicality: "FISIK TALENTA", wardrobeStyle: "WARDROBE & GAYA", studioSetup: "PENGATURAN STUDIO", broadcastSpecs: "SPEK PENYIARAN", stats: "STATISTIK BINTANG", lvl: "Lvl", popularity: "POPULARITAS", earnings: "PENGHASILAN", manual: "PANDUAN JARINGAN", acknowledge: "MENGERTI", rating: "Untuk 5 Tahun ke Atas | Play-to-Earn", instantPayout: "PEMBAYARAN INSTAN", success: "Pembayaran Berhasil!", shareDesc: "Siarkan ketenaran bintang Anda!", close: "TUTUP", editStudio: "EDIT ITEM STUDIO", done: "SELESAI", placement: "PENEMPATAN", scale: "SKALA", rotation: "ROTASI", furniture: "FURNITUR", props: "PROPERTI", lighting: "PENCAHAYAAN", sigAction: "GAYA KHAS", statusReady: "STATUS: SIAP", encryptionActive: "ENKRIPSI: AKTIF", uplinkConnected: "UPLINK: TERHUBUNG", featTalentTitle: "REKRUT TALENTA ELITE", featTalentDesc: "Temukan dan kelola daftar bintang baru Anda sendiri.", featStudioTitle: "STUDIO KUSTOM", featStudioDesc: "Geser-dan-lepas item untuk membangun lingkungan siaran unik Anda.", featEarnTitle: "DAPATKAN PENGHASILAN BESAR", featEarnDesc: "Uangkan streaming Anda dan tarik penghasilan secara instan."
  },
  es: { 
    appTitle: "MI ESTRELLA DE TV", tagline: "EL ÚLTIMO SIMULADOR DE TRANSMISIÓN", startSim: "INICIAR SIMULACIÓN", login: "INICIAR SESIÓN", identitySync: "SINCRONIZACIÓN DE IDENTIDAD", producerName: "Identidad del Productor", age: "Edad (5+)", enterTerminal: "ENTRAR AL TERMINAL", hub: "CENTRO", live: "EN VIVO", revenue: "INGRESOS", goLive: "TRANSMITIR", endStream: "TERMINAR VIVO", snap: "FOTO ($1)", video: "VIDEO ($2)", sing: "CANTAR ($3)", dance: "BAILAR ($4)", instrument: "TOCAR ($5)", share: "COMPARTIR", treasury: "TESORERÍA", balance: "SALDO", withdraw: "RETIRAR", minWithdraw: "RETIRO MÍN.", history: "HISTORIAL", settings: "AJUSTES", language: "IDIOMA", wipeData: "BORRAR DATOS", talentHub: "CENTRO de TALENTO", signTalent: "CONTRATAR TALENTO", assetConfig: "CONFIG. DE ASSETS", generateStar: "GENERAR ESTRELLA", stats: "ESTADÍSTICAS", lvl: "Nivel", popularity: "POPULARIDAD", earnings: "GANANCIAS", manual: "MANUAL DE RED", acknowledge: "ENTENDIDO", rating: "Para 5 años y más | Juego de simulación P2E", instantPayout: "PAGO INSTANTÁNEO", success: "¡Pago exitoso!", shareDesc: "¡Transmite la fama de tu estrella!", close: "CERRAR", editStudio: "EDITAR STUDIO", done: "LISTO", placement: "POSICIÓN", scale: "ESCALA", rotation: "ROTACIÓN", furniture: "MUEBLES", props: "ACCESORIOS", lighting: "ILUMINACIÓN", sigAction: "ESTILO FIRMA", statusReady: "ESTADO: LISTO", encryptionActive: "ENCRIPTACIÓN: ACTIVA", uplinkConnected: "UPLINK: CONECTADO", featTalentTitle: "FIRMA TALENTOS DE ÉLITE", featTalentDesc: "Descubre y gestiona tu propia lista de estrellas en ascenso.", featStudioTitle: "ESTUDIOS PERSONALIZADOS", featStudioDesc: "Arrastra y suelta elementos para construir tu entorno de transmisión único.", featEarnTitle: "GANA GRANDES INGRESOS", featEarnDesc: "Monetiza tus transmisiones y retira ganancias al instante."
  }
};

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'id', label: 'Bahasa Indonesia' }, { code: 'es', label: 'Español' }
];

// --- Constants ---
const IMAGE_MODEL = 'gemini-2.5-flash-image';

type View = 'home' | 'login' | 'onboarding' | 'customization' | 'dashboard' | 'settings' | 'wallet' | 'roster' | 'tutorial';
type CaptureMode = 'photo' | 'video' | 'sing' | 'dance' | 'instrument';
type PayoutType = 'bank' | 'wallet';

const FILTERS = [
  { label: 'STANDARD', class: '' }, { label: 'VINTAGE', class: 'sepia contrast-125 brightness-90' }, { label: 'CYBER', class: 'hue-rotate-180 saturate-200' }, { label: 'NOIR', class: 'grayscale contrast-150' }, { label: 'GLITCH', class: 'invert-[0.1] contrast-150 saturate-150' }
];

const DIGITAL_BANKS = ['Revolut', 'Monzo', 'Starling', 'N26', 'Chime'];

const GENERATED_SKINTONES = ["Tone 01 - Warm", "Tone 10 - Neutral", "Tone 20 - Cool", "Tone 30 - Olive"];

interface StudioTransform { x: number; y: number; scale: number; rotate: number; }

interface StarAppearance {
  gender: string; skintone: string; bodyHeight: string; bodyShape: string; bodySize: string; clothingSize: string; shoeSize: string; headwearSize: string; faceShape: string; hairstyle: string; hairColor: string; eyes: string; eyeColor: string; noseShape: string; lipShape: string; facialHair: string; pose: string; top: string; bottom: string; footwear: string; makeup: string; headwear: string; accessories: string; jewelry: string; material: string; texture: string; primaryColor: string; secondaryColor: string; imageUrl?: string; studioFurniture: string; studioProps: string; studioLighting: string; studioBackdrop: string; studioSound: string; studioFX: string; studioAudience: string; studioFlooring: string; studioMonitors: string; cameraAngle: string; studioMaterial: string; studioTheme: string; customDirective?: string;
}

interface CharacterProfile {
  id: string; userName: string; role: string; bio: string; popularity: number; level: number; earnings: number; appearance: StarAppearance; studioSetup: string; shootingLocation: string; creatorName?: string; studioUpgrades: string[]; signatureAction: CaptureMode; signatureSong: string; signatureGenre: string; studioTransforms: { furniture: StudioTransform; props: StudioTransform; lighting: StudioTransform; };
}

interface Transaction { id: string; amount: number; currency: string; provider: string; timestamp: number; status: 'Completed'; type: string; }

interface GameState {
  language: string; money: number; roster: CharacterProfile[]; activeStarId: string | null; transactions: Transaction[]; currentProducer: string; playerAge: number; parentalConsent: boolean; tutorialSeen: boolean; networkName: string; customRoles: string[]; customInspirations: Record<string, string[]>; draftStar?: Partial<CharacterProfile>; baseEarningAmount: number; baseEarningIntervalMs: number; streamHourlyRate: number; photoEarning: number; videoEarning: number; singEarning: number; danceEarning: number; instrumentEarning: number; minWithdrawal: number;
}

const INITIAL_ROLES = [ 'News Anchor', 'Talk Show Host', 'Sports Commentator', 'VJ', 'Podcaster', 'Pop Star', 'Celebrity Chef', 'Gamer' ];

const INITIAL_INSPIRATIONS: Record<string, string[]> = {
  pose: ['Dynamic Hero Pose', 'Expressive Laugh', 'Dramatic Finger Point', 'Stage Bow', 'Confident Lean'],
  top: ['Heroic Cape Jacket', 'Retro Cartoon Hoodie', 'Oversized Star T-Shirt', 'Neon Studio Vest'],
  bottom: ['Cargo Utility Shorts', 'Wide-Leg Cartoon Pants', 'High-Waist Space Leggings'],
  footwear: ['Oversized Red Boots', 'Winged Sneakers', 'Electric High-Tops'],
  makeup: ['Star Eye Decal', 'Glowing Face Lines', 'Bold Comic Contouring'],
  headwear: ['Backward Star Cap', 'Cyber-Antennae Headband', 'Glowing Crown'],
  accessories: ['Holographic Scarf', 'Cyber-Goggles', 'Expressive Cape'],
  jewelry: ['Golden Star Chain', 'Glowing Gem Studs', 'Cybernetic Wrist-Link'],
  gender: ['Male', 'Female', 'Non-Binary', 'Androgynous'],
  skintone: GENERATED_SKINTONES,
  bodyHeight: ["Short", "Average", "Tall"],
  bodyShape: ['Slender', 'Robust', 'Athletic', 'Curvy'],
  bodySize: ["S", "M", "L", "XL"],
  clothingSize: ["S", "M", "L", "XL"],
  shoeSize: ["38", "40", "42", "44"],
  headwearSize: ["S", "M", "L"],
  faceShape: ['Round', 'Angular', 'Square', 'Oval'],
  hairstyle: ['Spiky Hero Hair', 'Gravity-Defying Curls', 'Neon Buzz Cut'],
  hairColor: ['Neon Pink', 'Electric Blue', 'Jet Black', 'Pure White'],
  eyes: ['Oversized Glowing Blue', 'Electric Yellow Stars'],
  eyeColor: ['Crimson', 'Cyan', 'Lime', 'Gold'],
  noseShape: ['Small & Button', 'Angular & Sharp'],
  lipShape: ['Full & Pouty', 'Heart-Shaped'],
  facialHair: ['None', 'Designer Stubble', 'Stylized Sideburns'],
  material: ['Silk', 'Denim', 'Leather', 'Holographic'],
  texture: ['Plain', 'Striped', 'Polka Dot', 'Glitch'],
  primaryColor: ['Magenta', 'Cyan', 'Yellow', 'Lime', 'White'],
  studioMaterial: ['Neon Glow', 'Brushed Metal', 'Glossy Plastic'],
  studioTheme: ['Cyberpunk', 'Retro TV', 'Clean Minimal'],
  studioFurniture: ['Floating Holographic Podium', 'Retro Neon Desk', 'Inflatable Star Couch'],
  studioProps: ['Oversized Silver Microphone', 'Floating Teleprompter Droid', 'Neon On-Air Lightbox'],
  studioLighting: ['Vibrant Multi-Color Spots', 'Cool Blue Key Lights', 'Neon Pink Rim Glow'],
  studioBackdrop: ['City Rooftop Skyline', 'Sci-Fi Control Room', 'Floating Cloud Kingdom', 'Retro Arcade'],
  studioSound: ['Giant Boom Mic', 'Gold-Plated Headphones', 'High-Tech Lavalier'],
  studioFX: ['Floating Digital Particles', 'Stage Fog & Lasers', 'Confetti Blast'],
  studioAudience: ['Empty Studio', 'Cheering Fans', 'Robot Audience'],
  studioFlooring: ['Polished Chrome', 'Digital LED Grid', 'Red Carpet'],
  studioMonitors: ['CRT TV Wall', 'Ultra-Wide Curved LED', 'Floating Holograms'],
  cameraAngle: ['Low Angle Heroic', 'High Angle Cinematic', 'Wide Angle Establishing'],
  shootingLocation: ['Neon Sky Hub', 'Volcanic Broadcast Core', 'Space Station Network'],
};

const DEFAULT_STUDIO_TRANSFORM: StudioTransform = { x: 50, y: 50, scale: 1, rotate: 0 };
const DEFAULT_APPEARANCE: StarAppearance = {
  gender: 'Non-Binary', skintone: "Tone 10 - Neutral", bodyHeight: 'Average', bodyShape: 'Athletic', bodySize: 'M', clothingSize: 'M', shoeSize: '42', headwearSize: 'M', faceShape: 'Round', hairstyle: 'Spiky Hero Hair', hairColor: 'Neon Pink', eyes: 'Oversized Glowing Blue', eyeColor: 'Cyan', noseShape: 'Angular & Sharp', lipShape: 'Full & Pouty', facialHair: 'None', pose: 'Dynamic Hero Pose', top: 'Retro Cartoon Hoodie', bottom: 'Wide-Leg Cartoon Pants', footwear: 'Oversized Red Boots', makeup: 'Star Eye Decal', headwear: 'Backward Star Cap', accessories: 'Cyber-Goggles', jewelry: 'Golden Star Chain', material: 'Cotton', texture: 'Plain', primaryColor: 'Magenta', secondaryColor: 'Cyan', studioFurniture: 'Floating Holographic Podium', studioProps: 'Oversized Silver Microphone', studioLighting: 'Vibrant Multi-Color Spots', studioBackdrop: 'City Rooftop Skyline', studioSound: 'High-Tech Lavalier', studioFX: 'Floating Digital Particles', studioAudience: 'Empty Studio', studioFlooring: 'Polished Chrome', studioMonitors: 'CRT TV Wall', cameraAngle: 'Standard Mid-Shot', studioMaterial: 'Neon Glow', studioTheme: 'Cyberpunk', customDirective: ''
};

const Logo = ({ className = "w-12 h-12" }) => (
  <div className={`flex items-center justify-center bg-white border-4 border-[#FF0080] ${className}`}>
    <Tv className="w-full h-full text-[#FF0080] p-1" />
  </div>
);

const Ticker = ({ networkName }: { networkName: string }) => (
  <div className="h-10 bg-[#FF0080] border-b-4 border-black flex items-center overflow-hidden z-[60] relative">
    <div className="whitespace-nowrap flex items-center gap-20 animate-marquee">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="text-white font-black text-[10px] uppercase tracking-[0.4em]">
          {networkName} BROADCAST NETWORK // STATUS: OPTIMAL // ENCRYPTION: ACTIVE // ASSETS SYNCED: 100% // 
        </span>
      ))}
    </div>
  </div>
);

const MyTVStar = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    const isLoggedIn = localStorage.getItem('myTVStar_isLoggedIn') === 'true';
    const stateStr = localStorage.getItem('myTVStar_state');
    const state = stateStr ? JSON.parse(stateStr) : null;
    if (!isLoggedIn) return 'home';
    if (state && !state.tutorialSeen) return 'tutorial';
    if (!state?.roster || state.roster.length === 0) return 'onboarding';
    return 'roster';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('myTVStar_isLoggedIn') === 'true');
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('myTVStar_state');
    if (!saved) return {
      language: 'en', money: 0, roster: [], activeStarId: null, transactions: [], currentProducer: 'PROD-' + Math.floor(Math.random() * 9000 + 1000), playerAge: 18, parentalConsent: false, 
      draftStar: { 
        appearance: DEFAULT_APPEARANCE, bio: '', signatureAction: 'photo', signatureSong: 'UNLIMITED HITS', signatureGenre: 'Pop', 
        studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } 
      }, 
      tutorialSeen: false, networkName: 'MY TV STAR', customRoles: INITIAL_ROLES, customInspirations: INITIAL_INSPIRATIONS, 
      baseEarningAmount: 5.00, baseEarningIntervalMs: 10 * 60 * 1000, streamHourlyRate: 50.00, photoEarning: 1.00, videoEarning: 2.00, singEarning: 3.00, danceEarning: 4.00, instrumentEarning: 5.00, minWithdrawal: 20.00
    };
    return JSON.parse(saved);
  });

  const t = (key: string) => {
    const lang = gameState.language || 'en';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;
  };

  const isRTL = useMemo(() => ['ar', 'ur'].includes(gameState.language), [gameState.language]);
  const activeStar = useMemo(() => gameState.roster.find(s => s.id === gameState.activeStarId) || null, [gameState.roster, gameState.activeStarId]);

  const [onAir, setOnAir] = useState(false);
  const [streamRevenue, setStreamRevenue] = useState(0); 
  const [streamDuration, setStreamDuration] = useState(0); 
  const [viewerCount, setViewerCount] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [isSharing, setIsSharing] = useState(false);
  const [isEditingStudio, setIsEditingStudio] = useState(false);
  const [selectedEditItem, setSelectedEditItem] = useState<'furniture' | 'props' | 'lighting'>('furniture');
  const [activePerformanceType, setActivePerformanceType] = useState<CaptureMode | null>(null);
  const [selectedCaptureMode, setSelectedCaptureMode] = useState<CaptureMode>('video');
  const [isDragging, setIsDragging] = useState<null | 'furniture' | 'props' | 'lighting'>(null);

  const dragContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync selected capture mode with star's signature on mount or star change
  useEffect(() => {
    if (activeStar) {
      setSelectedCaptureMode(activeStar.signatureAction);
    }
  }, [activeStar]);

  const [nextPayTime, setNextPayTime] = useState<number>(() => {
    const saved = localStorage.getItem('myTVStar_nextPay');
    return saved ? parseInt(saved) : Date.now() + (gameState.baseEarningIntervalMs || 600000);
  });
  const [showPayoutToast, setShowPayoutToast] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [flashActive, setFlashActive] = useState(false);
  const [tempStar, setTempStar] = useState<Partial<CharacterProfile>>(gameState.draftStar || { appearance: DEFAULT_APPEARANCE, bio: '', signatureAction: 'photo', signatureSong: 'UNLIMITED HITS', signatureGenre: 'Pop', studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } });
  const [payoutProvider, setPayoutProvider] = useState<string>(DIGITAL_BANKS[0]);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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
        setPayoutMessage(`+$${gameState.baseEarningAmount.toFixed(2)} ${t('revenue')}`);
        setShowPayoutToast(true);
        setTimeout(() => setShowPayoutToast(false), 5000);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextPayTime, isLoggedIn, gameState.baseEarningAmount, gameState.baseEarningIntervalMs, gameState.language]);

  useEffect(() => {
    let streamInterval: number;
    if (onAir && isLoggedIn) {
      const perSec = gameState.streamHourlyRate / 3600;
      setViewerCount(Math.floor(Math.random() * 50) + 10);
      streamInterval = window.setInterval(() => {
        setStreamRevenue(prev => prev + perSec);
        setStreamDuration(prev => prev + 1);
        setViewerCount(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
      }, 1000);
    } else { setStreamDuration(0); setViewerCount(0); }
    return () => clearInterval(streamInterval);
  }, [onAir, isLoggedIn, gameState.streamHourlyRate]);

  useEffect(() => {
    if (isRecording) {
      const start = Date.now();
      const durationMs = 15000;
      const interval = setInterval(() => {
        const now = Date.now();
        const progress = ((now - start) / durationMs) * 100;
        if (now >= start + durationMs) {
          setIsRecording(false);
          setRecordProgress(0);
          
          let payout = gameState.videoEarning;
          if (activePerformanceType === 'sing') payout = gameState.singEarning;
          if (activePerformanceType === 'dance') payout = gameState.danceEarning;
          if (activePerformanceType === 'instrument') payout = gameState.instrumentEarning;
          if (activePerformanceType === 'photo') payout = gameState.photoEarning;

          processReward(payout, activePerformanceType?.toUpperCase() || 'VIDEO');
          setPayoutMessage(`+$${payout.toFixed(2)} ${activePerformanceType?.toUpperCase() || 'VIDEO'} ${t('revenue')}`);
          setShowPayoutToast(true);
          setTimeout(() => setShowPayoutToast(false), 8000);
          setActivePerformanceType(null);
          clearInterval(interval);
        } else { setRecordProgress(progress); }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording, activePerformanceType, gameState.videoEarning, gameState.singEarning, gameState.danceEarning, gameState.instrumentEarning, gameState.photoEarning, gameState.language]);

  const processReward = (amount: number, captureType?: string) => {
    setGameState(prev => {
      const newRoster = prev.roster.map(star => {
        if (star.id === prev.activeStarId) {
          const newPop = (star.popularity || 0) + Math.floor(amount * 5);
          const newLevel = newPop >= (star.level || 1) * 100 ? (star.level || 1) + 1 : (star.level || 1);
          return { ...star, earnings: (star.earnings || 0) + amount, popularity: newPop, level: newLevel };
        }
        return star;
      });
      return { ...prev, money: prev.money + amount, roster: newRoster };
    });
  };

  const capturePhoto = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);
    processReward(gameState.photoEarning, 'Photo');
    setPayoutMessage(`+$${gameState.photoEarning.toFixed(2)} SNAP ASSET`);
    setShowPayoutToast(true);
    setTimeout(() => setShowPayoutToast(false), 8000);
  };

  const triggerPerformance = (type: CaptureMode) => {
    if (isRecording) return;
    if (type === 'photo') {
        capturePhoto();
        return;
    }
    setActivePerformanceType(type);
    setIsRecording(true);
  };

  const toggleOnAir = () => {
    if (onAir) {
      processReward(streamRevenue);
      setPayoutMessage(`+$${streamRevenue.toFixed(2)} ${t('live')} ${t('revenue')}`);
      setShowPayoutToast(true);
      setTimeout(() => setShowPayoutToast(false), 5000);
      setStreamRevenue(0);
      setOnAir(false);
    } else {
      setOnAir(true);
      // Trigger a 15-second recording based on the selected capture mode
      triggerPerformance(selectedCaptureMode);
    }
  };

  const handleWithdrawal = async () => {
    if (gameState.money < gameState.minWithdrawal) return;
    setIsWithdrawing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const amount = gameState.money;
    const newTx: Transaction = {
      id: 'TX-' + Math.floor(Math.random() * 1000000).toString(36).toUpperCase(),
      amount: amount,
      currency: 'USD',
      provider: payoutProvider,
      timestamp: Date.now(),
      status: 'Completed',
      type: 'bank'
    };
    setGameState(prev => ({ ...prev, money: 0, transactions: [newTx, ...prev.transactions] }));
    setIsWithdrawing(false);
    alert(t('success'));
  };

  const createNewStar = async () => {
    setIsGeneratingImage(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const s = tempStar as CharacterProfile;
    const appearance = s.appearance;
    
    const prompt = `Stylized 2D character design Cartoon Network art style. 
    Character: ${s.userName}, a ${s.role} known for ${s.signatureAction}. 
    Physicality: Gender: ${appearance.gender}, Skintone: ${appearance.skintone}, Height: ${appearance.bodyHeight}, Body: ${appearance.bodyShape}, Face: ${appearance.faceShape}, Hair: ${appearance.hairstyle} in ${appearance.hairColor}.
    Studio Environment: Theme: ${appearance.studioTheme}, Backdrop: ${appearance.studioBackdrop}, Camera: ${appearance.cameraAngle}, Location: ${s.shootingLocation}.`;
    
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL, contents: { parts: [{ text: prompt }] }, config: { imageConfig: { aspectRatio: "1:1" } }
      });
      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) { if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; break; } }
      const newId = s.id || Math.random().toString(36).substr(2, 9);
      const finalizedStar: CharacterProfile = { ...s, id: newId, appearance: { ...appearance, imageUrl }, popularity: 0, level: 1, earnings: 0 };
      setGameState(prev => ({ ...prev, roster: s.id ? prev.roster.map(star => star.id === newId ? finalizedStar : star) : [...prev.roster, finalizedStar], activeStarId: newId }));
      setCurrentView('dashboard');
    } catch (err) { alert("Generation failed."); } 
    finally { setIsGeneratingImage(false); }
  };

  const handleTransformChange = (item: 'furniture' | 'props' | 'lighting', field: keyof StudioTransform, value: number) => {
    setTempStar(prev => ({
      ...prev,
      studioTransforms: {
        ...prev.studioTransforms!,
        [item]: {
          ...prev.studioTransforms![item],
          [field]: value
        }
      }
    }));
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragContainerRef.current) return;
    const rect = dragContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    handleTransformChange(isDragging, 'x', Math.round(x));
    handleTransformChange(isDragging, 'y', Math.round(y));
  };

  const renderHeader = (title: string, onBack?: () => void) => (
    <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
      <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-5xl md:text-6xl text-white uppercase">{title}</span></div>
      {onBack && <button onClick={onBack} className="btn-flat bg-white text-black px-12 py-5 font-bebas text-xl border-4 border-black hover:bg-slate-200 uppercase">{t('hub')}</button>}
    </header>
  );

  return (
    <div className={`app-container min-h-screen bg-slate-950 flex flex-col font-sans overflow-hidden ${isRTL ? 'rtl text-right' : 'ltr text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {showPayoutToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-[#00FF7F] text-black border-4 border-black px-10 py-5 font-black text-xl animate-bounce">
          {payoutMessage}
        </div>
      )}

      {currentView === 'home' && (
        <div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto custom-scrollbar">
          {/* Top Bar / Navigation */}
          <nav className="h-20 border-b-4 border-slate-900 bg-slate-950 flex items-center justify-between px-8 md:px-16 sticky top-0 z-[100] backdrop-blur-md bg-opacity-80">
            <div className="flex items-center gap-4">
              <Logo className="w-10 h-10" />
              <span className="font-bebas text-3xl text-white uppercase tracking-tighter">{t('appTitle')}</span>
            </div>
            <div className="flex items-center gap-8">
              <button className="hidden md:block font-bebas text-xl text-slate-400 hover:text-white uppercase transition-colors">Talent</button>
              <button className="hidden md:block font-bebas text-xl text-slate-400 hover:text-white uppercase transition-colors">Studio</button>
              <button className="hidden md:block font-bebas text-xl text-slate-400 hover:text-white uppercase transition-colors">Earnings</button>
              <button onClick={() => setCurrentView('login')} className="btn-flat bg-[#00FF7F] text-black px-8 py-2 font-bebas text-xl border-4 border-black hover:bg-white">{t('login')}</button>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-8 md:p-24 bg-grid overflow-hidden border-b-[12px] border-slate-900">
            {/* Background Decorative HUD */}
            <div className="absolute top-10 left-10 flex flex-col gap-2 pointer-events-none opacity-40">
              <div className="flex items-center gap-3 text-red-600 font-black animate-pulse">
                <div className="w-4 h-4 bg-red-600 rounded-full" />
                <span className="font-bebas text-2xl tracking-widest">ON AIR</span>
              </div>
              <div className="font-mono text-[#00FF7F] text-lg font-bold">
                {currentTime.toLocaleTimeString([], { hour12: false })}
              </div>
            </div>
            <div className="absolute bottom-10 right-10 flex items-center gap-6 pointer-events-none opacity-40">
              <Signal className="w-10 h-10 text-[#FFFF00]" />
              <div className="border-4 border-[#FFFF00] px-4 py-1 font-bebas text-xl text-[#FFFF00]">CH 01</div>
            </div>

            <div className="max-w-6xl w-full flex flex-col items-center z-20 text-center">
              <div className="inline-block bg-[#FF0080] text-white font-bebas text-xl md:text-2xl px-8 py-1 border-4 border-black transform -skew-x-12 mb-8">
                {t('tagline')}
              </div>
              
              <h1 className="font-bebas text-white text-[12vw] md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter mb-12 drop-shadow-[0_0_60px_rgba(255,0,128,0.15)]">
                {t('appTitle')}
              </h1>

              <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl px-4">
                <button onClick={() => setCurrentView('login')} className="flex-1 btn-flat py-10 text-5xl text-black bg-[#FFFF00] border-[10px] border-black font-bebas hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                  <Play className="w-10 h-10 fill-current" /> {t('startSim')}
                </button>
              </div>

              <div className="mt-16 flex items-center gap-12 text-slate-500 font-bebas text-2xl uppercase">
                 <span className="flex items-center gap-3"><Zap className="w-6 h-6 text-[#00FF7F]" /> PLAY-TO-EARN</span>
                 <span className="flex items-center gap-3"><Monitor className="w-6 h-6 text-[#FF0080]" /> 1080P SIMULATION</span>
                 <span className="flex items-center gap-3"><Globe className="w-6 h-6 text-[#00FFFF]" /> GLOBAL NETWORK</span>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
          </section>

          {/* Feature Showcase Section */}
          <section className="py-24 px-8 md:px-24 bg-slate-950 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
             <div className="bg-slate-900 border-[6px] border-white p-10 flex flex-col gap-6 hover:border-[#FF0080] transition-colors group">
                <div className="w-20 h-20 bg-black flex items-center justify-center border-4 border-white group-hover:border-[#FF0080] transition-colors">
                  <UserPlus className="w-10 h-10 text-[#FF0080]" />
                </div>
                <h3 className="font-bebas text-4xl text-white uppercase">{t('featTalentTitle')}</h3>
                <p className="text-slate-400 font-medium leading-relaxed uppercase text-sm tracking-wider">
                  {t('featTalentDesc')}
                </p>
             </div>
             <div className="bg-slate-900 border-[6px] border-white p-10 flex flex-col gap-6 hover:border-[#00FFFF] transition-colors group">
                <div className="w-20 h-20 bg-black flex items-center justify-center border-4 border-white group-hover:border-[#00FFFF] transition-colors">
                  <Layers className="w-10 h-10 text-[#00FFFF]" />
                </div>
                <h3 className="font-bebas text-4xl text-white uppercase">{t('featStudioTitle')}</h3>
                <p className="text-slate-400 font-medium leading-relaxed uppercase text-sm tracking-wider">
                  {t('featStudioDesc')}
                </p>
             </div>
             <div className="bg-slate-900 border-[6px] border-white p-10 flex flex-col gap-6 hover:border-[#00FF7F] transition-colors group">
                <div className="w-20 h-20 bg-black flex items-center justify-center border-4 border-white group-hover:border-[#00FF7F] transition-colors">
                  <DollarSign className="w-10 h-10 text-[#00FF7F]" />
                </div>
                <h3 className="font-bebas text-4xl text-white uppercase">{t('featEarnTitle')}</h3>
                <p className="text-slate-400 font-medium leading-relaxed uppercase text-sm tracking-wider">
                  {t('featEarnDesc')}
                </p>
             </div>
          </section>

          {/* Footer Section */}
          <footer className="bg-black py-16 px-8 md:px-24 border-t-[12px] border-slate-900">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-4">
                      <Logo className="w-12 h-12" />
                      <span className="font-bebas text-5xl text-white uppercase">{t('appTitle')}</span>
                   </div>
                   <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] max-w-md">
                     {t('rating')}
                   </p>
                </div>
                <div className="flex gap-16">
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bebas text-2xl text-[#FF0080] uppercase">Connect</h4>
                      <div className="flex gap-4">
                         <Twitter className="w-6 h-6 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                         <Instagram className="w-6 h-6 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                         <Facebook className="w-6 h-6 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                      </div>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bebas text-2xl text-[#00FF7F] uppercase">Support</h4>
                      <span className="text-slate-500 font-bebas text-xl hover:text-white cursor-pointer uppercase transition-colors">Privacy</span>
                      <span className="text-slate-500 font-bebas text-xl hover:text-white cursor-pointer uppercase transition-colors">Terms</span>
                   </div>
                </div>
             </div>
             <div className="mt-16 pt-8 border-t border-slate-900 text-center text-slate-800 font-mono text-[10px] uppercase tracking-widest">
                © 2025 MY TV STAR NETWORK // ALL RIGHTS RESERVED // BROADCAST_STATION_SIMULATOR_V3
             </div>
          </footer>
        </div>
      )}

      {currentView === 'login' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-grid">
          <div className="max-w-lg w-full bg-slate-900 border-[8px] border-white p-12 md:p-16 space-y-12">
            <h2 className="text-6xl md:text-7xl font-bebas text-white uppercase text-center tracking-widest">{t('identitySync')}</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); if(!gameState.tutorialSeen) setCurrentView('tutorial'); else setCurrentView('roster'); }} className="space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest">{t('producerName')}</label>
                <input required value={gameState.currentProducer} onChange={(e) => setGameState(p => ({...p, currentProducer: e.target.value}))} className="w-full bg-black border-4 border-slate-800 p-8 text-2xl text-white font-mono outline-none focus:border-[#00FF7F] transition-colors" placeholder="PRODUCER_ID" />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest">{t('age')}</label>
                <input required type="number" min={5} value={gameState.playerAge} onChange={(e) => setGameState(p => ({...p, playerAge: parseInt(e.target.value)}))} className="w-full bg-black border-4 border-slate-800 p-8 text-2xl text-white font-mono outline-none focus:border-[#00FF7F] transition-colors" />
              </div>
              <button type="submit" className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-4xl font-bebas border-8 border-black uppercase hover:bg-white">{t('enterTerminal')}</button>
            </form>
          </div>
        </div>
      )}

      {currentView === 'roster' && (
        <>
          {renderHeader(t('talentHub'))}
          <main className="flex-1 p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 overflow-y-auto custom-scrollbar bg-grid">
            <button onClick={() => { setTempStar({ appearance: DEFAULT_APPEARANCE, userName: '', role: 'Pop Star', signatureAction: 'sing', shootingLocation: 'Neon Sky Hub', studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } }); setCurrentView('onboarding'); }} className="bg-slate-900 border-[8px] border-dashed border-slate-700 hover:border-[#FF0080] hover:bg-[#FF0080]/5 flex flex-col items-center justify-center p-12 md:p-16 group transition-all">
              <PlusCircle className="w-20 h-20 md:w-24 md:h-24 text-slate-700 group-hover:text-[#FF0080] transform group-hover:rotate-90 transition-transform" />
              <span className="font-bebas text-4xl md:text-5xl text-slate-700 group-hover:text-[#FF0080] mt-8">{t('signTalent')}</span>
            </button>
            {gameState.roster.map(star => (
              <div key={star.id} onClick={() => { setGameState(p => ({ ...p, activeStarId: star.id })); setCurrentView('dashboard'); }} className="bg-slate-900 border-[8px] border-white hover:border-[#FF0080] transition-all cursor-pointer group flex flex-col overflow-hidden transform hover:-translate-y-2">
                <div className="aspect-square bg-black relative overflow-hidden">
                  {star.appearance.imageUrl ? <img src={star.appearance.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-600 w-16 h-16" /></div>}
                  <div className="absolute top-4 right-4 bg-white text-black px-4 py-1 font-bebas text-xl border-4 border-black z-10">LVL {star.level}</div>
                </div>
                <div className="p-8 border-t-8 border-white group-hover:bg-[#FF0080]/10 transition-colors">
                  <h3 className="text-4xl font-bebas text-white uppercase mb-4">{star.userName}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] md:text-[12px] font-black text-[#FF0080] uppercase tracking-widest">{t('popularity')}: {star.popularity.toLocaleString()}</span>
                    <span className="text-[10px] md:text-[12px] font-black text-[#00FF7F] uppercase tracking-widest">${star.earnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </main>
        </>
      )}

      {currentView === 'onboarding' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-grid">
          <div className="bg-slate-900 border-[8px] border-white p-12 md:p-16 max-w-2xl w-full space-y-12">
            <h2 className="text-5xl md:text-6xl font-bebas text-white uppercase text-center">TALENT REGISTRATION</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest">Stage Name</label>
                <input value={tempStar.userName || ''} onChange={(e) => setTempStar(p => ({...p, userName: e.target.value}))} className="w-full bg-black border-4 border-slate-800 p-8 text-3xl text-white font-bebas outline-none focus:border-[#00FF7F]" placeholder="STAR_NAME" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest">Primary Role</label>
                <select value={tempStar.role || 'Pop Star'} onChange={(e) => setTempStar(p => ({...p, role: e.target.value}))} className="w-full bg-black border-4 border-slate-800 p-6 md:p-8 text-2xl text-white font-bebas outline-none">
                  {gameState.customRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest">{t('sigAction')}</label>
                <select value={tempStar.signatureAction || 'sing'} onChange={(e) => setTempStar(p => ({...p, signatureAction: e.target.value as CaptureMode}))} className="w-full bg-black border-4 border-slate-800 p-6 md:p-8 text-2xl text-white font-bebas outline-none">
                  <option value="sing">SINGING</option>
                  <option value="dance">DANCING</option>
                  <option value="instrument">INSTRUMENTAL</option>
                  <option value="video">ACTING / HOSTING</option>
                  <option value="photo">MODELING</option>
                </select>
              </div>
            </div>
            <button disabled={!tempStar.userName} onClick={() => setCurrentView('customization')} className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-5xl font-bebas border-8 border-black uppercase">{t('assetConfig')}</button>
          </div>
        </div>
      )}

      {currentView === 'customization' && (
        <>
          {renderHeader(t('assetConfig'), () => setCurrentView('onboarding'))}
          <main className="flex-1 p-8 md:p-10 flex flex-col lg:flex-row gap-10 overflow-hidden bg-grid relative">
            {isEditingStudio && (
              <div className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex flex-col overflow-hidden">
                <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900">
                  <div className="flex items-center gap-6 text-[#00FF7F]"><BoxSelect className="w-10 h-10 md:w-12 md:h-12" /><span className="font-bebas text-5xl md:text-6xl uppercase">{t('editStudio')}</span></div>
                  <button onClick={() => setIsEditingStudio(false)} className="btn-flat bg-[#00FF7F] text-black px-12 py-5 font-bebas text-xl border-4 border-black uppercase">{t('done')}</button>
                </header>
                <div className="flex-1 flex flex-col lg:flex-row p-8 md:p-10 gap-10 overflow-hidden">
                  <div 
                    ref={dragContainerRef}
                    onMouseMove={handleDragMove}
                    onMouseUp={() => setIsDragging(null)}
                    onMouseLeave={() => setIsDragging(null)}
                    onTouchMove={handleDragMove}
                    onTouchEnd={() => setIsDragging(null)}
                    className="flex-1 bg-black border-[12px] border-white relative flex items-center justify-center overflow-hidden cursor-crosshair"
                  >
                     <div className="w-full h-full bg-grid-large relative opacity-50">
                        {(['furniture', 'props', 'lighting'] as const).map((item) => (
                           <div 
                             key={item}
                             onMouseDown={(e) => { e.stopPropagation(); setIsDragging(item); setSelectedEditItem(item); }}
                             className={`absolute border-4 flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-100 ${isDragging === item ? 'border-white bg-white/20 z-50' : 'border-slate-500 bg-slate-500/10'}`}
                             style={{ 
                               left: `${tempStar.studioTransforms?.[item].x}%`, 
                               top: `${tempStar.studioTransforms?.[item].y}%`,
                               width: `${80 * (tempStar.studioTransforms?.[item].scale || 1)}px`,
                               height: `${80 * (tempStar.studioTransforms?.[item].scale || 1)}px`,
                               transform: `translate(-50%, -50%) rotate(${tempStar.studioTransforms?.[item].rotate}deg)`
                             }}>
                             {item === 'furniture' && <Armchair className="text-white w-1/2 h-1/2" />}
                             {item === 'props' && <PlusCircle className="text-white w-1/2 h-1/2" />}
                             {item === 'lighting' && <Lamp className="text-white w-1/2 h-1/2" />}
                             <Grip className="absolute bottom-1 right-1 w-3 h-3 text-white/40" />
                        </div>
                        ))}
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                       <span className="font-bebas text-2xl md:text-3xl text-slate-700 uppercase tracking-widest">DRAG ITEMS TO POSITION</span>
                     </div>
                  </div>
                  <aside className="lg:w-[500px] bg-slate-900 border-[8px] border-white p-8 md:p-12 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
                     <div className="grid grid-cols-3 gap-4">
                       {(['furniture', 'props', 'lighting'] as const).map(item => (
                         <button key={item} onClick={() => setSelectedEditItem(item)} className={`btn-flat p-4 md:p-6 font-bebas text-xl md:text-2xl border-4 ${selectedEditItem === item ? 'bg-[#FF0080] text-white border-black' : 'bg-black text-slate-500 border-slate-800'}`}>
                           {t(item)}
                         </button>
                       ))}
                     </div>
                     <div className="space-y-10 md:space-y-12">
                        <div className="space-y-4 md:space-y-6">
                           <label className="text-[12px] md:text-[14px] font-black text-white uppercase flex items-center justify-between"><span className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#FF0080]" /> X POS</span><span className="font-mono text-[#FF0080]">{tempStar.studioTransforms?.[selectedEditItem].x}%</span></label>
                           <input type="range" min="0" max="100" value={tempStar.studioTransforms?.[selectedEditItem].x} onChange={(e) => handleTransformChange(selectedEditItem, 'x', parseInt(e.target.value))} className="w-full h-8 md:h-10 bg-black appearance-none border-4 border-slate-800 accent-[#FF0080] cursor-pointer" />
                        </div>
                        <div className="space-y-4 md:space-y-6">
                           <label className="text-[12px] md:text-[14px] font-black text-white uppercase flex items-center justify-between"><span className="flex items-center gap-4"><Move className="w-5 h-5 text-[#FF0080]" /> Y POS</span><span className="font-mono text-[#FF0080]">{tempStar.studioTransforms?.[selectedEditItem].y}%</span></label>
                           <input type="range" min="0" max="100" value={tempStar.studioTransforms?.[selectedEditItem].y} onChange={(e) => handleTransformChange(selectedEditItem, 'y', parseInt(e.target.value))} className="w-full h-8 md:h-10 bg-black appearance-none border-4 border-slate-800 accent-[#FF0080] cursor-pointer" />
                        </div>
                        <div className="space-y-4 md:space-y-6">
                           <label className="text-[12px] md:text-[14px] font-black text-white uppercase flex items-center justify-between"><span className="flex items-center gap-4"><Maximize2 className="w-5 h-5 text-[#FF0080]" /> {t('scale')}</span><span className="font-mono text-[#FF0080]">{tempStar.studioTransforms?.[selectedEditItem].scale}x</span></label>
                           <input type="range" min="0.1" max="3" step="0.1" value={tempStar.studioTransforms?.[selectedEditItem].scale} onChange={(e) => handleTransformChange(selectedEditItem, 'scale', parseFloat(e.target.value))} className="w-full h-8 md:h-10 bg-black appearance-none border-4 border-slate-800 accent-[#FF0080] cursor-pointer" />
                        </div>
                        <div className="space-y-4 md:space-y-6">
                           <label className="text-[12px] md:text-[14px] font-black text-white uppercase flex items-center justify-between"><span className="flex items-center gap-4"><RotateCw className="w-5 h-5 text-[#FF0080]" /> {t('rotation')}</span><span className="font-mono text-[#FF0080]">{tempStar.studioTransforms?.[selectedEditItem].rotate}°</span></label>
                           <input type="range" min="0" max="360" value={tempStar.studioTransforms?.[selectedEditItem].rotate} onChange={(e) => handleTransformChange(selectedEditItem, 'rotate', parseInt(e.target.value))} className="w-full h-8 md:h-10 bg-black appearance-none border-4 border-slate-800 accent-[#FF0080] cursor-pointer" />
                        </div>
                     </div>
                  </aside>
                </div>
              </div>
            )}
            <div className="flex-1 bg-slate-900 border-[8px] border-white p-10 md:p-12 overflow-y-auto custom-scrollbar space-y-16 md:space-y-20">
              {[
                { title: t('talentPhysicality'), color: '#FF0080', keys: ['gender', 'skintone', 'bodyHeight', 'bodyShape', 'hairstyle', 'hairColor', 'pose'] },
                { title: t('wardrobeStyle'), color: '#0000FF', keys: ['top', 'bottom', 'footwear', 'material', 'primaryColor'] },
                { title: t('studioSetup'), color: '#00FF7F', keys: ['studioFurniture', 'studioProps', 'studioLighting', 'studioBackdrop', 'cameraAngle'] }
              ].map(cat => (
                <section key={cat.title} className="space-y-8 md:space-y-10">
                  <div className="flex items-center justify-between border-b-8 border-white pb-6">
                    <h4 className="text-4xl md:text-5xl font-bebas uppercase" style={{ color: cat.color }}>{cat.title}</h4>
                    {cat.title === t('studioSetup') && (
                      <button onClick={() => setIsEditingStudio(true)} className="btn-flat bg-[#FF0080] text-white px-6 md:px-8 py-2 md:py-3 font-bebas text-2xl md:text-3xl border-4 border-black hover:bg-white hover:text-black transition-colors">
                        {t('editStudio')}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {cat.keys.map(key => (
                      <div key={key} className="space-y-3 md:space-y-4">
                        <label className="text-[10px] md:text-[12px] font-black text-slate-500 uppercase tracking-widest">{key.replace('studio', 'studio ').replace('body', 'body ').replace('camera', 'camera ')}</label>
                        <select 
                          value={(tempStar.appearance as any)?.[key] || ''} 
                          onChange={(e) => setTempStar(p => ({ ...p, appearance: { ...p.appearance!, [key]: e.target.value } }))}
                          className="w-full bg-black border-4 border-slate-800 p-4 md:p-6 text-white font-bebas text-2xl md:text-3xl outline-none focus:border-[#FF0080]"
                        >
                          {(gameState.customInspirations[key] || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <aside className="lg:w-[450px] md:w-[500px] bg-slate-900 border-[8px] border-white p-8 md:p-12 flex flex-col gap-10 md:gap-12">
               <h3 className="text-4xl md:text-5xl font-bebas text-white uppercase border-b-8 border-black pb-6 text-center tracking-widest">STAR PREVIEW</h3>
               <div className="flex-1 bg-black border-4 border-slate-800 flex items-center justify-center text-center p-12 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-grid-large opacity-10" />
                 <Bot className={`w-32 h-32 md:w-40 md:h-40 relative z-10 transition-all duration-500 ${isGeneratingImage ? 'animate-bounce text-[#00FF7F] scale-125' : 'text-slate-800 group-hover:text-slate-600'}`} />
                 {isEditingStudio && <div className="absolute inset-0 bg-[#FF0080]/10 flex items-center justify-center font-black text-sm text-[#FF0080] uppercase tracking-widest animate-pulse">DRAG_ACTIVE</div>}
               </div>
               <button disabled={isGeneratingImage || !tempStar.userName} onClick={createNewStar} className="w-full btn-flat py-10 md:py-12 bg-[#00FF7F] text-black text-5xl md:text-6xl font-bebas border-8 border-black uppercase disabled:opacity-30 disabled:cursor-not-allowed">
                 {isGeneratingImage ? <Loader2 className="w-12 h-12 animate-spin mx-auto" /> : t('generateStar')}
               </button>
            </aside>
          </main>
        </>
      )}

      {currentView === 'dashboard' && (
        <>
          <Ticker networkName={t('appTitle')} />
          {renderHeader("LIVE TERMINAL", () => setCurrentView('roster'))}
          <main className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-10 overflow-hidden bg-grid relative">
            <div className="flex-1 flex flex-col bg-black border-[12px] border-white overflow-hidden relative group">
              {onAir && <div className="absolute inset-0 border-[24px] border-red-600 animate-pulse pointer-events-none z-50" />}
              {flashActive && <div className="absolute inset-0 bg-white z-[100] animate-pulse" />}
              
              <div className="p-8 md:p-12 bg-slate-900 border-b-8 border-white flex justify-between items-center z-40">
                <div className="flex flex-col"><span className="text-4xl md:text-6xl font-bebas text-white uppercase leading-none">{activeStar?.userName}</span><span className="text-2xl md:text-3xl font-bebas text-[#FF0080] uppercase tracking-widest">{activeStar?.role}</span></div>
                {!onAir ? (
                  <button onClick={toggleOnAir} className="btn-flat px-20 md:px-28 py-8 md:py-10 text-black border-8 border-black text-3xl md:text-5xl font-bebas bg-[#00FF7F] hover:bg-white uppercase transition-all">{t('goLive')}</button>
                ) : (
                  <button onClick={toggleOnAir} className="btn-flat px-20 md:px-28 py-8 md:py-10 bg-slate-700 text-white border-8 border-black text-3xl md:text-5xl font-bebas hover:bg-red-600 uppercase transition-all">{t('endStream')}</button>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden p-12 md:p-16 bg-black flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                {onAir && (
                  <div className="bg-[#00FF7F]/10 border-8 border-[#00FF7F] p-12 md:p-16 text-center space-y-6 md:space-y-8 w-full max-w-4xl z-10 backdrop-blur-md">
                    <div className="font-bebas text-7xl md:text-[10rem] text-[#00FF7F] leading-none">{viewerCount.toLocaleString()} {t('live').toUpperCase()}</div>
                    <div className="font-mono text-3xl md:text-5xl text-white tracking-[0.2em]">{formatDuration(streamDuration)}</div>
                    <div className="text-4xl md:text-6xl font-bebas text-white pt-6 md:pt-8 border-t-4 border-[#00FF7F]/30 uppercase tracking-widest">${streamRevenue.toFixed(2)} NET REVENUE</div>
                  </div>
                )}
                {isRecording && !onAir && (
                  <div className="flex flex-col items-center gap-8 md:gap-10 animate-pulse z-10">
                     {activePerformanceType === 'sing' && <Mic2 className="w-32 h-32 md:w-48 md:h-48 text-[#00FFFF]" />}
                     {activePerformanceType === 'dance' && <Music2 className="w-32 h-32 md:w-48 md:h-48 text-[#FF0080]" />}
                     {activePerformanceType === 'instrument' && <Piano className="w-32 h-32 md:w-48 md:h-48 text-[#FFFF00]" />}
                     {activePerformanceType === 'video' && <Video className="w-32 h-32 md:w-48 md:h-48 text-[#FFFF00]" />}
                     <span className="font-bebas text-4xl md:text-6xl text-white uppercase tracking-tighter text-center">RECORDING_SIGNAL_ACTIVE...</span>
                  </div>
                )}
              </div>
              
              <div className="h-48 md:h-56 bg-slate-900 border-t-8 border-white p-6 md:p-8 grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 z-40">
                <button onClick={() => setSelectedCaptureMode('photo')} className={`btn-flat transition-all ${selectedCaptureMode === 'photo' ? 'bg-[#FF0080] text-white' : 'bg-slate-800 text-slate-400'} text-xl md:text-2xl font-bebas border-4 border-black flex flex-col items-center justify-center gap-2 md:gap-3`}><Camera className="w-8 h-8 md:w-10 md:h-10" />{t('snap')}</button>
                <button onClick={() => setSelectedCaptureMode('video')} className={`btn-flat transition-all ${selectedCaptureMode === 'video' ? 'bg-[#FFFF00] text-black' : 'bg-slate-800 text-slate-400'} text-xl md:text-2xl font-bebas border-4 border-black flex flex-col items-center justify-center gap-2 md:gap-3`}><Video className="w-8 h-8 md:w-10 md:h-10" />{t('video')}</button>
                <button onClick={() => setSelectedCaptureMode('sing')} className={`btn-flat transition-all ${selectedCaptureMode === 'sing' ? 'bg-[#00FFFF] text-black' : 'bg-slate-800 text-slate-400'} text-xl md:text-2xl font-bebas border-4 border-black flex flex-col items-center justify-center gap-2 md:gap-3`}><Mic2 className="w-8 h-8 md:w-10 md:h-10" />{t('sing')}</button>
                <button onClick={() => setSelectedCaptureMode('dance')} className={`btn-flat transition-all ${selectedCaptureMode === 'dance' ? 'bg-[#FF00FF] text-white' : 'bg-slate-800 text-slate-400'} text-xl md:text-2xl font-bebas border-4 border-black flex flex-col items-center justify-center gap-2 md:gap-3`}><Music2 className="w-8 h-8 md:w-10 md:h-10" />{t('dance')}</button>
                <button onClick={() => setSelectedCaptureMode('instrument')} className={`btn-flat transition-all ${selectedCaptureMode === 'instrument' ? 'bg-[#00FF00] text-black' : 'bg-slate-800 text-slate-400'} text-xl md:text-2xl font-bebas border-4 border-black flex flex-col items-center justify-center gap-2 md:gap-3`}><Piano className="w-8 h-8 md:w-10 md:h-10" />{t('instrument')}</button>
                <button onClick={() => setIsSharing(true)} className="btn-flat bg-white text-black text-2xl md:text-3xl font-bebas border-4 border-black uppercase flex flex-col items-center justify-center gap-2 md:gap-3"><Share2 className="w-8 h-8 md:w-10 md:h-10" />{t('share')}</button>
              </div>
              {isRecording && <div className="absolute bottom-48 md:bottom-56 left-0 w-full h-4 md:h-6 bg-black border-t-4 border-white z-50"><div className="h-full bg-red-600 transition-all duration-100" style={{ width: `${recordProgress}%` }} /></div>}
            </div>
            
            <aside className="lg:w-[450px] md:w-[500px] flex flex-col gap-10 md:gap-12">
              <div className="aspect-square bg-black border-[12px] border-white overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {activeStar?.appearance.imageUrl ? <img src={activeStar?.appearance.imageUrl} className={`w-full h-full object-cover ${selectedFilter.class}`} /> : <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-800 w-16 h-16" /></div>}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white text-black px-6 py-3 md:px-8 md:py-4 font-bebas text-3xl md:text-4xl border-4 border-black z-10">{activeStar?.userName}</div>
              </div>
              <div className="bg-slate-900 border-[12px] border-white p-10 md:p-12 space-y-10 flex-1 flex flex-col">
                <h3 className="text-5xl md:text-6xl font-bebas text-white uppercase border-b-8 border-black pb-6 text-center tracking-widest">{t('stats')}</h3>
                <div className="space-y-8 md:space-y-10 flex-1">
                  <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4"><span className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.3em]">{t('lvl')}</span><span className="text-5xl md:text-7xl font-bebas text-white leading-none">{activeStar?.level}</span></div>
                  <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4"><span className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.3em]">{t('popularity')}</span><span className="text-5xl md:text-7xl font-bebas text-[#FF0080] leading-none">{activeStar?.popularity.toLocaleString()}</span></div>
                  <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4"><span className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.3em]">{t('earnings')}</span><span className="text-5xl md:text-7xl font-bebas text-[#00FF7F] leading-none">${activeStar?.earnings.toFixed(2)}</span></div>
                </div>
                <button onClick={() => setCurrentView('wallet')} className="w-full btn-flat py-6 md:py-8 bg-[#FFFF00] text-black font-bebas text-3xl md:text-4xl border-8 border-black uppercase hover:bg-white transition-all">{t('treasury')}</button>
              </div>
            </aside>
          </main>
        </>
      )}

      {currentView === 'settings' && (
        <>
          {renderHeader(t('settings'), () => setCurrentView('roster'))}
          <main className="flex-1 p-16 max-w-4xl mx-auto w-full space-y-12 bg-grid overflow-y-auto">
            <div className="bg-slate-900 border-[8px] border-white p-12 space-y-8">
               <label className="text-xs font-black text-[#FF0080] uppercase tracking-widest block">{t('language')}</label>
               <select value={gameState.language} onChange={(e) => setGameState(p => ({...p, language: e.target.value}))} className="w-full bg-black border-4 border-slate-800 p-8 text-4xl text-white font-bebas outline-none uppercase">
                 {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
               </select>
            </div>
            <button onClick={() => { if(confirm("PERMANENTLY WIPE DATA?")) { localStorage.clear(); window.location.reload(); } }} className="w-full btn-flat py-8 bg-red-600 text-white border-4 border-black hover:bg-red-500 text-3xl font-bebas uppercase">{t('wipeData')}</button>
          </main>
        </>
      )}

      {currentView === 'wallet' && (
        <>
          {renderHeader(t('treasury'), () => setCurrentView('dashboard'))}
          <main className="flex-1 p-10 md:p-16 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 md:gap-24 overflow-hidden bg-grid">
            <div className="bg-slate-900 border-[12px] border-white p-12 md:p-20 flex flex-col gap-12 md:gap-16 text-center justify-center transform hover:scale-[1.02] transition-transform">
              <h3 className="text-4xl md:text-5xl font-bebas text-[#FF0080] uppercase tracking-widest">{t('balance')}</h3>
              <div className="text-8xl md:text-[10rem] lg:text-[12rem] font-bebas text-white leading-none">${gameState.money.toFixed(2)}</div>
              <button disabled={gameState.money < gameState.minWithdrawal || isWithdrawing} onClick={handleWithdrawal} className="w-full btn-flat py-12 md:py-16 bg-[#FFFF00] text-black text-5xl md:text-7xl font-bebas border-[16px] border-black uppercase disabled:opacity-10 transition-all">{t('withdraw')}</button>
              <div className="text-slate-500 font-mono text-lg md:text-xl uppercase tracking-widest">MIN: ${gameState.minWithdrawal.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900 border-[8px] border-white p-10 md:p-16 flex flex-col overflow-hidden">
               <h3 className="text-5xl md:text-6xl font-bebas text-white uppercase border-b-8 border-black pb-6 md:pb-8 mb-8 md:mb-10 text-center tracking-[0.2em]">{t('history')}</h3>
               <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4">
                 {gameState.transactions.length === 0 && <div className="text-center py-20 text-slate-700 font-bebas text-4xl uppercase">NO_DATA</div>}
                 {gameState.transactions.map(tx => (
                   <div key={tx.id} className="bg-black border-4 border-slate-800 p-6 md:p-8 flex justify-between items-center uppercase transform hover:border-[#00FF7F] transition-colors">
                     <div className="flex flex-col">
                       <span className="text-2xl md:text-3xl font-bebas text-white">{tx.provider}</span>
                       <span className="text-[10px] md:text-xs font-mono text-slate-500">{new Date(tx.timestamp).toLocaleString()}</span>
                     </div>
                     <span className="text-4xl md:text-5xl font-bebas text-[#00FF7F]">-${tx.amount.toFixed(2)}</span>
                   </div>
                 ))}
               </div>
            </div>
          </main>
        </>
      )}

      {currentView === 'tutorial' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-grid">
          <div className="max-w-5xl w-full bg-[#00FF7F] border-[12px] border-black p-12 md:p-20 space-y-12 md:space-y-16">
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-bebas text-black uppercase text-center leading-none tracking-tighter">{t('manual')}</h2>
            <div className="space-y-8 md:space-y-10 font-black text-lg md:text-xl uppercase tracking-[0.3em] text-black leading-relaxed text-center">
              <p className="border-b-4 border-black/20 pb-6">Welcome, Executive Producer. Your mission is to build the ultimate TV empire.</p>
              <p className="border-b-4 border-black/20 pb-6">Sign talents, build custom studios via DRAG-AND-DROP, and go LIVE.</p>
              <p>Revenue ($5) accumulates every 10 mins of simulation uptime.</p>
            </div>
            <button onClick={() => { setGameState(prev => ({ ...prev, tutorialSeen: true })); setCurrentView('roster'); }} className="w-full btn-flat py-12 md:py-16 bg-black text-white text-6xl md:text-7xl font-bebas border-8 border-black uppercase hover:bg-white hover:text-black transition-all">{t('acknowledge')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

const formatDuration = (sec: number) => { 
  const h = Math.floor(sec / 3600).toString().padStart(2, '0'); 
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0'); 
  const s = (sec % 60).toString().padStart(2, '0'); 
  return `${h}:${m}:${s}`; 
};

createRoot(document.getElementById('root')!).render(<MyTVStar />);
