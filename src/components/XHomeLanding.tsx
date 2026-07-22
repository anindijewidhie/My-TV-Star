import React from 'react';
import { PlusCircle, User, Sparkles, ShieldCheck, Zap, ArrowRight, Search, Globe, Flame } from 'lucide-react';
import { GameState } from '../types';
import { TvLogo } from './TvLogo';

interface XHomeLandingProps {
  themeStyle: any;
  onEnterRoster: () => void;
  onOpenNewStarCustomizer: () => void;
  onLoginProducer: () => void;
  gameState: GameState;
}

export const XHomeLanding: React.FC<XHomeLandingProps> = ({
  themeStyle,
  onEnterRoster,
  onOpenNewStarCustomizer,
  onLoginProducer,
  gameState
}) => {
  const isDark = gameState.theme === 'dark';

  return (
    <div className={`min-h-screen ${themeStyle.bg} ${themeStyle.text} flex flex-col font-mono selection:bg-[#FF0080] selection:text-white`}>
      {/* Top Banner Ticker */}
      <div className="bg-black text-[#00FF7F] dark:bg-white dark:text-black py-2 px-6 border-b-4 border-current text-xs font-bold uppercase tracking-widest flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-3 animate-pulse">
          <span className="bg-[#FF0080] text-white px-2 py-0.5 text-[10px] font-extrabold">LIVE</span>
          <span>MY TV STAR // 90s & 2000s CARTOON NETWORK TALENT NETWORK</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px]">
          <span>TREASURY: ${gameState.money.toFixed(2)}</span>
          <span>REWARD: $5.00 / 10 MINS</span>
          <span>STATUS: ONLINE</span>
        </div>
      </div>

      {/* Main Split Body (X Homepage Style) */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 items-center p-6 lg:p-12 gap-12 lg:gap-16">
        {/* Left Column: Massive Iconic Brand TV Logo with M Letter */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-8">
          <div className="relative group">
            {/* Giant Iconic TV Frame */}
            <div className={`w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 border-8 ${themeStyle.border} ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'} flex items-center justify-center relative overflow-hidden p-6`}>
              <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform">
                <TvLogo size="giant" />
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-2 left-2 bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 text-[10px] font-bold">
                EST. 1990
              </div>
              <div className="absolute bottom-2 right-2 bg-[#FF0080] text-white px-2 py-0.5 text-[10px] font-bold">
                PG-3+ SAFE
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <span className="text-xs font-bold tracking-[0.4em] opacity-60 uppercase block">
              CARTOON NETWORK TALENT NETWORK
            </span>
            <span className="font-bebas text-3xl sm:text-4xl tracking-tight text-[#00FF7F]">
              JOHNNY BRAVO // POWERPUFF // DEXTER // KND
            </span>
          </div>
        </div>

        {/* Right Column: X Landing Text & Sign Up Actions */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="font-bebas text-7xl sm:text-8xl lg:text-9xl leading-[0.85] tracking-tighter uppercase select-none">
              HAPPENING <span className="text-[#FF0080]">NOW</span>
            </h1>
            <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase opacity-90">
              JOIN THE GLOBAL TALENT NETWORK TODAY.
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="max-w-md w-full space-y-4 pt-2">
            {/* Primary Action Button */}
            <button
              onClick={onEnterRoster}
              className={`w-full py-5 px-8 font-bebas text-4xl tracking-wide border-4 ${themeStyle.border} ${themeStyle.accent} hover:bg-[#FF0080] hover:text-white transition-all flex items-center justify-between group`}
            >
              <span>ENTER TALENT HUB</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>

            {/* Secondary Action Button */}
            <button
              onClick={onOpenNewStarCustomizer}
              className="w-full py-4 px-8 font-bebas text-3xl tracking-wide border-4 border-black bg-[#FF0080] text-white hover:bg-black transition-all flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <PlusCircle className="w-7 h-7" />
                CREATE NEW STAR
              </span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </button>

            {/* Terms Disclaimer */}
            <p className="text-[11px] leading-relaxed font-bold opacity-60 uppercase tracking-tight pt-1">
              By joining, you agree to the Terms of Service and Privacy Policy, including $5.00/10min session payouts, AI teleprompter features, and PG-3+ Parental Control guidelines.
            </p>
          </div>

          {/* Already Have An Account / Sign In */}
          <div className="max-w-md w-full space-y-4 pt-6 border-t-4 border-current">
            <h3 className="font-bebas text-3xl uppercase tracking-tight">ALREADY A PRODUCER?</h3>
            <button
              onClick={onLoginProducer}
              className={`w-full py-4 px-8 font-bebas text-3xl tracking-wide border-4 ${themeStyle.border} bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-3`}
            >
              <User className="w-6 h-6" />
              SIGN IN WITH PRODUCER ID
            </button>
          </div>

          {/* Live Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-center border-t-2 border-current/20 max-w-md">
            <div>
              <span className="font-bebas text-3xl block text-[#FF0080]">100%</span>
              <span className="text-[9px] font-bold opacity-60 uppercase">CUSTOMIZABLE</span>
            </div>
            <div>
              <span className="font-bebas text-3xl block text-[#00FF7F]">$5.00</span>
              <span className="text-[9px] font-bold opacity-60 uppercase">EVERY 10 MINS</span>
            </div>
            <div>
              <span className="font-bebas text-3xl block text-amber-500">90s/00s</span>
              <span className="text-[9px] font-bold opacity-60 uppercase">CN CLASSICS</span>
            </div>
          </div>
        </div>
      </div>

      {/* X Footer Links Bar */}
      <footer className="border-t-4 border-current py-6 px-6 text-center text-[10px] font-bold uppercase tracking-widest opacity-60">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Download App</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Help Center</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Terms of Service</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Privacy Policy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Cookie Policy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Accessibility</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Ads Info</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Blog</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Careers</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Brand Resources</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Advertising</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Marketing</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">TV Star for Business</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Developers</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Directory</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onEnterRoster(); }} className="hover:underline">Settings</a>
          <span>© 2026 MY TV STAR, INC.</span>
        </div>
      </footer>
    </div>
  );
};
