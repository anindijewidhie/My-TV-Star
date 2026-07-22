import React, { useState } from 'react';
import { StarProfile } from '../types';
import { AvatarVisual } from './AvatarVisual';
import { 
  GENDERS, AVATAR_STYLES, HAIR_STYLES, HAIR_COLORS, SKIN_TONES, 
  EYE_COLORS, EXPRESSIONS, MAKEUP_FACIAL_HAIR, HEIGHTS, OUTFITS, 
  OUTFIT_COLORS, EYEWEAR, HEADWEAR, PROPS, BADGES, SHOW_GENRES, 
  PERSONALITY_TRAITS, CATCHPHRASES, SIGNATURE_MOVES, VOICE_TONES, 
  FANBASE_DEMOGRAPHICS, CONTRACT_PERKS 
} from '../data/characterOptions';
import { generateStarWithAI, getStylistAdvice, getRandomStarFallback } from '../services/aiService';
import { 
  Sparkles, Bot, Palette, Shirt, Award, Sliders, FileText, 
  Zap, RefreshCw, CheckCircle2, Wand2, ShieldAlert 
} from 'lucide-react';

interface CustomizerProps {
  initialProfile: StarProfile;
  onSave: (updated: StarProfile) => void;
  onCancel: () => void;
  isNewStar?: boolean;
  themeStyle: any;
  parentalControlMode?: boolean;
}

export const CharacterCustomizer: React.FC<CustomizerProps> = ({
  initialProfile,
  onSave,
  onCancel,
  isNewStar = false,
  themeStyle,
  parentalControlMode = false
}) => {
  const [profile, setProfile] = useState<StarProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'appearance' | 'wardrobe' | 'skills' | 'contract' | 'ai'>('appearance');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [stylistAdvice, setStylistAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Helper updates
  const updateAppearance = (key: keyof StarProfile['appearance'], value: string) => {
    setProfile(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value }
    }));
  };

  const updateOutfit = (key: keyof StarProfile['outfit'], value: string) => {
    setProfile(prev => ({
      ...prev,
      outfit: { ...prev.outfit, [key]: value }
    }));
  };

  const updateSkill = (key: keyof StarProfile['skills'], val: number) => {
    setProfile(prev => ({
      ...prev,
      skills: { ...prev.skills, [key]: Math.min(100, Math.max(1, val)) }
    }));
  };

  const updateContract = (key: keyof StarProfile['contract'], value: any) => {
    setProfile(prev => ({
      ...prev,
      contract: { ...prev.contract, [key]: value }
    }));
  };

  const togglePerk = (perk: string) => {
    const current = profile.contract.perks;
    const next = current.includes(perk) 
      ? current.filter(p => p !== perk)
      : [...current, perk];
    updateContract('perks', next);
  };

  const handleAiGenerate = async () => {
    setIsGeneratingAi(true);
    try {
      const result = await generateStarWithAI(aiPrompt);
      setProfile(result);
    } catch (e) {
      console.error(e);
      setProfile(getRandomStarFallback());
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAskStylist = async () => {
    setIsLoadingAdvice(true);
    try {
      const advice = await getStylistAdvice(profile);
      setStylistAdvice(advice);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeStyle.bg} ${themeStyle.text} font-mono p-6 lg:p-12`}>
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-current pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-[#FF0080] text-white px-3 py-1 font-bebas text-lg tracking-widest uppercase">CHARACTER STUDIO</span>
            {parentalControlMode && (
              <span className="bg-[#00FF7F] text-black px-3 py-1 font-bebas text-lg tracking-widest uppercase flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> PG-RATED (UNDER 18s)
              </span>
            )}
          </div>
          <h1 className="font-bebas text-6xl md:text-8xl tracking-tighter uppercase leading-none mt-2">
            {isNewStar ? 'CREATE NEW STAR' : `CUSTOMIZE: ${profile.name}`}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setProfile(getRandomStarFallback())}
            className="px-6 py-3 border-2 border-current hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center gap-2 font-bebas text-xl"
          >
            <RefreshCw className="w-5 h-5" /> RANDOMIZE
          </button>
          <button 
            onClick={onCancel}
            className="px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-bebas text-xl"
          >
            CANCEL
          </button>
          <button 
            onClick={() => onSave(profile)}
            className="px-10 py-3 bg-[#00FF7F] text-black border-4 border-black font-bebas text-3xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-8 h-8" /> SAVE TO ROSTER
          </button>
        </div>
      </div>

      {/* Main Studio Customizer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Interactive Character Visual & Quick Identity */}
        <div className="lg:col-span-4 border-4 border-current p-8 flex flex-col items-center bg-zinc-50 dark:bg-zinc-900 sticky top-24">
          <AvatarVisual profile={profile} size="lg" />

          {/* Name & Stage Title Input */}
          <div className="w-full mt-6 space-y-4">
            <div>
              <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest block mb-1">Character Full Name</label>
              <input 
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full p-3 font-bebas text-4xl border-2 border-current bg-white dark:bg-black outline-none focus:border-[#FF0080]"
                placeholder="Star Name"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest block mb-1">Stage Title / Moniker</label>
              <input 
                value={profile.stageTitle}
                onChange={e => setProfile(p => ({ ...p, stageTitle: e.target.value }))}
                className="w-full p-3 font-bebas text-2xl border-2 border-current bg-white dark:bg-black outline-none focus:border-[#00FF7F]"
                placeholder="e.g. The Prime Time Queen"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest block mb-1">Star Bio / Backstory</label>
              <textarea 
                rows={2}
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                className="w-full p-3 text-xs font-mono border-2 border-current bg-white dark:bg-black outline-none focus:border-[#FF0080]"
                placeholder="Star backstory..."
              />
            </div>
          </div>

          {/* Key Quick Attributes Badge */}
          <div className="w-full mt-6 pt-6 border-t-2 border-current grid grid-cols-2 gap-3 text-center">
            <div className="p-3 border border-current bg-white dark:bg-black">
              <span className="text-[9px] font-bold opacity-40 uppercase block">PRIMARY GENRE</span>
              <span className="font-bebas text-lg text-[#FF0080] truncate block">{profile.contract.preferredGenre}</span>
            </div>
            <div className="p-3 border border-current bg-white dark:bg-black">
              <span className="text-[9px] font-bold opacity-40 uppercase block">CHARISMA SCORE</span>
              <span className="font-bebas text-2xl text-[#00FF7F] block">{profile.skills.charisma} / 100</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Tabs and Options Workbench */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b-4 border-current pb-3">
            {[
              { id: 'appearance', label: 'APPEARANCE', icon: Palette },
              { id: 'wardrobe', label: 'WARDROBE & PROPS', icon: Shirt },
              { id: 'skills', label: 'SKILLS & STATS', icon: Sliders },
              { id: 'contract', label: 'CONTRACT & TRAITS', icon: FileText },
              { id: 'ai', label: 'AI STYLIST', icon: Sparkles }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-bebas text-2xl border-2 border-current flex items-center gap-2 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-black text-white dark:bg-white dark:text-black scale-105' 
                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Physical Appearance */}
          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-4 border-current bg-zinc-50 dark:bg-zinc-900/50 animate-in fade-in duration-200">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Gender / Identity</label>
                <select 
                  value={profile.appearance.gender}
                  onChange={e => updateAppearance('gender', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Avatar Visual Archetype</label>
                <select 
                  value={profile.appearance.avatarStyle}
                  onChange={e => updateAppearance('avatarStyle', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {AVATAR_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Hair Style</label>
                <select 
                  value={profile.appearance.hairStyle}
                  onChange={e => updateAppearance('hairStyle', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {HAIR_STYLES.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Hair Color</label>
                <select 
                  value={profile.appearance.hairColor}
                  onChange={e => updateAppearance('hairColor', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {HAIR_COLORS.map(hc => <option key={hc} value={hc}>{hc}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Skin Tone</label>
                <select 
                  value={profile.appearance.skinTone}
                  onChange={e => updateAppearance('skinTone', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {SKIN_TONES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Eye Color</label>
                <select 
                  value={profile.appearance.eyeColor}
                  onChange={e => updateAppearance('eyeColor', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {EYE_COLORS.map(ec => <option key={ec} value={ec}>{ec}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Facial Expression / Vibe</label>
                <select 
                  value={profile.appearance.expression}
                  onChange={e => updateAppearance('expression', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {EXPRESSIONS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Makeup / Facial Hair</label>
                <select 
                  value={profile.appearance.makeupFacialHair}
                  onChange={e => updateAppearance('makeupFacialHair', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {MAKEUP_FACIAL_HAIR.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Height & Presence</label>
                <select 
                  value={profile.appearance.height}
                  onChange={e => updateAppearance('height', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Tab 2: Wardrobe & Props */}
          {activeTab === 'wardrobe' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-4 border-current bg-zinc-50 dark:bg-zinc-900/50 animate-in fade-in duration-200">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Broadcast Outfit</label>
                <select 
                  value={profile.outfit.outfit}
                  onChange={e => updateOutfit('outfit', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {OUTFITS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Outfit Color Palette</label>
                <select 
                  value={profile.outfit.outfitColor}
                  onChange={e => updateOutfit('outfitColor', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {OUTFIT_COLORS.map(oc => <option key={oc} value={oc}>{oc}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Eyewear</label>
                <select 
                  value={profile.outfit.eyewear}
                  onChange={e => updateOutfit('eyewear', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {EYEWEAR.map(ew => <option key={ew} value={ew}>{ew}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Headwear / Crown</label>
                <select 
                  value={profile.outfit.headwear}
                  onChange={e => updateOutfit('headwear', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {HEADWEAR.map(hw => <option key={hw} value={hw}>{hw}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Signature Hand Prop</label>
                <select 
                  value={profile.outfit.prop}
                  onChange={e => updateOutfit('prop', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {PROPS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Honorary Studio Badge</label>
                <select 
                  value={profile.outfit.badge}
                  onChange={e => updateOutfit('badge', e.target.value)}
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                >
                  {BADGES.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Tab 3: Skills & Attributes */}
          {activeTab === 'skills' && (
            <div className="p-6 border-4 border-current bg-zinc-50 dark:bg-zinc-900/50 space-y-6 animate-in fade-in duration-200">
              <span className="text-xs font-bold opacity-50 uppercase tracking-widest block border-b-2 border-current pb-2">
                TALENT SKILL METRICS (INFLUENCES STUDIO RATINGS & PAYOUT)
              </span>

              {[
                { key: 'charisma', label: 'Charisma & Stage Presence', color: 'bg-[#FF0080]' },
                { key: 'humor', label: 'Humor & Wit', color: 'bg-yellow-400' },
                { key: 'dramatics', label: 'Dramatics & Emotion', color: 'bg-purple-500' },
                { key: 'intelligence', label: 'Intelligence & Fast Recall', color: 'bg-blue-500' },
                { key: 'musicality', label: 'Musicality & Rhythm', color: 'bg-[#00FF7F]' },
                { key: 'stunts', label: 'Stunts & Athletic Energy', color: 'bg-orange-500' }
              ].map(skill => {
                const val = (profile.skills as any)[skill.key];
                return (
                  <div key={skill.key} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span>{skill.label}</span>
                      <span className="font-bebas text-2xl">{val} / 100</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={val}
                        onChange={e => updateSkill(skill.key as any, parseInt(e.target.value))}
                        className="w-full h-3 bg-zinc-300 dark:bg-zinc-800 appearance-none cursor-pointer accent-[#FF0080]"
                      />
                      <button 
                        onClick={() => updateSkill(skill.key as any, val + 5)}
                        className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black font-bebas text-lg hover:scale-105"
                      >
                        +5 TRAINING
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Contract & Personality */}
          {activeTab === 'contract' && (
            <div className="p-6 border-4 border-current bg-zinc-50 dark:bg-zinc-900/50 space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">Preferred Broadcast Genre</label>
                  <select 
                    value={profile.contract.preferredGenre}
                    onChange={e => updateContract('preferredGenre', e.target.value)}
                    className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                  >
                    {SHOW_GENRES.map(sg => <option key={sg} value={sg}>{sg}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">Personality Trait</label>
                  <select 
                    value={profile.contract.personalityTrait}
                    onChange={e => updateContract('personalityTrait', e.target.value)}
                    className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                  >
                    {PERSONALITY_TRAITS.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">Signature Catchphrase</label>
                  <input 
                    value={profile.contract.catchphrase}
                    onChange={e => updateContract('catchphrase', e.target.value)}
                    className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                    placeholder="e.g. Stay tuned, stay fabulous!"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">Signature Move Pose</label>
                  <select 
                    value={profile.contract.signatureMove}
                    onChange={e => updateContract('signatureMove', e.target.value)}
                    className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                  >
                    {SIGNATURE_MOVES.map(sm => <option key={sm} value={sm}>{sm}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">Voice Tone & Accent</label>
                  <select 
                    value={profile.contract.voiceTone}
                    onChange={e => updateContract('voiceTone', e.target.value)}
                    className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                  >
                    {VOICE_TONES.map(vt => <option key={vt} value={vt}>{vt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">Target Fanbase Demographic</label>
                  <select 
                    value={profile.contract.fanbaseDemographic}
                    onChange={e => updateContract('fanbaseDemographic', e.target.value)}
                    className="w-full p-3 font-mono text-sm border-2 border-current bg-white dark:bg-black outline-none"
                  >
                    {FANBASE_DEMOGRAPHICS.map(fd => <option key={fd} value={fd}>{fd}</option>)}
                  </select>
                </div>
              </div>

              {/* Contract Perks Checkboxes */}
              <div className="pt-4 border-t-2 border-current">
                <label className="text-xs font-bold uppercase tracking-widest block mb-3">CONTRACT PERKS & CLAUSES</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CONTRACT_PERKS.map(perk => {
                    const isSelected = profile.contract.perks.includes(perk);
                    return (
                      <button
                        key={perk}
                        type="button"
                        onClick={() => togglePerk(perk)}
                        className={`p-3 text-left border-2 border-current text-xs font-bold font-mono uppercase flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-[#FF0080] text-white' : 'bg-white dark:bg-black'
                        }`}
                      >
                        <span>{perk}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: AI Stylist & Generator */}
          {activeTab === 'ai' && (
            <div className="p-6 border-4 border-current bg-zinc-50 dark:bg-zinc-900/50 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <Wand2 className="w-8 h-8 text-[#FF0080]" />
                <div>
                  <h3 className="font-bebas text-4xl">GEMINI AI TALENT GENERATOR & HOLLYWOOD STYLIST</h3>
                  <p className="text-xs opacity-60">Use Gemini AI to synthesize full original star concepts or ask for personalized image advice.</p>
                </div>
              </div>

              <div className="p-4 border-2 border-current bg-white dark:bg-black space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest block">AI Character Prompt / Theme</label>
                <input 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g. A cyberpunk news anchor with platinum neon hair who loves high-stakes gossip drama..."
                  className="w-full p-3 font-mono text-sm border-2 border-current bg-zinc-100 dark:bg-zinc-800 outline-none"
                />
                <button
                  disabled={isGeneratingAi}
                  onClick={handleAiGenerate}
                  className="w-full py-4 bg-[#FF0080] text-white font-bebas text-3xl border-2 border-black hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Bot className="w-8 h-8" />
                  {isGeneratingAi ? 'Synthesizing Star Profile...' : 'GENERATE FULL AI CHARACTER'}
                </button>
              </div>

              {/* Ask Stylist Advice Box */}
              <div className="p-4 border-2 border-[#00FF7F] bg-black text-white space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bebas text-2xl text-[#00FF7F]">HOLLYWOOD STYLIST CRITIQUE</span>
                  <button
                    disabled={isLoadingAdvice}
                    onClick={handleAskStylist}
                    className="px-4 py-1 bg-[#00FF7F] text-black font-bebas text-lg hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isLoadingAdvice ? 'Consulting...' : 'ASK STYLIST ADVICE'}
                  </button>
                </div>
                <p className="text-xs font-mono leading-relaxed text-zinc-300">
                  {stylistAdvice || "Click 'Ask Stylist Advice' to get Gemini AI styling recommendations to maximize your star's broadcast ratings!"}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
