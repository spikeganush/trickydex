import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { initialTricks, getTrickById, TrickCategory } from '../../types/trick';
import { GameState, Player } from '../../types/game';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { playSound } from '../../utils/sounds';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const getRandomTrickFromCategories = (categories: TrickCategory[]) => {
  // Filter tricks by the selected categories
  const filteredTricks = initialTricks.filter(trick => 
    categories.includes(trick.category as TrickCategory)
  );
  
  // If no tricks match the categories, return a random trick from all tricks
  if (filteredTricks.length === 0) {
    const randomIndex = Math.floor(Math.random() * initialTricks.length);
    return initialTricks[randomIndex];
  }
  
  const randomIndex = Math.floor(Math.random() * filteredTricks.length);
  return filteredTricks[randomIndex];
};

export default function GamePlayScreen() {
  const router = useRouter();
  const { players: playersParam, categories: categoriesParam } = useLocalSearchParams<{ 
    players?: string,
    categories?: string 
  }>();
  const letterScale = useSharedValue(1);
  const letterRotate = useSharedValue(0);
  const trickScale = useSharedValue(0.9);

  // Parse selected categories or use all categories as default
  const selectedCategories: TrickCategory[] = categoriesParam 
    ? JSON.parse(categoriesParam) 
    : ['soul_grinds', 'groove_grinds', 'special_grinds', 'air_tricks', 'spins', 'flips'];

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

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialPlayers = playersParam 
      ? JSON.parse(playersParam).map((name: string, index: number) => ({
          id: String(index + 1),
          name,
          letters: []
        })) 
      : [];
    
    // Select a random trick for the first round from the selected categories
    const firstTrick = getRandomTrickFromCategories(selectedCategories);
    
    return {
      players: initialPlayers,
      currentPlayerIndex: 0,
      currentTrickId: firstTrick.id,
      usedTrickIds: [firstTrick.id], // Track used tricks
      roundNumber: 1,
      allPlayersAttempted: false, // Track if all players have attempted the current trick
      trickHistory: [] // Initialize empty trick history
    };
  });

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentTrick = gameState.currentTrickId
    ? getTrickById(gameState.currentTrickId)
    : getRandomTrickFromCategories(selectedCategories);

  const animatedTrickStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: trickScale.value }]
    };
  });

  const animatedLetterStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: letterScale.value },
        { rotateZ: `${letterRotate.value}deg` }
      ]
    };
  });

  const getNewTrick = () => {
    // Get a trick that hasn't been used in this game yet and is from selected categories
    const unusedTricks = initialTricks.filter(
      trick => !gameState.usedTrickIds.includes(trick.id) && 
               selectedCategories.includes(trick.category as TrickCategory)
    );
    
    // If we've used all tricks from selected categories, reset the used tricks list
    if (unusedTricks.length === 0) {
      return getRandomTrickFromCategories(selectedCategories);
    }
    
    const randomIndex = Math.floor(Math.random() * unusedTricks.length);
    return unusedTricks[randomIndex];
  };

  const handleAttempt = async (success: boolean) => {
    if (success) {
      await playSound('success');
    } else {
      await playSound('fail');
      animateLetter();
    }

    const updatedPlayers = [...gameState.players];
    const player = updatedPlayers[gameState.currentPlayerIndex];
    
    // Record this attempt in the trick history
    const trickAttempt = {
      trickId: gameState.currentTrickId,
      success,
      playerName: player.name,
      roundNumber: gameState.roundNumber
    };
    
    const updatedTrickHistory = [...gameState.trickHistory, trickAttempt];

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
              trickHistory: JSON.stringify(updatedTrickHistory)
            }
          });
          return;
        }
        
        // If only one player remains, end the game
        const activePlayers = updatedPlayers.filter(p => p.letters.length < 5);
        if (activePlayers.length <= 1) {
          router.replace({
            pathname: '/(game)/game-over',
            params: { 
              playersData: JSON.stringify(updatedPlayers),
              trickHistory: JSON.stringify(updatedTrickHistory)
            }
          });
          return;
        }
      }
    }

    // For single player mode, don't change player index
    if (updatedPlayers.length === 1) {
      // Just get a new trick for the next round
      const newTrick = getNewTrick();
      
      // Animate the new trick
      trickScale.value = 0.9;
      trickScale.value = withSpring(1, { damping: 10, stiffness: 100 });
      
      // Play sound for new round
      await playSound('pokedexOpen');
      
      setGameState({
        players: updatedPlayers,
        currentPlayerIndex: 0,
        currentTrickId: newTrick.id,
        usedTrickIds: [...gameState.usedTrickIds, newTrick.id],
        roundNumber: gameState.roundNumber + 1,
        allPlayersAttempted: true,
        trickHistory: updatedTrickHistory
      });
      return;
    }

    // Move to next player (skip eliminated players)
    let nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    while (updatedPlayers[nextPlayerIndex].letters.length === 5) {
      nextPlayerIndex = (nextPlayerIndex + 1) % gameState.players.length;
    }

    // Check if we've completed a full round (all players have attempted the current trick)
    const isLastPlayerInRound = nextPlayerIndex === 0 || 
      (nextPlayerIndex < gameState.currentPlayerIndex && 
       updatedPlayers.slice(0, gameState.currentPlayerIndex + 1).some(p => p.letters.length === 5));

    // If all players have attempted the current trick, select a new trick for the next round
    let newTrickId = gameState.currentTrickId;
    let usedTrickIds = [...gameState.usedTrickIds];
    let roundNumber = gameState.roundNumber;
    
    if (isLastPlayerInRound) {
      // Select a new trick for the next round
      const newTrick = getNewTrick();
      newTrickId = newTrick.id;
      usedTrickIds = [...usedTrickIds, newTrick.id];
      roundNumber += 1;
      
      // Animate the new trick
      trickScale.value = 0.9;
      trickScale.value = withSpring(1, { damping: 10, stiffness: 100 });
      
      // Play sound for new round
      await playSound('pokedexOpen');
    }

    setGameState({
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      currentTrickId: newTrickId,
      usedTrickIds: usedTrickIds,
      roundNumber: roundNumber,
      allPlayersAttempted: isLastPlayerInRound,
      trickHistory: updatedTrickHistory
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

  return (
    <LinearGradient 
      colors={['#880808', '#A52A2A', '#800000']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <View style={styles.header}>
        <Text style={styles.gameTitle}>
          {isTrainingMode ? 'BLADE Training' : 'BLADE Game'}
        </Text>
        <Text style={styles.roundNumber}>
          {isTrainingMode ? `Trick #${gameState.roundNumber}` : `Round ${gameState.roundNumber}`}
        </Text>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{currentPlayer.name}'s Turn</Text>
        <Animated.Text style={[styles.letters, animatedLetterStyle]}>
          {currentPlayer.letters.length > 0 
            ? currentPlayer.letters.join('') 
            : 'Safe'}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.trickCard, animatedTrickStyle]}>
        <View style={styles.trickHeader}>
          <Text style={styles.trickNumber}>#{currentTrick.id.toString().padStart(3, '0')}</Text>
          <Text style={styles.trickCategory}>{currentTrick.category}</Text>
        </View>
        <Text style={styles.trickName}>{currentTrick.name}</Text>
        <Text style={styles.trickDescription}>{currentTrick.description}</Text>
        <View style={styles.trickFooter}>
          <Text style={styles.difficulty}>Difficulty: {currentTrick.difficulty}/10</Text>
          {currentTrick.variations && (
            <Text style={styles.variations}>
              {currentTrick.variations.length} variations
            </Text>
          )}
        </View>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.successButton]} 
          onPress={() => handleAttempt(true)}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Success</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.failButton]} 
          onPress={() => handleAttempt(false)}
        >
          <Ionicons name="close-circle" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Fail</Text>
        </TouchableOpacity>
      </View>

      {!isTrainingMode && (
        <View style={styles.playerList}>
          <Text style={styles.playersTitle}>Players:</Text>
          <View style={styles.playerScores}>
            {gameState.players.map((player) => (
              <View key={player.id} style={[
                styles.playerScoreItem,
                player.id === currentPlayer.id && styles.currentPlayerScore,
                player.letters.length === 5 && styles.eliminatedPlayer
              ]}>
                <Text style={[
                  styles.playerScoreName,
                  player.letters.length === 5 && styles.eliminatedText
                ]}>
                  {player.name}
                </Text>
                <Text style={styles.playerScoreLetters}>
                  {player.letters.join('')}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Trick History Section */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Attempts:</Text>
        <ScrollView style={styles.historyList}>
          {gameState.trickHistory.slice(-5).reverse().map((attempt, index) => {
            const trick = getTrickById(attempt.trickId);
            return (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyItemLeft}>
                  <Text style={styles.historyTrickName}>
                    {trick?.name || `Trick #${attempt.trickId}`}
                  </Text>
                  <Text style={styles.historyPlayerName}>
                    {attempt.playerName} - Round {attempt.roundNumber}
                  </Text>
                </View>
                <View style={[
                  styles.historyResult,
                  attempt.success ? styles.historySuccess : styles.historyFail
                ]}>
                  <Ionicons 
                    name={attempt.success ? "checkmark-circle" : "close-circle"} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.historyResultText}>
                    {attempt.success ? "Success" : "Fail"}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  gameTitle: {
    fontSize: 28,
    color: '#FFD700',
    fontFamily: 'Roboto_700Bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  roundNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto_500Medium',
    marginTop: 4,
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  playerName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
    marginBottom: 8,
  },
  letters: {
    fontSize: 32,
    marginBottom: 8,
    color: '#DC143C',
    fontFamily: 'Roboto_900Black',
  },
  trickCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  trickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trickNumber: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  trickCategory: {
    color: '#FFFFFF',
    fontSize: 12,
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  trickName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 8,
  },
  trickDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  trickFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficulty: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
  variations: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.48,
  },
  successButton: {
    backgroundColor: '#228B22',
  },
  failButton: {
    backgroundColor: '#DC143C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    marginLeft: 8,
  },
  playerList: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
  },
  playersTitle: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Roboto_500Medium',
  },
  playerScores: {
    gap: 8,
  },
  playerScoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  currentPlayerScore: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  eliminatedPlayer: {
    opacity: 0.6,
  },
  playerScoreName: {
    color: '#FFFFFF',
    flex: 1,
  },
  playerScoreLetters: {
    color: '#DC143C',
    fontFamily: 'Roboto_700Bold',
    minWidth: 60,
    textAlign: 'right',
  },
  eliminatedText: {
    textDecorationLine: 'line-through',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  historyContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    maxHeight: 200,
  },
  historyTitle: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Roboto_500Medium',
  },
  historyList: {
    maxHeight: 150,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    marginBottom: 6,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyTrickName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
  },
  historyPlayerName: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  historyResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  historySuccess: {
    backgroundColor: 'rgba(34, 139, 34, 0.8)',
  },
  historyFail: {
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
  },
  historyResultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 4,
  },
});
