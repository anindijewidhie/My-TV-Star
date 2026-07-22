import React, { useState, useEffect } from 'react';
import { CharacterProfile } from '../types';
import { AvatarVisual } from './AvatarVisual';
import { generateLiveTeleprompterScript } from '../services/aiService';
import { 
  Tv, Radio, Sparkles, Zap, Award, Shirt, RefreshCw, 
  ChevronRight, Volume2, ShieldCheck, Flame, Play, Square 
} from 'lucide-react';

interface StudioViewProps {
  character: CharacterProfile;
  sessionTime: number;
  onEndStream: () => void;
  onUpdateCharacter: (updated: CharacterProfile) => void;
  parentalControlMode?: boolean;
}

export const StudioView: React.FC<StudioViewProps> = ({
  character,
  sessionTime,
  onEndStream,
  onUpdateCharacter,
  parentalControlMode = false
}) => {
  const { profile } = character;
  const [teleprompterScript, setTeleprompterScript] = useState<string>(
    `"${profile.contract.catchphrase} Welcome live to ${profile.contract.preferredGenre}!"`
  );
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [viewerCount, setViewerCount] = useState(124500);
  const [networkRating, setNetworkRating] = useState(98.4);
  const [activeMove, setActiveMove] = useState(false);
  const [currentSegment, setCurrentSegment] = useState('OPENING MONOLOGUE');
  const [quickOutfit, setQuickOutfit] = useState(profile.outfit.outfit);

  const progress = ((sessionTime % 600) / 600) * 100;
  const remainingSeconds = 600 - (sessionTime % 600);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  // Simulate viewer fluctuation based on character charisma
  useEffect(() => {
    const interval = setInterval(() => {
      const charismaBonus = (profile.skills.charisma - 50) * 50;
      const flux = Math.floor((Math.random() - 0.48) * 1500) + charismaBonus;
      setViewerCount(prev => Math.max(10000, prev + flux));
    }, 3000);
    return () => clearInterval(interval);
  }, [profile.skills.charisma]);

  const handleTriggerCatchphrase = async () => {
    setActiveMove(true);
    setViewerCount(prev => prev + Math.floor(Math.random() * 25000 + 10000));
    setNetworkRating(prev => Math.min(99.9, +(prev + 0.3).toFixed(1)));

    setIsLoadingScript(true);
    const newScript = await generateLiveTeleprompterScript(profile, currentSegment);
    setTeleprompterScript(newScript);
    setIsLoadingScript(false);

    setTimeout(() => {
      setActiveMove(false);
    }, 1500);
  };

  const handleSegmentChange = (seg: string) => {
    setCurrentSegment(seg);
    handleTriggerCatchphrase();
  };

  const handleQuickOutfitChange = (newOutfitName: string) => {
    setQuickOutfit(newOutfitName);
    const updated = {
      ...character,
      profile: {
        ...character.profile,
        outfit: {
          ...character.profile.outfit,
          outfit: newOutfitName
        }
      }
    };
    onUpdateCharacter(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono selection:bg-[#FF0080]">
      {/* Top Studio Broadcast Bar */}
      <div className="h-3 bg-gradient-to-r from-[#FF0080] via-[#00FF7F] to-[#FFFF00] w-full" />
      
      <header className="h-20 border-b-2 border-white/20 flex items-center justify-between px-6 lg:px-12 bg-zinc-950">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-red-600/20 border border-red-500 px-3 py-1">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
            <span className="font-bebas text-2xl tracking-widest text-red-500">ON AIR</span>
          </div>
          <div className="h-6 w-px bg-white/20 hidden md:block" />
          <div className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest opacity-60">
            <Radio className="w-4 h-4 text-[#00FF7F]" /> NODE_SYNC // STUDIO 7 BROADCAST
          </div>
        </div>

        <div className="flex items-center gap-6">
          {parentalControlMode && (
            <span className="bg-[#00FF7F] text-black px-3 py-1 font-bebas text-lg tracking-widest uppercase hidden sm:block">
              PARENTAL CONTROL ACTIVE (PG-3+)
            </span>
          )}
          <button 
            onClick={onEndStream}
            className="font-bebas text-2xl border-2 border-white px-8 py-2 hover:bg-white hover:text-black transition-all flex items-center gap-2"
          >
            <Square className="w-5 h-5 fill-current" /> END BROADCAST
          </button>
        </div>
      </header>

      {/* Main Studio Interactive Stage */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Studio Stage: Character Avatar & Live Performance Frame */}
        <div className="lg:col-span-7 bg-zinc-900 border-4 border-white p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
          {/* Background Ambient Studio Lights */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--magenta)_0%,_transparent_70%)] animate-pulse" />
          </div>

          {/* Segment Tag */}
          <div className="absolute top-4 left-4 bg-black border border-[#00FF7F] px-4 py-1 text-xs font-bold text-[#00FF7F] tracking-widest uppercase">
            SEGMENT: {currentSegment}
          </div>

          {/* Interactive Character Avatar */}
          <div className="my-6">
            <AvatarVisual 
              profile={profile} 
              size="xl" 
              isLive={true} 
              activeMoveAnimation={activeMove} 
            />
          </div>

          {/* Character Live Name & Catchphrase Pose */}
          <div className="text-center z-10 space-y-2">
            <h2 className="font-bebas text-6xl lg:text-7xl tracking-tight uppercase leading-none">
              {profile.name}
            </h2>
            <div className="text-sm font-mono text-[#00FF7F] font-bold tracking-widest uppercase">
              {profile.contract.signatureMove}
            </div>
          </div>

          {/* Trigger Catchphrase Action Button */}
          <button
            onClick={handleTriggerCatchphrase}
            className="mt-6 px-10 py-4 bg-[#FF0080] text-white font-bebas text-3xl border-2 border-white hover:bg-[#00FF7F] hover:text-black transition-all scale-100 hover:scale-105 active:scale-95 flex items-center gap-3 z-20 shadow-xl"
          >
            <Sparkles className="w-8 h-8" />
            DELIVER CATCHPHRASE!
          </button>
        </div>

        {/* Right Studio Controls & Live Metrics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Teleprompter Feed */}
          <div className="bg-zinc-950 border-4 border-white p-6 space-y-3">
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="font-bebas text-2xl text-[#00FF7F] tracking-widest flex items-center gap-2">
                <Tv className="w-5 h-5" /> TELEPROMPTER FEED
              </span>
              <span className="text-[10px] font-bold opacity-40 uppercase">GEMINI SCRIPT AI</span>
            </div>
            <div className="min-h-[90px] text-sm lg:text-base font-mono text-yellow-300 leading-relaxed italic bg-black p-4 border border-white/20">
              {isLoadingScript ? 'Updating script on teleprompter...' : teleprompterScript}
            </div>
          </div>

          {/* Realtime Broadcast Ratings & Viewers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border-2 border-white p-6 text-center">
              <span className="text-xs font-bold opacity-40 uppercase tracking-widest block mb-1">LIVE VIEWERS</span>
              <span className="font-bebas text-5xl text-[#00FF7F]">{viewerCount.toLocaleString()}</span>
            </div>
            <div className="bg-zinc-900 border-2 border-white p-6 text-center">
              <span className="text-xs font-bold opacity-40 uppercase tracking-widest block mb-1">NETWORK SHARE</span>
              <span className="font-bebas text-5xl text-[#FF0080]">{networkRating}%</span>
            </div>
          </div>

          {/* Session Yield & $5 Payout Counter */}
          <div className="bg-zinc-900 border-4 border-[#00FF7F] p-6 space-y-4 text-center">
            <div className="flex justify-between items-center text-xs font-bold opacity-60 uppercase">
              <span>GAMEPLAY TIMER</span>
              <span className="text-[#00FF7F]">$5.00 PER 10 MIN REWARD</span>
            </div>

            <div className="w-full h-4 bg-white/10 border border-white/20 relative">
              <div 
                className="h-full bg-[#00FF7F] transition-all duration-1000" 
                style={{ width: `${progress}%` }} 
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bebas text-4xl tracking-widest">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
              <span className="font-bebas text-3xl text-[#00FF7F]">NEXT REWARD READY</span>
            </div>
          </div>

          {/* Segment Selector */}
          <div className="bg-zinc-950 border-2 border-white p-4 space-y-3">
            <span className="text-xs font-bold opacity-40 uppercase tracking-widest block">CHANGE STUDIO SEGMENT</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                'OPENING MONOLOGUE',
                'CELEBRITY INTERVIEW',
                'COOKING CHALLENGE',
                'GRAND FINALE SHOWDOWN'
              ].map(seg => (
                <button
                  key={seg}
                  onClick={() => handleSegmentChange(seg)}
                  className={`p-2 text-[10px] font-bold font-mono border border-white uppercase text-left transition-colors ${
                    currentSegment === seg ? 'bg-[#FF0080] text-white' : 'hover:bg-zinc-800'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Backstage Wardrobe Swap */}
          <div className="bg-zinc-950 border-2 border-white p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold opacity-40 uppercase tracking-widest block">BACKSTAGE WARDROBE SWAP</span>
              <Shirt className="w-4 h-4 text-[#FF0080]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Prime Time Tuxedo',
                'Sparkling Idol Dress',
                'Executive Anchor Suit',
                'Cyberpunk Trench Coat',
                'MasterChef Whites'
              ].map(o => (
                <button
                  key={o}
                  onClick={() => handleQuickOutfitChange(o)}
                  className={`px-3 py-1 text-[10px] font-bold border border-white ${
                    character.profile.outfit.outfit === o ? 'bg-[#00FF7F] text-black' : 'hover:bg-zinc-800'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
