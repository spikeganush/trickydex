import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { playSound } from '../../utils/sounds';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TrickCategory, trickCategories } from '../../types/trick';

export default function GameScreen() {
  const [players, setPlayers] = useState<string[]>(['', '']); // Start with 2 empty player fields
  const [selectedCategories, setSelectedCategories] = useState<TrickCategory[]>([
    'soul_grinds', 'groove_grinds', 'special_grinds', 'air_tricks', 'spins', 'flips'
  ]);
  const router = useRouter();

  const addPlayer = async () => {
    try {
      await playSound('click');
      setPlayers(prev => [...prev, '']);
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  };

  const removePlayer = async (index: number) => {
    try {
      await playSound('click');
      if (players.length > 1) { // Maintain minimum of 1 player
        setPlayers(prev => prev.filter((_, i) => i !== index));
      } else {
        Alert.alert('Minimum Players', 'You need at least 1 player for BLADE');
      }
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  };

  const handlePlayerChange = (text: string, index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = text;
    setPlayers(newPlayers);
  };

  const toggleCategory = async (category: TrickCategory) => {
    try {
      await playSound('click');
      setSelectedCategories(prev => {
        if (prev.includes(category)) {
          // Don't allow deselecting if it's the last category
          if (prev.length === 1) {
            Alert.alert('Minimum Categories', 'You need at least 1 trick category for BLADE');
            return prev;
          }
          return prev.filter(c => c !== category);
        } else {
          return [...prev, category];
        }
      });
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  };

  const handleStartGame = async () => {
    const validPlayers = players.filter(p => p.trim() !== '');
    if (validPlayers.length >= 1) {
      await playSound('pokedexOpen');
      router.push({
        pathname: '/(game)/play',
        params: { 
          players: JSON.stringify(validPlayers),
          categories: JSON.stringify(selectedCategories)
        }
      });
    } else {
      Alert.alert('Player Required', 'Please add at least 1 player to start the game');
    }
  };

  const validPlayers = players.filter(p => p.trim() !== '');
  const isValid = validPlayers.length >= 1;

  return (
    <LinearGradient 
      colors={['#880808', '#A52A2A', '#800000']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>BLADE Game</Text>
          <Text style={styles.subtitle}>
            Each player attempts the same trick. If you fail, you get a letter (B-L-A-D-E).
            Spell BLADE and you're out!
          </Text>
        </View>

        <View style={styles.playerSection}>
          <Text style={styles.sectionTitle}>Players:</Text>
          {players.map((player, index) => (
            <View key={index} style={styles.playerRow}>
              <TextInput
                style={[
                  styles.input,
                  player.trim() === '' && { borderColor: '#FF4500' }
                ]}
                placeholder={`Player ${index + 1}`}
                placeholderTextColor="#FFD70080"
                value={player}
                onChangeText={(text) => handlePlayerChange(text, index)}
              />
              <Pressable 
                style={styles.removeButton} 
                onPress={() => removePlayer(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FF4500" />
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Trick Categories:</Text>
          <View style={styles.categoryGrid}>
            {(Object.keys(trickCategories) as TrickCategory[]).map((category) => (
              <Pressable 
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) && styles.categorySelected
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategories.includes(category) && styles.categoryTextSelected
                ]}>
                  {trickCategories[category]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.addButton} onPress={addPlayer}>
            <Ionicons name="add-circle" size={24} color="#FFD700" />
            <Text style={styles.addButtonText}>ADD PLAYER</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.startButton, !isValid && styles.disabledButton]} 
            onPress={handleStartGame}
            disabled={!isValid}
          >
            <Ionicons name="play-circle" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>START GAME</Text>
          </Pressable>
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Game Rules:</Text>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
            <Text style={styles.ruleText}>All players attempt the same trick each round</Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
            <Text style={styles.ruleText}>Failing a trick earns you a letter (B-L-A-D-E)</Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
            <Text style={styles.ruleText}>When you spell BLADE, you're eliminated</Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
            <Text style={styles.ruleText}>Single player mode available for training</Text>
          </View>
        </View>
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
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    color: '#FFD700',
    fontFamily: 'Roboto_900Black',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
  },
  playerSection: {
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#444',
  },
  categorySelected: {
    backgroundColor: '#8B0000',
    borderColor: '#FFD700',
  },
  categoryText: {
    color: '#CCC',
    textAlign: 'center',
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'Roboto_700Bold',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444',
    fontFamily: 'Roboto_400Regular',
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFD700',
    marginLeft: 8,
    fontFamily: 'Roboto_700Bold',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Roboto_700Bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  rulesContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  rulesTitle: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'Roboto_700Bold',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
  },
});
