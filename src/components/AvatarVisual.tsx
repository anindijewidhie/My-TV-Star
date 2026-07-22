import React from 'react';
import { StarProfile } from '../types';

interface AvatarVisualProps {
  profile: StarProfile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLive?: boolean;
  activeMoveAnimation?: boolean;
}

export const AvatarVisual: React.FC<AvatarVisualProps> = ({ 
  profile, 
  size = 'md', 
  isLive = false,
  activeMoveAnimation = false 
}) => {
  const { appearance, outfit } = profile;

  // 90s & 2000s Cartoon Network Color Palette Mapping
  const getHairHex = (colorName: string) => {
    switch (colorName) {
      case 'Johnny Golden Blonde': return '#FFD700';
      case 'Powerpuff Orange Flame': return '#FF5500';
      case 'Blossom Crimson Red': return '#E60000';
      case 'Bubbles Bright Lemon': return '#FFF000';
      case 'Buttercup Midnight Black': return '#000000';
      case 'Dexter Fire Red': return '#FF3300';
      case 'Raven Shadow Purple': return '#4B0082';
      case 'Starfire Electric Orange': return '#FF6600';
      case 'Electric Cyan': return '#00E5FF';
      case 'Neon Hot Pink': return '#FF007F';
      case 'Emerald Green': return '#00E676';
      case 'Lavender Violet': return '#B388FF';
      case 'Silver Fox': return '#CFD8DC';
      case 'Pure Snow White': return '#FFFFFF';
      case 'Sunset Amber': return '#FF9900';
      default: return '#121212';
    }
  };

  const getSkinHex = (toneName: string) => {
    switch (toneName) {
      case 'Townsville Peach': return '#FFD2B2';
      case 'Porcelain Ivory': return '#FFE0D1';
      case 'Honey Bronze': return '#D7995B';
      case 'Deep Espresso': return '#4E3629';
      case 'Courage Pale Pink': return '#FFC0CB';
      case 'Beast Boy Lime Green': return '#76FF03';
      case 'Alien Magenta': return '#E91E63';
      case 'Synthetic Chrome': return '#80DEEA';
      case 'Ghostly Pale White': return '#F0F8FF';
      case 'Golden Olive': return '#B8860B';
      case 'Warm Almond': return '#E0AC69';
      default: return '#FFD2B2';
    }
  };

  const getOutfitHex = (colorName: string) => {
    switch (colorName) {
      case 'Townsville Blossom Pink': return '#FF1493';
      case 'Townsville Bubbles Blue': return '#00BFFF';
      case 'Townsville Buttercup Green': return '#32CD32';
      case 'Johnny Black & Blue': return '#111111';
      case 'Dexter Lab White & Violet': return '#8A2BE2';
      case 'Omnitrix Neon Green & Black': return '#00FF00';
      case 'Samurai Pure White': return '#F5F5F5';
      case 'Royal Gold': return '#FFD700';
      case 'Cyber Teal': return '#00E5FF';
      case 'Deep Crimson': return '#990000';
      case 'Midnight Black': return '#111111';
      case 'Electric Yellow': return '#FFFF00';
      default: return '#00FF7F';
    }
  };

  const getEyeHex = (colorName: string) => {
    switch (colorName) {
      case 'Powerpuff Giant Pink Eyes': return '#FF007F';
      case 'Powerpuff Giant Blue Eyes': return '#00BFFF';
      case 'Powerpuff Giant Green Eyes': return '#00FF00';
      case 'Johnny Black Shades Dots': return '#000000';
      case 'Omnitrix Glowing Green': return '#39FF14';
      case 'Sapphire Blue': return '#2979FF';
      case 'Emerald Green': return '#00E676';
      case 'Hazel Brown': return '#795548';
      case 'Obsidian Black': return '#1A1A1A';
      case 'Electric Purple': return '#D500F9';
      case 'Cyber Neon Red': return '#FF1744';
      default: return '#000000';
    }
  };

  const skinHex = getSkinHex(appearance.skinTone);
  const hairHex = getHairHex(appearance.hairColor);
  const outfitHex = getOutfitHex(outfit.outfitColor);
  const eyeHex = getEyeHex(appearance.eyeColor);

  const dimensionClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-72 h-72',
    xl: 'w-96 h-96'
  }[size];

  const isPowerpuff = appearance.avatarStyle.includes('Powerpuff');
  const isJohnny = appearance.avatarStyle.includes('Johnny');
  const isDexter = appearance.avatarStyle.includes('Dexter');
  const isKND = appearance.avatarStyle.includes('KND');

  return (
    <div className={`relative flex items-center justify-center select-none ${dimensionClasses} ${activeMoveAnimation ? 'animate-bounce' : ''}`}>
      {/* Cartoon Background Circle / Studio Glow */}
      <div 
        className="absolute inset-0 border-4 border-black transition-all overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, ${outfitHex}44 0%, #000000 100%)`
        }}
      >
        {isLive && (
          <div className="absolute top-2 left-2 bg-[#FF0080] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-black z-20 animate-pulse">
            CARTOON NETWORK LIVE
          </div>
        )}
      </div>

      {/* SVG Cartoon Vector Avatar */}
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full relative z-10 drop-shadow-xl"
      >
        <defs>
          <linearGradient id={`grad-outfit-${profile.name.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={outfitHex} />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>

        {/* Outer Shoulders & Body Cartoon Silhouette */}
        <path 
          d="M 25,195 Q 25,120 100,120 Q 175,120 175,195 Z" 
          fill={`url(#grad-outfit-${profile.name.replace(/\s+/g, '')})`}
          stroke="#000000" 
          strokeWidth="6" 
        />

        {/* Outfit Belt / Collar Cartoon Details */}
        {outfit.outfit.includes('Powerpuff') ? (
          <rect x="25" y="155" width="150" height="20" fill="#000000" stroke="#000" strokeWidth="2" />
        ) : outfit.outfit.includes('Dexter') ? (
          <path d="M 80,120 L 100,160 L 120,120" fill="#8A2BE2" stroke="#000" strokeWidth="4" />
        ) : outfit.outfit.includes('Samurai') ? (
          <path d="M 75,120 L 100,180 L 125,120" fill="#D32F2F" stroke="#000" strokeWidth="4" />
        ) : (
          <path d="M 80,120 L 100,150 L 120,120" fill="none" stroke="#FFFFFF" strokeWidth="4" />
        )}

        {/* Neck */}
        <rect x="85" y="95" width="30" height="30" rx="4" fill={skinHex} stroke="#000000" strokeWidth="5" />

        {/* Cartoon Face Head Shape */}
        {isPowerpuff ? (
          <circle cx="100" cy="70" r="42" fill={skinHex} stroke="#000000" strokeWidth="6" />
        ) : isJohnny ? (
          <path d="M 60,35 L 140,35 L 125,100 L 75,100 Z" fill={skinHex} stroke="#000000" strokeWidth="6" />
        ) : (
          <ellipse cx="100" cy="70" rx="40" ry="42" fill={skinHex} stroke="#000000" strokeWidth="6" />
        )}

        {/* Eyes - Giant Cartoon Style or Standard */}
        <g id="eyes">
          {isPowerpuff ? (
            /* Giant Powerpuff Eyes */
            <>
              <circle cx="78" cy="68" r="18" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
              <circle cx="78" cy="68" r="12" fill={eyeHex} />
              <circle cx="74" cy="62" r="5" fill="#FFFFFF" />

              <circle cx="122" cy="68" r="18" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
              <circle cx="122" cy="68" r="12" fill={eyeHex} />
              <circle cx="118" cy="62" r="5" fill="#FFFFFF" />
            </>
          ) : (
            /* Standard Bold Cartoon Eyes */
            <>
              <ellipse cx="82" cy="66" rx="9" ry="8" fill="#FFFFFF" stroke="#000" strokeWidth="3" />
              <circle cx="82" cy="66" r="5" fill={eyeHex} />
              <circle cx="80" cy="64" r="2" fill="#FFFFFF" />

              <ellipse cx="118" cy="66" rx="9" ry="8" fill="#FFFFFF" stroke="#000" strokeWidth="3" />
              <circle cx="118" cy="66" r="5" fill={eyeHex} />
              <circle cx="116" cy="64" r="2" fill="#FFFFFF" />

              {/* Eyebrows */}
              <path d="M 70,54 Q 82,48 92,54" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
              <path d="M 108,54 Q 118,48 130,54" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Cartoon Mouth Expression */}
        {appearance.expression.includes('Smirk') || appearance.expression.includes('Johnny') ? (
          <path d="M 85,88 Q 105,92 120,80" fill="none" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
        ) : appearance.expression.includes('Shock') || appearance.expression.includes('Courage') ? (
          <circle cx="100" cy="88" r="10" fill="#000000" stroke="#FF0000" strokeWidth="2" />
        ) : (
          <path d="M 82,88 Q 100,104 118,88 Z" fill="#FF0055" stroke="#000000" strokeWidth="3" />
        )}

        {/* Cartoon Hairstyles */}
        <g id="hairstyle">
          {appearance.hairStyle.includes('Johnny') || appearance.hairStyle.includes('Pompadour') ? (
            <path d="M 50,45 L 50,5 Q 100,-15 150,5 L 150,45 Z" fill={hairHex} stroke="#000000" strokeWidth="6" />
          ) : appearance.hairStyle.includes('Blossom') || appearance.hairStyle.includes('Ponytail') ? (
            <path d="M 50,60 Q 40,10 100,10 Q 160,10 150,60 Q 180,120 160,150 Q 100,140 40,150 Q 20,120 50,60 Z" fill={hairHex} stroke="#000000" strokeWidth="6" />
          ) : appearance.hairStyle.includes('Bubbles') || appearance.hairStyle.includes('Pigtails') ? (
            <>
              <circle cx="45" cy="65" r="22" fill={hairHex} stroke="#000" strokeWidth="5" />
              <circle cx="155" cy="65" r="22" fill={hairHex} stroke="#000" strokeWidth="5" />
              <path d="M 55,60 Q 100,30 145,60 Q 100,45 55,60 Z" fill={hairHex} stroke="#000" strokeWidth="5" />
            </>
          ) : appearance.hairStyle.includes('Dexter') || appearance.hairStyle.includes('Spikes') ? (
            <path d="M 55,55 L 40,25 L 70,30 L 80,5 L 110,20 L 130,5 L 140,35 L 155,20 L 145,60 Z" fill={hairHex} stroke="#000" strokeWidth="5" />
          ) : (
            <path d="M 55,60 Q 60,20 100,20 Q 140,20 145,60 Q 125,35 100,35 Q 75,35 55,60 Z" fill={hairHex} stroke="#000" strokeWidth="5" />
          )}
        </g>

        {/* Cartoon Eyewear */}
        {outfit.eyewear !== 'None' && (
          <g id="eyewear">
            {outfit.eyewear.includes('Johnny') || outfit.eyewear.includes('Sunglasses') ? (
              <path d="M 65,56 L 96,56 L 96,74 L 65,74 Z M 104,56 L 135,56 L 135,74 L 104,74 Z M 96,62 L 104,62" fill="#000000" stroke="#000000" strokeWidth="3" />
            ) : outfit.eyewear.includes('Dexter') || outfit.eyewear.includes('Glasses') ? (
              <>
                <rect x="62" y="52" width="34" height="26" rx="4" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
                <rect x="104" y="52" width="34" height="26" rx="4" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
                <line x1="96" y1="65" x2="104" y2="65" stroke="#000" strokeWidth="5" />
              </>
            ) : null}
          </g>
        )}

        {/* Cartoon Headwear */}
        {outfit.headwear !== 'None' && (
          <g id="headwear">
            {outfit.headwear.includes('Blossom') || outfit.headwear.includes('Bow') ? (
              <path d="M 100,25 L 60,5 L 80,30 L 60,45 L 100,32 L 140,45 L 120,30 L 140,5 Z" fill="#FF0000" stroke="#000" strokeWidth="5" />
            ) : outfit.headwear.includes('KND') || outfit.headwear.includes('Helmet') ? (
              <path d="M 50,50 Q 50,10 100,10 Q 150,10 150,50 L 160,55 L 40,55 Z" fill="#2E7D32" stroke="#000" strokeWidth="5" />
            ) : null}
          </g>
        )}

        {/* Props Held (Bottom Right) */}
        {outfit.prop !== 'None' && (
          <g id="prop" transform="translate(135, 125)">
            <rect x="0" y="0" width="42" height="42" rx="8" fill="#FFD700" stroke="#000000" strokeWidth="3" />
            <text x="21" y="28" textAnchor="middle" fontSize="22" fill="#000000" fontWeight="bold">
              {outfit.prop.includes('Chemical') ? '🧪' : outfit.prop.includes('Katana') ? '⚔️' : outfit.prop.includes('Omnitrix') ? '⌚' : outfit.prop.includes('Scythe') ? '💀' : outfit.prop.includes('Microphone') ? '🎤' : '🏆'}
            </text>
          </g>
        )}
      </svg>

      {/* Badge Ribbon */}
      <div className="absolute -bottom-2 right-2 bg-black text-[#00FF7F] border-2 border-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider z-20 shadow-lg">
        {outfit.badge || 'CARTOON STAR'}
      </div>
    </div>
  );
};
