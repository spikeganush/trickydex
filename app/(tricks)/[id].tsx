import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { initialTricks, trickCategories, TrickCategory } from '../../types/trick';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { playSound } from '../../utils/sounds';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useAppContext } from '../../context/AppContext';

const TrickDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const trick = initialTricks.find(t => t.id === Number(id));
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite, addToRecentlyViewed } = useAppContext();
  
  const cardScale = useSharedValue(0.9);
  const titleOpacity = useSharedValue(0);
  const detailsOpacity = useSharedValue(0);

  useEffect(() => {
    const loadScreen = async () => {
      await playSound('pokedexOpen');
      
      // Animate elements sequentially
      cardScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      
      setTimeout(() => {
        titleOpacity.value = withSpring(1, { damping: 20, stiffness: 100 });
      }, 200);
      
      setTimeout(() => {
        detailsOpacity.value = withSpring(1, { damping: 20, stiffness: 100 });
      }, 400);
      
      // Add to recently viewed
      if (trick) {
        addToRecentlyViewed(trick.id);
      }
    };
    
    loadScreen();
  }, []);

  const handleFavoriteToggle = async () => {
    if (!trick) return;
    
    if (isFavorite(trick.id)) {
      await playSound('buttonPress');
      removeFavorite(trick.id);
    } else {
      await playSound('trickFound');
      addFavorite(trick.id);
    }
  };

  const handleBack = async () => {
    await playSound('pokedexClose');
    router.back();
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }]
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value
    };
  });

  const animatedDetailsStyle = useAnimatedStyle(() => {
    return {
      opacity: detailsOpacity.value
    };
  });

  if (!trick) {
    return (
      <LinearGradient 
        colors={['#DC143C', '#8B0000']} 
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>TrickyDex</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FFD700" />
          <Text style={styles.errorText}>Trick not found</Text>
          <TouchableOpacity 
            style={styles.returnButton}
            onPress={handleBack}
          >
            <Text style={styles.returnButtonText}>Return to Catalog</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={['#DC143C', '#8B0000']} 
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TrickyDex</Text>
        <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
          <Ionicons 
            name={isFavorite(trick.id) ? "star" : "star-outline"} 
            size={24} 
            color="#FFD700" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Animated.View style={[styles.titleSection, animatedTitleStyle]}>
            <Text style={styles.trickNumber}>#{trick.id.toString().padStart(3, '0')}</Text>
            <Text style={styles.trickName}>{trick.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {trickCategories[trick.category as TrickCategory] || trick.category}
              </Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.detailsSection, animatedDetailsStyle]}>
            <View style={styles.difficultyMeter}>
              <Text style={styles.difficultyLabel}>Difficulty</Text>
              <View style={styles.difficultyBar}>
                {[...Array(10)].map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.difficultyUnit,
                      i < trick.difficulty && styles.activeDifficultyUnit,
                      trick.difficulty >= 8 && i < trick.difficulty && styles.hardDifficultyUnit,
                      trick.difficulty <= 3 && i < trick.difficulty && styles.easyDifficultyUnit,
                    ]} 
                  />
                ))}
              </View>
              <Text style={styles.difficultyValue}>{trick.difficulty}/10</Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>{trick.description}</Text>
            </View>

            {trick.variations && trick.variations.length > 0 && (
              <View style={styles.variationsContainer}>
                <Text style={styles.variationsTitle}>Variations</Text>
                {trick.variations.map((variation, index) => (
                  <View key={index} style={styles.variationItem}>
                    <Ionicons name="chevron-forward" size={16} color="#FFD700" />
                    <Text style={styles.variationText}>{variation}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 215, 0, 0.3)',
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  titleSection: {
    padding: 16,
    backgroundColor: 'rgba(139, 0, 0, 0.7)',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  trickNumber: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    marginBottom: 4,
  },
  trickName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    textTransform: 'capitalize',
  },
  detailsSection: {
    padding: 16,
  },
  difficultyMeter: {
    marginBottom: 20,
  },
  difficultyLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    marginBottom: 8,
  },
  difficultyBar: {
    flexDirection: 'row',
    height: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  difficultyUnit: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 1,
  },
  activeDifficultyUnit: {
    backgroundColor: '#FFD700',
  },
  hardDifficultyUnit: {
    backgroundColor: '#FF4500',
  },
  easyDifficultyUnit: {
    backgroundColor: '#32CD32',
  },
  difficultyValue: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    marginBottom: 8,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
  },
  variationsContainer: {
    marginBottom: 16,
  },
  variationsTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    marginBottom: 8,
  },
  variationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  variationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginVertical: 16,
    fontFamily: 'Roboto_500Medium',
  },
  returnButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginTop: 16,
  },
  returnButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default TrickDetailScreen;
