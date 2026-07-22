import React, { useState } from 'react';
import { CharacterProfile, GameState, View } from '../types';
import { AvatarVisual } from './AvatarVisual';
import { TvLogo } from './TvLogo';
import { 
  Tv, Home, Search, Bell, Mail, Bookmark, User, PlusCircle, 
  MessageSquare, Repeat, Heart, BarChart2, Share, Sparkles, 
  Play, Edit3, Trash2, DollarSign, ShieldCheck, Flame, TrendingUp, MoreHorizontal
} from 'lucide-react';

interface XFeedViewProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  themeStyle: any;
  onOpenNewStarCustomizer: () => void;
  onEditStar: (star: CharacterProfile) => void;
  onSelectActiveStar: (star: CharacterProfile) => void;
  onNavigateView: (view: View) => void;
}

export const XFeedView: React.FC<XFeedViewProps> = ({
  gameState,
  setGameState,
  themeStyle,
  onOpenNewStarCustomizer,
  onEditStar,
  onSelectActiveStar,
  onNavigateView
}) => {
  const [activeTab, setActiveTab] = useState<'forYou' | 'following' | 'trending'>('forYou');
  const [composeText, setComposeText] = useState('');
  const [selectedStarIdForPost, setSelectedStarIdForPost] = useState<string>(gameState.roster[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Feed posts state
  const [customPosts, setCustomPosts] = useState<Array<{
    id: string;
    starId: string;
    text: string;
    timestamp: string;
    likes: number;
    reposts: number;
    replies: number;
    views: string;
  }>>([
    {
      id: 'p-1',
      starId: gameState.roster[0]?.id || 'star-1',
      text: 'Ooh Mama! Just styled my hair for prime time broadcast! Check out the pompadour shine!',
      timestamp: '15m',
      likes: 1240,
      reposts: 312,
      replies: 89,
      views: '45.2K'
    },
    {
      id: 'p-2',
      starId: gameState.roster[1]?.id || 'star-2',
      text: 'City of Townsville emergency broadcast: Crime is down 98% thanks to Chemical X!',
      timestamp: '1h',
      likes: 3890,
      reposts: 954,
      replies: 240,
      views: '120.8K'
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim()) return;

    const newPost = {
      id: 'p-' + Date.now(),
      starId: selectedStarIdForPost || gameState.roster[0]?.id || 'star-1',
      text: composeText,
      timestamp: 'Just now',
      likes: 1,
      reposts: 0,
      replies: 0,
      views: '1'
    };

    setCustomPosts([newPost, ...customPosts]);
    setComposeText('');
  };

  const handleDeleteStar = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your TV Network roster?`)) {
      setGameState(prev => ({
        ...prev,
        roster: prev.roster.filter(s => s.id !== id)
      }));
    }
  };

  const filteredRoster = gameState.roster.filter(s => 
    s.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.profile.stageTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.profile.contract.preferredGenre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${themeStyle.bg} ${themeStyle.text} font-mono flex justify-center selection:bg-[#FF0080] selection:text-white`}>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 min-h-screen">
        
        {/* ================= LEFT SIDEBAR NAVIGATION (X STYLE) ================= */}
        <aside className="md:col-span-3 lg:col-span-3 border-r-4 border-current p-4 lg:p-6 flex flex-col justify-between sticky top-0 h-screen select-none overflow-y-auto">
          <div className="space-y-6">
            {/* My TV Star TV Logo */}
            <div 
              onClick={() => onNavigateView('home')} 
              className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <TvLogo size="md" />
              <div className="flex flex-col">
                <span className="font-bebas text-3xl tracking-tighter leading-none">MY TV STAR</span>
                <span className="text-[8px] font-bold tracking-[0.2em] text-[#FF0080] uppercase">CN NETWORK HUB</span>
              </div>
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('forYou')} 
                className={`w-full flex items-center gap-4 px-4 py-3 font-bebas text-2xl tracking-wide border-2 transition-all ${
                  activeTab === 'forYou' ? `${themeStyle.accent} border-current` : 'border-transparent hover:border-current'
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="hidden lg:inline">HOME FEED</span>
              </button>

              <button 
                onClick={() => onNavigateView('roster')} 
                className="w-full flex items-center gap-4 px-4 py-3 font-bebas text-2xl tracking-wide border-2 border-transparent hover:border-current transition-all"
              >
                <Tv className="w-6 h-6" />
                <span className="hidden lg:inline">TALENT ROSTER</span>
              </button>

              <button 
                onClick={() => onNavigateView('donation')} 
                className="w-full flex items-center gap-4 px-4 py-3 font-bebas text-2xl tracking-wide border-2 border-transparent hover:border-current transition-all"
              >
                <DollarSign className="w-6 h-6 text-[#00FF7F]" />
                <span className="hidden lg:inline">SUPPORT & REWARDS</span>
              </button>

              <div className="pt-2 border-t-2 border-current/20">
                <div className="px-4 py-2 text-[10px] font-bold opacity-50 uppercase tracking-widest hidden lg:block">
                  NETWORK TREASURY
                </div>
                <div className="px-4 py-1 font-bebas text-3xl text-[#00FF7F] leading-none">
                  ${gameState.money.toFixed(2)}
                </div>
                <div className="px-4 text-[9px] opacity-60 uppercase hidden lg:block">
                  +$5.00 EACH 10 MINS
                </div>
              </div>
            </nav>

            {/* Create New Star Button */}
            <button 
              onClick={onOpenNewStarCustomizer}
              className="w-full py-4 px-4 font-bebas text-2xl border-4 border-black bg-[#FF0080] text-white hover:bg-black transition-all flex items-center justify-center gap-2 shadow-none"
            >
              <PlusCircle className="w-6 h-6" />
              <span className="hidden lg:inline">CREATE STAR</span>
            </button>
          </div>

          {/* Producer Profile Badge Bottom */}
          <div className="p-3 border-2 border-current bg-zinc-100 dark:bg-zinc-900 flex items-center gap-3">
            <div className="bg-black text-white dark:bg-white dark:text-black w-9 h-9 border border-current flex items-center justify-center font-bebas text-xl font-bold">
              ID
            </div>
            <div className="hidden lg:flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate">{gameState.currentProducer}</span>
              <span className="text-[9px] text-[#00FF7F] font-bold uppercase">PRODUCER LEVEL 1</span>
            </div>
          </div>
        </aside>

        {/* ================= CENTER MAIN FEED COLUMN (X STYLE) ================= */}
        <main className="md:col-span-9 lg:col-span-6 border-r-4 border-current flex flex-col min-h-screen">
          
          {/* Feed Header Tabs */}
          <div className="sticky top-0 z-40 bg-white dark:bg-black border-b-4 border-current flex items-center justify-around h-16 select-none">
            <button 
              onClick={() => setActiveTab('forYou')} 
              className={`flex-1 h-full font-bebas text-2xl flex items-center justify-center gap-2 relative ${
                activeTab === 'forYou' ? 'text-[#FF0080]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span>FOR YOU</span>
              {activeTab === 'forYou' && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#FF0080]" />}
            </button>

            <button 
              onClick={() => setActiveTab('following')} 
              className={`flex-1 h-full font-bebas text-2xl flex items-center justify-center gap-2 relative ${
                activeTab === 'following' ? 'text-[#FF0080]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span>NETWORK STARS ({gameState.roster.length})</span>
              {activeTab === 'following' && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#FF0080]" />}
            </button>
          </div>

          {/* Compose Post Box (X Style) */}
          <div className="p-4 border-b-4 border-current space-y-4 bg-zinc-50 dark:bg-zinc-950">
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div className="flex gap-3 items-start">
                {gameState.roster.length > 0 && (
                  <div className="w-12 h-12 border-2 border-black overflow-hidden flex-shrink-0 bg-black">
                    <AvatarVisual 
                      profile={gameState.roster.find(s => s.id === selectedStarIdForPost)?.profile || gameState.roster[0].profile}
                      size="sm" 
                    />
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-60 uppercase">POST AS:</span>
                    <select 
                      value={selectedStarIdForPost} 
                      onChange={(e) => setSelectedStarIdForPost(e.target.value)}
                      className={`text-xs font-bold p-1 border-2 ${themeStyle.border} bg-white dark:bg-black outline-none`}
                    >
                      {gameState.roster.map(star => (
                        <option key={star.id} value={star.id}>
                          {star.profile.name} (@{star.profile.name.toLowerCase().replace(/\s+/g, '_')})
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea 
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    placeholder="What is happening in your TV Studio?!"
                    rows={2}
                    className={`w-full p-3 border-2 ${themeStyle.border} bg-white dark:bg-black text-sm font-mono outline-none resize-none focus:border-[#FF0080]`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-current/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF0080]">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline uppercase">BROADCAST TICKER ACTIVE</span>
                </div>

                <button 
                  type="submit"
                  disabled={!composeText.trim()}
                  className="px-6 py-2 font-bebas text-xl border-2 border-black bg-black text-white dark:bg-white dark:text-black hover:bg-[#FF0080] hover:text-white transition-all disabled:opacity-40"
                >
                  BROADCAST POST
                </button>
              </div>
            </form>
          </div>

          {/* Feed Content: Custom Broadcast Posts */}
          <div className="divide-y-4 divide-current flex-1">
            {customPosts.map(post => {
              const star = gameState.roster.find(s => s.id === post.starId) || gameState.roster[0];
              if (!star) return null;

              return (
                <div key={post.id} className="p-4 sm:p-6 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors space-y-3">
                  <div className="flex gap-4 items-start">
                    {/* Star Avatar Circle */}
                    <div className="w-14 h-14 border-2 border-black flex-shrink-0 bg-black">
                      <AvatarVisual profile={star.profile} size="sm" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bebas text-2xl leading-none">{star.profile.name}</span>
                          <span className="text-xs opacity-60 font-bold">@{star.profile.name.toLowerCase().replace(/\s+/g, '_')}</span>
                          <span className="text-xs opacity-40">· {post.timestamp}</span>
                        </div>
                        <span className="bg-[#FF0080] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">
                          {star.profile.appearance.avatarStyle.split(' ')[0]}
                        </span>
                      </div>

                      <p className="text-sm font-mono leading-relaxed">{post.text}</p>

                      <div className="p-2 border-2 border-current bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-bold flex items-center justify-between">
                        <span className="text-[#00FF7F]">"{star.profile.contract.catchphrase}"</span>
                        <button 
                          onClick={() => {
                            onSelectActiveStar(star);
                            onNavigateView('studio');
                          }}
                          className="px-3 py-1 font-bebas text-lg bg-[#FF0080] text-white border border-black hover:bg-black transition-colors flex items-center gap-1"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          LAUNCH STUDIO
                        </button>
                      </div>

                      {/* X Post Engagement Controls */}
                      <div className="flex items-center justify-between text-xs font-bold opacity-70 pt-2">
                        <button className="flex items-center gap-1.5 hover:text-[#FF0080]">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.replies}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-[#00FF7F]">
                          <Repeat className="w-4 h-4" />
                          <span>{post.reposts}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-[#FF0080]">
                          <Heart className="w-4 h-4 fill-current text-[#FF0080]" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5">
                          <BarChart2 className="w-4 h-4" />
                          <span>{post.views}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* TV Star Character Roster Cards inside Feed */}
            <div className="p-4 bg-black text-white dark:bg-white dark:text-black font-bebas text-3xl tracking-wide flex items-center justify-between">
              <span>FEATURED NETWORK ROSTER ({filteredRoster.length})</span>
              <button 
                onClick={onOpenNewStarCustomizer}
                className="text-sm font-mono bg-[#FF0080] text-white px-3 py-1 border border-current hover:bg-white hover:text-black"
              >
                + ADD STAR
              </button>
            </div>

            {filteredRoster.map(star => (
              <div key={star.id} className="p-4 sm:p-6 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors border-b-4 border-current">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-32 h-32 border-4 border-black flex-shrink-0 bg-black">
                    <AvatarVisual profile={star.profile} size="md" />
                  </div>

                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-bold text-[#FF0080] tracking-widest uppercase block">
                        {star.profile.stageTitle}
                      </span>
                      <h3 className="font-bebas text-4xl sm:text-5xl leading-none">{star.profile.name}</h3>
                      <p className="text-xs opacity-70 line-clamp-2 mt-1">{star.profile.bio}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-bold uppercase">
                      <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 border border-current">
                        STYLE: {star.profile.appearance.avatarStyle}
                      </span>
                      <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 border border-current text-[#00FF7F]">
                        EARNINGS: ${star.earnings.toFixed(2)}
                      </span>
                      <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 border border-current text-[#FF0080]">
                        LEVEL {star.level}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                      <button 
                        onClick={() => {
                          onSelectActiveStar(star);
                          onNavigateView('studio');
                        }}
                        className="px-6 py-2 font-bebas text-2xl border-2 border-black bg-[#FF0080] text-white hover:bg-black transition-all flex items-center gap-2"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        LIVE STUDIO
                      </button>

                      <button 
                        onClick={() => onEditStar(star)}
                        className={`px-4 py-2 font-bebas text-xl border-2 ${themeStyle.border} ${themeStyle.bg} hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center gap-1`}
                      >
                        <Edit3 className="w-4 h-4" />
                        CUSTOMIZE
                      </button>

                      <button 
                        onClick={() => handleDeleteStar(star.id, star.profile.name)}
                        className="p-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        title="Delete Star"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* ================= RIGHT SIDEBAR (X STYLE TRENDING & SEARCH) ================= */}
        <aside className="hidden lg:block lg:col-span-3 p-6 space-y-6 sticky top-0 h-screen overflow-y-auto select-none">
          
          {/* Search Box */}
          <div className={`p-3 border-4 ${themeStyle.border} bg-zinc-100 dark:bg-zinc-900 flex items-center gap-3`}>
            <Search className="w-5 h-5 opacity-50" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TV Star..." 
              className="bg-transparent text-sm font-mono outline-none w-full"
            />
          </div>

          {/* Premium Reward Card */}
          <div className="p-5 border-4 border-black bg-[#FF0080] text-white space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 animate-spin" />
              <h3 className="font-bebas text-3xl leading-none">PREMIUM NETWORK</h3>
            </div>
            <p className="text-xs font-mono leading-snug">
              Earn $5.00 every 10 minutes of broadcast streaming. Unlock unlimited Chemical X and custom studio props.
            </p>
            <button 
              onClick={() => onNavigateView('donation')}
              className="w-full py-2 font-bebas text-xl border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all"
            >
              CLAIM $5 REWARD PERKS
            </button>
          </div>

          {/* Trending Topics Box (X Style) */}
          <div className={`border-4 ${themeStyle.border} p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950`}>
            <h3 className="font-bebas text-3xl border-b-2 border-current pb-2 flex items-center justify-between">
              <span>WHAT'S HAPPENING</span>
              <Flame className="w-5 h-5 text-[#FF0080]" />
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-0.5 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 p-1">
                <span className="opacity-50 text-[10px] block uppercase">Entertainment · Trending</span>
                <span className="font-bold block text-sm">#CityOfTownsville</span>
                <span className="opacity-60 text-[10px]">142.5K Broadcast Posts</span>
              </div>

              <div className="space-y-0.5 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 p-1">
                <span className="opacity-50 text-[10px] block uppercase">Cartoon Network · Trending</span>
                <span className="font-bold block text-sm">#JohnnyBravoHair</span>
                <span className="opacity-60 text-[10px]">98.4K Broadcast Posts</span>
              </div>

              <div className="space-y-0.5 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 p-1">
                <span className="opacity-50 text-[10px] block uppercase">Animation · Trending</span>
                <span className="font-bold block text-sm">#DexterLabInventions</span>
                <span className="opacity-60 text-[10px]">76.2K Broadcast Posts</span>
              </div>

              <div className="space-y-0.5 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 p-1">
                <span className="opacity-50 text-[10px] block uppercase">Finance · Trending</span>
                <span className="font-bold block text-sm">#5Dollar10MinReward</span>
                <span className="opacity-60 text-[10px]">54.1K Broadcast Posts</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="text-[10px] opacity-40 font-mono uppercase space-y-1">
            <p>Terms of Service · Privacy Policy · Cookie Policy</p>
            <p>© 2026 MY TV STAR, INC.</p>
          </div>
        </aside>

      </div>
    </div>
  );
};
