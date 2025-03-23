import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Link } from 'expo-router';

const HomeScreen = () => {
  const titleScale = useSharedValue(0);
  const router = useRouter();
  const { isInitialAppLoad, setInitialAppLoad } = useAppContext();

  useEffect(() => {
    if (isInitialAppLoad) {
      titleScale.value = withSpring(1, { damping: 10, stiffness: 100 });
      setInitialAppLoad(false);
    } else {
      titleScale.value = 1;
    }
  }, [isInitialAppLoad]);

  return (
    <LinearGradient
      colors={['#2E3338', '#393E44']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View
          style={[styles.logoContainer, { transform: [{ scale: titleScale }] }]}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>TrickyDex</Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Link href="/(tricks)" asChild>
            <TouchableOpacity style={styles.button}>
              <Ionicons name='list' size={24} color='#FFFFFF' />
              <Text style={styles.buttonText}>Trick Catalog</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(game)" asChild>
            <TouchableOpacity style={styles.button}>
              <Ionicons name='game-controller' size={24} color='#FFFFFF' />
              <Text style={styles.buttonText}>BLADE Game</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    color: '#FFFFFF',
    marginBottom: 48,
    fontFamily: 'Roboto_900Black',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#D13B40',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
  },
});

export default HomeScreen;
