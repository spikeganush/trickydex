import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  PLAYER_NAMES: 'trickydex_player_names',
  GAME_SETTINGS: 'trickydex_game_settings',
  DIFFICULTY_PREFERENCE: 'trickydex_difficulty_preference',
  MAX_DIFFICULTY: 'trickydex_max_difficulty',
  SELECTED_CATEGORIES: 'trickydex_selected_categories',
};

// Save player names to AsyncStorage
export const savePlayerNames = async (playerNames: string[]): Promise<void> => {
  try {
    // Filter out empty player names
    const validPlayerNames = playerNames.filter(name => name.trim() !== '');
    
    // Only save if there are valid names
    if (validPlayerNames.length > 0) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PLAYER_NAMES, 
        JSON.stringify(validPlayerNames)
      );
    }
  } catch (error) {
    console.error('Failed to save player names:', error);
  }
};

// Load player names from AsyncStorage
export const loadPlayerNames = async (): Promise<string[]> => {
  try {
    const savedPlayerNames = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_NAMES);
    return savedPlayerNames ? JSON.parse(savedPlayerNames) : [''];
  } catch (error) {
    console.error('Failed to load player names:', error);
    return [''];
  }
};

// Save game settings to AsyncStorage
export const saveGameSettings = async (
  maxDifficulty: number,
  selectedCategories: string[],
  difficultyPreference?: 'easy' | 'medium' | 'hard'
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.MAX_DIFFICULTY,
      maxDifficulty.toString()
    );
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.SELECTED_CATEGORIES,
      JSON.stringify(selectedCategories)
    );

    if (difficultyPreference) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.DIFFICULTY_PREFERENCE,
        difficultyPreference
      );
    }
  } catch (error) {
    console.error('Failed to save game settings:', error);
  }
};

// Load game settings from AsyncStorage
export const loadGameSettings = async (): Promise<{
  maxDifficulty?: number;
  selectedCategories?: string[];
  difficultyPreference?: 'easy' | 'medium' | 'hard';
}> => {
  try {
    const [maxDifficultyStr, categoriesStr, difficultyPreference] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.MAX_DIFFICULTY),
      AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORIES),
      AsyncStorage.getItem(STORAGE_KEYS.DIFFICULTY_PREFERENCE)
    ]);

    return {
      maxDifficulty: maxDifficultyStr ? parseInt(maxDifficultyStr, 10) : undefined,
      selectedCategories: categoriesStr ? JSON.parse(categoriesStr) : undefined,
      difficultyPreference: (difficultyPreference as 'easy' | 'medium' | 'hard' | null) || undefined
    };
  } catch (error) {
    console.error('Failed to load game settings:', error);
    return {};
  }
};

// Load max difficulty from AsyncStorage
export const loadMaxDifficulty = async (): Promise<number> => {
  try {
    const savedMaxDifficulty = await AsyncStorage.getItem(STORAGE_KEYS.MAX_DIFFICULTY);
    return savedMaxDifficulty ? parseInt(savedMaxDifficulty, 10) : 3;
  } catch (error) {
    console.error('Failed to load max difficulty:', error);
    return 3;
  }
};

// Load selected categories from AsyncStorage
export const loadSelectedCategories = async (): Promise<string[]> => {
  try {
    const savedCategories = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORIES);
    return savedCategories 
      ? JSON.parse(savedCategories) 
      : ['soul_grinds', 'groove_grinds', 'special_grinds', 'topside_grinds'];
  } catch (error) {
    console.error('Failed to load selected categories:', error);
    return ['soul_grinds', 'groove_grinds', 'special_grinds', 'topside_grinds'];
  }
};

// Clear all stored data (for reset functionality)
export const clearStoredData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PLAYER_NAMES,
      STORAGE_KEYS.GAME_SETTINGS,
      STORAGE_KEYS.DIFFICULTY_PREFERENCE,
      STORAGE_KEYS.MAX_DIFFICULTY,
      STORAGE_KEYS.SELECTED_CATEGORIES,
    ]);
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
};
