
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
  SmartphoneNfc
} from 'lucide-react';

// --- Constants & Types ---
const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const AGE_RATING_TEXT = "Playable for ages 5+ | Recommended age 8+ | Parental control required for players under 18.";

type View = 'home' | 'login' | 'onboarding' | 'customization' | 'dashboard' | 'settings' | 'wallet' | 'roster' | 'tutorial';
type CaptureMode = 'photo' | 'video' | 'sing' | 'dance' | 'instrument';
type PerformanceDuration = 15 | 30 | 45 | 60 | 120; 
type PerformanceVocalMode = 'vocal' | 'instrumental';

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
  imageUrl?: string;
  studioFurniture: string;
  studioProps: string;
  studioLighting: string;
  cameraAngle: string;
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
  // Economy Calibration
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

const SKINTONES = [
  "00: Fair", "02: Fair", "04: Fair", "06: Fair", "08: Fair",
  "10: Light", "12: Light", "14: Light", "16: Light", "18: Light",
  "20: Light Medium", "22: Light Medium", "24: Light Medium", "26: Light Medium", "28: Light Medium",
  "30: Medium", "32: Medium", "34: Medium", "36: Medium", "38: Medium",
  "40: Medium Dark", "42: Medium Dark", "44: Medium Dark", "46: Medium Dark", "48: Medium Dark",
  "50: Dark", "52: Dark", "54: Dark", "56: Dark", "58: Dark",
  "60: Deep", "62: Deep", "64: Deep", "66: Deep", "68: Deep", "70: Deep"
];

const HEIGHTS = ["Short", "Short Medium", "Medium", "Medium Tall", "Tall", "Super Tall"];
const CLOTHING_SIZES = ["XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL", "6XL"];
const SHOE_SIZES_MEN = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"];
const SHOE_SIZES_WOMEN = ["32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];
const ACCESSORY_SIZES = ["XS", "S", "M", "L", "XL"];

const INITIAL_INSPIRATIONS: Record<string, string[]> = {
  pose: ['Dynamic Hero Pose', 'Expressive Laugh', 'Dramatic Finger Point', 'Stage Bow', 'Confident Lean', 'Wacky Jump', 'Thoughtful Hand-to-Chin', 'Epic Mic Holding'],
  top: ['Heroic Cape Jacket', 'Retro Cartoon Hoodie', 'Oversized Star T-Shirt', 'Neon Studio Vest', 'Classic Pop Star Sequins', 'Futuristic Tech-Suit Top'],
  bottom: ['Cargo Utility Shorts', 'Wide-Leg Cartoon Pants', 'High-Waist Space Leggings', 'Glowing Side-Stripe Slacks', 'Expressive Belted Skirt', 'Heroic Cape-Bottom Pants'],
  footwear: ['Oversized Red Boots', 'Winged Sneakers', 'Electric High-Tops', 'Magical Glass Shoes', 'Cyber-Punk Platforms', 'Bouncy Cartoon Loafers'],
  makeup: ['Star Eye Decal', 'Glowing Face Lines', 'Bold Comic Contouring', 'Expressive Glitter Mask', 'Neon Lip Outline', 'Cartoonish Blush Hearts'],
  gender: ['Masculine', 'Feminine', 'Androgynous', 'Fluid', 'Non-Binary', 'Alien'],
  skintone: SKINTONES,
  bodyHeight: HEIGHTS,
  bodyShape: ['Slender', 'Robust', 'Athletic', 'Curvy', 'Short & Round'],
  bodySize: CLOTHING_SIZES,
  clothingSize: CLOTHING_SIZES,
  shoeSize: [...SHOE_SIZES_MEN, ...SHOE_SIZES_WOMEN],
  shoeSizeMen: SHOE_SIZES_MEN,
  shoeSizeWomen: SHOE_SIZES_WOMEN,
  headwearSize: ACCESSORY_SIZES,
  faceShape: ['Round', 'Angular', 'Square', 'Heart-shaped', 'Oval'],
  hairstyle: ['Spiky Hero Hair', 'Gravity-Defying Curls', 'Neon Buzz Cut', 'Long Flowing Cape-Hair', 'Techno-Pigtails', 'Sleek Geometric Bob'],
  eyes: ['Oversized Glowing Blue', 'Electric Yellow Stars', 'Fiery Red Hearts', 'Void Black Buttons', 'Sparkling Emerald', 'Vibrant Purple Rings'],
  studioFurniture: ['Giant Bean Bag Chair', 'Floating Holographic Podium', 'Retro Neon Talk-Show Desk', 'Cyber-Control Station', 'Golden Star Lectern', 'Comic-Style Sofa'],
  studioProps: ['Oversized Silver Microphone', 'Floating Teleprompter Droid', 'Golden Network Trophy', 'Neon On-Air Lightbox', 'Cartoonish Video Camera', 'Wacky Assistant Robot'],
  studioLighting: ['Vibrant Multi-Color Spots', 'Cool Blue Key Lights', 'Neon Pink Rim Glow', 'Dramatic Rainbow Pulse', 'Warm Comic-Book Glow', 'Electric Green Accents'],
  cameraAngle: ['Low Angle Heroic', 'Wacky High-Angle', 'Dynamic Dutch Tilt', 'Standard Mid-Shot', 'Epic Wide Establishing', 'Dramatic Extreme Close-up'],
  shootingLocation: ['Neon Sky Hub', 'Volcanic Broadcast Core', 'Underwater Bubble Studio', 'Space Station Network', 'Floating Island Platform', 'Virtual Reality Glitch-Void'],
  songs: ['Cartoon Theme Remix', 'The Star Power Anthem', 'Network Rhythm', 'Uplink Dance Beat', 'Digital Dreams', 'Saturday Morning Jam'],
  genres: ['Cartoon-Core', 'Hyper-Pop', 'Future Funk', 'Video Game Rock', 'Synthwave', 'Electropop', 'Orchestral Heroic']
};

const DEFAULT_STUDIO_TRANSFORM: StudioTransform = { x: 0, y: 0, scale: 1, rotate: 0 };

const DEFAULT_APPEARANCE: StarAppearance = {
  gender: 'Fluid',
  skintone: SKINTONES[10], // Light
  bodyHeight: 'Medium Tall',
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
  studioFurniture: 'Floating Holographic Podium',
  studioProps: 'Oversized Silver Microphone',
  studioLighting: 'Vibrant Multi-Color Spots',
  cameraAngle: 'Standard Mid-Shot',
};

const Logo = ({ className = "w-12 h-12" }) => (
  <div className={`flex items-center justify-center bg-white border-4 border-[#FF0080] ${className}`}>
    <Tv className="w-full h-full text-[#FF0080] p-1" />
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

  const [onAir, setOnAir] = useState(false);
  const [streamRevenue, setStreamRevenue] = useState(0); 
  const [chatLog, setChatLog] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [nextPayTime, setNextPayTime] = useState<number>(() => {
    const saved = localStorage.getItem('myTVStar_nextPay');
    return saved ? parseInt(saved) : Date.now() + (gameState.baseEarningIntervalMs || 600000);
  });
  const [showPayoutToast, setShowPayoutToast] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');
  const [networkTicker, setNetworkTicker] = useState<string>("NETWORK STATUS: GLOBAL ASSETS SYNCING...");

  const [captureMode, setCaptureMode] = useState<CaptureMode>(activeStar?.signatureAction || 'photo');
  const [performanceVocalMode, setPerformanceVocalMode] = useState<PerformanceVocalMode>('vocal');
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

  const [performanceDuration, setPerformanceDuration] = useState<PerformanceDuration>(15);
  const [songTitle, setSongTitle] = useState(activeStar?.signatureSong || 'UNLIMITED HITS');
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [flashActive, setFlashActive] = useState(false);
  const [tempStar, setTempStar] = useState<Partial<CharacterProfile>>(gameState.draftStar || { 
    appearance: DEFAULT_APPEARANCE, 
    bio: '', 
    signatureAction: 'photo', 
    signatureSong: 'UNLIMITED HITS', 
    signatureGenre: 'Pop', 
    studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } 
  });
  
  const [showParentalGate, setShowParentalGate] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeStar) {
      setCaptureMode(activeStar.signatureAction);
      setSongTitle(activeStar.signatureSong);
    }
  }, [activeStar?.id]);

  useEffect(() => {
    setGameState(prev => ({ ...prev, draftStar: tempStar }));
  }, [tempStar]);

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
      streamInterval = window.setInterval(() => {
        setStreamRevenue(prev => prev + perSec);
      }, 1000);
    }
    return () => clearInterval(streamInterval);
  }, [onAir, isLoggedIn, gameState.streamHourlyRate]);

  useEffect(() => {
    const tickerInt = setInterval(() => {
      const msgs = [
        "NETWORK STATUS: GLOBAL ASSETS SYNCING...",
        `PRODUCERS CONNECTED: ${Math.floor(Math.random() * 500 + 100)}`,
        `STREAMING FEATURE ENABLED: $${gameState.streamHourlyRate.toFixed(2)} / HOUR LIVE!`,
        "OPERATING WORLDWIDE WITHOUT GEOGRAPHICAL RESTRICTIONS",
        "GLOBAL HUB BROADCAST ACTIVE IN ALL SECTORS",
        `SYSTEM YIELD: $${gameState.baseEarningAmount.toFixed(2)} / ${Math.floor(gameState.baseEarningIntervalMs / 60000)}MIN BACKGROUND`,
        "STEAM CROSS-PLAY ACTIVE: 14,209 USERS ONLINE",
        "SINGING & DANCING MODES ACTIVATED WORLDWIDE",
        "ALL SONGS ARE AVAILABLE // NO RESTRICTIONS",
        "WORLDWIDE PROTOCOL v2.5.0 STABLE",
        "PLAYABLE AGE 5+ | RECOMMENDED 8+ | PARENTAL CONTROL < 18",
        "LIVE BROADCAST REVENUE ACTIVATED"
      ];
      setNetworkTicker(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 4000);
    return () => clearInterval(tickerInt);
  }, [gameState.streamHourlyRate, gameState.baseEarningAmount, gameState.baseEarningIntervalMs]);

  useEffect(() => {
    if (isRecording) {
      const start = Date.now();
      const durationMs = (captureMode === 'video') ? 15000 : (performanceDuration * 1000);
      
      const interval = setInterval(() => {
        const now = Date.now();
        const progress = ((now - start) / durationMs) * 100;
        
        if (now >= start + durationMs) {
          setIsRecording(false);
          setRecordProgress(0);
          
          let payout = gameState.videoEarning; 
          let assetName = 'VIDEO ASSET';
          
          if (captureMode === 'sing' || captureMode === 'dance' || captureMode === 'instrument') {
            const baseVideoReward = gameState.videoEarning * 0.75;
            payout = (performanceDuration / 15) * baseVideoReward;
            
            let modeLabel = captureMode.toUpperCase();
            if (captureMode === 'sing') modeLabel = `SINGING PERFORMANCE (${performanceVocalMode.toUpperCase()})`;
            if (captureMode === 'instrument') modeLabel = `INSTRUMENTAL PERFORMANCE`;
            if (captureMode === 'dance') modeLabel = `DANCE PERFORMANCE`;
            
            assetName = modeLabel;
            
            const durationLabel = performanceDuration === 120 ? 'full length' : `${performanceDuration} seconds`;
            handleAction(`I just finished a ${durationLabel} ${activeStar?.signatureGenre} ${modeLabel} to "${songTitle}". How did the set feel?`);
          } else if (captureMode === 'video') {
             assetName = 'NETWORK VIDEO CONTENT';
             payout = 2.00;
          }
          
          processReward(payout, assetName);
          setPayoutMessage(`+$${payout.toFixed(2)} ${assetName} REWARD`);
          setShowPayoutToast(true);
          setTimeout(() => setShowPayoutToast(false), 8000);
          clearInterval(interval);
        } else {
          setRecordProgress(progress);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording, captureMode, performanceDuration, songTitle, gameState.videoEarning, performanceVocalMode, activeStar?.signatureGenre]);

  const handleShareAsset = async (type: string) => {
    if (!activeStar?.appearance.imageUrl) return;
    const shareText = `Check out my latest ${type.toUpperCase()} from ${gameState.networkName}! 
Star: ${activeStar.userName}
Ratio: ${selectedRatio.label}
Filter: ${selectedFilter.label}
Career Earnings: $${activeStar.earnings.toFixed(2)}
Join the Network today!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${gameState.networkName} - NEW CONTENT`, text: shareText, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Copied to clipboard!");
      }
    } catch (err) { console.error(err); }
  };

  const processReward = (amount: number, captureType?: string) => {
    setGameState(prev => {
      const newRoster = prev.roster.map(star => {
        if (star.id === prev.activeStarId) {
          const currentPop = star.popularity || 0;
          const currentLevel = star.level || 1;
          const newPop = currentPop + Math.floor(amount * 5); 
          const levelThreshold = currentLevel * 100;
          const newLevel = newPop >= levelThreshold ? currentLevel + 1 : currentLevel;
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
      const earned = streamRevenue;
      processReward(earned);
      setPayoutMessage(`+$${earned.toFixed(2)} LIVE STREAM REVENUE`);
      setShowPayoutToast(true);
      setTimeout(() => setShowPayoutToast(false), 5000);
      setStreamRevenue(0);
      setOnAir(false);
    } else {
      setOnAir(true);
      if (captureMode === 'video') {
        setIsRecording(true);
      }
    }
  };

  const handleAction = async (prompt?: string) => {
    if (!activeStar) return;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    setIsAiThinking(true);
    const contextPrompt = prompt || userInput;
    if (!prompt) {
      setChatLog(prev => [...prev, { role: 'user', text: userInput }]);
      setUserInput('');
    }
    try {
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: `You are the Executive Producer. Talent: ${activeStar.userName}, Role: ${activeStar.role}. Studio: ${activeStar.shootingLocation}. User directive: ${contextPrompt}`,
        config: { systemInstruction: `Act as a high-stakes TV producer. Give feedback to the star about their performance. Be loud, energetic, and professional. Mention specific details about the duration, mode (instrumental/vocal/instrument playing), or music genre if provided.` }
      });
      setChatLog(prev => [...prev, { role: 'ai', text: response.text || "Signal glitch!" }]);
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'ai', text: "Technical error on the network." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const createNewStar = async () => {
    setIsGeneratingImage(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const s = tempStar as CharacterProfile;
    // Modified prompt to focus on 'Cartoon Network series' art style
    const prompt = `Stylized 2D character design in the iconic Cartoon Network art style, clean bold outlines, vibrant flat colors, cel-shaded, expressive features. Character: ${s.userName}, a ${s.role}. Physical specs: ${s.appearance.skintone} skin, ${s.appearance.bodyHeight} height, ${s.appearance.bodyShape} build. Wearing: ${s.appearance.top} and ${s.appearance.bottom} with ${s.appearance.footwear}. Bio: ${s.bio || 'A rising star.'} Pose: ${s.appearance.pose}. Environment: ${s.shootingLocation}. Features: ${s.appearance.studioFurniture} (Positioned: ${s.studioTransforms.furniture.x}, ${s.studioTransforms.furniture.y}, Scale: ${s.studioTransforms.furniture.scale}) and ${s.appearance.studioProps} (Positioned: ${s.studioTransforms.props.x}, ${s.studioTransforms.props.y}, Scale: ${s.studioTransforms.props.scale}). Lighting: ${s.appearance.studioLighting}. Style: professional vector-style character sheet, high quality 2D animation aesthetic.`;
    
    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
      const newId = s.id || Math.random().toString(36).substr(2, 9);
      const finalizedStar: CharacterProfile = { 
        ...s, 
        id: newId, 
        popularity: s.popularity || 0, 
        level: s.level || 1, 
        earnings: s.earnings || 0, 
        bio: s.bio || '', 
        studioUpgrades: s.studioUpgrades || [], 
        appearance: { ...s.appearance, imageUrl },
        signatureAction: s.signatureAction || 'photo',
        signatureSong: s.signatureSong || 'UNLIMITED HITS',
        signatureGenre: s.signatureGenre || 'Pop',
        studioTransforms: s.studioTransforms || { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } }
      };
      setGameState(prev => ({ 
        ...prev, 
        roster: s.id ? prev.roster.map(star => star.id === newId ? finalizedStar : star) : [...prev.roster, finalizedStar], 
        activeStarId: newId, 
        draftStar: { appearance: DEFAULT_APPEARANCE, bio: '', signatureAction: 'photo', signatureSong: 'UNLIMITED HITS', signatureGenre: 'Pop', studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } } 
      }));
      setCurrentView('dashboard');
    } catch (err) { alert("Asset sync failed."); } 
    finally { setIsGeneratingImage(false); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState.playerAge < 5) { alert("Access Restricted: Aged 5 and above."); return; }
    setIsLoggedIn(true);
    if (!gameState.tutorialSeen) setCurrentView('tutorial');
    else if (gameState.roster.length === 0) setCurrentView('onboarding');
    else setCurrentView('roster');
  };

  const handleWithdrawal = () => {
    if (gameState.money < gameState.minWithdrawal) { alert(`Min withdrawal: $${gameState.minWithdrawal.toFixed(2)}`); return; }
    const amount = gameState.money;
    const newTransaction: Transaction = {
      id: 'TX-' + Date.now(),
      amount: amount,
      currency: 'USD',
      provider: 'NETWORK WIRE',
      timestamp: Date.now(),
      status: 'Completed',
      type: 'Withdrawal'
    };
    setGameState(prev => ({ ...prev, money: 0, transactions: [newTransaction, ...prev.transactions] }));
    alert(`Transfer of $${amount.toFixed(2)} successful.`);
  };

  const overrideStarStat = (starId: string, key: string, value: any) => {
    setGameState(prev => ({
      ...prev,
      roster: prev.roster.map(star => star.id === starId ? { ...star, [key]: value } : star)
    }));
  };

  const updateNetworkParam = (key: string, val: any) => {
    setGameState(p => ({ ...p, [key]: val }));
  };

  const addCustomItem = (category: string, item: string) => {
    if (!item) return;
    setGameState(p => {
      if (category === 'role') return { ...p, customRoles: [...p.customRoles, item] };
      const newInspirations = { ...p.customInspirations };
      newInspirations[category] = [...(newInspirations[category] || []), item];
      return { ...p, customInspirations: newInspirations };
    });
  };

  const removeCustomItem = (category: string, item: string) => {
    setGameState(p => {
      if (category === 'role') return { ...p, customRoles: p.customRoles.filter(r => r !== item) };
      const newInspirations = { ...p.customInspirations };
      newInspirations[category] = (newInspirations[category] || []).filter(i => i !== item);
      return { ...p, customInspirations: newInspirations };
    });
  };

  const [customStep, setCustomStep] = useState<'profile' | 'apparel' | 'studio' | 'performance'>('profile');
  const [studioCalibrationTarget, setStudioCalibrationTarget] = useState<'none' | 'furniture' | 'props' | 'lighting'>('none');

  // --- Views ---
  const DashboardView = () => (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans overflow-hidden">
      {showParentalGate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border-[10px] border-white p-12 text-center space-y-8">
            <Shield className="w-20 h-20 text-[#FF0080] mx-auto" />
            <h2 className="text-5xl font-bebas text-white uppercase">PARENTAL GATE</h2>
            <p className="text-xs text-slate-500 uppercase">Enter 4-digit PIN to proceed.</p>
            <input type="password" maxLength={4} className="w-full bg-black border-8 border-slate-800 p-8 text-4xl text-white text-center" placeholder="0000" onChange={(e) => { if(e.target.value.length === 4) { setGameState(p => ({...p, parentalConsent: true})); setShowParentalGate(false); } }} />
            <button onClick={() => setShowParentalGate(false)} className="btn-flat w-full py-4 bg-slate-800 text-white font-bebas">CANCEL</button>
          </div>
        </div>
      )}
      {showPayoutToast && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-12 duration-500">
           <div className="bg-[#00FF7F] text-black p-8 border-[10px] border-black flex items-center gap-10 min-w-[650px]">
              <div className="bg-black p-6"><Award className="w-16 h-16 text-[#00FF7F] animate-bounce" /></div>
              <div className="flex-1">
                <p className="text-6xl font-bebas tracking-widest leading-none uppercase">ASSET SYNC</p>
                <p className="text-xs font-black uppercase mt-4 tracking-[0.3em] border-t-4 border-black pt-4">YIELD: {payoutMessage}</p>
              </div>
              <button onClick={() => handleShareAsset('capture')} className="btn-flat bg-black text-[#00FF7F] px-8 py-4 border-4 border-black font-bebas text-2xl hover:bg-white hover:text-black transition-all flex items-center gap-3"><Share2 className="w-6 h-6" /> SHARE</button>
           </div>
        </div>
      )}
      <Ticker networkName={gameState.networkName} />
      <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Logo className="w-16 h-16" />
          <div className="hidden lg:flex flex-col"><span className="font-bebas text-5xl text-white uppercase leading-none">TERMINAL</span><span className="text-[9px] font-black text-[#00FF7F] uppercase tracking-widest mt-2 flex items-center gap-2"><div className="w-2 h-2 bg-[#00FF7F] animate-pulse" /> WORLDWIDE UPLINK</span></div>
        </div>
        <nav className="flex items-center gap-16">
          <button onClick={() => setCurrentView('roster')} className="font-black text-[12px] tracking-[0.4em] uppercase text-slate-500 hover:text-white flex flex-col items-center gap-2 group"><Layers className="w-5 h-5 group-hover:text-white" /> HUB</button>
          <button onClick={() => setCurrentView('dashboard')} className="font-black text-[12px] tracking-[0.4em] uppercase text-[#FF0080] border-b-8 pb-1 pt-2 border-[#FF0080] flex flex-col items-center gap-2"><Monitor className="w-5 h-5" /> LIVE</button>
          <button onClick={() => setCurrentView('wallet')} className="font-black text-[12px] tracking-[0.4em] uppercase text-slate-500 hover:text-white flex flex-col items-center gap-2 group"><BarChart3 className="w-5 h-5 group-hover:text-white" /> REVENUE</button>
        </nav>
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentView('wallet')} className="flex items-center gap-6 px-12 py-5 bg-slate-950 border-8 border-black cursor-pointer group hover:border-[#00FF7F] transition-all">
            <DollarSign className="w-8 h-8 text-[#00FF7F]" /><span className="font-black text-4xl font-mono text-[#00FF7F]">${gameState.money.toFixed(2)}</span>
          </div>
          <button onClick={() => setCurrentView('settings')} className="p-5 bg-slate-800 border-4 border-black hover:bg-white hover:text-black transition-colors"><Settings className="w-8 h-8" /></button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-10 gap-10 overflow-hidden bg-grid">
        <div className="flex-1 flex flex-col gap-10 min-h-0">
          <div className="relative flex-1 bg-black border-[12px] border-white flex flex-col overflow-hidden">
            {onAir && <div className="absolute inset-0 pointer-events-none z-10 border-[16px] border-red-600 m-8 animate-pulse" />}
            {flashActive && <div className="absolute inset-0 bg-white z-[100] animate-pulse" />}
            <div className="p-10 border-b-8 border-white flex justify-between items-center bg-slate-900 z-20">
              <div className="flex items-center gap-12">
                {onAir ? <div className="px-12 py-6 bg-red-600 border-8 border-black animate-pulse flex items-center gap-6"><span className="font-bebas text-5xl text-white uppercase">LIVE STREAMING</span></div> : <div className="px-12 py-6 bg-slate-800 border-8 border-slate-700 flex items-center gap-6"><span className="font-bebas text-5xl text-slate-500 uppercase">OFFLINE</span></div>}
                <div className="flex flex-col"><span className="text-4xl font-bebas text-white uppercase tracking-widest">{activeStar?.userName}</span><span className="text-2xl font-bebas text-[#FF0080] uppercase tracking-widest">{activeStar?.role}</span></div>
              </div>
              <div className="flex gap-8">
                <button onClick={() => setCurrentView('tutorial')} className="p-5 bg-slate-800 border-4 border-black hover:bg-white hover:text-black transition-colors"><HelpCircle className="w-8 h-8" /></button>
                {!onAir ? <button onClick={toggleOnAir} className="btn-flat px-24 py-8 text-black border-8 border-black text-4xl font-bebas tracking-widest bg-[#00FF7F] hover:bg-white">GO LIVE</button> : <button onClick={toggleOnAir} className="btn-flat px-24 py-8 bg-slate-700 text-white border-8 border-black text-4xl font-bebas tracking-widest hover:bg-red-600">END STREAM</button>}
              </div>
            </div>

            <div className="bg-slate-950 border-b-8 border-white flex flex-col z-20">
               <div className="bg-black/40 border-b-2 border-white/5 px-10 py-2 flex items-center gap-4"><Activity className="w-4 h-4 text-[#FF0080]" /><span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Broadcast Performance Metrics // Worldwide Uplink Active</span></div>
               <div className="px-10 py-8 flex items-center justify-around">
                  <div className="flex items-center gap-6 group hover:translate-y-[-2px] transition-transform">
                     <TrendingUp className="w-12 h-12 text-[#FF0080] drop-shadow-[0_0_10px_rgba(255,0,128,0.5)]" />
                     <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Popularity</span><span className="text-5xl font-bebas text-white tracking-widest group-hover:text-[#FF0080] transition-colors">{(activeStar?.popularity || 0).toLocaleString()}</span></div>
                  </div>
                  <div className="w-1 h-16 bg-slate-800/50" />
                  <div className="flex items-center gap-6 group hover:translate-y-[-2px] transition-transform">
                     <Award className="w-12 h-12 text-[#00FF7F] drop-shadow-[0_0_10px_rgba(0,255,127,0.5)]" />
                     <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Star Level</span><span className="text-5xl font-bebas text-white tracking-widest group-hover:text-[#00FF7F] transition-colors">{activeStar?.level || 1}</span></div>
                  </div>
                  <div className="w-1 h-16 bg-slate-800/50" />
                  <div className="flex items-center gap-6 group hover:translate-y-[-2px] transition-transform">
                     <Zap className="w-12 h-12 text-[#FFFF00] drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]" />
                     <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Career Revenue</span><span className="text-5xl font-bebas text-white tracking-widest group-hover:text-[#FFFF00] transition-colors">${(activeStar?.earnings || 0).toFixed(2)}</span></div>
                  </div>
               </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-black">
              <div className="flex-1 flex flex-col border-r-8 border-white">
                <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar relative">
                  {onAir && <div className="absolute top-4 right-4 bg-black/80 border-4 border-[#00FF7F] p-4 z-50 animate-in fade-in slide-in-from-right-10"><div className="flex items-center gap-4"><Zap className="w-8 h-8 text-[#00FF7F] animate-pulse" /><div><p className="text-[10px] font-black uppercase text-[#00FF7F] tracking-[0.2em]">Global Session Yield</p><p className="text-4xl font-bebas text-white leading-none">${streamRevenue.toFixed(2)}</p></div></div></div>}
                  {chatLog.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-10`}><div className={`max-w-[85%] p-10 border-8 ${msg.role === 'user' ? 'bg-slate-900 border-[#0000FF]' : 'bg-slate-900 border-[#FF0080]'}`}><div className="text-[11px] uppercase font-black opacity-60 tracking-[0.6em] text-white mb-6 border-b border-white/10 pb-2">{msg.role === 'user' ? activeStar?.userName : 'EXEC PRODUCER'}</div><div className="text-2xl leading-relaxed font-bold tracking-tight text-white uppercase">{msg.text}</div></div></div>
                  ))}
                  {isAiThinking && <div className="flex justify-start"><div className="bg-slate-900 border-8 border-[#FF0080] p-10 flex gap-6"><div className="w-5 h-5 bg-[#FF0080] animate-bounce" /><div className="w-5 h-5 bg-[#FF0080] animate-bounce [animation-delay:0.2s]" /></div></div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-12 border-t-8 border-white bg-slate-900">
                  <form onSubmit={(e) => { e.preventDefault(); if(userInput.trim()) handleAction(); }} className="flex gap-10"><input disabled={!onAir || isAiThinking} value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={onAir ? "TRANSMIT DIRECTIVE..." : "WAITING FOR UPLINK..."} className="flex-1 bg-black border-8 border-white px-12 py-10 text-2xl text-white font-mono uppercase outline-none focus:border-[#FF0080] placeholder:text-slate-900" /><button disabled={!onAir || !userInput.trim() || isAiThinking} className="btn-flat px-20 bg-white text-black border-8 border-black hover:bg-[#FF0080] hover:text-white"><Mic2 className="w-12 h-12" /></button></form>
                </div>
              </div>

              <div className="lg:w-[450px] flex flex-col bg-slate-900 p-10 overflow-y-auto custom-scrollbar border-l-8 border-white">
                <div className="space-y-16">
                   <div className="space-y-6">
                     <label className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">REVENUE CAPTURE</label>
                     <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setCaptureMode('photo')} className={`py-6 border-4 text-[9px] font-black uppercase flex flex-col items-center gap-4 transition-all ${captureMode === 'photo' ? 'bg-[#FF0080] border-white text-white' : 'bg-black border-slate-800 text-slate-500'}`}><Camera className="w-8 h-8" /> PHOTO</button>
                        <button onClick={() => setCaptureMode('video')} className={`py-6 border-4 text-[9px] font-black uppercase flex flex-col items-center gap-4 transition-all ${captureMode === 'video' ? 'bg-[#0000FF] border-white text-white' : 'bg-black border-slate-800 text-slate-500'}`}><Video className="w-8 h-8" /> VIDEO</button>
                        <button onClick={() => setCaptureMode('sing')} className={`py-6 border-4 text-[9px] font-black uppercase flex flex-col items-center gap-4 transition-all ${captureMode === 'sing' ? 'bg-[#FFFF00] border-white text-black' : 'bg-black border-slate-800 text-slate-500'}`}><Mic2 className="w-8 h-8" /> SING</button>
                        <button onClick={() => setCaptureMode('dance')} className={`py-6 border-4 text-[9px] font-black uppercase flex flex-col items-center gap-4 transition-all ${captureMode === 'dance' ? 'bg-[#00FF7F] border-white text-black' : 'bg-black border-slate-800 text-slate-500'}`}><Dna className="w-8 h-8" /> DANCE</button>
                        <button onClick={() => setCaptureMode('instrument')} className={`col-span-2 py-6 border-4 text-[9px] font-black uppercase flex flex-col items-center gap-4 transition-all ${captureMode === 'instrument' ? 'bg-[#FF8000] border-white text-white' : 'bg-black border-slate-800 text-slate-500'}`}><Piano className="w-8 h-8" /> INSTRUMENT PERFORMANCE</button>
                     </div>
                   </div>

                   <div className="space-y-10 border-t-8 border-white pt-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[#00FF7F]">
                          <Maximize className="w-6 h-6" />
                          <label className="text-xs font-black uppercase tracking-[0.3em]">ASPECT RATIO</label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                           {ASPECT_RATIOS.map(ratio => (
                             <button key={ratio.label} onClick={() => setSelectedRatio(ratio)} className={`p-3 border-4 text-[10px] font-black transition-all ${selectedRatio.label === ratio.label ? 'bg-white text-black border-white' : 'bg-black text-slate-600 border-slate-800 hover:border-slate-500'}`}>{ratio.label}</button>
                           ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[#FF0080]">
                          <Filter className="w-6 h-6" />
                          <label className="text-xs font-black uppercase tracking-[0.3em]">BROADCAST FILTER</label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           {FILTERS.map(filter => (
                             <button key={filter.label} onClick={() => setSelectedFilter(filter)} className={`p-4 border-4 text-[10px] font-black transition-all ${selectedFilter.label === filter.label ? 'bg-white text-black border-white' : 'bg-black text-slate-600 border-slate-800 hover:border-slate-500'}`}>{filter.label}</button>
                           ))}
                        </div>
                      </div>
                   </div>

                   {onAir ? (
                      <div className="space-y-8 border-t-8 border-white pt-10">
                         {captureMode === 'photo' ? (
                            <button onClick={capturePhoto} className="w-full btn-flat py-12 bg-[#FF0080] text-white border-[10px] border-black font-bebas text-5xl tracking-[0.2em] hover:bg-white hover:text-black transition-all">SNAP ($1)</button>
                         ) : (
                            <div className="space-y-6">
                               {(captureMode === 'sing' || captureMode === 'dance' || captureMode === 'instrument') && (
                                 <div className="space-y-6 animate-in slide-in-from-right-10">
                                   <div className="space-y-4">
                                      <div className="flex items-center gap-3 text-[#FFFF00] border-b-2 border-[#FFFF00] pb-2">
                                        <Music className="w-5 h-5" />
                                        <label className="text-[10px] font-black uppercase tracking-widest">SONG SELECTION</label>
                                      </div>
                                      <div className="flex flex-col gap-4">
                                        <input value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="w-full bg-black border-4 border-white p-4 text-white font-mono uppercase text-sm focus:border-[#FF0080] outline-none" placeholder="ENTER SONG..." />
                                        {captureMode === 'sing' && (
                                          <div className="flex gap-2">
                                            <button 
                                              onClick={() => setPerformanceVocalMode('vocal')}
                                              className={`flex-1 p-3 border-2 text-[10px] font-black uppercase transition-all ${performanceVocalMode === 'vocal' ? 'bg-[#FF0080] text-white border-white' : 'bg-black text-slate-500 border-slate-800'}`}
                                            >
                                              Vocal
                                            </button>
                                            <button 
                                              onClick={() => setPerformanceVocalMode('instrumental')}
                                              className={`flex-1 p-3 border-2 text-[10px] font-black uppercase transition-all ${performanceVocalMode === 'instrumental' ? 'bg-[#00FF7F] text-black border-white' : 'bg-black text-slate-500 border-slate-800'}`}
                                            >
                                              Instrumental
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                   </div>
                                   <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PERFORMANCE DURATION</label>
                                     <div className="grid grid-cols-3 gap-2">
                                       {[15, 30, 45, 60, 120].map(d => (
                                         <button 
                                           key={d} 
                                           onClick={() => setPerformanceDuration(d as PerformanceDuration)} 
                                           className={`p-3 border-2 text-[10px] font-black uppercase ${performanceDuration === d ? 'bg-white text-black border-white' : 'bg-black text-slate-500 border-slate-800 hover:border-white'}`}
                                         >
                                           {d === 120 ? 'FULL' : d === 60 ? '1 MIN' : d + 'S'}
                                         </button>
                                       ))}
                                     </div>
                                   </div>
                                 </div>
                               )}
                               <div className="space-y-4">
                                 <button disabled={isRecording} onClick={() => setIsRecording(true)} className={`w-full btn-flat py-12 text-white border-[10px] border-black font-bebas text-5xl tracking-[0.2em] ${isRecording ? 'bg-slate-700 opacity-50' : (captureMode === 'sing' ? 'bg-[#FFFF00] text-black hover:bg-white' : (captureMode === 'dance' ? 'bg-[#00FF7F] text-black hover:bg-white' : (captureMode === 'instrument' ? 'bg-[#FF8000] hover:bg-white hover:text-black' : (captureMode === 'video' ? 'bg-[#0000FF] hover:bg-white hover:text-black' : 'bg-slate-800'))))}`}>
                                   {isRecording ? 'RECORDING...' : (captureMode === 'video' ? `VIDEO ($2.00)` : `${captureMode.toUpperCase()} ($${((performanceDuration / 15) * (gameState.videoEarning * 0.75)).toFixed(1)})`)}
                                 </button>
                                 {isRecording && <div className="h-6 bg-black border-4 border-white p-1 overflow-hidden"><div className="h-full bg-red-600 transition-all duration-100 ease-linear" style={{ width: `${recordProgress}%` }} /></div>}
                               </div>
                            </div>
                         )}
                         <div className="pt-10 border-t-4 border-slate-800">
                           <p className="text-[10px] font-black text-[#00FF7F] uppercase tracking-widest mb-4">Live Session Summary</p>
                           <div className="bg-black p-6 border-4 border-slate-800 space-y-4">
                             <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">Hourly Rate</span><span className="text-xl font-bebas text-white">${gameState.streamHourlyRate.toFixed(2)}</span></div>
                             <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">Earned Now</span><span className="text-xl font-bebas text-[#00FF7F]">${streamRevenue.toFixed(2)}</span></div>
                           </div>
                         </div>
                      </div>
                   ) : <div className="bg-black border-8 border-slate-800 p-12 text-center text-slate-800 border-t-8 border-white mt-10"><Monitor className="w-20 h-20 mx-auto mb-8 opacity-20" /><p className="text-xs font-black uppercase tracking-[0.4em]">Broadcast Disconnected</p><button onClick={toggleOnAir} className="mt-8 btn-flat w-full py-4 bg-white text-black border-4 border-black text-xl font-bebas tracking-widest hover:bg-[#00FF7F]">GO LIVE</button></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="lg:w-[450px] flex flex-col gap-10 overflow-y-auto">
          {/* Main Display Frame */}
          <div className="bg-slate-900 border-[10px] border-white p-8 space-y-4">
             <div className="flex justify-between items-center px-2"><span className="text-[10px] font-black text-[#FF0080] uppercase tracking-widest">VISUAL BROADCAST FEED</span><div className="flex gap-4"><div className="bg-black px-3 py-1 border-2 border-[#00FF7F] text-[#00FF7F] text-[8px] font-black">{selectedRatio.label}</div><div className="bg-black px-3 py-1 border-2 border-[#FFFF00] text-[#FFFF00] text-[8px] font-black">{selectedFilter.label}</div></div></div>
             <div className={`w-full ${selectedRatio.value} bg-black border-4 border-black relative overflow-hidden flex items-center justify-center transition-all duration-500`}>
               {activeStar?.appearance.imageUrl ? <img src={activeStar.appearance.imageUrl} alt="Star" className={`w-full h-full object-cover transition-all duration-500 ${selectedFilter.class}`} /> : <Loader2 className="w-24 h-24 animate-spin text-[#FF0080]" />}
               <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                 <div className="bg-white text-black px-6 py-3 font-bebas text-3xl uppercase border-4 border-black pointer-events-auto shadow-[4px_4px_0px_0px_#FF0080]">{activeStar?.userName}</div>
                 <button onClick={() => { if(activeStar) { setTempStar(activeStar); setCurrentView('customization'); } }} className="btn-flat bg-[#FF0080] text-white p-4 border-4 border-black pointer-events-auto hover:bg-white hover:text-black transition-all"><RefreshCcw className="w-6 h-6" /></button>
               </div>
          </div>
          </div>

          {/* Star Console Section */}
          <div className="bg-slate-900 border-[10px] border-white p-10 space-y-8">
            <div className="flex items-center gap-6 border-b-4 border-black pb-4">
              <BarChart4 className="w-10 h-10 text-[#FF0080]" />
              <div className="flex flex-col">
                <h3 className="text-4xl font-bebas text-white uppercase tracking-widest leading-none">STAR CONSOLE</h3>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">LIVE ANALYTICS ENGINE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Popularity Card */}
              <div className="bg-black border-4 border-[#FF0080] p-6 group hover:translate-x-2 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-[#FF0080]" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">POPULARITY</span>
                  </div>
                  <span className="text-5xl font-bebas text-white tracking-widest">{(activeStar?.popularity || 0).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-900 border border-slate-800">
                  <div className="h-full bg-[#FF0080] animate-pulse" style={{ width: `${Math.min(100, (activeStar?.popularity || 0) / ( (activeStar?.level || 1) * 100 ) * 100)}%` }} />
                </div>
              </div>

              {/* Level Card */}
              <div className="bg-black border-4 border-[#00FF7F] p-6 group hover:translate-x-2 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Award className="w-8 h-8 text-[#00FF7F]" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">STAR LEVEL</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-5xl font-bebas text-white tracking-widest">LV. {activeStar?.level || 1}</span>
                    <span className="text-[9px] font-black text-[#00FF7F] uppercase tracking-widest">UPLINK STABLE</span>
                  </div>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-black border-4 border-[#FFFF00] p-6 group hover:translate-x-2 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <DollarSign className="w-8 h-8 text-[#FFFF00]" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">STAR REVENUE</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-5xl font-bebas text-white tracking-widest">${(activeStar?.earnings || 0).toFixed(2)}</span>
                    <span className="text-[9px] font-black text-[#FFFF00] uppercase tracking-widest">CREDITS SYNCED</span>
                  </div>
                </div>
              </div>

              {/* Genre Badge */}
              <div className="bg-slate-950 border-4 border-slate-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Disc className="w-6 h-6 text-slate-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PRIMARY GENRE</span>
                </div>
                <span className="text-xl font-bebas text-white uppercase tracking-widest">{activeStar?.signatureGenre}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );

  const CustomizationView = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const switchStep = (step: any) => { setIsTransitioning(true); setTimeout(() => { setCustomStep(step); setStudioCalibrationTarget('none'); setIsTransitioning(false); }, 150); };
    
    const updateValue = (key: string, val: any) => { 
      if (key === 'shootingLocation') setTempStar(p => ({ ...p, shootingLocation: val })); 
      else if (['signatureAction', 'signatureSong', 'signatureGenre', 'userName', 'role'].includes(key)) setTempStar(p => ({ ...p, [key]: val }));
      else setTempStar(p => ({ ...p, appearance: { ...(p.appearance || DEFAULT_APPEARANCE), [key]: val } })); 
    };

    const updateTransform = (target: 'furniture' | 'props' | 'lighting', key: keyof StudioTransform, val: number) => {
      setTempStar(p => {
        const transforms = p.studioTransforms || { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } };
        return { ...p, studioTransforms: { ...transforms, [target]: { ...transforms[target], [key]: val } } };
      });
    };

    const renderOptionGroup = (label: string, key: string, list: string[], accent: string) => (
      <div className="space-y-4">
        <label className={`text-[10px] font-black uppercase tracking-[0.4em]`} style={{ color: accent }}>{label}</label>
        <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {list.map(opt => (<button key={opt} onClick={() => updateValue(key, opt)} className={`p-3 border-2 text-[10px] font-black uppercase transition-all duration-200 ${(tempStar.appearance?.[key as keyof StarAppearance] === opt || tempStar.shootingLocation === opt || tempStar[key as keyof CharacterProfile] === opt) ? 'border-white text-white' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-400'}`} style={{ backgroundColor: (tempStar.appearance?.[key as keyof StarAppearance] === opt || tempStar.shootingLocation === opt || tempStar[key as keyof CharacterProfile] === opt) ? accent : 'transparent' }}>{opt}</button>))}
        </div>
      </div>
    );

    const CalibrationSlider = ({ label, target, property, min, max, step, color }: any) => {
      const val = (tempStar.studioTransforms?.[target as 'furniture' | 'props' | 'lighting'] || DEFAULT_STUDIO_TRANSFORM)[property as keyof StudioTransform];
      return (
        <div className="space-y-3"><div className="flex justify-between items-center"><label className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</label><span className="text-[9px] font-mono text-white bg-black border border-slate-800 px-2 py-0.5">{val.toFixed(2)}</span></div><input type="range" min={min} max={max} step={step} value={val} onChange={(e) => updateTransform(target, property, parseFloat(e.target.value))} className="w-full accent-white bg-slate-800 h-1 appearance-none cursor-pointer" style={{ accentColor: color }} /></div>
      );
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col bg-grid overflow-hidden">
        <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50"><div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">STAR CONFIG</span></div><div className="flex gap-4"><button onClick={() => setCurrentView('roster')} className="btn-flat bg-white px-8 py-4 font-bebas text-xl">BACK</button><button onClick={() => setCurrentView('dashboard')} className="btn-flat bg-slate-800 text-white px-8 py-4 font-bebas text-xl">DASHBOARD</button></div></header>
        <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full overflow-hidden">
          <div className="lg:w-1/4 border-r-8 border-white bg-slate-900 p-8 flex flex-col gap-6">
            {[ { id: 'profile', label: 'Identity', icon: <UserCircle className="w-6 h-6" />, color: '#FF0080' }, { id: 'apparel', label: 'Apparel', icon: <Shirt className="w-6 h-6" />, color: '#00FF7F' }, { id: 'studio', label: 'Environment', icon: <Monitor className="w-6 h-6" />, color: '#FFFF00' }, { id: 'performance', label: 'Performance', icon: <Headphones className="w-6 h-6" />, color: '#0000FF' } ].map(tab => (<button key={tab.id} onClick={() => switchStep(tab.id as any)} className={`flex items-center gap-6 p-6 border-4 border-black font-bebas text-3xl tracking-widest transition-all duration-300 transform ${customStep === tab.id ? 'translate-x-4 bg-white text-black' : 'bg-slate-950 text-slate-600 hover:bg-slate-800'}`} style={{ borderLeftColor: tab.color, borderLeftWidth: customStep === tab.id ? '16px' : '4px' }}>{React.cloneElement(tab.icon as any, { style: { color: customStep === tab.id ? tab.color : 'inherit' } })}{tab.label}</button>))}
            <div className="mt-auto space-y-6"><button disabled={isGeneratingImage || !tempStar.userName} onClick={createNewStar} className="w-full btn-flat py-8 bg-[#00FF7F] text-black text-4xl border-8 border-black font-bebas hover:bg-white disabled:opacity-20">{isGeneratingImage ? <Loader2 className="w-8 h-8 animate-spin" /> : 'COMMIT ASSET'}</button></div>
          </div>
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-slate-950/50 relative">
            <div className={`transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-x-10 scale-95' : 'opacity-100 translate-x-0 scale-100'} space-y-16`}>
              {customStep === 'profile' && (
                <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                  <div className="flex items-center gap-6 border-b-8 border-[#FF0080] pb-6"><UserCircle className="w-12 h-12 text-[#FF0080]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Star Identity</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12"><div className="space-y-4"><label className="text-[10px] font-black text-[#FF0080] uppercase tracking-widest">STAR NAME</label><input value={tempStar.userName || ''} onChange={(e) => updateValue('userName', e.target.value)} className="w-full bg-black border-4 border-slate-800 p-6 text-2xl text-white font-bebas focus:border-[#FF0080] outline-none" placeholder="ENTER NAME..." /></div><div className="space-y-4"><label className="text-[10px] font-black text-[#FF0080] uppercase tracking-widest">BROADCAST ROLE</label><select value={tempStar.role || ''} onChange={(e) => updateValue('role', e.target.value)} className="w-full bg-black border-4 border-slate-800 p-6 text-2xl text-white font-bebas focus:border-[#FF0080] outline-none">{gameState.customRoles.map(r => (<option key={r} value={r}>{r.toUpperCase()}</option>))}</select></div></div>
                  <div className="space-y-6"><label className="text-xs font-black text-[#FF0080] uppercase tracking-widest">Biography</label><textarea value={tempStar.bio || ''} onChange={(e) => setTempStar(p => ({...p, bio: e.target.value}))} placeholder="TELL THE WORLD..." className="w-full bg-black border-4 border-slate-800 p-8 text-white font-mono uppercase text-sm h-48 focus:border-[#FF0080] outline-none" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {renderOptionGroup('GENDER IDENTITY', 'gender', gameState.customInspirations.gender || INITIAL_INSPIRATIONS.gender, '#FF0080')}
                    {renderOptionGroup('SKINTONE SELECTION', 'skintone', gameState.customInspirations.skintone || INITIAL_INSPIRATIONS.skintone, '#FF0080')}
                    {renderOptionGroup('HEIGHT SCALE', 'bodyHeight', gameState.customInspirations.bodyHeight || INITIAL_INSPIRATIONS.bodyHeight, '#FF0080')}
                    {renderOptionGroup('BODY SHAPE', 'bodyShape', gameState.customInspirations.bodyShape || INITIAL_INSPIRATIONS.bodyShape, '#FF0080')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {renderOptionGroup('FACE SHAPE', 'faceShape', gameState.customInspirations.faceShape || INITIAL_INSPIRATIONS.faceShape, '#FF0080')}
                    {renderOptionGroup('EYE RADIANCE', 'eyes', gameState.customInspirations.eyes || INITIAL_INSPIRATIONS.eyes, '#FF0080')}
                  </div>
                </div>
              )}
              {customStep === 'apparel' && (
                <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                  <div className="flex items-center gap-6 border-b-8 border-[#00FF7F] pb-6"><Shirt className="w-12 h-12 text-[#00FF7F]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Broadcast Apparel</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {renderOptionGroup('BODY/SUIT SIZE', 'bodySize', gameState.customInspirations.bodySize || INITIAL_INSPIRATIONS.bodySize, '#00FF7F')}
                    {renderOptionGroup('CLOTHING SIZE', 'clothingSize', gameState.customInspirations.clothingSize || INITIAL_INSPIRATIONS.clothingSize, '#00FF7F')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {renderOptionGroup('SHOE SIZE (MEN)', 'shoeSize', gameState.customInspirations.shoeSizeMen || INITIAL_INSPIRATIONS.shoeSizeMen, '#00FF7F')}
                    {renderOptionGroup('SHOE SIZE (WOMEN)', 'shoeSize', gameState.customInspirations.shoeSizeWomen || INITIAL_INSPIRATIONS.shoeSizeWomen, '#00FF7F')}
                  </div>
                  {renderOptionGroup('HEADWEAR SIZE', 'headwearSize', gameState.customInspirations.headwearSize || INITIAL_INSPIRATIONS.headwearSize, '#00FF7F')}
                  <div className="pt-10 border-t-8 border-black">
                    {renderOptionGroup('HAIRSTYLE CONFIG', 'hairstyle', gameState.customInspirations.hairstyle || INITIAL_INSPIRATIONS.hairstyle, '#00FF7F')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {renderOptionGroup('UPPER BODY STYLE', 'top', gameState.customInspirations.top || INITIAL_INSPIRATIONS.top, '#00FF7F')}
                    {renderOptionGroup('LOWER BODY STYLE', 'bottom', gameState.customInspirations.bottom || INITIAL_INSPIRATIONS.bottom, '#00FF7F')}
                    {renderOptionGroup('FOOTWEAR STYLE', 'footwear', gameState.customInspirations.footwear || INITIAL_INSPIRATIONS.footwear, '#00FF7F')}
                    {renderOptionGroup('STUDIO MAKEUP', 'makeup', gameState.customInspirations.makeup || INITIAL_INSPIRATIONS.makeup, '#00FF7F')}
                  </div>
                </div>
              )}
              {customStep === 'studio' && (
                <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                   <div className="flex items-center gap-6 border-b-8 border-[#FFFF00] pb-6"><Monitor className="w-12 h-12 text-[#FFFF00]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Studio Config</h2></div>
                  {studioCalibrationTarget === 'none' ? (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {renderOptionGroup('TRANSMISSION HUB', 'shootingLocation', gameState.customInspirations.shootingLocation || INITIAL_INSPIRATIONS.shootingLocation, '#FFFF00')}
                        {renderOptionGroup('SET PIECES (FURNITURE)', 'studioFurniture', gameState.customInspirations.studioFurniture || INITIAL_INSPIRATIONS.studioFurniture, '#FFFF00')}
                        {renderOptionGroup('PRODUCTION PROPS', 'studioProps', gameState.customInspirations.studioProps || INITIAL_INSPIRATIONS.studioProps, '#FFFF00')}
                        {renderOptionGroup('LIGHTING RIG', 'studioLighting', gameState.customInspirations.studioLighting || INITIAL_INSPIRATIONS.studioLighting, '#FFFF00')}
                      </div>
                      <div className="pt-10 border-t-8 border-white">
                        <div className="grid grid-cols-3 gap-4">
                          <button onClick={() => setStudioCalibrationTarget('furniture')} className="btn-flat py-8 bg-[#FFFF00] text-black text-xl font-bebas border-8 border-black hover:bg-white flex flex-col items-center gap-4 justify-center"><Armchair className="w-10 h-10" /> CALIBRATE FURNITURE</button>
                          <button onClick={() => setStudioCalibrationTarget('props')} className="btn-flat py-8 bg-[#FFFF00] text-black text-xl font-bebas border-8 border-black hover:bg-white flex flex-col items-center gap-4 justify-center"><Box className="w-10 h-10" /> CALIBRATE PROPS</button>
                          <button onClick={() => setStudioCalibrationTarget('lighting')} className="btn-flat py-8 bg-[#FFFF00] text-black text-xl font-bebas border-8 border-black hover:bg-white flex flex-col items-center gap-4 justify-center"><Lamp className="w-10 h-10" /> CALIBRATE LIGHTING</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
                       <div className="flex gap-4">
                         <button onClick={() => setStudioCalibrationTarget('furniture')} className={`flex-1 p-6 border-4 font-bebas text-2xl uppercase transition-all ${studioCalibrationTarget === 'furniture' ? 'bg-[#FFFF00] text-black border-white' : 'bg-black text-slate-600 border-slate-800'}`}>FURNITURE</button>
                         <button onClick={() => setStudioCalibrationTarget('props')} className={`flex-1 p-6 border-4 font-bebas text-2xl uppercase transition-all ${studioCalibrationTarget === 'props' ? 'bg-[#FFFF00] text-black border-white' : 'bg-black text-slate-600 border-slate-800'}`}>PROPS</button>
                         <button onClick={() => setStudioCalibrationTarget('lighting')} className={`flex-1 p-6 border-4 font-bebas text-2xl uppercase transition-all ${studioCalibrationTarget === 'lighting' ? 'bg-[#FFFF00] text-black border-white' : 'bg-black text-slate-600 border-slate-800'}`}>LIGHTING</button>
                       </div>
                       
                       <div className="flex flex-col lg:flex-row gap-10">
                          {/* Visual Blueprint Helper */}
                          <div className="lg:w-1/3 bg-slate-900 border-8 border-white p-6 space-y-4">
                             <div className="flex items-center gap-3 text-[#FFFF00] border-b-2 border-black pb-2">
                               <Target className="w-4 h-4" />
                               <span className="text-[10px] font-black uppercase">Studio Blueprint</span>
                             </div>
                             <div className="aspect-square bg-black border-4 border-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white animate-pulse rounded-full z-20" title="Star Position" />
                                
                                <div 
                                  className={`absolute w-8 h-8 flex items-center justify-center border-2 border-[#FFFF00] bg-slate-900/80 transition-all duration-300 z-10 ${studioCalibrationTarget === 'furniture' ? 'scale-110 shadow-[0_0_15px_#FFFF00]' : 'opacity-40'}`}
                                  style={{ 
                                    left: `${50 + (tempStar.studioTransforms?.furniture?.x || 0) / 2}%`, 
                                    top: `${50 + (tempStar.studioTransforms?.furniture?.y || 0) / 2}%`,
                                    transform: `translate(-50%, -50%) rotate(${tempStar.studioTransforms?.furniture?.rotate || 0}deg) scale(${tempStar.studioTransforms?.furniture?.scale || 1})`
                                  }}
                                >
                                  <Armchair className="w-4 h-4 text-[#FFFF00]" />
                                </div>
                                
                                <div 
                                  className={`absolute w-6 h-6 flex items-center justify-center border-2 border-[#00FF7F] bg-slate-900/80 transition-all duration-300 z-10 ${studioCalibrationTarget === 'props' ? 'scale-110 shadow-[0_0_15px_#00FF7F]' : 'opacity-40'}`}
                                  style={{ 
                                    left: `${50 + (tempStar.studioTransforms?.props?.x || 0) / 2}%`, 
                                    top: `${50 + (tempStar.studioTransforms?.props?.y || 0) / 2}%`,
                                    transform: `translate(-50%, -50%) rotate(${tempStar.studioTransforms?.props?.rotate || 0}deg) scale(${tempStar.studioTransforms?.props?.scale || 1})`
                                  }}
                                >
                                  <Box className="w-3 h-3 text-[#00FF7F]" />
                                </div>

                                <div 
                                  className={`absolute w-10 h-10 flex items-center justify-center border-2 border-[#0000FF] bg-slate-900/80 transition-all duration-300 z-10 ${studioCalibrationTarget === 'lighting' ? 'scale-110 shadow-[0_0_15px_#0000FF]' : 'opacity-40'}`}
                                  style={{ 
                                    left: `${50 + (tempStar.studioTransforms?.lighting?.x || 0) / 2}%`, 
                                    top: `${50 + (tempStar.studioTransforms?.lighting?.y || 0) / 2}%`,
                                    transform: `translate(-50%, -50%) rotate(${tempStar.studioTransforms?.lighting?.rotate || 0}deg) scale(${tempStar.studioTransforms?.lighting?.scale || 1})`
                                  }}
                                >
                                  <Lamp className="w-5 h-5 text-[#0000FF]" />
                                </div>
                             </div>
                             <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest text-center">Center point is the star's mark</p>
                          </div>

                          <div className="flex-1 bg-slate-900 border-8 border-white p-10 space-y-10">
                            <div className="flex items-center gap-4 text-[#FFFF00] border-b-4 border-black pb-4">
                              <Sliders className="w-8 h-8" />
                              <h3 className="text-4xl font-bebas uppercase tracking-widest">{studioCalibrationTarget?.toUpperCase()} POSITIONING</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-8">
                                <CalibrationSlider label="Horizontal Placement (X)" target={studioCalibrationTarget} property="x" min={-100} max={100} step={1} color="#FFFF00" />
                                <CalibrationSlider label="Vertical Placement (Y)" target={studioCalibrationTarget} property="y" min={-100} max={100} step={1} color="#FFFF00" />
                              </div>
                              <div className="space-y-8">
                                <CalibrationSlider label="Asset Scale" target={studioCalibrationTarget} property="scale" min={0.1} max={3} step={0.05} color="#FFFF00" />
                                <CalibrationSlider label="Rotation Degree" target={studioCalibrationTarget} property="rotate" min={-180} max={180} step={1} color="#FFFF00" />
                              </div>
                            </div>
                          </div>
                       </div>
                       
                       <button onClick={() => setStudioCalibrationTarget('none')} className="btn-flat px-12 py-4 bg-white text-black font-bebas text-xl border-4 border-black hover:bg-[#FFFF00]">LOCK STUDIO CONFIG</button>
                    </div>
                  )}
                </div>
              )}
              {customStep === 'performance' && (
                <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                  <div className="flex items-center gap-6 border-b-8 border-[#0000FF] pb-6"><Headphones className="w-12 h-12 text-[#0000FF]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Signature Performance</h2></div>
                  {renderOptionGroup('STUDIO POSE', 'pose', gameState.customInspirations.pose || INITIAL_INSPIRATIONS.pose, '#0000FF')}
                  <div className="space-y-8"><label className="text-[10px] font-black text-[#0000FF] uppercase tracking-[0.4em]">DEFAULT CAPTURE MODE</label><div className="grid grid-cols-2 md:grid-cols-5 gap-2">{[ { id: 'photo', icon: <Camera className="w-6 h-6" />, label: 'PHOTO' }, { id: 'video', icon: <Video className="w-6 h-6" />, label: 'VIDEO' }, { id: 'sing', icon: <Mic2 className="w-6 h-6" />, label: 'SING' }, { id: 'dance', icon: <Dna className="w-6 h-6" />, label: 'DANCE' }, { id: 'instrument', icon: <Piano className="w-6 h-6" />, label: 'INSTR' } ].map(m => (<button key={m.id} onClick={() => updateValue('signatureAction', m.id)} className={`p-4 border-4 flex flex-col items-center gap-3 transition-all duration-300 ${tempStar.signatureAction === m.id ? 'bg-[#0000FF] text-white border-white' : 'bg-black text-slate-600 border-slate-800'}`}>{m.icon}<span className="text-[9px] font-black">{m.label}</span></button>))}</div></div>
                  {(tempStar.signatureAction === 'sing' || tempStar.signatureAction === 'dance' || tempStar.signatureAction === 'instrument') && (
                    <div className="space-y-8 p-10 bg-slate-900 border-8 border-white animate-in slide-in-from-bottom-6 duration-500">
                      <div className="flex items-center gap-4 text-[#FFFF00]">
                        <Music className="w-8 h-8" />
                        <h3 className="text-4xl font-bebas uppercase tracking-widest">Acoustic Settings</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MUSIC GENRE</label>
                          <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto custom-scrollbar p-2 bg-black">
                            {(gameState.customInspirations.genres || INITIAL_INSPIRATIONS.genres).map(genre => (
                              <button 
                                key={genre} 
                                onClick={() => updateValue('signatureGenre', genre)}
                                className={`p-4 border-2 text-[10px] font-black uppercase transition-all ${tempStar.signatureGenre === genre ? 'bg-[#00FF7F] text-black border-white' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-400'}`}
                              >
                                {genre}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4 pt-6 border-t-4 border-black">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SONG SELECTION</label>
                          <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto custom-scrollbar p-2 bg-black">
                            {(gameState.customInspirations.songs || INITIAL_INSPIRATIONS.songs).map(song => (<button key={song} onClick={() => updateValue('signatureSong', song)} className={`p-4 border-2 text-[10px] font-black uppercase transition-all ${tempStar.signatureSong === song ? 'bg-[#FFFF00] text-black border-white' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-400'}`}>{song}</button>))}
                          </div>
                          <div className="pt-6 space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CUSTOM TITLE</label>
                            <input value={tempStar.signatureSong || ''} onChange={(e) => updateValue('signatureSong', e.target.value)} className="w-full bg-black border-4 border-slate-800 p-6 text-xl text-white font-mono uppercase focus:border-[#FFFF00] outline-none" placeholder="NAME YOUR HIT..." />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  const SettingsView = ({ gameState, updateNetworkParam, addCustomItem, removeCustomItem, overrideStarStat, setCurrentView }: any) => {
    const [activeTab, setActiveTab] = useState<'brand' | 'economy' | 'talent' | 'style' | 'studio' | 'overrides'>('brand');
    const [newItem, setNewItem] = useState('');

    const categories = {
      talent: [ { id: 'role', label: 'Roles', icon: <Users className="w-4 h-4" /> }, { id: 'pose', label: 'Poses', icon: <Play className="w-4 h-4" /> }, { id: 'gender', label: 'Gender Identities', icon: <UserCircle className="w-4 h-4" /> }, { id: 'skintone', label: 'Skintones', icon: <Palette className="w-4 h-4" /> }, { id: 'bodyHeight', label: 'Heights', icon: <Maximize className="w-4 h-4" /> }, { id: 'bodyShape', label: 'Body Shapes', icon: <Shapes className="w-4 h-4" /> }, { id: 'faceShape', label: 'Face Shapes', icon: <UserCircle className="w-4 h-4" /> }, { id: 'eyes', label: 'Eye Colors', icon: <Eye className="w-4 h-4" /> } ],
      style: [ { id: 'bodySize', label: 'Body Sizes', icon: <Activity className="w-4 h-4" /> }, { id: 'clothingSize', label: 'Clothing Sizes', icon: <Shirt className="w-4 h-4" /> }, { id: 'shoeSizeMen', label: 'Shoe Men', icon: <Zap className="w-4 h-4" /> }, { id: 'shoeSizeWomen', label: 'Shoe Women', icon: <Zap className="w-4 h-4" /> }, { id: 'headwearSize', label: 'Acc. Sizes', icon: <MonitorSmartphone className="w-4 h-4" /> }, { id: 'hairstyle', label: 'Hairstyles', icon: <Scissors className="w-4 h-4" /> }, { id: 'top', label: 'Tops', icon: <Shirt className="w-4 h-4" /> }, { id: 'bottom', label: 'Bottoms', icon: <Shirt className="w-4 h-4" /> }, { id: 'footwear', label: 'Footwear', icon: <Zap className="w-4 h-4" /> }, { id: 'makeup', label: 'Makeup Styles', icon: <Brush className="w-4 h-4" /> }, { id: 'songs', label: 'Song Library', icon: <Music className="w-4 h-4" /> }, { id: 'genres', label: 'Music Genres', icon: <Disc className="w-4 h-4" /> } ],
      studio: [ { id: 'studioFurniture', label: 'Furniture', icon: <Armchair className="w-4 h-4" /> }, { id: 'studioProps', label: 'Props', icon: <Box className="w-4 h-4" /> }, { id: 'studioLighting', label: 'Lighting', icon: <Lamp className="w-4 h-4" /> }, { id: 'cameraAngle', label: 'Camera Angles', icon: <Video className="w-4 h-4" /> }, { id: 'shootingLocation', label: 'Locations', icon: <MapPin className="w-4 h-4" /> } ]
    };

    const renderEditableList = (title: string, category: string, list: string[]) => (
      <div className="space-y-6 bg-black border-4 border-slate-800 p-8 hover:border-white transition-all group">
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4"><h4 className="text-2xl font-bebas text-white uppercase">{title}</h4><span className="text-[10px] font-black text-slate-500">{list.length} ITEMS</span></div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-2">{list.map(item => (<div key={item} className="flex items-center gap-2 bg-slate-900 border-2 border-slate-800 px-3 py-1 text-[10px] font-black text-slate-300 uppercase">{item}<button onClick={() => removeCustomItem(category, item)} className="text-red-500 hover:text-white transition-colors"><Trash2 className="w-3 h-3" /></button></div>))}</div>
        <form onSubmit={(e) => { e.preventDefault(); addCustomItem(category, newItem); setNewItem(''); }} className="flex gap-4"><input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={`ADD...`} className="flex-1 bg-black border-2 border-slate-700 p-2 text-xs font-mono uppercase text-white outline-none focus:border-[#00FF7F]" /><button type="submit" className="btn-flat bg-[#00FF7F] text-black px-4 py-2 text-[10px]">ADD</button></form>
      </div>
    );

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col bg-grid overflow-hidden">
        <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50"><div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">SYSTEM OVERRIDE</span></div><button onClick={() => setCurrentView('dashboard')} className="btn-flat bg-white px-12 py-5 font-bebas text-3xl hover:bg-[#FF0080] hover:text-white">EXIT</button></header>
        <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full overflow-hidden">
          <div className="lg:w-1/4 border-r-8 border-white bg-slate-900 p-8 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            {[ 
              { id: 'brand', label: 'Brand', icon: <Palette className="w-5 h-5" />, color: '#FF0080' }, 
              { id: 'economy', label: 'Economy', icon: <Coins className="w-5 h-5" />, color: '#00FF7F' }, 
              { id: 'talent', label: 'Talent', icon: <Users className="w-5 h-5" />, color: '#FFFF00' }, 
              { id: 'style', label: 'Style', icon: <Brush className="w-5 h-5" />, color: '#0000FF' }, 
              { id: 'studio', label: 'Studio', icon: <Armchair className="w-5 h-5" />, color: '#FF0080' }, 
              { id: 'overrides', label: 'Stat Overrides', icon: <Sliders className="w-5 h-5" />, color: '#00FF7F' } 
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-4 p-5 border-4 font-bebas text-2xl tracking-widest transition-all transform ${activeTab === tab.id ? 'translate-x-4 bg-white text-black' : 'bg-slate-950 text-slate-600 hover:bg-slate-800'}`} style={{ borderLeftColor: tab.color, borderLeftWidth: activeTab === tab.id ? '12px' : '4px' }}>{tab.icon}{tab.label}</button>
            ))}
            <div className="mt-auto pt-8 border-t-4 border-slate-800"><button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full bg-red-950/20 p-6 border-4 border-red-900 text-red-500 font-bebas text-xl uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all">FACTORY RESET</button></div>
          </div>
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-slate-950/50">
            <div className="space-y-12">
              {activeTab === 'brand' && (<div className="space-y-12 animate-in slide-in-from-right-10"><div className="flex items-center gap-6 border-b-8 border-[#FF0080] pb-6"><Palette className="w-12 h-12 text-[#FF0080]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Brand Calibration</h2></div><div className="bg-black border-4 border-slate-800 p-8 space-y-6"><label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">NETWORK IDENTITY</label><input value={gameState.networkName} onChange={(e) => updateNetworkParam('networkName', e.target.value)} className="w-full bg-black border-4 border-slate-800 p-6 text-4xl text-white font-bebas tracking-widest uppercase focus:border-[#FF0080] outline-none" /></div></div>)}
              {activeTab === 'economy' && (<div className="space-y-12 animate-in slide-in-from-right-10"><div className="flex items-center gap-6 border-b-8 border-[#00FF7F] pb-6"><Coins className="w-12 h-12 text-[#00FF7F]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Economy Override</h2></div><div className="grid md:grid-cols-2 gap-8">{[ { k: 'baseEarningAmount', l: 'Base Cycle Reward ($)', min: 0, max: 1000 }, { k: 'baseEarningIntervalMs', l: 'Cycle Interval (ms)', min: 1000, max: 3600000 }, { k: 'streamHourlyRate', l: 'Stream Hourly Rate ($)', min: 0, max: 5000 }, { k: 'photoEarning', l: 'Photo Capture Reward ($)', min: 0, max: 100 }, { k: 'videoEarning', l: 'Video Capture Reward ($)', min: 0, max: 200 }, { k: 'minWithdrawal', l: 'Minimum Payout Threshold ($)', min: 0, max: 1000 } ].map(item => (<div key={item.k} className="bg-black border-4 border-slate-800 p-8 space-y-4"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.l}</label><div className="flex items-center gap-4"><input type="number" step={item.k === 'baseEarningIntervalMs' ? 1000 : 1} value={gameState[item.k as keyof GameState]} onChange={(e) => updateNetworkParam(item.k, parseFloat(e.target.value))} className="w-full bg-slate-900 border-2 border-slate-700 p-4 text-white font-mono text-xl outline-none focus:border-[#00FF7F]" /></div></div>))}</div></div>)}
              {activeTab === 'talent' && (<div className="space-y-12 animate-in slide-in-from-right-10"><div className="flex items-center gap-6 border-b-8 border-[#FFFF00] pb-6"><Users className="w-12 h-12 text-[#FFFF00]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Talent Inspiration</h2></div><div className="grid gap-8">{categories.talent.map(c => renderEditableList(c.label, c.id, gameState.customInspirations[c.id] || INITIAL_INSPIRATIONS[c.id] || []))}</div></div>)}
              {activeTab === 'style' && (<div className="space-y-12 animate-in slide-in-from-right-10"><div className="flex items-center gap-6 border-b-8 border-[#0000FF] pb-6"><Brush className="w-12 h-12 text-[#0000FF]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Style Configuration</h2></div><div className="grid gap-8">{categories.style.map(c => renderEditableList(c.label, c.id, gameState.customInspirations[c.id] || INITIAL_INSPIRATIONS[c.id] || []))}</div></div>)}
              {activeTab === 'studio' && (<div className="space-y-12 animate-in slide-in-from-right-10"><div className="flex items-center gap-6 border-b-8 border-[#FF0080] pb-6"><Monitor className="w-12 h-12 text-[#FF0080]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Studio Parameters</h2></div><div className="grid gap-8">{categories.studio.map(c => renderEditableList(c.label, c.id, gameState.customInspirations[c.id] || INITIAL_INSPIRATIONS[c.id] || []))}</div></div>)}
              {activeTab === 'overrides' && (<div className="space-y-12 animate-in slide-in-from-right-10"><div className="flex items-center gap-6 border-b-8 border-[#00FF7F] pb-6"><Sliders className="w-12 h-12 text-[#00FF7F]" /><h2 className="text-6xl font-bebas text-white uppercase tracking-widest">Global Roster Override</h2></div><div className="space-y-12">{gameState.roster.map(star => (<div key={star.id} className="bg-black border-8 border-slate-800 p-10 space-y-8"><div className="flex justify-between items-center"><div className="flex items-center gap-6"><div className="w-20 h-20 bg-slate-900 border-2 border-white overflow-hidden"><img src={star.appearance.imageUrl} className="w-full h-full object-cover" /></div><div className="flex flex-col"><span className="text-4xl font-bebas text-white uppercase">{star.userName}</span><span className="text-[10px] font-black text-[#00FF7F] uppercase tracking-widest">{star.id}</span></div></div><button onClick={() => setGameState(p => ({...p, roster: p.roster.filter(s => s.id !== star.id)}))} className="text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-500 p-2"><Trash2 className="w-6 h-6" /></button></div><div className="grid md:grid-cols-3 gap-8">{[ { k: 'popularity', l: 'Popularity' }, { k: 'level', l: 'Level' }, { k: 'earnings', l: 'Earnings ($)' } ].map(stat => (<div key={stat.k} className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.l}</label><input type="number" value={star[stat.k as keyof CharacterProfile] as number} onChange={(e) => overrideStarStat(star.id, stat.k, parseFloat(e.target.value))} className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-mono outline-none focus:border-[#00FF7F]" /></div>))}</div></div>))}</div></div>)}
            </div>
          </div>
        </main>
      </div>
    );
  };

  const Ticker = ({ networkName }: { networkName: string }) => {
    const [networkTicker, setNetworkTicker] = useState("NETWORK STATUS: GLOBAL ASSETS SYNCING...");
    useEffect(() => {
      const tickerInt = setInterval(() => {
        const msgs = [`${networkName} STATUS: GLOBAL ASSETS SYNCING...`, "STREAMING FEATURE ENABLED: $50.00 / HOUR LIVE!", "GLOBAL HUB BROADCAST ACTIVE IN ALL SECTORS", "SYSTEM YIELD: $5.00 / 10MIN BACKGROUND", "WORLDWIDE PROTOCOL v2.5.0 STABLE"];
        setNetworkTicker(msgs[Math.floor(Math.random() * msgs.length)]);
      }, 4000);
      return () => clearInterval(tickerInt);
    }, [networkName]);
    return (<div className="h-10 bg-[#FF0080] border-y-4 border-black flex items-center overflow-hidden z-[60]"><div className="whitespace-nowrap flex gap-24 animate-marquee text-white font-black text-[10px] uppercase tracking-[0.4em] items-center"><span>{networkTicker}</span><span>WORLDWIDE PROTOCOL: NO GEOGRAPHICAL RESTRICTIONS</span><span>PRO STREAM YIELD: $50.00 / HOUR ACTIVE</span><span>{networkTicker}</span></div></div>);
  };

  const HomeView = () => (
    <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden bg-grid">
      <div className="scanline" />
      <header className="h-28 flex items-center justify-between px-12 z-20 border-b-8 border-white bg-slate-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-6"><Logo className="w-16 h-16" /><div className="flex flex-col"><span className="font-bebas text-5xl tracking-[0.1em] text-white leading-none">{gameState.networkName}</span><span className="text-[10px] font-black tracking-[0.3em] text-[#FF0080] uppercase mt-2">GLOBAL TALENT SIMULATION NETWORK</span></div></div>
        <div className="flex items-center gap-6"><button onClick={() => setCurrentView('login')} className="btn-flat bg-[#0000FF] text-white px-12 py-5 border-4 border-black text-sm font-black hover:bg-white hover:text-black transition-colors uppercase tracking-widest">LOGIN TERMINAL</button></div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-12 z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full broadcast-overlay" />
        <div className="max-w-6xl w-full flex flex-col items-center gap-8 py-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-3 bg-[#FF0080] border-4 border-black px-6 py-3 text-black font-black text-xs tracking-[0.2em] uppercase"><Zap className="w-4 h-4 fill-current" /> BROADCAST PROTOCOL v2.5</div>
            <div className="flex items-center gap-3 bg-[#00FF7F] border-4 border-black px-6 py-3 text-black font-black text-xs tracking-[0.2em] uppercase"><Globe className="w-4 h-4" /> WORLDWIDE LINK ACTIVE</div>
            <div className="flex items-center gap-3 bg-[#FFFF00] border-4 border-black px-6 py-3 text-black font-black text-xs tracking-[0.2em] uppercase"><UserCheck className="w-4 h-4" /> PLAYABLE AGES 5+</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <h1 className="font-bebas leading-none flex flex-col items-center space-y-2"><span className="text-white text-6xl md:text-9xl tracking-tight uppercase">UNLIMITED</span><span className="text-[#FF0080] text-7xl md:text-[11rem] tracking-tighter uppercase leading-none">BROADCASTING</span><span className="text-[#FFFF00] text-6xl md:text-9xl tracking-widest uppercase">SIMULATION</span></h1>
            <div className="w-full h-8 bg-[#FF0080] border-x-8 border-black my-8 flex items-center justify-center overflow-hidden"><div className="whitespace-nowrap flex gap-12 text-[10px] text-white font-black animate-marquee uppercase tracking-widest"><span>FULL INSTRUMENTAL SUPPORT // EVERYTHING IS EDITABLE // REVENUE YIELD: $50.00 PER HOUR // GLOBAL BROADCAST ACTIVE</span><span>FULL INSTRUMENTAL SUPPORT // EVERYTHING IS EDITABLE // REVENUE YIELD: $50.00 PER HOUR // GLOBAL BROADCAST ACTIVE</span></div></div>
          </div>
          <div className="max-w-3xl text-center space-y-12">
            <p className="text-slate-200 text-xl md:text-3xl font-black uppercase tracking-[0.1em] leading-snug">Step into the lights as the world's premier <span className="text-[#FF0080]">TV HOST</span> or <span className="text-[#00FF7F]">PERFORMER</span>. Character designs inspired by classic Cartoon Network vibes.</p>
            
            <div className="flex flex-col gap-8 items-center bg-black/40 border-8 border-white/10 p-12 backdrop-blur-md">
               <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Available across all sectors</p>
               <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="bg-white text-black p-4 border-4 border-black hover:bg-[#FF0080] hover:text-white transition-all"><Smartphone className="w-12 h-12" /></div>
                    <span className="text-[10px] font-black uppercase">iOS App</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="bg-white text-black p-4 border-4 border-black hover:bg-[#00FF7F] hover:text-white transition-all"><SmartphoneNfc className="w-12 h-12" /></div>
                    <span className="text-[10px] font-black uppercase">Android</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="bg-white text-black p-4 border-4 border-black hover:bg-[#FFFF00] hover:text-white transition-all"><Cpu className="w-12 h-12" /></div>
                    <span className="text-[10px] font-black uppercase">HarmonyOS</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
              <button onClick={() => setCurrentView('login')} className="btn-flat py-8 px-20 text-4xl text-black bg-[#FFFF00] border-8 border-black font-bebas tracking-widest hover:bg-white transform hover:-translate-y-2 transition-all">INITIATE BROADCAST</button>
              <button onClick={() => { setIsLoggedIn(true); setCurrentView('tutorial'); }} className="btn-flat py-8 px-12 text-2xl text-black bg-[#00FF7F] border-8 border-black font-bebas tracking-widest hover:bg-white transform hover:-translate-y-2 transition-all flex items-center gap-4"><BookOpen className="w-8 h-8" /> GUIDEBOOK</button>
            </div>
          </div>
        </div>
      </main>
      <footer className="h-32 flex flex-col md:flex-row items-center justify-between px-12 py-6 z-20 border-t-8 border-white bg-slate-900 gap-6"><div className="flex flex-col gap-2"><div className="flex items-center gap-8"><span className="text-white font-black text-[11px] uppercase tracking-[0.3em]">GEOGRAPHICAL STATUS: UNRESTRICTED</span><div className="flex gap-2"><div className="w-4 h-4 bg-[#FF0080]" /><div className="w-4 h-4 bg-[#FFFF00]" /><div className="w-4 h-4 bg-[#00FF7F]" /><div className="w-4 h-4 bg-[#0000FF]" /></div></div><p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.15em]">{AGE_RATING_TEXT}</p></div><div className="flex items-center gap-12 font-black text-[11px] uppercase text-slate-500 tracking-[0.3em]"><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00FF7F]" /> SYSTEM STABLE</span><span>v2.5.0 STABLE_GLOBAL</span></div></footer>
    </div>
  );

  const TutorialView = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col bg-grid items-center justify-center p-12 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-900 border-[10px] border-white p-12 space-y-12 shadow-[20px_20px_0px_0px_#FF0080]">
        <div className="flex items-center gap-8 border-b-8 border-white pb-8"><BookOpen className="w-16 h-16 text-[#00FF7F]" /><h2 className="text-7xl font-bebas text-white uppercase tracking-tighter">NETWORK MANUAL</h2></div>
        <div className="grid md:grid-cols-2 gap-12"><div className="space-y-6 bg-black p-8 border-4 border-slate-800 hover:border-[#FF0080] transition-colors"><div className="flex items-center gap-4 text-[#FF0080]"><Zap className="w-8 h-8" /><h3 className="text-3xl font-bebas uppercase">EARNING YIELD</h3></div><p className="text-xs text-slate-400 uppercase leading-relaxed font-black font-mono">THE NETWORK PROVIDES A BASE REWARD OF $5.00 EVERY 10 MINUTES. GOING "LIVE" INCREASES REVENUE TO $50.00 PER HOUR.</p></div><div className="space-y-6 bg-black p-8 border-4 border-slate-800 hover:border-[#00FF7F] transition-colors"><div className="flex items-center gap-4 text-[#00FF7F]"><Users className="w-8 h-8" /><h3 className="text-3xl font-bebas uppercase">ASSET CREATION</h3></div><p className="text-xs text-slate-400 uppercase leading-relaxed font-black font-mono">REGISTER NEW TALENT AND CALIBRATE THEIR APPEARANCE. DESIGNS ARE BASED ON THE ICONIC FLAT 2D CARTOON STYLE.</p></div><div className="space-y-6 bg-black p-8 border-4 border-slate-800 hover:border-[#FFFF00] transition-colors"><div className="flex items-center gap-4 text-[#FFFF00]"><Camera className="w-8 h-8" /><h3 className="text-3xl font-bebas uppercase">CONTENT CAPTURE</h3></div><p className="text-xs text-slate-400 uppercase leading-relaxed font-black font-mono">USE PHOTO, VIDEO, SING, AND DANCE MODES TO GENERATE ADDITIONAL INSTANT REVENUE. ALL ASPECT RATIOS AND FILTERS ARE AVAILABLE.</p></div><div className="space-y-6 bg-black p-8 border-4 border-slate-800 hover:border-[#0000FF] transition-colors"><div className="flex items-center gap-4 text-[#0000FF]"><Shield className="w-8 h-8" /><h3 className="text-3xl font-bebas uppercase">SAFETY PROTOCOLS</h3></div><p className="text-xs text-slate-400 uppercase leading-relaxed font-black font-mono">PARENTAL CONTROLS ARE REQUIRED FOR FINANCIAL ACTIONS. MY TV STAR IS DESIGNED FOR AGES 5 AND ABOVE.</p></div></div>
        <button onClick={() => { setGameState(prev => ({ ...prev, tutorialSeen: true })); if (gameState.roster.length === 0) setCurrentView('onboarding'); else setCurrentView('roster'); }} className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-5xl font-bebas border-8 border-black hover:bg-white transition-all shadow-[10px_10px_0px_0px_#000]">ACKNOWLEDGE PROTOCOLS</button>
      </div>
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
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#FF0080] uppercase tracking-widest text-left block">Producer Identity</label>
                <input required maxLength={30} type="text" placeholder="REAL OR STAGE NAME..." value={gameState.currentProducer} onChange={(e) => setGameState(p => ({...p, currentProducer: e.target.value}))} className="w-full bg-black border-8 border-slate-800 p-8 text-2xl text-white font-mono uppercase outline-none focus:border-[#FF0080]" />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#FF0080] uppercase tracking-widest text-left block">Age (5+)</label>
                <input required type="number" min={5} value={gameState.playerAge} onChange={(e) => setGameState(p => ({...p, playerAge: parseInt(e.target.value)}))} className="w-full bg-black border-8 border-slate-800 p-8 text-2xl text-white font-mono outline-none focus:border-[#FF0080]" />
              </div>
              <button type="submit" className="w-full btn-flat py-8 bg-[#00FF7F] text-black text-3xl font-bebas border-8 border-black hover:bg-white">INITIALIZE LINK</button>
            </form>
          </div>
        </div>
      )}
      {currentView === 'onboarding' && (
        <div className="min-h-screen bg-slate-950 flex flex-col p-6 bg-grid">
          <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900">
            <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">REGISTRATION</span></div>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center p-10 max-w-4xl mx-auto w-full">
            <div className="bg-slate-900 border-[10px] border-white p-12 w-full space-y-12">
              <div className="space-y-4">
                <label className="text-xs font-black text-[#FF0080] uppercase">Talent Identity</label>
                <input type="text" placeholder="ENTER STAGE NAME..." value={tempStar.userName || ''} onChange={(e) => setTempStar(p => ({...p, userName: e.target.value}))} className="w-full bg-black border-8 border-slate-800 p-8 text-4xl text-white font-bebas outline-none focus:border-[#FF0080]" />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-[#FF0080] uppercase">BROADCAST ROLE</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-64 overflow-y-auto p-4 bg-black border-4 border-slate-800 custom-scrollbar">
                  {gameState.customRoles.map(role => (
                    <button key={role} onClick={() => setTempStar(p => ({...p, role}))} className={`p-6 border-4 font-bebas text-2xl uppercase transition-all ${tempStar.role === role ? 'bg-[#FF0080] text-white border-white' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-400'}`}>{role}</button>
                  ))}
                </div>
              </div>
              <button disabled={!tempStar.userName || !tempStar.role} onClick={() => setCurrentView('customization')} className="w-full btn-flat py-10 bg-[#00FF7F] text-black text-5xl font-bebas border-8 border-black hover:bg-white disabled:opacity-30">CALIBRATE ASSET</button>
            </div>
          </main>
        </div>
      )}
      {currentView === 'customization' && <CustomizationView />}
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'roster' && (
        <div className="min-h-screen bg-slate-950 flex flex-col bg-grid overflow-y-auto">
          <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
            <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">ASSET HUB</span></div>
            <div className="flex gap-6">
              <button onClick={() => setCurrentView('tutorial')} className="btn-flat bg-slate-800 text-white px-12 py-5 font-bebas border-4 border-black hover:bg-white hover:text-black">GUIDE</button>
              <button onClick={() => { setTempStar({ appearance: DEFAULT_APPEARANCE, bio: '', signatureAction: 'photo', signatureSong: 'UNLIMITED HITS', signatureGenre: 'Pop', studioTransforms: { furniture: { ...DEFAULT_STUDIO_TRANSFORM }, props: { ...DEFAULT_STUDIO_TRANSFORM }, lighting: { ...DEFAULT_STUDIO_TRANSFORM } } }); setCurrentView('onboarding'); }} className="btn-flat bg-[#00FF7F] text-black px-12 py-5 font-bebas border-4 border-black hover:bg-white"><Plus className="w-8 h-8 mr-4" /> NEW ASSET</button>
            </div>
          </header>
          <main className="flex-1 p-16 max-w-7xl mx-auto w-full grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {gameState.roster.map(star => (
              <div key={star.id} className="bg-slate-900 border-[10px] border-white p-8 space-y-8 group hover:border-[#FF0080] transition-all flex flex-col">
                <div className="aspect-square bg-black border-4 border-black overflow-hidden relative">
                  <img src={star.appearance.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-[#00FF7F] px-3 py-1 text-black font-bebas text-xl border-2 border-black">LV. {star.level}</div>
                </div>
                <div>
                  <div className="text-5xl font-bebas text-white uppercase leading-none mb-2">{star.userName}</div>
                  <div className="text-2xl font-bebas text-[#FF0080] uppercase tracking-widest">{star.role}</div>
                </div>
                <div className="mt-auto pt-4 border-t-4 border-black flex justify-between items-center">
                  <div className="flex flex-col"><span className="text-[9px] font-black text-slate-500 uppercase">Revenue</span><span className="text-2xl font-bebas text-[#00FF7F]">${star.earnings.toFixed(2)}</span></div>
                  <div className="flex flex-col items-end"><span className="text-[9px] font-black text-slate-500 uppercase">Popularity</span><span className="text-2xl font-bebas text-white">{star.popularity.toLocaleString()}</span></div>
                </div>
                <button onClick={() => { setGameState(p => ({...p, activeStarId: star.id})); setCurrentView('dashboard'); }} className="w-full btn-flat py-6 bg-white text-black font-bebas text-3xl hover:bg-[#FF0080] hover:text-white transition-all">LINK SECTOR</button>
              </div>
            ))}
            {gameState.roster.length === 0 && (
              <div className="col-span-full py-32 text-center bg-slate-900 border-[10px] border-white space-y-8">
                <Users className="w-32 h-32 text-slate-800 mx-auto" />
                <p className="font-bebas text-5xl text-white uppercase tracking-widest">No Assets Detected</p>
                <button onClick={() => setCurrentView('onboarding')} className="btn-flat px-16 py-8 bg-[#00FF7F] text-black text-4xl font-bebas border-8 border-black">START REGISTRATION</button>
              </div>
            )}
          </main>
        </div>
      )}
      {currentView === 'wallet' && (
        <div className="min-h-screen bg-slate-950 flex flex-col bg-grid overflow-y-auto">
          <header className="h-28 border-b-8 border-white flex items-center justify-between px-10 bg-slate-900 sticky top-0 z-50">
            <div className="flex items-center gap-6"><Logo /><span className="font-bebas text-6xl text-white uppercase">TREASURY</span></div>
            <button onClick={() => setCurrentView('dashboard')} className="btn-flat bg-white px-12 py-5 font-bebas border-4 border-black">CLOSE</button>
          </header>
          <main className="flex-1 p-16 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20">
            <div className="bg-slate-900 border-[10px] border-white p-16 text-center space-y-12">
              <h3 className="text-4xl font-bebas text-[#FF0080] uppercase tracking-widest">AVAILABLE CREDIT</h3>
              <div className="text-[14rem] font-bebas text-white leading-none">${gameState.money.toFixed(2)}</div>
              <button disabled={gameState.money < gameState.minWithdrawal} onClick={handleWithdrawal} className="w-full btn-flat py-12 bg-[#00FF7F] text-black text-6xl font-bebas border-[12px] border-black hover:bg-white disabled:opacity-20 transition-all">ESTABLISH WIRE</button>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Minimum withdrawal: ${gameState.minWithdrawal.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900 border-[10px] border-white p-16 flex flex-col overflow-hidden">
              <h3 className="text-4xl font-bebas text-white uppercase mb-12 tracking-widest">AUDIT LOG</h3>
              <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                {gameState.transactions.length === 0 && <div className="text-center py-20 text-slate-700 uppercase font-black tracking-widest">No transaction data</div>}
                {gameState.transactions.map(t => (
                  <div key={t.id} className="bg-black border-[6px] border-slate-800 p-10 flex justify-between items-center hover:border-white transition-all">
                    <div>
                      <div className="text-3xl font-bebas text-white uppercase tracking-widest">{t.provider}</div>
                      <div className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">{new Date(t.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-6xl font-bebas text-[#00FF7F]">+${t.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}
      {currentView === 'tutorial' && <TutorialView />}
      {currentView === 'settings' && (<SettingsView 
        gameState={gameState} 
        updateNetworkParam={updateNetworkParam} 
        addCustomItem={addCustomItem} 
        removeCustomItem={removeCustomItem} 
        overrideStarStat={overrideStarStat} 
        setCurrentView={setCurrentView} 
      />)}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<MyTVStar />);
