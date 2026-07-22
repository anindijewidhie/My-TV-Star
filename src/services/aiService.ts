import { GoogleGenAI, Type } from "@google/genai";
import { StarProfile } from "../types";
import { 
  GENDERS, AVATAR_STYLES, HAIR_STYLES, HAIR_COLORS, SKIN_TONES, 
  EYE_COLORS, EXPRESSIONS, MAKEUP_FACIAL_HAIR, HEIGHTS, OUTFITS, 
  OUTFIT_COLORS, EYEWEAR, HEADWEAR, PROPS, BADGES, SHOW_GENRES, 
  PERSONALITY_TRAITS, CATCHPHRASES, SIGNATURE_MOVES, VOICE_TONES, 
  FANBASE_DEMOGRAPHICS, CONTRACT_PERKS 
} from "../data/characterOptions";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' });

export async function generateStarWithAI(userPrompt?: string): Promise<StarProfile> {
  const prompt = `Generate a complete, highly detailed TV Star character profile for a professional TV Studio broadcast game.
${userPrompt ? `User request preferences: "${userPrompt}".` : ''}
Ensure the character feels unique, charismatic, and memorable. Choose exact values matching these themes:
- Name and Stage Title
- Short Bio
- Gender
- Avatar Style
- Hair Style, Hair Color, Skin Tone, Eye Color, Expression, Makeup / Facial Hair, Height
- Outfit, Outfit Color, Eyewear, Headwear, Prop, Badge
- Skill Ratings (1 to 100 for Charisma, Humor, Dramatics, Intelligence, Musicality, Stunts)
- Preferred Genre, Personality Trait, Catchphrase, Signature Move, Voice Tone, Fanbase Demographic
- Perks (list of 2-3 perks)
- Base Salary Multiplier (e.g. 1.2 to 2.5)`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            stageTitle: { type: Type.STRING },
            bio: { type: Type.STRING },
            gender: { type: Type.STRING },
            avatarStyle: { type: Type.STRING },
            hairStyle: { type: Type.STRING },
            hairColor: { type: Type.STRING },
            skinTone: { type: Type.STRING },
            eyeColor: { type: Type.STRING },
            expression: { type: Type.STRING },
            makeupFacialHair: { type: Type.STRING },
            height: { type: Type.STRING },
            outfit: { type: Type.STRING },
            outfitColor: { type: Type.STRING },
            eyewear: { type: Type.STRING },
            headwear: { type: Type.STRING },
            prop: { type: Type.STRING },
            badge: { type: Type.STRING },
            charisma: { type: Type.NUMBER },
            humor: { type: Type.NUMBER },
            dramatics: { type: Type.NUMBER },
            intelligence: { type: Type.NUMBER },
            musicality: { type: Type.NUMBER },
            stunts: { type: Type.NUMBER },
            preferredGenre: { type: Type.STRING },
            personalityTrait: { type: Type.STRING },
            catchphrase: { type: Type.STRING },
            signatureMove: { type: Type.STRING },
            voiceTone: { type: Type.STRING },
            fanbaseDemographic: { type: Type.STRING },
            perks: { type: Type.ARRAY, items: { type: Type.STRING } },
            baseSalaryRate: { type: Type.NUMBER }
          },
          required: [
            "name", "stageTitle", "bio", "gender", "avatarStyle",
            "hairStyle", "hairColor", "skinTone", "eyeColor", "expression",
            "makeupFacialHair", "height", "outfit", "outfitColor", "eyewear",
            "headwear", "prop", "badge", "charisma", "humor", "dramatics",
            "intelligence", "musicality", "stunts", "preferredGenre",
            "personalityTrait", "catchphrase", "signatureMove", "voiceTone",
            "fanbaseDemographic", "perks", "baseSalaryRate"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      name: data.name || "Alex Vance",
      stageTitle: data.stageTitle || "The Prime Time Prodigy",
      bio: data.bio || "A natural spotlight magnet who knows how to captivate millions.",
      appearance: {
        gender: (GENDERS.includes(data.gender) ? data.gender : GENDERS[0]) as any,
        avatarStyle: (AVATAR_STYLES.includes(data.avatarStyle) ? data.avatarStyle : AVATAR_STYLES[0]) as any,
        hairStyle: data.hairStyle || HAIR_STYLES[0],
        hairColor: data.hairColor || HAIR_COLORS[0],
        skinTone: data.skinTone || SKIN_TONES[0],
        eyeColor: data.eyeColor || EYE_COLORS[0],
        expression: data.expression || EXPRESSIONS[0],
        makeupFacialHair: data.makeupFacialHair || MAKEUP_FACIAL_HAIR[0],
        height: data.height || HEIGHTS[1]
      },
      outfit: {
        outfit: data.outfit || OUTFITS[0],
        outfitColor: data.outfitColor || OUTFIT_COLORS[0],
        eyewear: data.eyewear || EYEWEAR[0],
        headwear: data.headwear || HEADWEAR[0],
        prop: data.prop || PROPS[0],
        badge: data.badge || BADGES[0]
      },
      skills: {
        charisma: data.charisma || 85,
        humor: data.humor || 75,
        dramatics: data.dramatics || 70,
        intelligence: data.intelligence || 80,
        musicality: data.musicality || 65,
        stunts: data.stunts || 50
      },
      contract: {
        preferredGenre: data.preferredGenre || SHOW_GENRES[0],
        personalityTrait: data.personalityTrait || PERSONALITY_TRAITS[0],
        catchphrase: data.catchphrase || CATCHPHRASES[0],
        signatureMove: data.signatureMove || SIGNATURE_MOVES[0],
        voiceTone: data.voiceTone || VOICE_TONES[0],
        fanbaseDemographic: data.fanbaseDemographic || FANBASE_DEMOGRAPHICS[0],
        perks: Array.isArray(data.perks) ? data.perks : [CONTRACT_PERKS[0], CONTRACT_PERKS[1]],
        baseSalaryRate: data.baseSalaryRate || 1.5,
        stamina: 100,
        morale: 100
      }
    };
  } catch (err) {
    console.error("AI Generation error, using rich fallback:", err);
    return getRandomStarFallback();
  }
}

export function getRandomStarFallback(): StarProfile {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const nameFirst = ['Johnny', 'Dexter', 'Blossom', 'Bubbles', 'Buttercup', 'Dee Dee', 'Jack', 'Nigel', 'Courage', 'Ben', 'Mac', 'Grim', 'Mandy', 'Billy', 'Chowder', 'Coop', 'Vesper', 'Chloe', 'Marcus', 'Aria'];
  const nameLast = ['Bravo', 'Genius', 'Townsville', 'Samurai', 'Uno', 'Tennyson', 'Foster', 'Uno', 'Valerie', 'Sterling', 'Nova', 'Fox', 'Monroe', 'Vance'];
  const name = `${pick(nameFirst)} ${pick(nameLast)}`;

  return {
    name,
    stageTitle: pick(['Townsville City Savior', 'The Genius Lab Master', 'The Coolest Bravo Star', 'The Samurai Legend', 'The KND Supreme Agent', 'The Prime Time Queen', 'The Reality Titan']),
    bio: `A legendary 90s/2000s Cartoon Network inspired star known for unstoppable studio charisma, iconic catchphrases, and maximum rating power.`,
    appearance: {
      gender: pick(GENDERS),
      avatarStyle: pick(AVATAR_STYLES),
      hairStyle: pick(HAIR_STYLES),
      hairColor: pick(HAIR_COLORS),
      skinTone: pick(SKIN_TONES),
      eyeColor: pick(EYE_COLORS),
      expression: pick(EXPRESSIONS),
      makeupFacialHair: pick(MAKEUP_FACIAL_HAIR),
      height: pick(HEIGHTS)
    },
    outfit: {
      outfit: pick(OUTFITS),
      outfitColor: pick(OUTFIT_COLORS),
      eyewear: pick(EYEWEAR),
      headwear: pick(HEADWEAR),
      prop: pick(PROPS),
      badge: pick(BADGES)
    },
    skills: {
      charisma: Math.floor(Math.random() * 30 + 70),
      humor: Math.floor(Math.random() * 40 + 60),
      dramatics: Math.floor(Math.random() * 40 + 60),
      intelligence: Math.floor(Math.random() * 30 + 70),
      musicality: Math.floor(Math.random() * 50 + 50),
      stunts: Math.floor(Math.random() * 50 + 40)
    },
    contract: {
      preferredGenre: pick(SHOW_GENRES),
      personalityTrait: pick(PERSONALITY_TRAITS),
      catchphrase: pick(CATCHPHRASES),
      signatureMove: pick(SIGNATURE_MOVES),
      voiceTone: pick(VOICE_TONES),
      fanbaseDemographic: pick(FANBASE_DEMOGRAPHICS),
      perks: [pick(CONTRACT_PERKS), pick(CONTRACT_PERKS)],
      baseSalaryRate: parseFloat((Math.random() * 1.5 + 1).toFixed(2)),
      stamina: 100,
      morale: 100
    }
  };
}

export async function getStylistAdvice(star: StarProfile): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an elite TV Network Hollywood Stylist & Image Consultant. Give a 2-sentence sharp, enthusiastic advice for TV Star ${star.name} ("${star.stageTitle}").
Current Look: ${star.outfit.outfit} (${star.outfit.outfitColor}), ${star.appearance.hairStyle} in ${star.appearance.hairColor}, equipped with ${star.outfit.prop}.
Preferred Show Genre: ${star.contract.preferredGenre}. Personality: ${star.contract.personalityTrait}.
Give specific tips on how to maximize ratings and look legendary!`
    });
    return response.text || "Your look is sharp! Try pairing neon accents with an energetic signature move for prime time peak ratings.";
  } catch {
    return "To maximize prime-time viewer retention, keep your signature prop polished and drop your catchphrase during high-energy show climaxes!";
  }
}

export async function generateLiveTeleprompterScript(star: StarProfile, currentSegment: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are writing a teleprompter script for TV host ${star.name} currently live on air doing a segment: "${currentSegment}" for the show genre: ${star.contract.preferredGenre}.
Personality: ${star.contract.personalityTrait}. Catchphrase: "${star.contract.catchphrase}".
Write 1 sentence of exciting, punchy live TV hosting dialogue including their catchphrase or signature flair.`
    });
    return response.text?.trim() || `"${star.contract.catchphrase} Welcome live to our special segment on ${currentSegment}!"`;
  } catch {
    return `"${star.contract.catchphrase} We are live across all networks, stay right there!"`;
  }
}
