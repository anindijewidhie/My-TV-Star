import React from 'react';

interface TvLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  showLabel?: boolean;
}

export const TvLogo: React.FC<TvLogoProps> = ({ 
  className = '', 
  size = 'md',
  showLabel = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    giant: 'w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80'
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-2xl"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antennae */}
          <line x1="32" y1="22" x2="16" y2="4" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <line x1="68" y1="22" x2="84" y2="4" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <circle cx="16" cy="4" r="3.5" fill="#FF0080" />
          <circle cx="84" cy="4" r="3.5" fill="#00FF7F" />

          {/* TV Outer Casing */}
          <rect x="6" y="20" width="88" height="74" rx="12" fill="currentColor" stroke="currentColor" strokeWidth="3" />

          {/* TV Screen Outer Frame Bezel */}
          <rect x="11" y="25" width="62" height="64" rx="8" fill="#121216" stroke="#000000" strokeWidth="3" />

          {/* TV Screen Display Glow */}
          <rect x="13" y="27" width="58" height="60" rx="6" fill="#1A1A24" />

          {/* Side Control Panel */}
          <rect x="76" y="25" width="13" height="64" rx="4" fill="#26262e" stroke="#000000" strokeWidth="2" />
          <circle cx="82.5" cy="35" r="3.5" fill="#FF0080" stroke="#000000" strokeWidth="1" />
          <circle cx="82.5" cy="47" r="3.5" fill="#00FF7F" stroke="#000000" strokeWidth="1" />
          
          {/* Speaker Grille Lines */}
          <line x1="78" y1="62" x2="87" y2="62" stroke="#666666" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="70" x2="87" y2="70" stroke="#666666" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="78" x2="87" y2="78" stroke="#666666" strokeWidth="2" strokeLinecap="round" />

          {/* 'M' Letter inside Television Screen */}
          {/* Bold, flat-styled 90s Cartoon Network / MTV style M */}
          <path 
            d="M 18,80 L 18,34 L 42,66 L 66,34 L 66,80 L 54,80 L 54,48 L 42,54 L 30,48 L 30,80 Z" 
            fill="#FF0080" 
            stroke="#FFFFFF" 
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* TV Screen Reflection Glare */}
          <path d="M 14,28 L 68,28 L 14,68 Z" fill="#FFFFFF" fillOpacity="0.12" />
        </svg>
      </div>

      {showLabel && (
        <span className="font-bebas text-2xl tracking-tighter mt-1 text-center leading-none">
          MY TV <span className="text-[#FF0080]">STAR</span>
        </span>
      )}
    </div>
  );
};
