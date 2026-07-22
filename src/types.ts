export type View = 'home' | 'login' | 'roster' | 'customizer' | 'studio' | 'donation';

export type Gender = 'Female' | 'Male' | 'Non-Binary' | 'Android' | 'Extraterrestrial' | 'Toon Creature' | 'Secret Agent';
export type AvatarStyle = 
  | 'Powerpuff Heroic (Townsville)' 
  | 'Dexter Genius Lab' 
  | 'Johnny Bravo Glamour' 
  | 'Samurai Master' 
  | 'Codename KND Operative' 
  | 'Teen Titans Anime-Toon' 
  | 'Foster Whimsical Friend' 
  | 'Grim Dark Comedy' 
  | 'Ben 10 Alien Hero' 
  | 'Cul-de-Sac 90s Classic' 
  | 'Chowder Pattern Toon' 
  | 'Megas XLR Mech Pilot'
  | 'Classic Hollywood'
  | 'Cyberpunk Broadcast';

export interface CharacterAppearance {
  gender: Gender;
  avatarStyle: AvatarStyle;
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  eyeColor: string;
  expression: string;
  makeupFacialHair: string;
  height: string;
}

export interface CharacterOutfit {
  outfit: string;
  outfitColor: string;
  eyewear: string;
  headwear: string;
  prop: string;
  badge: string;
}

export interface CharacterSkills {
  charisma: number;
  humor: number;
  dramatics: number;
  intelligence: number;
  musicality: number;
  stunts: number;
}

export interface CharacterContract {
  preferredGenre: string;
  personalityTrait: string;
  catchphrase: string;
  signatureMove: string;
  voiceTone: string;
  fanbaseDemographic: string;
  perks: string[];
  baseSalaryRate: number; // multiplier for earnings
  stamina: number; // 0-100
  morale: number; // 0-100
}

export interface StarProfile {
  name: string;
  stageTitle: string;
  bio: string;
  appearance: CharacterAppearance;
  outfit: CharacterOutfit;
  skills: CharacterSkills;
  contract: CharacterContract;
}

export interface CharacterProfile {
  id: string;
  profile: StarProfile;
  level: number;
  earnings: number;
  totalBroadcastMinutes: number;
  showsHostedCount: number;
  createdAt: number;
}

export interface GameState {
  language: string;
  money: number;
  roster: CharacterProfile[];
  currentProducer: string;
  theme: 'dark' | 'light';
  parentalControlUnder18: boolean;
}
