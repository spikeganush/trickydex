import { Audio } from 'expo-av';

type SoundType = 
  | 'success' 
  | 'fail' 
  | 'gameOver' 
  | 'click' 
  | 'pokedexOpen' 
  | 'pokedexClose' 
  | 'pokedexScroll' 
  | 'pokedexSelect'
  | 'trickFound'
  | 'trickNotFound'
  | 'buttonPress';

// Cache for loaded sounds to improve performance
const soundCache = new Map<SoundType, Audio.Sound>();

export const preloadSounds = async () => {
  const sounds: SoundType[] = [
    'success', 'fail', 'gameOver', 'click', 
    'pokedexOpen', 'pokedexClose', 'pokedexScroll', 'pokedexSelect',
    'trickFound', 'trickNotFound', 'buttonPress'
  ];

  for (const sound of sounds) {
    try {
      const soundFile = getSoundFile(sound);
      const { sound: soundObject } = await Audio.Sound.createAsync(soundFile);
      soundCache.set(sound, soundObject);
    } catch (error) {
      console.error(`Failed to preload sound: ${sound}`, error);
    }
  }
};

const getSoundFile = (sound: SoundType) => {
  switch (sound) {
    case 'success':
      return require('../assets/sounds/success.mp3');
    case 'fail':
      return require('../assets/sounds/fail.mp3');
    case 'gameOver':
      return require('../assets/sounds/game-over.mp3');
    case 'click':
      return require('../assets/sounds/click.mp3');
    case 'pokedexOpen':
      return require('../assets/sounds/pokedex-open.mp3');
    case 'pokedexClose':
      return require('../assets/sounds/pokedex-close.mp3');
    case 'pokedexScroll':
      return require('../assets/sounds/pokedex-scroll.mp3');
    case 'pokedexSelect':
      return require('../assets/sounds/pokedex-select.mp3');
    case 'trickFound':
      return require('../assets/sounds/trick-found.mp3');
    case 'trickNotFound':
      return require('../assets/sounds/trick-not-found.mp3');
    case 'buttonPress':
      return require('../assets/sounds/button-press.mp3');
  }
};

export const playSound = async (sound: SoundType) => {
  try {
    // Try to get from cache first
    let soundObject = soundCache.get(sound);
    
    if (!soundObject) {
      // If not in cache, load it
      const soundFile = getSoundFile(sound);
      try {
        const { sound: newSoundObject } = await Audio.Sound.createAsync(soundFile);
        soundObject = newSoundObject;
        
        // Store in cache for future use
        soundCache.set(sound, soundObject);
      } catch (error) {
        console.warn(`Sound file for "${sound}" might be empty or corrupted. Skipping playback.`);
        return;
      }
    } else {
      // Reset sound to beginning if it was already played
      await soundObject.setPositionAsync(0);
    }
    
    await soundObject.playAsync();
  } catch (error) {
    console.error(`Failed to play sound: ${sound}`, error);
  }
};

export const unloadSounds = async () => {
  for (const [_, sound] of soundCache.entries()) {
    await sound.unloadAsync();
  }
  soundCache.clear();
};
