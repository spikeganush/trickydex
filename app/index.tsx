import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { playSound } from '../utils/sounds';

const HomeScreen = () => {
  const titleScale = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[
        styles.title,
        { transform: [{ scale: titleScale }] }
      ]}>
        TrickyDex
      </Animated.Text>
      <TouchableOpacity style={styles.menuButton} onPress={() => {
        playSound('click');
        router.push('/(tricks)');
      }}>
        <Text style={styles.buttonText}>View Trick Catalog</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => {
          playSound('click');
          router.push('/(game)');
        }}
      >
        <Text style={styles.buttonText}>BLADE Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#E53935',
    padding: 16,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 32,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuButton: {
    backgroundColor: '#A52A2A',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
  },
});

export default HomeScreen;
