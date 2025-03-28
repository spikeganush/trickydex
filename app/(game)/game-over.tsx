import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Player, TrickAttempt, GameHistoryItem, GameHistoryPlayer, GameHistoryTrick } from '../../types/game';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getTrickById } from '../../types/trick';
import { saveGameHistory } from '../../utils/storage';

export default function GameOverScreen() {
  const { playersData, trickHistory: trickHistoryParam, gameSettings: gameSettingsParam } =
    useLocalSearchParams<{
      playersData?: string;
      trickHistory?: string;
      gameSettings?: string;
    }>();
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);

  if (!playersData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game data not available</Text>
      </View>
    );
  }

  const players: Player[] = JSON.parse(playersData);
  const trickHistory: TrickAttempt[] = trickHistoryParam
    ? JSON.parse(trickHistoryParam)
    : [];
  const gameSettings = gameSettingsParam 
    ? JSON.parse(gameSettingsParam)
    : { maxDifficulty: 30, selectedCategories: [], difficultyPreference: 'medium' };

  // Sort players by letters (fewer is better)
  const sortedPlayers = [...players].sort((a, b) => {
    // First compare by elimination status (non-eliminated first)
    const aEliminated = a.letters.length === 5;
    const bEliminated = b.letters.length === 5;

    if (aEliminated !== bEliminated) {
      return aEliminated ? 1 : -1;
    }

    // Then by letter count (fewer is better)
    return a.letters.length - b.letters.length;
  });

  const isTrainingMode = players.length === 1;
  const winner = sortedPlayers[0];
  const isWinner = winner.letters.length < 5;

  // Calculate statistics
  const totalAttempts = trickHistory.length;
  const successfulAttempts = trickHistory.filter(
    (attempt) => attempt.success
  ).length;
  const successRate =
    totalAttempts > 0
      ? Math.round((successfulAttempts / totalAttempts) * 100)
      : 0;

  const toggleHistory = async () => {
    setShowHistory(!showHistory);
  };

  // Save game history
  useEffect(() => {
    if (historySaved || !playersData || trickHistory.length === 0) return;

    const saveHistory = async () => {
      try {
        // Create game history players
        const historyPlayers: GameHistoryPlayer[] = players.map(player => ({
          id: player.id,
          name: player.name,
          finalLetters: [...player.letters],
          isWinner: player === winner && isWinner
        }));

        // Group trick attempts by roundNumber
        const tricksByRound: Record<number, TrickAttempt[]> = {};
        trickHistory.forEach(attempt => {
          if (!tricksByRound[attempt.roundNumber]) {
            tricksByRound[attempt.roundNumber] = [];
          }
          tricksByRound[attempt.roundNumber].push(attempt);
        });

        // Create game history tricks
        const historyTricks: GameHistoryTrick[] = Object.entries(tricksByRound).map(([round, attempts]) => {
          const trickId = attempts[0].trickId;
          const trick = getTrickById(trickId);
          
          return {
            trickId,
            trickName: trick?.name || `Unknown Trick #${trickId}`,
            roundNumber: parseInt(round),
            attempts: attempts.map(attempt => ({
              playerName: attempt.playerName,
              success: attempt.success
            }))
          };
        });

        // Calculate game summary
        let summary: string;
        if (isTrainingMode) {
          summary = `Training session - ${players[0].letters.length === 5 ? 'Eliminated' : 'Practiced'} with ${trickHistory.length} attempts`;
        } else if (isWinner) {
          summary = `${winner.name} won against ${players.length - 1} player${players.length > 2 ? 's' : ''}`;
        } else {
          summary = `All players were eliminated - Game wins!`;
        }

        // Create the game history item
        const gameHistoryItem: GameHistoryItem = {
          id: Date.now().toString(), // Use timestamp as ID
          date: new Date().toISOString(),
          duration: Math.max(1, Math.floor(trickHistory.length / players.length) * 2), // Estimate duration in minutes
          players: historyPlayers,
          tricks: historyTricks,
          settings: {
            maxDifficulty: gameSettings.maxDifficulty,
            selectedCategories: gameSettings.selectedCategories,
            difficultyPreference: gameSettings.difficultyPreference
          },
          summary
        };

        // Save to storage
        await saveGameHistory(gameHistoryItem);
        setHistorySaved(true);
      } catch (error) {
        console.error('Failed to save game history:', error);
      }
    };

    saveHistory();
  }, [playersData, trickHistory, historySaved]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.headerText}>Game Over</Text>

        {isTrainingMode ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Training Results</Text>
            <View style={styles.playerStatus}>
              <Text style={styles.playerName}>{players[0].name}</Text>
              <Text style={styles.letters}>
                {players[0].letters.length === 0
                  ? 'Safe'
                  : players[0].letters.join('')}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Attempts</Text>
                <Text style={styles.statValue}>{totalAttempts}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Success Rate</Text>
                <Text style={styles.statValue}>{successRate}%</Text>
              </View>
            </View>
            <Text style={styles.resultMessage}>
              {players[0].letters.length === 5
                ? 'You spelled BLADE and got eliminated!'
                : 'Keep practicing to improve your skills!'}
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Final Results</Text>
            {sortedPlayers.map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.playerStatus,
                  index === 0 && isWinner && styles.winnerStatus,
                ]}
              >
                <View style={styles.rankContainer}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text
                  style={[
                    styles.letters,
                    player.letters.length === 5 && styles.eliminatedText,
                  ]}
                >
                  {player.letters.length > 0 ? player.letters.join('') : 'Safe'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {trickHistory.length > 0 && (
          <View style={styles.card}>
            <View style={styles.historyHeader}>
              <Text style={styles.cardTitle}>Trick History</Text>
              <Pressable
                style={styles.historyToggle}
                onPress={() => setShowHistory(!showHistory)}
              >
                <Ionicons
                  name={showHistory ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color='#FFFFFF'
                />
              </Pressable>
            </View>

            {showHistory && (
              <View style={styles.historyList}>
                {trickHistory.map((attempt, index) => {
                  const trick = getTrickById(attempt.trickId);
                  return (
                    <View key={index} style={styles.historyItem}>
                      <View style={styles.historyLeft}>
                        <Text style={styles.historyTrick}>
                          {trick?.name || `Trick #${attempt.trickId}`}
                        </Text>
                        <Text style={styles.historyPlayer}>
                          by {attempt.playerName}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.historyResult,
                          attempt.success
                            ? styles.historySuccess
                            : styles.historyFail,
                        ]}
                      >
                        {attempt.success ? 'Landed' : 'Failed'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Link href="/(game)" asChild>
            <Pressable style={styles.button}>
              <Ionicons name='refresh' size={24} color='#FFFFFF' />
              <Text style={styles.buttonText}>Play Again</Text>
            </Pressable>
          </Link>

          <Pressable
            style={styles.button}
            onPress={() => {
              // Force navigation to the root app screen
              router.push("/");
            }}
          >
            <Ionicons name='home' size={24} color='#FFFFFF' />
            <Text style={styles.buttonText}>Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#393E44',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  playerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  winnerStatus: {
    backgroundColor: 'rgba(46, 139, 87, 0.2)',
  },
  rankContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D13B40',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  playerName: {
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  letters: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#D13B40',
  },
  eliminatedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  resultMessage: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyToggle: {
    padding: 4,
  },
  historyList: {
    marginTop: 8,
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
    color: '#2E8B57',
  },
  historyFail: {
    color: '#D13B40',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginTop: 'auto', // This will push the buttons to the bottom
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
  errorText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
