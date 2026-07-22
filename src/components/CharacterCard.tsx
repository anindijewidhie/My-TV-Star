import React from 'react';
import { CharacterProfile } from '../types';
import { AvatarVisual } from './AvatarVisual';
import { Edit3, Play, Trophy, Sparkles, Zap, DollarSign, Award, Star } from 'lucide-react';

interface CharacterCardProps {
  character: CharacterProfile;
  onEdit: (star: CharacterProfile) => void;
  onStartStudio: (star: CharacterProfile) => void;
  themeStyle: any;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onEdit,
  onStartStudio,
  themeStyle
}) => {
  const { profile, level, earnings } = character;

  return (
    <div className={`border-4 ${themeStyle.border} flex flex-col overflow-hidden group hover:scale-[1.02] transition-all bg-white dark:bg-black shadow-none`}>
      {/* Top Banner / Avatar Header */}
      <div className="relative bg-zinc-900 border-b-4 border-current p-6 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-3 left-3 bg-[#FF0080] text-white px-3 py-1 font-bebas text-lg tracking-widest border border-white z-10">
          LEVEL {level} STAR
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button 
            onClick={() => onEdit(character)}
            className="p-2 bg-white text-black hover:bg-[#00FF7F] transition-colors border-2 border-black"
            title="Edit & Customize Character"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Avatar Rendering */}
        <AvatarVisual profile={profile} size="md" />

        <div className="mt-4 text-center z-10 w-full px-2">
          <h3 className="font-bebas text-4xl text-white leading-none mb-1 tracking-tight truncate uppercase">
            {profile.name}
          </h3>
          <span className="text-xs font-mono text-[#00FF7F] tracking-widest uppercase block mb-1">
            "{profile.stageTitle}"
          </span>
          <div className="inline-block border border-[#FF0080] bg-[#FF0080]/10 px-3 py-0.5 text-[10px] font-mono text-[#FF0080] font-bold tracking-widest uppercase">
            {profile.contract.preferredGenre}
          </div>
        </div>
      </div>

      {/* Middle Details & Attributes Overview */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-mono text-xs">
        
        {/* Style & Outfit Badges */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          <div className="p-2 border border-current bg-zinc-100 dark:bg-zinc-900 truncate">
            <span className="opacity-40 block uppercase">STYLE</span>
            <span className="text-[#FF0080]">{profile.appearance.avatarStyle}</span>
          </div>
          <div className="p-2 border border-current bg-zinc-100 dark:bg-zinc-900 truncate">
            <span className="opacity-40 block uppercase">OUTFIT</span>
            <span>{profile.outfit.outfit}</span>
          </div>
          <div className="p-2 border border-current bg-zinc-100 dark:bg-zinc-900 truncate">
            <span className="opacity-40 block uppercase">PROP</span>
            <span>{profile.outfit.prop}</span>
          </div>
          <div className="p-2 border border-current bg-zinc-100 dark:bg-zinc-900 truncate">
            <span className="opacity-40 block uppercase">TRAIT</span>
            <span className="text-[#00FF7F]">{profile.contract.personalityTrait}</span>
          </div>
        </div>

        {/* Catchphrase quote */}
        <div className="p-3 border-l-4 border-[#FF0080] bg-zinc-50 dark:bg-zinc-900 italic text-[11px] opacity-80 truncate">
          "{profile.contract.catchphrase}"
        </div>

        {/* Key Stats Bar Mini-Overview */}
        <div className="space-y-1.5 pt-2 border-t border-current/20">
          <div className="flex justify-between text-[10px] font-bold uppercase">
            <span>CHARISMA</span>
            <span className="text-[#00FF7F]">{profile.skills.charisma}/100</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800">
            <div className="h-full bg-[#00FF7F]" style={{ width: `${profile.skills.charisma}%` }} />
          </div>

          <div className="flex justify-between text-[10px] font-bold uppercase">
            <span>HUMOR</span>
            <span className="text-yellow-500">{profile.skills.humor}/100</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800">
            <div className="h-full bg-yellow-500" style={{ width: `${profile.skills.humor}%` }} />
          </div>
        </div>

      </div>

      {/* Footer Controls & Payout Earnings */}
      <div className="p-6 border-t-4 border-current bg-zinc-100 dark:bg-zinc-900 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest block">Total Payout</span>
          <div className="font-bebas text-4xl text-[#00FF7F] leading-none">${earnings.toFixed(2)}</div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(character)}
            className="px-4 py-3 border-2 border-current font-bebas text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            CUSTOMIZE
          </button>
          <button 
            onClick={() => onStartStudio(character)}
            className="px-6 py-3 border-2 border-black bg-black text-white hover:bg-[#FF0080] transition-colors font-bebas text-2xl flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" /> GO LIVE
          </button>
        </div>
      </div>
    </div>
  );
};
