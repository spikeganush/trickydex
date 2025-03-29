import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GameHistoryItem } from '../../types/game';
import { loadGameHistory } from '../../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 40; // Account for padding

// Initialize empty chart data structure to avoid undefined during initial render
const emptyChartData = {
  labels: [],
  datasets: [{ data: [] }]
};

// Define types for our chart data
type ChartData = {
  labels: string[];
  datasets: { data: number[] }[];
};

export default function StatisticsScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load game history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const historyData = await loadGameHistory();
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load game history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Calculate statistics
  const totalGames = useMemo(() => history.length, [history]);
  
  const playerStats = useMemo(() => {
    // Track player stats across all games
    const stats: Record<string, { 
      gamesPlayed: number, 
      wins: number,
      totalTrickAttempts: number,
      successfulAttempts: number
    }> = {};

    // Process each game
    history.forEach(game => {
      // Process each player
      game.players.forEach(player => {
        if (!stats[player.name]) {
          stats[player.name] = { 
            gamesPlayed: 0, 
            wins: 0,
            totalTrickAttempts: 0,
            successfulAttempts: 0
          };
        }
        stats[player.name].gamesPlayed += 1;
        if (player.isWinner) {
          stats[player.name].wins += 1;
        }
      });

      // Count trick attempts for each player
      game.tricks.forEach(trick => {
        trick.attempts.forEach(attempt => {
          if (stats[attempt.playerName]) {
            stats[attempt.playerName].totalTrickAttempts += 1;
            if (attempt.success) {
              stats[attempt.playerName].successfulAttempts += 1;
            }
          }
        });
      });
    });

    return stats;
  }, [history]);

  const topPlayers = useMemo(() => {
    // Convert to array for sorting
    return Object.entries(playerStats)
      .map(([name, stats]) => ({
        name,
        winRate: stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0,
        successRate: stats.totalTrickAttempts > 0 
          ? (stats.successfulAttempts / stats.totalTrickAttempts) * 100 
          : 0,
        gamesPlayed: stats.gamesPlayed
      }))
      .sort((a, b) => b.winRate - a.winRate || b.successRate - a.successRate)
      .slice(0, 5); // Top 5 players
  }, [playerStats]);

  // Difficulty distribution data for chart
  const difficultyChartData = useMemo(() => {
    if (history.length === 0) return emptyChartData;
    
    // Group into ranges for cleaner display
    const ranges = [
      { label: "1-5", count: 0 },
      { label: "6-10", count: 0 },
      { label: "11-15", count: 0 },
      { label: "16-20", count: 0 },
      { label: "21-25", count: 0 },
      { label: "26-30", count: 0 }
    ];

    history.forEach(game => {
      const difficulty = game.settings.maxDifficulty;
      if (difficulty <= 5) ranges[0].count += 1;
      else if (difficulty <= 10) ranges[1].count += 1;
      else if (difficulty <= 15) ranges[2].count += 1;
      else if (difficulty <= 20) ranges[3].count += 1;
      else if (difficulty <= 25) ranges[4].count += 1;
      else ranges[5].count += 1;
    });

    return {
      labels: ranges.map(r => r.label),
      datasets: [
        {
          data: ranges.map(r => r.count)
        }
      ]
    };
  }, [history]);

  // Game mode distribution data for chart
  const gameModeChartData = useMemo(() => {
    if (history.length === 0) return emptyChartData;
    
    const modes = {
      'easy': 0,
      'medium': 0,
      'hard': 0
    };

    history.forEach(game => {
      const preference = game.settings.difficultyPreference;
      if (modes[preference] !== undefined) {
        modes[preference] += 1;
      }
    });

    const labels = Object.keys(modes).map(
      key => key.charAt(0).toUpperCase() + key.slice(1)
    );
    
    return {
      labels,
      datasets: [
        {
          data: Object.values(modes)
        }
      ]
    };
  }, [history]);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'rgba(0, 0, 0, 0.4)',
    backgroundGradientTo: 'rgba(0, 0, 0, 0.7)',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
    barRadius: 5,
  };

  // Format percentages
  const formatPercent = (value: number) => {
    return `${Math.round(value)}%`;
  };

  // Safely render chart only when data is valid
  const renderChart = (
    chartData: ChartData, 
    color: (opacity: number) => string, 
    title: string
  ) => {
    if (loading) return <ActivityIndicator size="small" color="#D13B40" />;
    
    return (
      <BarChart
        data={chartData}
        width={screenWidth - 32} // Account for card padding
        height={220}
        chartConfig={{
          ...chartConfig,
          color,
          propsForLabels: {
            fontSize: 10,
            fill: '#FFFFFF'
          },
          propsForVerticalLabels: {
            fontSize: 10,
            fill: '#FFFFFF'
          },
          propsForHorizontalLabels: {
            fontSize: 10,
            fill: '#FFFFFF'
          }
        }}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#303030', '#1c1c1c']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerText}>Game Statistics</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D13B40" />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="stats-chart" size={64} color="#555555" />
          <Text style={styles.emptyText}>No game history available</Text>
          <Text style={styles.emptySubtext}>Play some games to see statistics</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalGames}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {history[0]?.date ? 
                    new Date(history[0].date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) 
                    : 'N/A'}
                </Text>
                <Text style={styles.statLabel}>Latest Game</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Player Rankings</Text>
            {topPlayers.length > 0 ? (
              topPlayers.map((player, index) => (
                <View key={player.name} style={styles.playerRankItem}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <View style={styles.playerStats}>
                      <Text style={styles.playerStat}>
                        Win Rate: {formatPercent(player.winRate)}
                      </Text>
                      <Text style={styles.playerStat}>
                        Success Rate: {formatPercent(player.successRate)}
                      </Text>
                      <Text style={styles.playerStat}>
                        Games: {player.gamesPlayed}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No player data available</Text>
            )}
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Difficulty Distribution</Text>
            {history.length > 0 ? (
              <View style={styles.chartContainer}>
                {renderChart(
                  difficultyChartData, 
                  (opacity: number) => `rgba(76, 175, 80, ${opacity})`,
                  "Difficulty"
                )}
              </View>
            ) : (
              <Text style={styles.noDataText}>No difficulty data available</Text>
            )}
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Game Modes</Text>
            {history.length > 0 ? (
              <View style={styles.chartContainer}>
                {renderChart(
                  gameModeChartData,
                  (opacity: number) => `rgba(209, 59, 64, ${opacity})`,
                  "Game Modes"
                )}
              </View>
            ) : (
              <Text style={styles.noDataText}>No game mode data available</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto_400Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Roboto_500Medium',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#BBBBBB',
    marginTop: 8,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#BBBBBB',
    fontFamily: 'Roboto_400Regular',
    marginTop: 4,
  },
  playerRankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D13B40',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  playerStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerStat: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: '#DDDDDD',
    marginRight: 8,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#BBBBBB',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  chartContainer: {
    marginVertical: 8,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
