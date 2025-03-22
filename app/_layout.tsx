import { Slot } from 'expo-router';
import { StatusBar } from 'react-native';
import { ThemeProvider, Theme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from '@expo-google-fonts/roboto';
import { AppProvider } from '../context/AppContext';

type FontStyle = {
  fontFamily: string;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

interface CustomTheme extends Theme {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
}

const theme: CustomTheme = {
  dark: true,
  colors: {
    primary: '#D13B40', // Main Pokedex red
    background: '#2D2D2D', // Dark background
    card: '#393E44', // Card background
    text: '#FFFFFF', // White text
    border: '#4A4A4A', // Subtle border color
    notification: '#D13B40',
  },
  fonts: {
    regular: {
      fontFamily: 'Roboto_400Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Roboto_500Medium',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'Roboto_700Bold',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'Roboto_900Black',
      fontWeight: '900',
    },
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  if (!fontsLoaded) {
    return null; // Return null to show nothing until fonts are loaded
  }

  return (
    <ThemeProvider value={theme}>
      <AppProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          edges={['top', 'left', 'right']}
        >
          <StatusBar
            barStyle='light-content'
            backgroundColor={theme.colors.background}
          />
          <Slot />
        </SafeAreaView>
      </AppProvider>
    </ThemeProvider>
  );
}
