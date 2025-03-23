import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { 
  initialTricks, 
  getTrickById, 
  TrickCategory, 
  getCompleteRandomTrick,
  Variation,
  Entrance
} from '../../types/trick';
import { GameState, Player } from '../../types/game';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Enhanced game state to include variation and entrance
interface EnhancedGameState extends GameState {
  currentVariation: Variation | null;
  currentEntrance: Entrance | null;
  totalDifficulty: number;
  difficultyPreference: 'easy' | 'medium' | 'hard';
  maxDifficulty: number; // Maximum difficulty level (1-10)
}

export default function GamePlayScreen() {
  const router = useRouter();
  const { players: playersParam, categories: categoriesParam } =
    useLocalSearchParams<{
      players?: string;
      categories?: string;
    }>();
  const letterScale = useSharedValue(1);
  const letterRotate = useSharedValue(0);
  const trickScale = useSharedValue(0.9);

  // Parse selected categories or use all categories as default
  const selectedCategories: TrickCategory[] = categoriesParam
    ? JSON.parse(categoriesParam)
    : [
        'soul_grinds',
        'groove_grinds',
        'special_grinds',
        'air_tricks',
        'spins',
        'flips',
      ];

  // Animation for trick reveal
  useEffect(() => {
    trickScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const animateLetter = () => {
    letterScale.value = withSpring(1.5, { damping: 10, stiffness: 100 }, () => {
      letterScale.value = withSpring(1);
    });
    letterRotate.value = withTiming(360, { duration: 500 }, () => {
      letterRotate.value = 0;
    });
  };

  const [gameState, setGameState] = useState<EnhancedGameState>(() => {
    const initialPlayers = playersParam
      ? JSON.parse(playersParam).map((name: string, index: number) => ({
          id: String(index + 1),
          name,
          letters: [],
        }))
      : [];

    // Get a random trick for the first round from the selected categories
    const { trick, variation, entrance, totalDifficulty } = getCompleteRandomTrick(
      selectedCategories,
      'medium',
      true,
      true,
      7
    );

    return {
      players: initialPlayers,
      currentPlayerIndex: 0,
      currentTrickId: trick.id,
      currentVariation: variation,
      currentEntrance: entrance,
      totalDifficulty: totalDifficulty,
      usedTrickIds: [trick.id], // Track used tricks
      roundNumber: 1,
      allPlayersAttempted: false, // Track if all players have attempted the current trick
      trickHistory: [], // Initialize empty trick history
      difficultyPreference: 'easy', // Default difficulty preference
      maxDifficulty: 7, // Default max difficulty (1-10)
    };
  });

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentTrick = gameState.currentTrickId
    ? getTrickById(gameState.currentTrickId)
    : getCompleteRandomTrick(selectedCategories).trick;

  const animatedTrickStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: trickScale.value }],
    };
  });

  const animatedLetterStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: letterScale.value },
        { rotateZ: `${letterRotate.value}deg` },
      ],
    };
  });

  // Function to adjust difficulty based on player performance
  const adjustDifficultyBasedOnPerformance = (success: boolean): 'easy' | 'medium' | 'hard' => {
    const { difficultyPreference } = gameState;
    
    // If player succeeded, potentially increase difficulty
    if (success) {
      // Check recent history to see if player is doing well
      const recentHistory = gameState.trickHistory.slice(-3);
      const successCount = recentHistory.filter(attempt => 
        attempt.playerName === currentPlayer.name && attempt.success
      ).length;
      
      // If player has succeeded in most recent attempts, increase difficulty
      if (successCount >= 2) {
        if (difficultyPreference === 'easy') return 'medium';
        if (difficultyPreference === 'medium') return 'hard';
      }
    } 
    // If player failed, potentially decrease difficulty
    else {
      // Check recent history to see if player is struggling
      const recentHistory = gameState.trickHistory.slice(-3);
      const failCount = recentHistory.filter(attempt => 
        attempt.playerName === currentPlayer.name && !attempt.success
      ).length;
      
      // If player has failed in most recent attempts, decrease difficulty
      if (failCount >= 2) {
        if (difficultyPreference === 'hard') return 'medium';
        if (difficultyPreference === 'medium') return 'easy';
      }
    }
    
    // Default: keep current difficulty
    return difficultyPreference;
  };

  const getNewTrick = (difficultyPreference: 'easy' | 'medium' | 'hard') => {
    // Get a trick that hasn't been used in this game yet and is from selected categories
    const unusedTricks = initialTricks.filter(
      (trick) =>
        !gameState.usedTrickIds.includes(trick.id) &&
        selectedCategories.includes(trick.category as TrickCategory) &&
        trick.difficulty <= gameState.maxDifficulty // Filter by max difficulty
    );

    // If we've used all tricks from selected categories, reset the used tricks list
    if (unusedTricks.length === 0) {
      return getCompleteRandomTrick(
        selectedCategories,
        difficultyPreference,
        true,
        true,
        gameState.maxDifficulty
      );
    }

    const randomIndex = Math.floor(Math.random() * unusedTricks.length);
    const selectedTrick = unusedTricks[randomIndex];
    
    // Get complete trick with variation and entrance based on the selected categories
    // We're still using the same categories, but we want to ensure the selected trick is used
    const result = getCompleteRandomTrick(
      [selectedTrick.category as TrickCategory],
      difficultyPreference,
      true,
      true,
      gameState.maxDifficulty
    );
    
    // If by chance we get a different trick than the one we selected (which is possible since
    // getCompleteRandomTrick selects randomly from the category), force our selected trick
    if (result.trick.id !== selectedTrick.id) {
      // Calculate total difficulty while respecting max difficulty
      let totalDifficulty = selectedTrick.difficulty;
      let variation = null;
      let entrance = null;
      
      // Try to add a variation if it doesn't exceed max difficulty
      if (result.variation && (totalDifficulty + result.variation.difficulty) <= gameState.maxDifficulty) {
        variation = result.variation;
        totalDifficulty += variation.difficulty;
      }
      
      // Try to add an entrance if it doesn't exceed max difficulty
      if (result.entrance && (totalDifficulty + result.entrance.difficulty) <= gameState.maxDifficulty) {
        entrance = result.entrance;
        totalDifficulty += entrance.difficulty;
      }
      
      // Cap the total difficulty at 10 if it exceeds it
      totalDifficulty = Math.min(10, totalDifficulty);
      
      return {
        trick: selectedTrick,
        variation,
        entrance,
        totalDifficulty
      };
    }
    
    return result;
  };

  // Function to adjust max difficulty
  const adjustMaxDifficulty = (amount: number) => {
    const newMaxDifficulty = Math.min(10, Math.max(1, gameState.maxDifficulty + amount));
    setGameState({
      ...gameState,
      maxDifficulty: newMaxDifficulty
    });
  };

  const handleAttempt = async (success: boolean) => {
    if (!success) {
      animateLetter();
    }

    const updatedPlayers = [...gameState.players];
    const player = updatedPlayers[gameState.currentPlayerIndex];

    // Record this attempt in the trick history
    const trickAttempt = {
      trickId: gameState.currentTrickId,
      success,
      playerName: player.name,
      roundNumber: gameState.roundNumber,
    };

    const updatedTrickHistory = [...gameState.trickHistory, trickAttempt];

    // Adjust difficulty based on player performance
    const newDifficultyPreference = adjustDifficultyBasedOnPerformance(success);

    if (!success) {
      const nextLetter = 'BLADE'[player.letters.length];
      player.letters.push(nextLetter);

      // Check if player is eliminated
      if (player.letters.length === 5) {
        // For single player mode, just end the game
        if (updatedPlayers.length === 1) {
          router.replace({
            pathname: '/(game)/game-over',
            params: {
              playersData: JSON.stringify(updatedPlayers),
              trickHistory: JSON.stringify(updatedTrickHistory),
            },
          });
          return;
        }

        // If only one player remains, end the game
        const activePlayers = updatedPlayers.filter(
          (p) => p.letters.length < 5
        );
        if (activePlayers.length <= 1) {
          router.replace({
            pathname: '/(game)/game-over',
            params: {
              playersData: JSON.stringify(updatedPlayers),
              trickHistory: JSON.stringify(updatedTrickHistory),
            },
          });
          return;
        }
      }
    }

    // For single player mode, don't change player index
    if (updatedPlayers.length === 1) {
      // Just get a new trick for the next round
      const newTrickComplete = getNewTrick(newDifficultyPreference);

      // Animate the new trick
      trickScale.value = 0.9;
      trickScale.value = withSpring(1, { damping: 10, stiffness: 100 });

      setGameState({
        players: updatedPlayers,
        currentPlayerIndex: 0,
        currentTrickId: newTrickComplete.trick.id,
        currentVariation: newTrickComplete.variation,
        currentEntrance: newTrickComplete.entrance,
        totalDifficulty: newTrickComplete.totalDifficulty,
        usedTrickIds: [...gameState.usedTrickIds, newTrickComplete.trick.id],
        roundNumber: gameState.roundNumber + 1,
        allPlayersAttempted: true,
        trickHistory: updatedTrickHistory,
        difficultyPreference: newDifficultyPreference,
        maxDifficulty: gameState.maxDifficulty,
      });
      return;
    }

    // Move to next player (skip eliminated players)
    let nextPlayerIndex =
      (gameState.currentPlayerIndex + 1) % gameState.players.length;
    while (updatedPlayers[nextPlayerIndex].letters.length === 5) {
      nextPlayerIndex = (nextPlayerIndex + 1) % gameState.players.length;
    }

    // Check if we've completed a full round (all players have attempted the current trick)
    const isLastPlayerInRound =
      nextPlayerIndex === 0 ||
      (nextPlayerIndex < gameState.currentPlayerIndex &&
        updatedPlayers
          .slice(0, gameState.currentPlayerIndex + 1)
          .some((p) => p.letters.length === 5));

    // If all players have attempted the current trick, select a new trick for the next round
    let newTrickId = gameState.currentTrickId;
    let newVariation = gameState.currentVariation;
    let newEntrance = gameState.currentEntrance;
    let newTotalDifficulty = gameState.totalDifficulty;
    let usedTrickIds = [...gameState.usedTrickIds];
    let roundNumber = gameState.roundNumber;

    if (isLastPlayerInRound) {
      // Select a new trick for the next round
      const newTrickComplete = getNewTrick(newDifficultyPreference);
      newTrickId = newTrickComplete.trick.id;
      newVariation = newTrickComplete.variation;
      newEntrance = newTrickComplete.entrance;
      newTotalDifficulty = newTrickComplete.totalDifficulty;
      usedTrickIds = [...usedTrickIds, newTrickComplete.trick.id];
      roundNumber += 1;

      // Animate the new trick
      trickScale.value = 0.9;
      trickScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    }

    setGameState({
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      currentTrickId: newTrickId,
      currentVariation: newVariation,
      currentEntrance: newEntrance,
      totalDifficulty: newTotalDifficulty,
      usedTrickIds: usedTrickIds,
      roundNumber: roundNumber,
      allPlayersAttempted: isLastPlayerInRound,
      trickHistory: updatedTrickHistory,
      difficultyPreference: newDifficultyPreference,
      maxDifficulty: gameState.maxDifficulty,
    });
  };

  if (!currentPlayer || !currentTrick) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game data not available</Text>
      </View>
    );
  }

  // Determine if we're in training mode (single player)
  const isTrainingMode = gameState.players.length === 1;

  // Format the trick name with variation and entrance
  const formattedTrickName = () => {
    let name = '';
    
    // Add entrance if available
    if (gameState.currentEntrance) {
      name += `${gameState.currentEntrance.name} `;
    }
    
    // Add trick name
    name += currentTrick.name;
    
    // Add variation if available
    if (gameState.currentVariation) {
      name += ` (${gameState.currentVariation.name})`;
    }
    
    return name;
  };

  return (
    <LinearGradient
      colors={['#2E3338', '#393E44']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.content}>
        <View style={styles.difficultyControls}>
          <Text style={styles.difficultyLabel}>Max Difficulty: {gameState.maxDifficulty}/10</Text>
          <View style={styles.difficultyButtons}>
            <TouchableOpacity 
              style={[styles.difficultyButton, gameState.maxDifficulty <= 1 && styles.disabledButton]} 
              onPress={() => adjustMaxDifficulty(-1)}
              disabled={gameState.maxDifficulty <= 1}
            >
              <Text style={styles.difficultyButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.difficultyButton, gameState.maxDifficulty >= 10 && styles.disabledButton]} 
              onPress={() => adjustMaxDifficulty(1)}
              disabled={gameState.maxDifficulty >= 10}
            >
              <Text style={styles.difficultyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Current Player</Text>
          <View style={styles.playerCard}>
            <Text style={styles.playerName}>{currentPlayer.name}</Text>
            <Animated.Text style={[styles.letters, animatedLetterStyle]}>
              {currentPlayer.letters.join('')}
            </Animated.Text>
          </View>
        </View>

        <Animated.View style={[styles.trickCard, animatedTrickStyle]}>
          <View style={styles.trickHeader}>
            <Text style={styles.trickName}>{formattedTrickName()}</Text>
            <Text style={styles.trickCategory}>
              {currentTrick.category.replace('_', ' ')}
            </Text>
          </View>
          <Text style={styles.trickDescription}>
            {currentTrick.description}
          </Text>
          <View style={styles.trickMeta}>
            <Text style={styles.difficultyText}>
              Base Difficulty: {currentTrick.difficulty}/10
            </Text>
            {gameState.totalDifficulty !== currentTrick.difficulty && (
              <Text style={styles.difficultyText}>
                Total Difficulty: {gameState.totalDifficulty}/10
              </Text>
            )}
            <Text style={styles.difficultyText}>
              Mode: {gameState.difficultyPreference.charAt(0).toUpperCase() + gameState.difficultyPreference.slice(1)}
            </Text>
            <Text style={styles.difficultyText}>
              Max Difficulty: {gameState.maxDifficulty}/10
            </Text>
          </View>
        </Animated.View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={() => handleAttempt(true)}
          >
            <Ionicons name='checkmark' size={24} color='#FFFFFF' />
            <Text style={styles.buttonText}>Landed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.failButton]}
            onPress={() => handleAttempt(false)}
          >
            <Ionicons name='close' size={24} color='#FFFFFF' />
            <Text style={styles.buttonText}>Failed</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Players Status</Text>
          {gameState.players.map((player) => (
            <View
              key={player.id}
              style={[
                styles.playerStatus,
                player.id === currentPlayer.id && styles.activePlayer,
              ]}
            >
              <Text style={styles.statusName}>{player.name}</Text>
              <Text style={styles.statusLetters}>
                {player.letters.length > 0 ? player.letters.join('') : 'Safe'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Attempts</Text>
          {[...gameState.trickHistory].reverse().map((attempt, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyTrick}>
                  {getTrickById(attempt.trickId)?.name}
                </Text>
                <Text style={styles.historyPlayer}>
                  by {attempt.playerName}
                </Text>
              </View>
              <Text
                style={[
                  styles.historyResult,
                  attempt.success ? styles.historySuccess : styles.historyFail,
                ]}
              >
                {attempt.success ? 'Landed' : 'Failed'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  playerCard: {
    backgroundColor: '#4A5056',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  letters: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  trickCard: {
    backgroundColor: '#4A5056',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  trickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trickName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  trickCategory: {
    fontSize: 14,
    color: '#B8BDC2',
    textTransform: 'capitalize',
    marginLeft: 8,
  },
  trickDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
  },
  trickMeta: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  difficultyText: {
    fontSize: 14,
    color: '#B8BDC2',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  failButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  playersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  playerStatus: {
    backgroundColor: '#4A5056',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activePlayer: {
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  statusName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  statusLetters: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  historySection: {
    marginBottom: 24,
  },
  historyItem: {
    backgroundColor: '#4A5056',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flex: 1,
  },
  historyTrick: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  historyPlayer: {
    fontSize: 14,
    color: '#B8BDC2',
  },
  historyResult: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  historySuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    color: '#4CAF50',
  },
  historyFail: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    color: '#FF6B6B',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 24,
  },
  difficultyControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  difficultyLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  difficultyButtons: {
    flexDirection: 'row',
  },
  difficultyButton: {
    backgroundColor: '#444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  difficultyButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
