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
import { initialTricks, getTrickById, TrickCategory } from '../../types/trick';
import { GameState, Player } from '../../types/game';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const getRandomTrickFromCategories = (categories: TrickCategory[]) => {
  // Filter tricks by the selected categories
  const filteredTricks = initialTricks.filter((trick) =>
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

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialPlayers = playersParam
      ? JSON.parse(playersParam).map((name: string, index: number) => ({
          id: String(index + 1),
          name,
          letters: [],
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
      trickHistory: [], // Initialize empty trick history
    };
  });

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentTrick = gameState.currentTrickId
    ? getTrickById(gameState.currentTrickId)
    : getRandomTrickFromCategories(selectedCategories);

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

  const getNewTrick = () => {
    // Get a trick that hasn't been used in this game yet and is from selected categories
    const unusedTricks = initialTricks.filter(
      (trick) =>
        !gameState.usedTrickIds.includes(trick.id) &&
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
      const newTrick = getNewTrick();

      // Animate the new trick
      trickScale.value = 0.9;
      trickScale.value = withSpring(1, { damping: 10, stiffness: 100 });

      setGameState({
        players: updatedPlayers,
        currentPlayerIndex: 0,
        currentTrickId: newTrick.id,
        usedTrickIds: [...gameState.usedTrickIds, newTrick.id],
        roundNumber: gameState.roundNumber + 1,
        allPlayersAttempted: true,
        trickHistory: updatedTrickHistory,
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
    }

    setGameState({
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      currentTrickId: newTrickId,
      usedTrickIds: usedTrickIds,
      roundNumber: roundNumber,
      allPlayersAttempted: isLastPlayerInRound,
      trickHistory: updatedTrickHistory,
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
      colors={['#2E3338', '#393E44']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.content}>
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
            <Text style={styles.trickName}>{currentTrick.name}</Text>
            <Text style={styles.trickCategory}>
              {currentTrick.category.replace('_', ' ')}
            </Text>
          </View>
          <Text style={styles.trickDescription}>
            {currentTrick.description}
          </Text>
          <View style={styles.trickMeta}>
            <Text style={styles.difficultyText}>
              Difficulty: {currentTrick.difficulty}/10
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
              {/* Remove the horizontal padding from playerStatus and add it to the text containers */}
              <Text style={styles.statusName}>{player.name}</Text>
              <Text style={styles.statusLetters}>
                {player.letters.length > 0 ? player.letters.join('') : 'Safe'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Attempts</Text>
          {gameState.trickHistory.reverse().map((attempt, index) => (
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
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  playerCard: {
    backgroundColor: '#393E44', // theme.colors.card
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  playerName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  letters: {
    fontFamily: 'Roboto_900Black',
    fontSize: 32,
    color: '#D13B40', // theme.colors.primary
  },
  trickCard: {
    backgroundColor: '#393E44', // theme.colors.card
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  trickHeader: {
    marginBottom: 12,
  },
  trickName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trickCategory: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#D13B40', // theme.colors.primary
    textTransform: 'capitalize',
  },
  trickDescription: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  trickMeta: {
    borderTopWidth: 1,
    borderTopColor: '#4A4A4A', // theme.colors.border
    paddingTop: 12,
  },
  difficultyText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  successButton: {
    backgroundColor: '#2E8B57', // Success green
  },
  failButton: {
    backgroundColor: '#D13B40', // theme.colors.primary
  },
  buttonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  playersSection: {
    backgroundColor: '#393E44', // theme.colors.card
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  playerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    // Remove horizontal padding from here
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A', // theme.colors.border
    marginHorizontal: -16, // This will make it extend to the edges
    paddingHorizontal: 16, // Add padding back to maintain spacing
  },
  activePlayer: {
    backgroundColor: 'rgba(223, 223, 223, 0.1)', // theme.colors.primary with opacity
  },
  statusName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  statusLetters: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#D13B40', // theme.colors.primary
  },
  historySection: {
    backgroundColor: '#393E44', // theme.colors.card
    borderRadius: 8,
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  historyLeft: {
    flex: 1,
    marginRight: 8,
  },
  historyTrick: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  historyPlayer: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
  },
  historyResult: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
  },
  historySuccess: {
    color: '#2E8B57', // Success green
  },
  historyFail: {
    color: '#D13B40', // Error red
  },
  errorText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
