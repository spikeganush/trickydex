import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  LayoutChangeEvent,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TrickCategory, trickCategories } from '../../types/trick';
import { 
  savePlayerNames, 
  loadPlayerNames, 
  saveGameSettings, 
  loadMaxDifficulty, 
  loadSelectedCategories,
  loadActiveGame,
  clearActiveGame,
  saveActiveGame
} from '../../utils/storage';

export default function GameScreen() {
  const [players, setPlayers] = useState<string[]>(['']); // Start with 1 empty player field
  const [touchedFields, setTouchedFields] = useState<boolean[]>([false]); // Track which fields have been touched
  const [maxDifficulty, setMaxDifficulty] = useState<number>(3); // Default max difficulty (1-30)
  const [selectedCategories, setSelectedCategories] = useState<TrickCategory[]>(
    [
      'soul_grinds',
      'groove_grinds',
      'special_grinds',
      'topside_grinds',
    ]
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sliderWidth, setSliderWidth] = useState<number>(200); // Default width
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false); // Track if there's a saved game
  const [savedGameDate, setSavedGameDate] = useState<string>(''); // Track when the game was saved
  const router = useRouter();

  // Create custom slider with PanResponder
  const sliderRef = useRef(null);
  const initialTouchX = useRef(0);
  const initialValue = useRef(0);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt: GestureResponderEvent) => {
      // Store initial touch position and current value
      initialTouchX.current = evt.nativeEvent.pageX;
      initialValue.current = maxDifficulty;
    },
    onPanResponderMove: (evt: GestureResponderEvent) => {
      if (sliderWidth > 0) {
        // Calculate movement based on difference from initial touch
        const touchOffset = evt.nativeEvent.pageX - initialTouchX.current;
        const valueChange = Math.round((touchOffset / sliderWidth) * 30);
        const newValue = Math.max(1, Math.min(30, initialValue.current + valueChange));
        setMaxDifficulty(newValue);
      }
    },
  });

  // Load saved player names, game settings, and check for saved game on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load player names
        const savedPlayers = await loadPlayerNames();
        setPlayers(savedPlayers);
        setTouchedFields(Array(savedPlayers.length).fill(false));
        
        // Check for saved game first to prioritize those settings if available
        const activeGame = await loadActiveGame();
        if (activeGame) {
          setHasSavedGame(true);
          // Format the date for display
          const savedDate = new Date(activeGame.timestamp);
          setSavedGameDate(savedDate.toLocaleString());
          
          // If we have a saved game, use its categories as the selected categories
          // This ensures the UI shows the same categories that were used in the saved game
          if (activeGame.gameState.selectedCategories && 
              activeGame.gameState.selectedCategories.length > 0) {
            console.log('Restoring categories from saved game:', activeGame.gameState.selectedCategories);
            setSelectedCategories(activeGame.gameState.selectedCategories as TrickCategory[]);
          }
          
          // Also restore the max difficulty from the saved game
          if (activeGame.gameState.maxDifficulty) {
            setMaxDifficulty(activeGame.gameState.maxDifficulty);
          }
          
          // No need to continue loading other settings since we've got them from the saved game
          setIsLoading(false);
          return;
        } else {
          setHasSavedGame(false);
        }
        
        // If no saved game, load settings from regular storage
        const savedMaxDifficulty = await loadMaxDifficulty();
        setMaxDifficulty(savedMaxDifficulty);
        
        // Load selected categories
        const savedCategories = await loadSelectedCategories() as TrickCategory[];
        if (savedCategories && savedCategories.length > 0) {
          console.log('Restoring categories from settings:', savedCategories);
          setSelectedCategories(savedCategories);
        }
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
          resumeGame: 'false',
        },
      });
    } else {
      Alert.alert(
        'Player Required',
        'Please add at least 1 player to start the game'
      );
    }
  };
  
  const handleResumeGame = async () => {
    try {
      // Load the saved game first to extract necessary parameters
      const savedGame = await loadActiveGame();
      if (savedGame) {
        // Update the saved game with the current category selection and difficulty
        // This ensures that if the user modified the settings, those changes are saved
        const updatedGameState = {
          ...savedGame.gameState,
          selectedCategories: selectedCategories,
          maxDifficulty: maxDifficulty
        };
        
        // Save the updated game state before resuming
        await saveActiveGame(updatedGameState);
        console.log('Updated saved game with current categories:', selectedCategories);
        
        // Navigate to the game screen with resume flag and necessary configuration
        router.push({
          pathname: '/(game)/play',
          params: {
            resumeGame: 'true',
            // Pass the UPDATED configuration
            maxDifficulty: maxDifficulty.toString(),
            categories: JSON.stringify(selectedCategories),
            // Original players list in case we need it
            players: JSON.stringify(savedGame.gameState.players.map(p => p.name))
          },
        });
      } else {
        // If no saved game is found (unlikely but possible), show an error
        Alert.alert(
          "Error",
          "Could not find a saved game to resume. Please start a new game."
        );
        setHasSavedGame(false);
      }
    } catch (error) {
      console.error('Error resuming game:', error);
      Alert.alert(
        "Error",
        "There was an error resuming your game. Please try again or start a new game."
      );
    }
  };

  const handleClearSavedGame = () => {
    Alert.alert(
      "Clear Saved Game",
      "Are you sure you want to delete your saved game? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            await clearActiveGame();
            setHasSavedGame(false);
            setSavedGameDate('');
          },
          style: "destructive" 
        }
      ]
    );
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
        
        {/* Resume Game Button - only shown if a saved game exists */}
        {hasSavedGame && (
          <View style={styles.resumeContainer}>
            <Text style={styles.savedGameText}>
              You have a saved game from {savedGameDate}
            </Text>
            <View style={styles.resumeButtonRow}>
              <Pressable
                style={[styles.resumeButton, styles.primaryButton]}
                onPress={handleResumeGame}
              >
                <Ionicons name="play-circle" size={18} color="#fff" />
                <Text style={styles.resumeButtonText}>Resume Game</Text>
              </Pressable>
              <Pressable
                style={[styles.resumeButton, styles.secondaryButton]}
                onPress={handleClearSavedGame}
              >
                <Ionicons name="trash-bin" size={18} color="#fff" />
                <Text style={styles.resumeButtonText}>Delete Save</Text>
              </Pressable>
            </View>
          </View>
        )}

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
              onPress={() => setMaxDifficulty(Math.max(1, maxDifficulty - 1))}
            >
              <Ionicons name="remove" size={24} color="#FFFFFF" />
            </Pressable>
            <View 
              style={styles.sliderTrackContainer}
              onLayout={(event: LayoutChangeEvent) => {
                setSliderWidth(event.nativeEvent.layout.width);
              }}
              ref={sliderRef}
              {...panResponder.panHandlers}
            >
              <View style={styles.slider}>
                <View
                  style={[
                    styles.sliderTrack,
                    { width: `${(maxDifficulty / 30) * 100}%` },
                  ]}
                />
                <View style={[
                  styles.sliderThumb,
                  { left: `${(maxDifficulty / 30) * 100}%`, marginLeft: -12 }
                ]} />
              </View>
            </View>
            <Pressable
              style={styles.sliderButton}
              onPress={() => setMaxDifficulty(Math.min(30, maxDifficulty + 1))}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          <Pressable 
            style={[styles.historyButton, { marginBottom: 8 }]}
            onPress={() => router.push('/(game)/history')}
          >
            <Ionicons name="time-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Game History</Text>
          </Pressable>
          <Pressable 
            style={styles.historyButton}
            onPress={() => router.push('/(game)/statistics')}
          >
            <Ionicons name="stats-chart" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Statistics</Text>
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
  sliderTrackContainer: {
    flex: 1,
    paddingVertical: 15, // Increase touch target area
    marginHorizontal: 12,
  },
  slider: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  sliderTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: -7,
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
  // Resume game styles
  resumeContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  savedGameText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  resumeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  secondaryButton: {
    backgroundColor: '#E24A4A',
  },
  resumeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
