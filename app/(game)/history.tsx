import { View, Text, StyleSheet, Pressable, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GameHistoryItem } from '../../types/game';
import { loadGameHistory, deleteGameHistoryItem, clearGameHistory } from '../../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

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

  const handleDeleteItem = (gameId: string) => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGameHistoryItem(gameId);
              setHistory(history.filter(game => game.id !== gameId));
            } catch (error) {
              console.error('Failed to delete game:', error);
            }
          } 
        }
      ]
    );
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;
    
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all game records? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearGameHistory();
              setHistory([]);
            } catch (error) {
              console.error('Failed to clear history:', error);
            }
          } 
        }
      ]
    );
  };

  const toggleExpandItem = (gameId: string) => {
    setExpandedItemId(expandedItemId === gameId ? null : gameId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderHistoryItem = ({ item }: { item: GameHistoryItem }) => {
    const isExpanded = expandedItemId === item.id;
    
    return (
      <Pressable
        style={[styles.historyItem, isExpanded && styles.historyItemExpanded]}
        onPress={() => toggleExpandItem(item.id)}
      >
        <View style={styles.historyHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
            <Text style={styles.historySummary}>{item.summary}</Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#FFFFFF"
            />
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Players:</Text>
              <View style={styles.playersList}>
                {item.players.map((player) => (
                  <View key={player.id} style={styles.playerItem}>
                    <Text style={[
                      styles.playerName,
                      player.isWinner && styles.winnerName
                    ]}>
                      {player.name}
                      {player.isWinner && " 🏆"}
                    </Text>
                    <Text style={styles.playerLetters}>
                      {player.finalLetters.length > 0 
                        ? player.finalLetters.join('') 
                        : 'Safe'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Settings:</Text>
              <Text style={styles.detailText}>
                Difficulty: {item.settings.difficultyPreference}, 
                Max: {item.settings.maxDifficulty}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categories:</Text>
              <Text style={styles.detailText}>
                {item.settings.selectedCategories.map(cat => 
                  cat.replace('_', ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                ).join(', ')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tricks:</Text>
              <Text style={styles.detailText}>
                {item.tricks.length} rounds played
              </Text>
            </View>

            <View style={styles.tricksContainer}>
              {item.tricks.map((trick, index) => (
                <View key={trick.trickId} style={styles.trickItem}>
                  <View style={styles.trickHeader}>
                    <Text style={styles.trickName}>
                      Round {trick.roundNumber}: {trick.trickName}
                    </Text>
                  </View>
                  <View style={styles.attemptsContainer}>
                    {trick.attempts.map((attempt, i) => (
                      <View key={`${trick.trickId}-${i}`} style={styles.attemptItem}>
                        <Ionicons 
                          name={attempt.success ? "checkmark-circle" : "close-circle"} 
                          size={16} 
                          color={attempt.success ? "#4CAF50" : "#D13B40"} 
                          style={styles.attemptIcon}
                        />
                        <Text style={[
                          styles.attemptText,
                          attempt.success ? styles.successText : styles.failText
                        ]}>
                          {attempt.playerName}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      </Pressable>
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
        <Text style={styles.headerText}>Game History</Text>
        <Pressable 
          style={[styles.clearButton, history.length === 0 && styles.disabledButton]}
          onPress={handleClearHistory}
          disabled={history.length === 0}
        >
          <Ionicons name="trash-outline" size={20} color={history.length === 0 ? "#777777" : "#FFFFFF"} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D13B40" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#777777" />
          <Text style={styles.emptyText}>No game history yet</Text>
          <Text style={styles.emptySubtext}>
            Complete a game to see your history here
          </Text>
          <Link href="/(game)" asChild>
            <Pressable style={styles.newGameButton}>
              <Text style={styles.newGameButtonText}>Start New Game</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  newGameButton: {
    backgroundColor: '#D13B40',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newGameButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#393E44',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  historyItemExpanded: {
    borderWidth: 1,
    borderColor: '#D13B40',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {},
  historyDate: {
    color: '#BBBBBB',
    fontSize: 14,
    marginBottom: 4,
  },
  historySummary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#4D5258',
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    color: '#BBBBBB',
    fontSize: 14,
    marginBottom: 4,
  },
  detailText: {
    color: '#DDDDDD',
    fontSize: 14,
    flex: 1,
  },
  playersList: {
    marginTop: 4,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#4D5258',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  winnerName: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  playerLetters: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  tricksContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  trickItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  trickHeader: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  trickName: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
  },
  attemptsContainer: {
    padding: 8,
  },
  attemptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  attemptIcon: {
    marginRight: 6,
  },
  attemptText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  successText: {
    color: '#A8E0A8',
  },
  failText: {
    color: '#F2A3A5',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#D13B40',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
