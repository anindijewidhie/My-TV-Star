
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Tv, 
  Mic2, 
  DollarSign, 
  Star, 
  Play, 
  TrendingUp, 
  Users, 
  Monitor, 
  Clock, 
  Sparkles, 
  Camera, 
  LogOut, 
  Globe, 
  Settings, 
  Shield, 
  Zap, 
  Palette, 
  Loader2, 
  Wand2, 
  RefreshCcw, 
  CheckCircle2, 
  Move, 
  ChevronLeft, 
  Cast, 
  ArrowRight, 
  Video, 
  Aperture, 
  Armchair, 
  BoxSelect, 
  Lamp, 
  Radio, 
  History, 
  CreditCard, 
  Activity, 
  Cpu, 
  Lock, 
  Wifi, 
  Database, 
  Smartphone, 
  Gamepad2, 
  Cloud, 
  Layers, 
  BarChart3, 
  Server, 
  Share2, 
  Plus, 
  Award, 
  ZapOff, 
  BarChart, 
  UserCheck, 
  AlertTriangle,
  Save,
  Layout,
  Music,
  Dna,
  FileText,
  Trophy,
  HelpCircle,
  Volume2,
  MonitorSmartphone,
  BookOpen,
  Edit3,
  Terminal,
  Trash2,
  Shirt,
  UserCircle,
  Filter,
  Maximize,
  Headphones,
  Settings2,
  Sliders,
  Coins,
  Brush,
  Scissors,
  Eye,
  Box,
  MapPin,
  ChevronRight,
  Music2,
  Disc,
  BarChart4,
  CheckCircle,
  Shapes,
  Piano,
  Target,
  SmartphoneNfc,
  Apple,
  Bot,
  Fan,
  Watch,
  Gem,
  Glasses,
  Crown,
  Layers3,
  Paintbrush2,
  Component,
  PlusCircle,
  Type as TypeIcon,
  Search,
  Timer,
  Eye as EyeOpen,
  Wallet,
  Building2,
  Smartphone as PhoneIcon
} from 'lucide-react';

// --- Constants & Types ---
const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const AGE_RATING_TEXT = "For 5 Years and Above | Parental Control for Players Aged under 18 years old | Play-to-Earn Simulation Game";

type View = 'home' | 'login' | 'onboarding' | 'customization' | 'dashboard' | 'settings' | 'wallet' | 'roster' | 'tutorial';
type CaptureMode = 'photo' | 'video' | 'sing' | 'dance' | 'instrument';
type PerformanceDuration = 15 | 30 | 45 | 60 | 120; 
type PerformanceVocalMode = 'vocal' | 'instrumental';
type PayoutType = 'bank' | 'wallet';

const ASPECT_RATIOS = [
  { label: '1:1', value: 'aspect-square' },
  { label: '4:5', value: 'aspect-[4/5]' },
  { label: '16:9', value: 'aspect-video' },
  { label: '9:16', value: 'aspect-[9/16]' },
  { label: '2.39:1', value: 'aspect-[2.39/1]' }
];

const FILTERS = [
  { label: 'STANDARD', class: '' },
  { label: 'VINTAGE', class: 'sepia contrast-125 brightness-90' },
  { label: 'CYBER', class: 'hue-rotate-180 saturate-200' },
  { label: 'NOIR', class: 'grayscale contrast-150' },
  { label: 'GLITCH', class: 'invert-[0.1] contrast-150 saturate-150' }
];

const DIGITAL_BANKS = ['Revolut', 'Monzo', 'Starling', 'N26', 'Chime', 'NuBank', 'Ally', 'TymeBank', 'Digibank', 'Wise'];
const E_WALLETS = ['PayPal', 'Venmo', 'CashApp', 'GrabPay', 'GCash', 'Dana', 'GoPay', 'ShopeePay', 'Apple Pay', 'Google Pay', 'Alipay'];

const UNDERTONES = ["warm", "neutral warm", "neutral", "neutral cool", "cool", "cool olive", "neutral olive", "warm olive"];
const TONE_LEVELS = Array.from({ length: 36 }, (_, i) => (i * 2).toString().padStart(2, '0'));
const GENERATED_SKINTONES = TONE_LEVELS.flatMap(level => 
  UNDERTONES.map(undertone => `Tone ${level} - ${undertone}`)
);

interface StudioTransform {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

interface StarAppearance {
  gender: string;
  skintone: string;
  bodyHeight: string;
  bodyShape: string;
  bodySize: string;
  clothingSize: string;
  shoeSize: string;
  headwearSize: string;
  faceShape: string;
  hairstyle: string;
  eyes: string;
  pose: string;
  top: string;
  bottom: string;
  footwear: string;
  makeup: string;
  headwear: string;
  accessories: string;
  jewelry: string;
  material: string;
  texture: string;
  primaryColor: string;
  secondaryColor: string;
  imageUrl?: string;
  studioFurniture: string;
  studioProps: string;
  studioLighting: string;
  studioBackdrop: string;
  studioSound: string;
  studioFX: string;
  cameraAngle: string;
  studioMaterial: string;
  studioTheme: string;
  customDirective?: string;
}

interface CharacterProfile {
  id: string;
  userName: string;
  role: string;
  bio: string;
  popularity: number;
  level: number;
  earnings: number;
  appearance: StarAppearance;
  studioSetup: string;
  shootingLocation: string;
  creatorName?: string;
  studioUpgrades: string[];
  signatureAction: CaptureMode;
  signatureSong: string;
  signatureGenre: string;
  studioTransforms: {
    furniture: StudioTransform;
    props: StudioTransform;
    lighting: StudioTransform;
  };
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  timestamp: number;
  status: 'Completed';
  type: string;
}

interface GameState {
  money: number;
  roster: CharacterProfile[];
  activeStarId: string | null;
  transactions: Transaction[];
  currentProducer: string;
  playerAge: number;
  parentalConsent: boolean;
  tutorialSeen: boolean;
  networkName: string;
  customRoles: string[];
  customInspirations: Record<string, string[]>;
  draftStar?: Partial<CharacterProfile>;
  baseEarningAmount: number;
  baseEarningIntervalMs: number;
  streamHourlyRate: number;
  photoEarning: number;
  videoEarning: number;
  minWithdrawal: number;
}

const INITIAL_ROLES = [
  'News Anchor', 'Talk Show Host', 'Sports Commentator', 'VJ', 'Podcaster', 'Game Show Host',
  'Pop Star', 'Stand-up Comedian', 'Drag Queen', 'Magician', 'DJ', 'Opera Singer', 'Vocalist',
  'Celebrity Chef', 'Tech Reviewer', 'Fashion Guru', 'Fitness Coach', 'ASMR Artist', 'Gamer', 'Makeup Artist'
];

const HEIGHTS = ["Tiny", "Short", "Petite", "Average", "Above Average", "Tall", "Towering", "Gigantic"];
const CLOTHING_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "OVERSIZED"];

const INITIAL_INSPIRATIONS: Record<string, string[]> = {
  pose: ['Dynamic Hero Pose', 'Expressive Laugh', 'Dramatic Finger Point', 'Stage Bow', 'Confident Lean', 'Wacky Jump', 'Epic Mic Holding'],
  top: ['Heroic Cape Jacket', 'Retro Cartoon Hoodie', 'Oversized Star T-Shirt', 'Neon Studio Vest', 'Classic Pop Star Sequins', 'Futuristic Tech-Suit Top', 'Vintage 90s Windbreaker'],
  bottom: ['Cargo Utility Shorts', 'Wide-Leg Cartoon Pants', 'High-Waist Space Leggings', 'Glowing Side-Stripe Slacks', 'Expressive Belted Skirt', 'Cyber-Punk Joggers'],
  footwear: ['Oversized Red Boots', 'Winged Sneakers', 'Electric High-Tops', 'Magical Glass Shoes', 'Cyber-Punk Platforms', 'Bouncy Cartoon Loafers'],
  makeup: ['Star Eye Decal', 'Glowing Face Lines', 'Bold Comic Contouring', 'Expressive Glitter Mask', 'Neon Lip Outline'],
  headwear: ['Backward Star Cap', 'Cyber-Antennae Headband', 'Glowing Crown', 'Classic Beret', 'Heroic Cowl', 'Top Hat', 'Neon Headphones'],
  accessories: ['Holographic Scarf', 'Cyber-Goggles', 'Expressive Cape', 'Floating Tech-Droid', 'Neon Sash'],
  jewelry: ['Golden Star Chain', 'Glowing Gem Studs', 'Cybernetic Wrist-Link', 'Emerald Heart Ring', 'Neon Choker'],
  gender: ['Male', 'Female', 'Transgender', 'Genderfluid', 'Non-Binary', 'Androgynous', 'Two-Spirit', 'Agender'],
  skintone: GENERATED_SKINTONES,
  bodyHeight: HEIGHTS,
  bodyShape: ['Slender', 'Robust', 'Athletic', 'Curvy', 'Short & Round', 'Top-Heavy', 'Lanky'],
  bodySize: CLOTHING_SIZES,
  clothingSize: CLOTHING_SIZES,
  shoeSize: ["36", "38", "40", "42", "44", "46"],
  headwearSize: ["XS", "S", "M", "L", "XL"],
  faceShape: ['Round', 'Angular', 'Square', 'Heart-shaped', 'Oval'],
  hairstyle: ['Spiky Hero Hair', 'Gravity-Defying Curls', 'Neon Buzz Cut', 'Techno-Pigtails', 'Sleek Geometric Bob', 'Afro-Cloud'],
  eyes: ['Oversized Glowing Blue', 'Electric Yellow Stars', 'Fiery Red Hearts', 'Void Black Buttons', 'Sparkling Emerald'],
  material: ['Silk', 'Denim', 'Leather', 'Holographic', 'Cotton', 'Metallic', 'Velvet', 'Latex', 'Plasma Skin'],
  texture: ['Plain', 'Striped', 'Polka Dot', 'Glitch', 'Camo', 'Gradient', 'Diamond-Stitched', 'Fur-Trimmed'],
  primaryColor: ['Magenta', 'Cyan', 'Yellow', 'Lime', 'Black', 'White', 'Purple', 'Orange', 'Silver', 'Gold'],
  studioMaterial: ['Neon Glow', 'Brushed Metal', 'Glossy Plastic', 'Raw Wood', 'Holographic Glass', 'Vantablack'],
  studioTheme: ['Cyberpunk', 'Retro TV', 'Clean Minimal', 'Dark Network', 'Pastel Pop', 'Space Station'],
  studioFurniture: ['Giant Bean Bag Chair', 'Floating Holographic Podium', 'Retro Neon Talk-Show Desk', 'Cyber-Control Station'],
  studioProps: ['Oversized Silver Microphone', 'Floating Teleprompter Droid', 'Golden Network Trophy', 'Neon On-Air Lightbox'],
  studioLighting: ['Vibrant Multi-Color Spots', 'Cool Blue Key Lights', 'Neon Pink Rim Glow', 'Dramatic Rainbow Pulse'],
  studioBackdrop: ['City Rooftop Skyline', 'Deep Jungle Canopy', 'Sci-Fi Control Room', 'Floating Cloud Kingdom', 'Vintage Brick Wall', 'Golden Art Deco Screen'],
  studioSound: ['Giant Boom Mic', 'Retro Radio Console', 'Gold-Plated Headphones', 'Stereo Speaker Tower', 'High-Tech Lavalier', 'Cybernetic Soundboard'],
  studioFX: ['Floating Digital Particles', 'Stage Fog & Lasers', 'Magic Sparkle Aura', 'Confetti Blast', 'Falling Matrix Code', 'Neon Fireflies'],
  cameraAngle: ['Low Angle Heroic', 'Wacky High-Angle', 'Dynamic Dutch Tilt', 'Standard Mid-Shot'],
  shootingLocation: ['Neon Sky Hub', 'Volcanic Broadcast Core', 'Underwater Bubble Studio', 'Space Station Network'],
  songs: ['Cartoon Theme Remix', 'The Star Power Anthem', 'Network Rhythm', 'Uplink Dance Beat'],
  genres: ['Cartoon-Core', 'Hyper-Pop', 'Future Funk', 'Video Game Rock', 'Synthwave']
};

const DEFAULT_STUDIO_TRANSFORM: StudioTransform = { x: 0, y: 0, scale: 1, rotate: 0 };

const DEFAULT_APPEARANCE: StarAppearance = {
  gender: 'Genderfluid',
  skintone: "Tone 00 - neutral",
  bodyHeight: 'Average',
  bodyShape: 'Athletic',
  bodySize: 'M',
  clothingSize: 'M',
  shoeSize: '42',
  headwearSize: 'M',
  faceShape: 'Round',
  hairstyle: 'Spiky Hero Hair',
  eyes: 'Oversized Glowing Blue',
  pose: 'Dynamic Hero Pose',
  top: 'Retro Cartoon Hoodie',
  bottom: 'Wide-Leg Cartoon Pants',
  footwear: 'Oversized Red Boots',
  makeup: 'Star Eye Decal',
  headwear: 'Backward Star Cap',
  accessories: 'Cyber-Goggles',
  jewelry: 'Golden Star Chain',
  material: 'Cotton',
  texture: 'Plain',
  primaryColor: 'Magenta',
  secondaryColor: 'Cyan',
  studioFurniture: 'Floating Holographic Podium',
  studioProps: 'Oversized Silver Microphone',
  studioLighting: 'Vibrant Multi-Color Spots',
  studioBackdrop: 'City Rooftop Skyline',
  studioSound: 'High-Tech Lavalier',
  studioFX: 'Floating Digital Particles',
  cameraAngle: 'Standard Mid-Shot',
  studioMaterial: 'Neon Glow',
  studioTheme: 'Cyberpunk',
  customDirective: ''
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
      money: 0,
      roster: [],
      activeStarId: null,
      transactions: [],
      currentProducer: 'PROD-' + Math.floor(Math.random() * 9000 + 1000),
      playerAge: 18,
      parentalConsent: false,
      draftStar: { 
        appearance: DEFAULT_APPEARANCE, 
        bio: '', 
        signatureAction: 'photo', 
        signatureSong: 'UNLIMITED HITS',
        signatureGenre: 'Pop',
        studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } }
      },
      tutorialSeen: false,
      networkName: 'MY TV STAR',
      customRoles: INITIAL_ROLES,
      customInspirations: INITIAL_INSPIRATIONS,
      baseEarningAmount: 5.00,
      baseEarningIntervalMs: 10 * 60 * 1000,
      streamHourlyRate: 50.00,
      photoEarning: 1.00,
      videoEarning: 2.00,
      minWithdrawal: 20.00
    };
    return JSON.parse(saved);
  });

  const activeStar = useMemo(() => 
    gameState.roster.find(s => s.id === gameState.activeStarId) || null
  , [gameState.roster, gameState.activeStarId]);

  const [captureMode, setCaptureMode] = useState<CaptureMode>('photo');
  const [songTitle, setSongTitle] = useState('');
  const [performanceDuration, setPerformanceDuration] = useState<PerformanceDuration>(15);

  const [onAir, setOnAir] = useState(false);
  const [streamRevenue, setStreamRevenue] = useState(0); 
  const [streamDuration, setStreamDuration] = useState(0); 
  const [viewerCount, setViewerCount] = useState(0);
  const [chatLog, setChatLog] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [nextPayTime, setNextPayTime] = useState<number>(() => {
    const saved = localStorage.getItem('myTVStar_nextPay');
    return saved ? parseInt(saved) : Date.now() + (gameState.baseEarningIntervalMs || 600000);
  });
  const [showPayoutToast, setShowPayoutToast] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [flashActive, setFlashActive] = useState(false);
  const [tempStar, setTempStar] = useState<Partial<CharacterProfile>>(gameState.draftStar || { 
    appearance: DEFAULT_APPEARANCE, bio: '', signatureAction: 'photo', signatureSong: 'UNLIMITED HITS', signatureGenre: 'Pop', studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } 
  });
  
  const [payoutType, setPayoutType] = useState<PayoutType>('bank');
  const [payoutProvider, setPayoutProvider] = useState<string>(DIGITAL_BANKS[0]);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeStar) { setCaptureMode(activeStar.signatureAction); setSongTitle(activeStar.signatureSong); }
  }, [activeStar?.id]);

  useEffect(() => { setGameState(prev => ({ ...prev, draftStar: tempStar })); }, [tempStar]);

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
        setPayoutMessage(`+$${gameState.baseEarningAmount.toFixed(2)} NETWORK REWARD`);
        setShowPayoutToast(true);
        setTimeout(() => setShowPayoutToast(false), 5000);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextPayTime, isLoggedIn, gameState.baseEarningAmount, gameState.baseEarningIntervalMs]);

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
      const durationMs = (activeStar?.signatureAction === 'video') ? 15000 : (performanceDuration * 1000);
      const interval = setInterval(() => {
        const now = Date.now();
        const progress = ((now - start) / durationMs) * 100;
        if (now >= start + durationMs) {
          setIsRecording(false);
          setRecordProgress(0);
          let payout = gameState.videoEarning; 
          let assetName = 'VIDEO ASSET';
          processReward(payout, assetName);
          setPayoutMessage(`+$${payout.toFixed(2)} ${assetName} REWARD`);
          setShowPayoutToast(true);
          setTimeout(() => setShowPayoutToast(false), 8000);
          clearInterval(interval);
        } else { setRecordProgress(progress); }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording, activeStar, performanceDuration, gameState.videoEarning]);

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
    setPayoutMessage(`+$${gameState.photoEarning.toFixed(2)} SNAP ASSET REWARD`);
    setShowPayoutToast(true);
    setTimeout(() => setShowPayoutToast(false), 8000);
  };

  const toggleOnAir = () => {
    if (onAir) {
      processReward(streamRevenue);
      setPayoutMessage(`+$${streamRevenue.toFixed(2)} LIVE STREAM REVENUE`);
      setShowPayoutToast(true);
      setTimeout(() => setShowPayoutToast(false), 5000);
      setStreamRevenue(0);
      setOnAir(false);
    } else {
      setOnAir(true);
      if (activeStar?.signatureAction === 'video') setIsRecording(true);
    }
  };

  const handleAction = async (prompt?: string) => {
    if (!activeStar) return;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    setIsAiThinking(true);
    const contextPrompt = prompt || userInput;
    if (!prompt) { setChatLog(prev => [...prev, { role: 'user', text: userInput }]); setUserInput(''); }
    try {
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: `Executive Producer feedback for Talent: ${activeStar.userName}, Role: ${activeStar.role}. Directive: ${contextPrompt}`,
        config: { systemInstruction: `Act as a loud, energetic TV producer giving professional feedback.` }
      });
      setChatLog(prev => [...prev, { role: 'ai', text: response.text || "Signal glitch!" }]);
    } catch (err) { setChatLog(prev => [...prev, { role: 'ai', text: "Technical error." }]); } 
    finally { setIsAiThinking(false); }
  };

  const createNewStar = async () => {
    setIsGeneratingImage(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const s = tempStar as CharacterProfile;
    const appearance = s.appearance;
    const prompt = `Stylized 2D character design Cartoon Network art style. Character: ${s.userName}, a ${s.role}. Gender: ${appearance.gender}. Skintone: ${appearance.skintone}. Body: ${appearance.bodyHeight}, ${appearance.bodyShape}. Wardrobe: ${appearance.top}, ${appearance.bottom}, ${appearance.footwear} (${appearance.material}, ${appearance.texture}). Colors: ${appearance.primaryColor}, ${appearance.secondaryColor}. Studio Location: ${s.shootingLocation}. Studio Elements: theme: ${appearance.studioTheme}, furniture: ${appearance.studioFurniture}, backdrop: ${appearance.studioBackdrop}, sound setup: ${appearance.studioSound}, lighting: ${appearance.studioLighting}, special effects: ${appearance.studioFX}. Camera: ${appearance.cameraAngle}. Extra: ${appearance.customDirective || 'None'}.`;
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL, contents: { parts: [{ text: prompt }] }, config: { imageConfig: { aspectRatio: "1:1" } }
      });
      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) { if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; break; } }
      const newId = s.id || Math.random().toString(36).substr(2, 9);
      const finalizedStar: CharacterProfile = { ...s, id: newId, appearance: { ...appearance, imageUrl }, popularity: 0, level: 1, earnings: 0, studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } };
      setGameState(prev => ({ ...prev, roster: s.id ? prev.roster.map(star => star.id === newId ? finalizedStar : star) : [...prev.roster, finalizedStar], activeStarId: newId }));
      setCurrentView('dashboard');
    } catch (err) { alert("Generation failed."); } 
    finally { setIsGeneratingImage(false); }
  };

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); setIsLoggedIn(true); if (!gameState.tutorialSeen) setCurrentView('tutorial'); else if (gameState.roster.length === 0) setCurrentView('onboarding'); else setCurrentView('roster'); };

  const handleWithdrawal = () => {
    if (gameState.money < gameState.minWithdrawal) { alert(`Min withdrawal: $${gameState.minWithdrawal.toFixed(2)}`); return; }
    setIsWithdrawing(true);
    setTimeout(() => {
      const amount = gameState.money;
      setGameState(prev => ({ 
        ...prev, 
        money: 0, 
        transactions: [{ 
          id: 'TX-'+Date.now(), 
          amount, 
          currency: 'USD', 
          provider: `${payoutProvider} (${payoutType === 'bank' ? 'Instant Bank' : 'Instant E-Wallet'})`, 
          timestamp: Date.now(), 
          status: 'Completed', 
          type: 'Withdrawal' 
        } as Transaction, ...prev.transactions] 
      }));
      setIsWithdrawing(false);
      alert(`Instant Payout Successful! $${amount.toFixed(2)} has been sent to your ${payoutProvider} account.`);
    }, 2000);
  };

  const formatDuration = (sec: number) => { const h = Math.floor(sec / 3600).toString().padStart(2, '0'); const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0'); const s = (sec % 60).toString().padStart(2, '0'); return `${h}:${m}:${s}`; };

  // --- UI Components ---
  const HomeView = () => (
    <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden bg-grid">
      <header className="h-28 flex items-center justify-between px-12 z-20 border-b-8 border-white bg-slate-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Logo className="w-16 h-16" />
          <span className="font-bebas text-5xl text-white tracking-widest">{gameState.networkName}</span>
        </div>
        <button onClick={() => setCurrentView('login')} className="btn-flat bg-[#0000FF] text-white px-12 py-5 border-4 border-black text-sm font-black hover:bg-white hover:text-black uppercase transition-colors">
          LOGIN
        </button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 relative">
        <div className="flex flex-col items-center text-center max-w-5xl w-full">
           <div className="w-40 h-40 bg-[#FF0080] border-[10px] border-white flex items-center justify-center mb-10 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Tv className="w-24 h-24 text-white" />
           </div>
           
           <div className="space-y-2 mb-10 w-full flex flex-col items-center">
             <h1 className="font-bebas leading-tight flex flex-col items-center">
               <span className="text-white text-6xl md:text-8xl tracking-widest block">THE ULTIMATE</span>
               <span className="text-[#FF0080] text-7xl md:text-[9rem] tracking-tight bg-white px-10 py-4 my-4 border-x-[20px] border-[#FF0080] inline-block">
                 BROADCASTING
               </span>
               <span className="text-white text-4xl md:text-6xl tracking-[0.3em] uppercase block">SIMULATION GAME</span>
             </h1>
           </div>

           <div className="flex flex-col items-center gap-12 w-full">
             <div className="bg-[#00FF7F] text-black font-black text-lg md:text-xl tracking-[0.4em] uppercase border-4 border-black py-4 px-12 transform rotate-1 inline-block">
               EARN $5.00 / 10 MINS • LIVE STREAMS ENABLED
             </div>
             
             <button onClick={() => setCurrentView('login')} className="btn-flat py-10 px-32 text-5xl text-black bg-[#FFFF00] border-[10px] border-black font-bebas hover:bg-white hover:-translate-y-3 active:translate-y-0 transition-all">
               START SIMULATION
             </button>
           </div>
        </div>
      </main>
      <footer className="h-24 bg-slate-900 border-t-8 border-white flex items-center justify-center px-12 z-20">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.25em] text-center">{AGE_RATING_TEXT}</p>
        </div>
      </footer>
    </div>
  );

  const DashboardView = () => (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans overflow-hidden">
      <Ticker networkName={gameState.networkName} />
      <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-8"><Logo className="w-16 h-16" /><div className="hidden lg:flex flex-col"><span className="font-bebas text-5xl text-white leading-none">TERMINAL</span><span className="text-[9px] font-black text-[#00FF7F] tracking-widest mt-2 flex items-center gap-2"><div className="w-2 h-2 bg-[#00FF7F] animate-pulse" /> WORLDWIDE UPLINK</span></div></div>
        <nav className="flex items-center gap-16">
          <button onClick={() => setCurrentView('roster')} className="font-black text-[12px] uppercase text-slate-500 hover:text-white flex flex-col items-center gap-2"><Layers className="w-5 h-5" /> HUB</button>
          <button onClick={() => setCurrentView('dashboard')} className="font-black text-[12px] uppercase text-[#FF0080] border-b-8 pb-1 pt-2 border-[#FF0080] flex flex-col items-center gap-2"><Monitor className="w-5 h-5" /> LIVE</button>
          <button onClick={() => setCurrentView('wallet')} className="font-black text-[12px] uppercase text-slate-500 hover:text-white flex flex-col items-center gap-2"><BarChart3 className="w-5 h-5" /> REVENUE</button>
        </nav>
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentView('wallet')} className="flex items-center gap-6 px-12 py-5 bg-slate-950 border-8 border-black cursor-pointer hover:border-[#00FF7F] transition-all">
            <DollarSign className="w-8 h-8 text-[#00FF7F]" /><span className="font-black text-4xl font-mono text-[#00FF7F]">${gameState.money.toFixed(2)}</span>
          </div>
          <button onClick={() => setCurrentView('settings')} className="p-5 bg-slate-800 border-4 border-black text-white hover:bg-white hover:text-black transition-colors"><Settings className="w-8 h-8" /></button>
        </div>
      </header>
      <main className="flex-1 flex flex-col lg:flex-row p-10 gap-10 overflow-hidden bg-grid">
        <div className="flex-1 flex flex-col gap-10 min-h-0">
          <div className="relative flex-1 bg-black border-[12px] border-white flex flex-col overflow-hidden">
            {onAir && <div className="absolute inset-0 pointer-events-none z-10 border-[16px] border-red-600 m-8 animate-pulse" />}
            {flashActive && <div className="absolute inset-0 bg-white z-[100] animate-pulse" />}
            <div className="p-10 border-b-8 border-white flex justify-between items-center bg-slate-900 z-20">
              <div className="flex flex-col"><span className="text-4xl font-bebas text-white uppercase tracking-widest">{activeStar?.userName}</span><span className="text-2xl font-bebas text-[#FF0080] uppercase tracking-widest">{activeStar?.role}</span></div>
              <div className="flex items-center gap-8">
                {onAir && (
                  <div className="flex gap-10 items-center bg-black/60 px-8 py-4 border-4 border-slate-700">
                    <div className="flex items-center gap-3">
                      <EyeOpen className="w-6 h-6 text-[#00FF7F]" />
                      <span className="font-bebas text-3xl text-white">{viewerCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Timer className="w-6 h-6 text-[#FFFF00]" />
                      <span className="font-bebas text-3xl text-white">{formatDuration(streamDuration)}</span>
                    </div>
                  </div>
                )}
                {!onAir ? (
                  <button onClick={toggleOnAir} className="btn-flat px-24 py-8 text-black border-8 border-black text-4xl font-bebas bg-[#00FF7F] hover:bg-white transition-colors">GO LIVE</button>
                ) : (
                  <button onClick={toggleOnAir} className="btn-flat px-24 py-8 bg-slate-700 text-white border-8 border-black text-4xl font-bebas hover:bg-red-600 transition-colors">END STREAM</button>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-black">
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                {onAir && <div className="bg-black/80 border-4 border-[#00FF7F] p-4"><p className="text-[10px] font-black uppercase text-[#00FF7F]">LIVE YIELD: ${streamRevenue.toFixed(2)}</p></div>}
                {chatLog.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-10 border-8 ${msg.role === 'user' ? 'bg-slate-900 border-[#0000FF]' : 'bg-slate-900 border-[#FF0080]'}`}><div className="text-2xl text-white uppercase font-bold">{msg.text}</div></div></div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="lg:w-[450px] bg-slate-900 p-10 overflow-y-auto border-l-8 border-white flex flex-col gap-10">
                <div className="bg-black border-4 border-[#FF0080] p-6 flex flex-col items-center justify-center gap-4">
                  <span className="text-[10px] font-black uppercase text-[#FF0080] tracking-widest">Session Revenue</span>
                  <span className="text-6xl font-bebas text-white">${streamRevenue.toFixed(2)}</span>
                </div>
                <div className="space-y-6">
                  <button onClick={capturePhoto} className="w-full btn-flat py-12 bg-[#FF0080] text-white border-[10px] border-black font-bebas text-5xl hover:bg-white hover:text-black">SNAP ($1)</button>
                  <button onClick={() => setIsRecording(true)} disabled={isRecording} className="w-full btn-flat py-12 bg-[#FFFF00] text-black border-[10px] border-black font-bebas text-5xl hover:bg-white transition-colors">VIDEO ($2)</button>
                  {isRecording && <div className="h-6 bg-black border-4 border-white p-1"><div className="h-full bg-red-600 transition-all duration-100" style={{ width: `${recordProgress}%` }} /></div>}
                </div>
                <div className="mt-auto pt-6 border-t-4 border-slate-800 space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Filters</label>
                  <div className="flex flex-wrap gap-2">
                    {FILTERS.map(f => (
                      <button key={f.label} onClick={() => setSelectedFilter(f)} className={`px-4 py-2 text-[10px] font-black border-2 transition-all ${selectedFilter.label === f.label ? 'bg-[#FF0080] text-white border-[#FF0080]' : 'bg-black text-white border-slate-700 hover:border-white'}`}>{f.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="lg:w-[450px] flex flex-col gap-10">
          <div className={`w-full aspect-square bg-black border-[10px] border-white relative overflow-hidden flex items-center justify-center`}>
            {activeStar?.appearance.imageUrl ? <img src={activeStar.appearance.imageUrl} className={`w-full h-full object-cover ${selectedFilter.class}`} /> : <Loader2 className="w-24 h-24 animate-spin text-[#FF0080]" />}
            {onAir && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 font-bebas text-2xl border-2 border-black flex items-center gap-2 animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full" /> LIVE
              </div>
            )}
            <div className="absolute bottom-6 left-6 bg-white text-black px-6 py-3 font-bebas text-3xl border-4 border-black">{activeStar?.userName}</div>
          </div>
          <div className="bg-slate-900 border-[10px] border-white p-10 space-y-8">
            <h3 className="text-4xl font-bebas text-white uppercase border-b-4 border-black pb-4">STAR STATS</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end"><span className="text-xs font-black text-slate-500">LEVEL</span><span className="text-5xl font-bebas text-white">{activeStar?.level}</span></div>
              <div className="flex justify-between items-end"><span className="text-xs font-black text-slate-500">POPULARITY</span><span className="text-5xl font-bebas text-[#FF0080]">{activeStar?.popularity.toLocaleString()}</span></div>
              <div className="flex justify-between items-end"><span className="text-xs font-black text-slate-500">REVENUE</span><span className="text-5xl font-bebas text-[#00FF7F]">${activeStar?.earnings.toFixed(2)}</span></div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );

  const WalletView = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col bg-grid">
      <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">INSTANT TREASURY</span></div>
        <button onClick={() => setCurrentView('dashboard')} className="btn-flat bg-white text-black px-12 py-5 font-bebas border-4 border-black hover:bg-slate-200 transition-colors">BACK</button>
      </header>
      <main className="flex-1 p-16 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 overflow-hidden">
        <div className="bg-slate-900 border-[10px] border-white p-12 flex flex-col gap-12 overflow-y-auto custom-scrollbar">
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bebas text-[#FF0080] uppercase tracking-widest">CURRENT BALANCE</h3>
            <div className="text-8xl md:text-9xl font-bebas text-white leading-none">${gameState.money.toFixed(2)}</div>
          </div>

          <div className="space-y-8 border-t-4 border-black pt-10">
            <h4 className="text-2xl font-bebas text-[#00FF7F] uppercase tracking-widest">1. SELECT PAYOUT METHOD</h4>
            <div className="grid grid-cols-2 gap-6">
               <button 
                onClick={() => { setPayoutType('bank'); setPayoutProvider(DIGITAL_BANKS[0]); }}
                className={`flex flex-col items-center gap-4 p-8 border-8 transition-all ${payoutType === 'bank' ? 'bg-[#FF0080] border-black text-white' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                 <Building2 className="w-10 h-10" />
                 <span className="font-bebas text-2xl uppercase">Digital Bank</span>
               </button>
               <button 
                onClick={() => { setPayoutType('wallet'); setPayoutProvider(E_WALLETS[0]); }}
                className={`flex flex-col items-center gap-4 p-8 border-8 transition-all ${payoutType === 'wallet' ? 'bg-[#FF0080] border-black text-white' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                 <PhoneIcon className="w-10 h-10" />
                 <span className="font-bebas text-2xl uppercase">E-Wallet</span>
               </button>
            </div>
          </div>

          <div className="space-y-8 border-t-4 border-black pt-10">
            <h4 className="text-2xl font-bebas text-[#00FF7F] uppercase tracking-widest">2. SELECT PROVIDER</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-48 overflow-y-auto custom-scrollbar p-2 bg-black/40">
              {(payoutType === 'bank' ? DIGITAL_BANKS : E_WALLETS).map(provider => (
                <button 
                  key={provider}
                  onClick={() => setPayoutProvider(provider)}
                  className={`p-4 border-4 text-[10px] font-black uppercase transition-all ${payoutProvider === provider ? 'bg-white border-black text-black' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={gameState.money < gameState.minWithdrawal || isWithdrawing} 
            onClick={handleWithdrawal} 
            className="w-full btn-flat py-10 bg-[#FFFF00] text-black text-5xl font-bebas border-[10px] border-black hover:bg-white transition-all disabled:opacity-20 relative overflow-hidden"
          >
            {isWithdrawing ? (
              <div className="flex items-center gap-4"><Loader2 className="w-10 h-10 animate-spin" /> VERIFYING...</div>
            ) : (
              'INSTANT PAYOUT'
            )}
            {isWithdrawing && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
          </button>
          <p className="text-[10px] font-black text-slate-500 uppercase text-center">MINIMUM WITHDRAWAL: ${gameState.minWithdrawal.toFixed(2)} // STATUS: INSTANT</p>
        </div>

        <div className="bg-slate-900 border-[10px] border-white p-12 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-10 border-b-4 border-black pb-4">
             <h3 className="text-4xl font-bebas text-white uppercase">UPLINK HISTORY</h3>
             <History className="w-8 h-8 text-slate-500" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4">
            {gameState.transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                 <ZapOff className="w-16 h-16" />
                 <div className="font-bebas text-3xl uppercase">NO TRANSACTION DATA</div>
              </div>
            ) : gameState.transactions.map(t => (
              <div key={t.id} className="bg-black border-4 border-slate-800 p-8 flex flex-col gap-4 relative">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#FF0080] uppercase tracking-[0.2em]">{t.type}</span>
                    <span className="text-2xl font-bebas text-white uppercase mt-1">{t.provider}</span>
                  </div>
                  <div className="text-4xl font-bebas text-[#00FF7F]">-${t.amount.toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-4">
                  <span>ID: {t.id}</span>
                  <span>{new Date(t.timestamp).toLocaleString().toUpperCase()}</span>
                </div>
                <div className="absolute top-4 right-4 bg-[#00FF7F] text-black px-2 py-0.5 text-[8px] font-black uppercase">COMPLETED</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  const SettingsView = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col bg-grid">
      <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">NETWORK SETTINGS</span></div>
        <button onClick={() => setCurrentView('dashboard')} className="btn-flat bg-white text-black px-12 py-5 font-bebas border-4 border-black hover:bg-slate-200 transition-colors">EXIT</button>
      </header>
      <main className="flex-1 p-16 max-w-4xl mx-auto w-full space-y-12">
        <div className="bg-slate-900 border-[10px] border-white p-12 space-y-8">
           <div className="flex flex-col gap-4">
             <label className="text-xs font-black text-slate-500 uppercase tracking-widest">NETWORK IDENTITY NAME</label>
             <input 
               value={gameState.networkName} 
               onChange={(e) => setGameState(p => ({...p, networkName: e.target.value}))} 
               className="w-full bg-black border-8 border-slate-800 p-8 text-5xl text-white font-bebas outline-none focus:border-[#FF0080]" 
             />
           </div>
           
           <div className="grid grid-cols-2 gap-8 pt-10 border-t-4 border-black">
             <div className="flex flex-col gap-4">
               <label className="text-[10px] font-black text-slate-500 uppercase">EARNING FREQUENCY</label>
               <div className="bg-black border-4 border-slate-800 p-6 font-bebas text-3xl text-white">EVERY 10 MINS</div>
             </div>
             <div className="flex flex-col gap-4">
               <label className="text-[10px] font-black text-slate-500 uppercase">BASE REWARD</label>
               <div className="bg-black border-4 border-slate-800 p-6 font-bebas text-3xl text-[#00FF7F]">$5.00</div>
             </div>
           </div>
        </div>

        <div className="bg-slate-900 border-[10px] border-white p-12 space-y-8">
          <h4 className="text-3xl font-bebas text-white uppercase border-b-4 border-black pb-4">ADVANCED TERMINAL</h4>
          <div className="flex items-center justify-between bg-black border-4 border-slate-800 p-8">
             <div className="flex flex-col gap-2">
               <span className="text-2xl font-bebas text-white uppercase">ERASE LOCAL DATABASE</span>
               <span className="text-[10px] font-black text-slate-500 uppercase">THIS WILL PERMANENTLY WIPE ALL ASSETS AND ROSTER DATA.</span>
             </div>
             <button onClick={() => { if(confirm("PERMANENTLY WIPE DATA?")) { localStorage.clear(); window.location.reload(); } }} className="btn-flat bg-red-600 text-white px-8 py-4 border-4 border-black hover:bg-red-500 transition-colors">WIPE DATA</button>
          </div>
        </div>
      </main>
    </div>
  );

  const CustomizationView = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col bg-grid">
      <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">ASSET CONFIG</span></div>
        <button onClick={() => setCurrentView('onboarding')} className="btn-flat bg-white text-black px-12 py-5 font-bebas border-4 border-black hover:bg-slate-200 transition-colors">BACK</button>
      </header>
      <main className="flex-1 p-10 flex flex-col lg:flex-row gap-10 overflow-hidden">
        <div className="flex-1 bg-slate-900 border-[10px] border-white p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(gameState.customInspirations).map(([key, options]) => (
              <div key={key} className="space-y-3">
                <label className="text-[10px] font-black text-[#FF0080] uppercase tracking-widest">{key}</label>
                <select 
                  value={(tempStar.appearance as any)?.[key] || ''} 
                  onChange={(e) => setTempStar(p => ({ ...p, appearance: { ...p.appearance!, [key]: e.target.value } }))}
                  className="w-full bg-black border-4 border-slate-800 p-4 text-white font-bebas text-2xl outline-none focus:border-[#00FF7F]"
                >
                  {(options as string[]).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-12 space-y-4">
            <label className="text-[10px] font-black text-[#FF0080] uppercase tracking-widest">Custom Visual Directive (AI Prompt Supplement)</label>
            <textarea 
              value={tempStar.appearance?.customDirective || ''} 
              onChange={(e) => setTempStar(p => ({ ...p, appearance: { ...p.appearance!, customDirective: e.target.value } }))}
              placeholder="Describe unique details (e.g. glowing aura, mechanical limbs, specific background objects...)"
              className="w-full bg-black border-4 border-slate-800 p-6 text-white font-mono text-sm outline-none focus:border-[#00FF7F] h-32"
            />
          </div>
        </div>
        <aside className="lg:w-[450px] bg-slate-900 border-[10px] border-white p-10 space-y-8 flex flex-col">
           <h3 className="text-4xl font-bebas text-white uppercase border-b-4 border-black pb-4">ASSET PREVIEW</h3>
           <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-black border-4 border-slate-800">
             <Bot className={`w-24 h-24 mb-6 ${isGeneratingImage ? 'animate-bounce text-[#00FF7F]' : 'text-slate-700'}`} />
             <p className="text-xs font-black text-slate-500 uppercase leading-relaxed">System ready to generate assets based on current configuration.</p>
           </div>
           <div className="space-y-4">
             <button 
               disabled={isGeneratingImage || !tempStar.userName} 
               onClick={createNewStar} 
               className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-5xl font-bebas border-8 border-black hover:bg-white transition-colors disabled:opacity-50"
             >
               {isGeneratingImage ? <Loader2 className="w-12 h-12 animate-spin mx-auto" /> : 'GENERATE STAR'}
             </button>
             <p className="text-[9px] font-black text-slate-500 uppercase text-center">GENERATES 2D ARTWORK VIA GENAI</p>
           </div>
        </aside>
      </main>
    </div>
  );

  const RosterView = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col bg-grid">
      <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">TALENT HUB</span></div>
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentView('wallet')} className="flex items-center gap-6 px-12 py-5 bg-slate-950 border-8 border-black cursor-pointer hover:border-[#00FF7F] transition-all">
            <DollarSign className="w-8 h-8 text-[#00FF7F]" /><span className="font-black text-4xl font-mono text-[#00FF7F]">${gameState.money.toFixed(2)}</span>
          </div>
          <button onClick={() => { setTempStar({ appearance: DEFAULT_APPEARANCE, userName: '', role: 'Pop Star', shootingLocation: 'Neon Sky Hub' }); setCurrentView('onboarding'); }} className="btn-flat bg-[#FF0080] text-white px-10 py-5 font-bebas text-3xl border-4 border-black hover:bg-white hover:text-black">SIGN NEW TALENT</button>
        </div>
      </header>
      <main className="flex-1 p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-12 overflow-y-auto custom-scrollbar">
        {gameState.roster.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center space-y-12 py-32">
            <div className="w-32 h-32 bg-slate-800 flex items-center justify-center border-4 border-slate-700 animate-pulse">
               <Users className="w-20 h-20 text-slate-600" />
            </div>
            <h2 className="text-6xl font-bebas text-slate-600 uppercase">NO TALENT ROSTER DETECTED</h2>
            <button onClick={() => { setTempStar({ appearance: DEFAULT_APPEARANCE, userName: '', role: 'Pop Star', shootingLocation: 'Neon Sky Hub' }); setCurrentView('onboarding'); }} className="btn-flat py-6 px-16 bg-[#00FF7F] text-black font-bebas text-4xl border-8 border-black">START RECRUITMENT</button>
          </div>
        ) : (
          gameState.roster.map(star => (
            <div key={star.id} onClick={() => { setGameState(p => ({ ...p, activeStarId: star.id })); setCurrentView('dashboard'); }} className="bg-slate-900 border-[8px] border-white hover:border-[#FF0080] transition-all cursor-pointer group flex flex-col overflow-hidden">
              <div className="aspect-square bg-black relative overflow-hidden">
                {star.appearance.imageUrl ? (
                  <img src={star.appearance.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800"><Loader2 className="animate-spin text-slate-600 w-12 h-12" /></div>
                )}
                <div className="absolute top-4 right-4 bg-white text-black px-4 py-1 font-bebas text-xl border-2 border-black z-10">LVL {star.level}</div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-4xl font-bebas text-white uppercase truncate">{star.userName}</h3>
                <div className="flex justify-between items-end border-t-2 border-slate-800 pt-6">
                  <div className="flex flex-col"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">POPULARITY</span><span className="text-3xl font-bebas text-[#FF0080]">{star.popularity.toLocaleString()}</span></div>
                  <div className="flex flex-col items-end"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">EARNINGS</span><span className="text-3xl font-bebas text-[#00FF7F]">${star.earnings.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );

  return (
    <div className="app-container">
      {currentView === 'home' && <HomeView />}
      {currentView === 'login' && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 bg-grid">
          <div className="max-w-md w-full bg-slate-900 border-[10px] border-white p-12 text-center space-y-12">
            <Logo className="w-24 h-24 mx-auto" />
            <h2 className="text-6xl font-bebas text-white uppercase">IDENTITY SYNC</h2>
            <form onSubmit={handleLogin} className="space-y-8 text-left">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#FF0080] uppercase">Producer Identity</label>
                <input required value={gameState.currentProducer} onChange={(e) => setGameState(p => ({...p, currentProducer: e.target.value}))} className="w-full bg-black border-8 border-slate-800 p-8 text-2xl text-white font-mono outline-none focus:border-[#FF0080]" />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#FF0080] uppercase">Age (5+)</label>
                <input required type="number" min={5} value={gameState.playerAge} onChange={(e) => setGameState(p => ({...p, playerAge: parseInt(e.target.value)}))} className="w-full bg-black border-8 border-slate-800 p-8 text-2xl text-white font-mono outline-none focus:border-[#FF0080]" />
              </div>
              <button type="submit" className="w-full btn-flat py-8 bg-[#00FF7F] text-black text-3xl font-bebas border-8 border-black hover:bg-white transition-colors">ENTER TERMINAL</button>
            </form>
          </div>
        </div>
      )}
      {currentView === 'onboarding' && (
        <div className="min-h-screen bg-slate-950 flex flex-col p-6 bg-grid">
          <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900">
            <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">TALENT REGISTRATION</span></div>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center p-10 max-w-4xl mx-auto w-full">
            <div className="bg-slate-900 border-[10px] border-white p-12 w-full space-y-12">
              <div className="space-y-4">
                <label className="text-xs font-black text-[#FF0080] uppercase">Stage Name</label>
                <input value={tempStar.userName || ''} onChange={(e) => setTempStar(p => ({...p, userName: e.target.value}))} className="w-full bg-black border-8 border-slate-800 p-8 text-4xl text-white font-bebas outline-none focus:border-[#FF0080]" />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-[#FF0080] uppercase">Primary Role</label>
                <select value={tempStar.role || 'Pop Star'} onChange={(e) => setTempStar(p => ({...p, role: e.target.value}))} className="w-full bg-black border-8 border-slate-800 p-8 text-4xl text-white font-bebas outline-none focus:border-[#FF0080]">
                  {gameState.customRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <button disabled={!tempStar.userName} onClick={() => setCurrentView('customization')} className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-5xl font-bebas border-8 border-black hover:bg-white transition-colors disabled:opacity-30">PROCEED TO STUDIO</button>
            </div>
          </main>
        </div>
      )}
      {currentView === 'customization' && <CustomizationView />}
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'roster' && <RosterView />}
      {currentView === 'tutorial' && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-12 bg-grid">
          <div className="max-w-4xl w-full bg-slate-900 border-[10px] border-white p-12 space-y-12">
            <h2 className="text-7xl font-bebas text-white uppercase">NETWORK MANUAL</h2>
            <div className="grid md:grid-cols-2 gap-12 text-slate-300 uppercase font-black text-xs leading-relaxed">
              <div className="bg-black p-8 border-4 border-slate-800"><p>Earn $5.00 every 10 minutes in the background. Going "Live" yields $50.00 per hour.</p></div>
              <div className="bg-black p-8 border-4 border-slate-800"><p>288 Skin colors across 36 tones and 8 undertones. Everything is customizable.</p></div>
            </div>
            <button onClick={() => { setGameState(prev => ({ ...prev, tutorialSeen: true })); if (gameState.roster.length === 0) setCurrentView('onboarding'); else setCurrentView('roster'); }} className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-5xl font-bebas border-8 border-black hover:bg-white transition-colors">ACKNOWLEDGE</button>
          </div>
        </div>
      )}
      {currentView === 'wallet' && <WalletView />}
      {currentView === 'settings' && <SettingsView />}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<MyTVStar />);
