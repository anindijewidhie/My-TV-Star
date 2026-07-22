import React from 'react';
import { View, GameState } from '../types';
import { Sun, Moon, ShieldCheck, ShieldAlert, PlusCircle, User, Zap } from 'lucide-react';
import { TvLogo } from './TvLogo';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  themeStyle: any;
  onOpenNewStarCustomizer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  gameState,
  setGameState,
  themeStyle,
  onOpenNewStarCustomizer
}) => {
  const isDark = gameState.theme === 'dark';

  const toggleTheme = () => {
    setGameState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const toggleParentalControl = () => {
    setGameState(prev => ({ ...prev, parentalControlUnder18: !prev.parentalControlUnder18 }));
  };

  return (
    <nav className={`h-20 border-b-4 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-[100] ${themeStyle.bg} ${themeStyle.border} ${themeStyle.text} font-mono select-none`}>
      {/* Brand Logo & Title */}
      <div 
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => setCurrentView('home')}
      >
        <TvLogo size="md" className="group-hover:scale-105 transition-transform" />
        <div className="flex flex-col">
          <span className="font-bebas text-4xl tracking-tighter leading-none">MY TV STAR</span>
          <span className="text-[9px] font-bold tracking-[0.3em] opacity-50 uppercase text-[#FF0080]">GLOBAL TALENT STUDIO</span>
        </div>
      </div>

      {/* Center Treasury / Status Badge */}
      <div className="hidden lg:flex items-center gap-6 border-x-2 border-current px-6 h-full">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">NETWORK TREASURY</span>
          <span className="font-bebas text-3xl text-[#00FF7F] leading-none">${gameState.money.toFixed(2)}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Parental Control Under 18 Toggle */}
        <button 
          onClick={toggleParentalControl}
          className={`px-3 py-1.5 border-2 border-current text-xs font-bold font-mono uppercase flex items-center gap-2 transition-colors ${
            gameState.parentalControlUnder18 ? 'bg-[#00FF7F] text-black' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
          }`}
          title="Parental Control Mode (Age 3+ / Under 18)"
        >
          {gameState.parentalControlUnder18 ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4 opacity-50" />}
          <span className="hidden sm:inline">{gameState.parentalControlUnder18 ? 'PG-3+ ACTIVE' : 'PG-18 ALL'}</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-2 border-2 border-current transition-transform hover:rotate-12"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Navigation buttons */}
        <button 
          onClick={() => setCurrentView('donation')} 
          className="font-bebas text-xl uppercase tracking-wider hover:text-[#FF0080] transition-colors hidden sm:block"
        >
          SUPPORT
        </button>

        <button 
          onClick={onOpenNewStarCustomizer}
          className="px-4 py-2 font-bebas text-2xl border-2 border-black bg-[#FF0080] text-white hover:bg-black transition-all flex items-center gap-2 shadow-none"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="hidden md:inline">NEW STAR</span>
        </button>

        {gameState.roster.length > 0 || localStorage.getItem('myTVStar_isLoggedIn') === 'true' ? (
          <button 
            onClick={() => setCurrentView('roster')} 
            className={`px-6 py-2 font-bebas text-2xl border-2 ${themeStyle.border} ${themeStyle.accent}`}
          >
            TALENT HUB
          </button>
        ) : (
          <button 
            onClick={() => setCurrentView('login')} 
            className={`px-6 py-2 font-bebas text-2xl border-2 ${themeStyle.border} ${themeStyle.accent}`}
          >
            PRODUCER LOGIN
          </button>
        )}
      </div>
    </nav>
  );
};
