import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TrickCategory, trickCategories } from '../../types/trick';
import { 
  savePlayerNames, 
  loadPlayerNames, 
  saveGameSettings, 
  loadMaxDifficulty, 
  loadSelectedCategories 
} from '../../utils/storage';

export default function GameScreen() {
  const [players, setPlayers] = useState<string[]>(['']); // Start with 1 empty player field
  const [touchedFields, setTouchedFields] = useState<boolean[]>([false]); // Track which fields have been touched
  const [maxDifficulty, setMaxDifficulty] = useState<number>(3); // Default max difficulty (1-10)
  const [selectedCategories, setSelectedCategories] = useState<TrickCategory[]>(
    [
      'soul_grinds',
      'groove_grinds',
      'special_grinds',
      'topside_grinds',
    ]
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load saved player names and game settings on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load player names
        const savedPlayers = await loadPlayerNames();
        setPlayers(savedPlayers);
        setTouchedFields(Array(savedPlayers.length).fill(false));
        
        // Load max difficulty
        const savedMaxDifficulty = await loadMaxDifficulty();
        setMaxDifficulty(savedMaxDifficulty);
        
        // Load selected categories
        const savedCategories = await loadSelectedCategories() as TrickCategory[];
        setSelectedCategories(savedCategories);
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedData();
  }, []);

  // Save game settings when they change
  useEffect(() => {
    if (!isLoading) {
      saveGameSettings(maxDifficulty, selectedCategories);
    }
  }, [maxDifficulty, selectedCategories, isLoading]);

  const addPlayer = async () => {
    const newPlayers = [...players, ''];
    setPlayers(newPlayers);
    setTouchedFields((prev) => [...prev, false]); // Add a new untouched field
    savePlayerNames(newPlayers);
  };

  const removePlayer = async (index: number) => {
    if (players.length > 1) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
      setTouchedFields((prev) => prev.filter((_, i) => i !== index)); // Remove the corresponding touched state
      savePlayerNames(newPlayers);
    } else {
      Alert.alert('Minimum Players', 'You need at least 1 player for BLADE');
    }
  };

  const handlePlayerChange = (text: string, index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = text;
    setPlayers(newPlayers);
    
    // Mark this field as touched
    if (!touchedFields[index]) {
      const newTouchedFields = [...touchedFields];
      newTouchedFields[index] = true;
      setTouchedFields(newTouchedFields);
    }
    
    // Save player names after a short delay to avoid excessive writes
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        savePlayerNames(newPlayers);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const toggleCategory = (category: TrickCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        if (prev.length === 1) {
          Alert.alert(
            'Minimum Categories',
            'You need at least 1 trick category for BLADE'
          );
          return prev;
        }
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleStartGame = () => {
    const validPlayers = players.filter((p) => p.trim() !== '');
    if (validPlayers.length >= 1) {
      // Save the final player names before starting the game
      savePlayerNames(validPlayers);
      
      // For parameterized navigation, router.push is still the best approach
      router.push({
        pathname: '/(game)/play',
        params: {
          players: JSON.stringify(validPlayers),
          categories: JSON.stringify(selectedCategories),
          maxDifficulty: maxDifficulty.toString(),
        },
      });
    } else {
      Alert.alert(
        'Player Required',
        'Please add at least 1 player to start the game'
      );
    }
  };

  const validPlayers = players.filter((p) => p.trim() !== '');
  const isValid = validPlayers.length >= 1;

  return (
    <LinearGradient
      colors={['#2E3338', '#393E44']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>BLADE Game</Text>
          <Text style={styles.subtitle}>
            Each player attempts the same trick. If you fail, you get a letter
            (B-L-A-D-E). Spell BLADE and you're out!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Players</Text>
          {players.map((player, index) => (
            <View key={index} style={styles.playerRow}>
              <TextInput
                style={[
                  styles.input,
                  touchedFields[index] && player.trim() === '' && styles.inputError,
                ]}
                placeholder={`Player ${index + 1}`}
                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                value={player}
                onChangeText={(text) => handlePlayerChange(text, index)}
              />
              <Pressable
                style={styles.iconButton}
                onPress={() => removePlayer(index)}
              >
                <Ionicons name='close-circle' size={24} color='#FF4545' />
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.addButton} onPress={addPlayer}>
            <Ionicons name='add-circle' size={20} color='#FFFFFF' />
            <Text style={styles.buttonText}>Add Player</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trick Categories</Text>
          <View style={styles.categoryGrid}>
            {(Object.keys(trickCategories) as TrickCategory[]).map(
              (category) => (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategories.includes(category) &&
                      styles.categorySelected,
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(category) &&
                        styles.categoryTextSelected,
                    ]}
                  >
                    {trickCategories[category]}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Rules</Text>
          <View style={styles.rulesList}>
            {[
              'All players attempt the same trick each round',
              'Failing a trick earns you a letter (B-L-A-D-E)',
              "When you spell BLADE, you're eliminated",
              'Last player standing wins!',
            ].map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Ionicons name='checkmark-circle' size={18} color='#4CAF50' />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Settings</Text>
          <Text style={styles.settingLabel}>Max Difficulty: {maxDifficulty}</Text>
          <View style={styles.sliderContainer}>
            <Pressable
              style={styles.sliderButton}
              onPress={() => setMaxDifficulty(Math.max(1, maxDifficulty - 3))}
            >
              <Ionicons name="remove" size={24} color="#FFFFFF" />
            </Pressable>
            <View style={styles.slider}>
              <View
                style={[
                  styles.sliderTrack,
                  { width: `${(maxDifficulty / 30) * 100}%` },
                ]}
              />
            </View>
            <Pressable
              style={styles.sliderButton}
              onPress={() => setMaxDifficulty(Math.min(30, maxDifficulty + 3))}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          <Pressable 
            style={styles.historyButton}
            onPress={() => router.push('/(game)/history')}
          >
            <Ionicons name="time-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Game History</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.startButton, !isValid && styles.startButtonDisabled]}
          onPress={handleStartGame}
          disabled={!isValid}
        >
          <Ionicons name='play-circle' size={24} color='#FFFFFF' />
          <Text style={styles.startButtonText}>Start Game</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'Roboto_500Medium',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontFamily: 'Roboto_400Regular',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF4545',
  },
  iconButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Roboto_500Medium',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    width: '48%',
  },
  categorySelected: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
  },
  categoryTextSelected: {
    fontFamily: 'Roboto_700Bold',
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Roboto_400Regular',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sliderButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  slider: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
  },
});
