import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { initialTricks, trickCategories, getTricksByCategory, TrickCategory } from '../../types/trick';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { playSound } from '../../utils/sounds';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

const TrickListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredTricks, setFilteredTricks] = useState(initialTricks);
  const listScale = useSharedValue(0.95);
  
  // Animation when screen loads
  useEffect(() => {
    const playOpenSound = async () => {
      await playSound('pokedexOpen');
    };
    
    playOpenSound();
    listScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  // Filter tricks based on search query and selected category
  useEffect(() => {
    let result = initialTricks;
    
    if (selectedCategory) {
      result = getTricksByCategory(selectedCategory);
    }
    
    if (searchQuery) {
      result = result.filter(trick => 
        trick.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trick.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTricks(result);
  }, [searchQuery, selectedCategory]);

  const handleCategorySelect = async (category: string | null) => {
    await playSound('pokedexSelect');
    setSelectedCategory(category);
  };

  const handleTrickSelect = async () => {
    await playSound('pokedexSelect');
  };

  const animatedListStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: listScale.value }]
    };
  });

  const renderTrickItem = ({ item }: { item: typeof initialTricks[0] }) => (
    <Link href={`/(tricks)/${item.id}`} asChild>
      <TouchableOpacity 
        style={styles.trickCard}
        onPress={handleTrickSelect}
      >
        <View style={styles.trickHeader}>
          <Text style={styles.trickNumber}>#{item.id.toString().padStart(3, '0')}</Text>
          <Text style={styles.trickCategory}>{trickCategories[item.category as TrickCategory]}</Text>
        </View>
        <Text style={styles.trickName}>{item.name}</Text>
        <View style={styles.trickFooter}>
          <Text style={styles.trickDifficulty}>Difficulty: {item.difficulty}/10</Text>
          {item.variations && (
            <Text style={styles.variationsCount}>{item.variations.length} variations</Text>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <LinearGradient 
      colors={['#DC143C', '#8B0000']} 
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <View style={styles.header}>
        <Text style={styles.title}>TrickyDex</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#FFD700" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tricks..."
            placeholderTextColor="#FFD700AA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={24} color="#FFD700" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity 
          style={[
            styles.categoryButton, 
            selectedCategory === null && styles.selectedCategory
          ]}
          onPress={() => handleCategorySelect(null)}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
        
        {Object.entries(trickCategories).map(([key, value]) => (
          <TouchableOpacity 
            key={key}
            style={[
              styles.categoryButton, 
              selectedCategory === key && styles.selectedCategory
            ]}
            onPress={() => handleCategorySelect(key)}
          >
            <Text style={styles.categoryText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Animated.View style={[styles.listContainer, animatedListStyle]}>
        <FlatList
          data={filteredTricks}
          renderItem={renderTrickItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={() => playSound('pokedexScroll')}
          scrollEventThrottle={16}
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#FFD700',
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 8,
  },
  categoryButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  selectedCategory: {
    backgroundColor: '#FFD700',
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  listContent: {
    padding: 8,
  },
  trickCard: {
    flex: 1,
    backgroundColor: 'rgba(139, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    minWidth: '40%',
    borderWidth: 1,
    borderColor: '#FFD700',
    elevation: 3,
  },
  trickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trickNumber: {
    color: '#FFD700',
    fontSize: 12,
  },
  trickCategory: {
    color: '#FFFFFF',
    fontSize: 10,
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trickName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trickFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trickDifficulty: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  variationsCount: {
    color: '#FFD700',
    fontSize: 10,
  },
});

export default TrickListScreen;
