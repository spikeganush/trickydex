import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import {
  initialTricks,
  trickCategories,
  getTricksByCategory,
  TrickCategory,
} from '../../types/trick';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TrickListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredTricks, setFilteredTricks] = useState(initialTricks);

  // Filter tricks based on search query and selected category
  useEffect(() => {
    let result = initialTricks;

    if (selectedCategory) {
      result = getTricksByCategory(selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(
        (trick) =>
          trick.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trick.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTricks(result);
  }, [searchQuery, selectedCategory]);

  const handleCategorySelect = async (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleTrickSelect = async () => {};

  const renderTrickItem = ({ item }: { item: (typeof initialTricks)[0] }) => (
    <Link href={`/(tricks)/${item.id}`} asChild>
      <TouchableOpacity style={styles.trickCard} onPress={handleTrickSelect}>
        <View style={styles.trickHeader}>
          <Text style={styles.trickNumber}>
            #{item.id.toString().padStart(3, '0')}
          </Text>
          <Text style={styles.trickCategory}>
            {trickCategories[item.category as TrickCategory]}
          </Text>
        </View>
        <Text style={styles.trickName}>{item.name}</Text>
        <View style={styles.trickFooter}>
          <Text style={styles.trickDifficulty}>
            Difficulty: {item.difficulty}/10
          </Text>
          {item.variations && (
            <Text style={styles.variationsCount}>
              {item.variations.length} variations
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <LinearGradient
      colors={['#2E3338', '#393E44']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>TrickyDex</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name='search'
            size={24}
            color='#FFFFFF'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Search tricks...'
            placeholderTextColor='rgba(255, 255, 255, 0.6)'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name='close-circle' size={24} color='#FFFFFF' />
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
            selectedCategory === null && styles.selectedCategory,
          ]}
          onPress={() => handleCategorySelect(null)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === null && styles.selectedCategoryText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {Object.entries(trickCategories).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryButton,
              selectedCategory === key && styles.selectedCategory,
            ]}
            onPress={() => handleCategorySelect(key)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === key && styles.selectedCategoryText,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.listContainer]}>
        <FlatList
          data={filteredTricks}
          renderItem={renderTrickItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBlock: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 53, 13, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#D13B40',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(209, 59, 64, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#D13B40',
  },
  selectedCategory: {
    backgroundColor: '#D13B40',
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  trickCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    margin: 8,
    minWidth: '40%',
    padding: 12,
  },
  trickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trickNumber: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  trickCategory: {
    color: '#FFFFFF',
    fontSize: 12,
    backgroundColor: '#D13B40',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trickName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trickFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trickDifficulty: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  variationsCount: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});

export default TrickListScreen;
