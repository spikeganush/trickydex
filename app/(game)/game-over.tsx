import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Player, TrickAttempt } from '../../types/game';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { playSound } from '../../utils/sounds';
import { getTrickById } from '../../types/trick';

export default function GameOverScreen() {
  const { playersData, trickHistory: trickHistoryParam } = useLocalSearchParams<{ 
    playersData?: string, 
    trickHistory?: string 
  }>();
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  
  useEffect(() => {
    // Play game over sound when screen loads
    const playGameOverSound = async () => {
      await playSound('gameOver');
    };
    
    playGameOverSound();
  }, []);

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
  const successfulAttempts = trickHistory.filter(attempt => attempt.success).length;
  const successRate = totalAttempts > 0 
    ? Math.round((successfulAttempts / totalAttempts) * 100) 
    : 0;

  const handleHome = async () => {
    await playSound('click');
    // Force navigation to the main menu by using the absolute path
    router.navigate('/');
  };

  const toggleHistory = async () => {
    await playSound('click');
    setShowHistory(!showHistory);
  };

  return (
    <LinearGradient 
      colors={['#880808', '#A52A2A', '#800000']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.gameOverText}>Game Over</Text>
          
          {isTrainingMode ? (
            <View style={styles.trainingResultContainer}>
              <Text style={styles.trainingResultTitle}>Training Results</Text>
              <Text style={styles.playerName}>{players[0].name}</Text>
              <View style={styles.letterContainer}>
                <Text style={styles.letterLabel}>Final Status:</Text>
                <Text style={styles.letterValue}>
                  {players[0].letters.length === 0 ? 'Perfect! No letters' : players[0].letters.join('')}
                </Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Attempts:</Text>
                  <Text style={styles.statValue}>{totalAttempts}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Success Rate:</Text>
                  <Text style={styles.statValue}>{successRate}%</Text>
                </View>
              </View>
              <Text style={styles.roundsCompleted}>
                {players[0].letters.length === 5 
                  ? 'You spelled BLADE and got eliminated!' 
                  : 'Keep practicing to improve your skills!'}
              </Text>
            </View>
          ) : isWinner ? (
            <View style={styles.winnerContainer}>
              <Text style={styles.winnerLabel}>Winner:</Text>
              <Text style={styles.winnerName}>{winner.name}</Text>
              <View style={styles.winnerStats}>
                <Text style={styles.winnerLetters}>Letters: {winner.letters.join('')}</Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Rounds:</Text>
                  <Text style={styles.statValue}>{trickHistory.length > 0 ? trickHistory[trickHistory.length-1].roundNumber : 0}</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.tieText}>It's a tie!</Text>
          )}
        </View>

        {!isTrainingMode && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Final Results:</Text>
            {sortedPlayers.map((player, index) => (
              <View 
                key={player.id} 
                style={[
                  styles.playerResult,
                  index === 0 && isWinner && styles.winnerResult
                ]}
              >
                <View style={styles.playerRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.playerStats}>
                    <Text 
                      style={[
                        styles.playerLetters,
                        player.letters.length === 5 && styles.eliminatedText
                      ]}
                    >
                      {player.letters.length > 0 ? player.letters.join('') : 'Safe'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Trick History Toggle Button */}
        {trickHistory.length > 0 && (
          <Pressable 
            style={styles.historyToggleButton} 
            onPress={toggleHistory}
          >
            <Ionicons 
              name={showHistory ? "chevron-up-circle" : "chevron-down-circle"} 
              size={20} 
              color="#FFD700" 
            />
            <Text style={styles.historyToggleText}>
              {showHistory ? "Hide Trick History" : "Show Trick History"}
            </Text>
          </Pressable>
        )}

        {/* Trick History Section */}
        {showHistory && trickHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Trick History:</Text>
            <View style={styles.historyList}>
              {trickHistory.map((attempt, index) => {
                const trick = getTrickById(attempt.trickId);
                return (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyRound}>Round {attempt.roundNumber}</Text>
                      <Text style={styles.historyTrickName}>
                        {trick?.name || `Trick #${attempt.trickId}`}
                      </Text>
                      <Text style={styles.historyPlayerName}>
                        {attempt.playerName}
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
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Link href="/(game)" asChild>
            <Pressable style={styles.playAgainButton}>
              <Ionicons name="refresh-circle" size={24} color="#FFFFFF" />
              <Text style={styles.playAgainText}>Play Again</Text>
            </Pressable>
          </Link>
          
          <Link href="../" asChild>
            <Pressable style={styles.homeButton}>
              <Ionicons name="home" size={24} color="#FFD700" />
              <Text style={styles.homeText}>Home</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gameOverText: {
    fontSize: 36,
    color: '#FFD700',
    fontFamily: 'Roboto_900Black',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 16,
  },
  trainingResultContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  trainingResultTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
    marginBottom: 12,
  },
  letterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  letterLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto_500Medium',
    marginRight: 8,
  },
  letterValue: {
    fontSize: 24,
    color: '#DC143C',
    fontFamily: 'Roboto_700Bold',
  },
  statsContainer: {
    width: '100%',
    marginVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Roboto_500Medium',
  },
  statValue: {
    fontSize: 14,
    color: '#FFD700',
    fontFamily: 'Roboto_700Bold',
  },
  roundsCompleted: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginTop: 8,
  },
  winnerContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  winnerLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Roboto_500Medium',
  },
  winnerName: {
    fontSize: 28,
    color: '#FFD700',
    fontFamily: 'Roboto_700Bold',
    marginVertical: 8,
  },
  winnerStats: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  winnerLetters: {
    fontSize: 20,
    color: '#DC143C',
    fontFamily: 'Roboto_700Bold',
  },
  tieText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
  },
  resultsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    color: '#FFD700',
    fontFamily: 'Roboto_700Bold',
    marginBottom: 12,
  },
  playerResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  winnerResult: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  playerRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A52A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Roboto_500Medium',
    marginBottom: 4,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerLetters: {
    color: '#DC143C',
    fontFamily: 'Roboto_700Bold',
  },
  eliminatedText: {
    textDecorationLine: 'line-through',
  },
  historyToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  historyToggleText: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 8,
  },
  historyContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  historyTitle: {
    fontSize: 20,
    color: '#FFD700',
    fontFamily: 'Roboto_700Bold',
    marginBottom: 12,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyRound: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    marginBottom: 2,
  },
  historyTrickName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
  historyPlayerName: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  historyResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    marginLeft: 4,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: '#228B22',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    marginLeft: 8,
  },
  homeButton: {
    backgroundColor: 'rgba(165, 42, 42, 0.8)',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  homeText: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    marginLeft: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
