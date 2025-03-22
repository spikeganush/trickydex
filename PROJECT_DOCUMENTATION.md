# TrickyDex Project Documentation

## Project Overview

TrickyDex is a React Native mobile application built with Expo that serves as a comprehensive catalog and reference guide for inline skating tricks. The app also includes a game feature called "BLADE" where players can challenge each other to perform tricks.

## Tech Stack

- **Framework**: React Native with Expo (v52.0.38)
- **Navigation**: Expo Router (v4.0.19)
- **UI Components**: Native React Native components with custom styling
- **Animations**: React Native Reanimated (v3.16.1)
- **Styling**: StyleSheet API with LinearGradient for backgrounds
- **Icons**: Expo Vector Icons (Ionicons)
- **Typography**: Google Fonts (Roboto family)

## Project Structure

```
TrickyDexAi/
├── app/                      # Main application screens
│   ├── (tricks)/             # Trick catalog related screens
│   │   ├── index.tsx         # Trick catalog list screen
│   │   └── [id].tsx          # Trick detail screen
│   ├── (game)/               # BLADE game related screens
│   │   ├── index.tsx         # Game setup screen
│   │   ├── play.tsx          # Game play screen
│   │   └── game-over.tsx     # Game over screen
│   ├── _layout.tsx           # Root layout component
│   └── index.tsx             # Home screen
├── assets/                   # Static assets (images, fonts, etc.)
├── context/                  # React Context for state management
│   └── AppContext.tsx        # App-wide state management
├── types/                    # TypeScript type definitions
│   ├── trick.ts              # Trick-related types and data
│   └── game.ts               # Game-related types
└── utils/                    # Utility functions
```

## Core Features

### 1. Trick Catalog

The trick catalog is the main feature of the app, providing a comprehensive database of inline skating tricks organized by categories:

- **Soul Grinds**: Soul, Makio, Mizou, Acid, Mistrial, X Grind, Sidewalk, PStar
- **Groove Grinds**: Royale, Unity, Torque, Backslide, Frontside, Darkslide, Fastslide, Pudslide
- **Special Grinds**: Fishbrain, Kindgrind, Savannah, Soyale, Sweatstance, Misfit, Sunny Day
- **Air Tricks**: Various aerial maneuvers
- **Spins**: Various spin tricks
- **Flips**: Various flip tricks

Each trick includes:
- Unique ID
- Name
- Description
- Difficulty rating (1-10)
- Category
- Variations (when applicable)

### 2. BLADE Game

The BLADE game is a challenge-based game where players attempt to perform tricks:

- Players take turns attempting the same trick
- If a player fails a trick, they receive a letter (B-L-A-D-E)
- When a player spells "BLADE", they are eliminated
- The last player standing wins
- Single-player mode is also available for practice

## Component Breakdown

### Home Screen (`app/index.tsx`)

The entry point of the application featuring:
- TrickyDex logo and title with animation
- Navigation buttons to the Trick Catalog and BLADE Game
- Styled with LinearGradient background

### App Layout (`app/_layout.tsx`)

Defines the overall layout and theme for the application:
- Sets up custom theme with colors and typography
- Loads Google Fonts (Roboto variants)
- Configures StatusBar
- Wraps the app with necessary providers (ThemeProvider, AppProvider)

### Trick Catalog Screens

#### Trick List (`app/(tricks)/index.tsx`)

Displays the list of all tricks with:
- Search functionality
- Category filtering
- Two-column grid layout for tricks
- Each trick card shows ID, name, category, and difficulty

#### Trick Detail (`app/(tricks)/[id].tsx`)

Shows detailed information about a specific trick:
- Trick name, ID, and category
- Visual difficulty meter
- Detailed description
- List of variations (if available)
- Favorite button to save tricks
- Animations for a polished UX

### BLADE Game Screens

#### Game Setup (`app/(game)/index.tsx`)

Allows players to set up a new game:
- Add/remove players
- Select trick categories to include
- View game rules
- Start game button

#### Game Play (`app/(game)/play.tsx`)

The main game screen where:
- Displays current player and trick
- Success/Fail buttons for trick attempts
- Shows player status with BLADE letters
- Tracks game progress
- Handles player elimination
- Animates trick reveals and letter additions

#### Game Over (`app/(game)/game-over.tsx`)

Displays the final results of the game:
- Winner announcement
- Player rankings
- Game statistics
- Option to play again

## State Management

The app uses React Context API for state management through `AppContext.tsx`:

### App Context Features

- **Favorites Management**:
  - Add/remove favorite tricks
  - Check if a trick is favorited
  - Get list of favorite tricks

- **Recently Viewed Tracking**:
  - Add tricks to recently viewed list
  - Get list of recently viewed tricks
  - Automatically limits to 10 most recent

- **App State**:
  - Track initial app load for animations

## Data Structure

### Trick Data (`types/trick.ts`)

Contains the trick data structure and initial dataset:
- Trick interface definition
- Category types and labels
- Complete dataset of tricks with all properties
- Helper functions for filtering tricks

### Game Data (`types/game.ts`)

Defines the game state structure:
- Player interface
- TrickAttempt interface for tracking attempts
- GameState interface for overall game state

## UI/UX Design

The app features a dark theme with red accents inspired by traditional Pokédex designs:

- **Color Palette**:
  - Primary: #D13B40 (Pokedex red)
  - Background: #2D2D2D (Dark background)
  - Card Background: #393E44
  - Text: #FFFFFF (White)
  - Accents: #FFD700 (Gold for highlights)

- **Typography**:
  - Roboto font family with multiple weights
  - Consistent text sizing and spacing

- **Animations**:
  - Spring animations for smooth transitions
  - Scale and opacity animations for elements
  - Rotation animations for interactive elements

## Future Development Opportunities

1. **Data Persistence**: Implement AsyncStorage or a database to save user favorites and game history
2. **User Accounts**: Add user authentication for personalized experiences
3. **Video Demonstrations**: Include video tutorials for each trick
4. **Community Features**: Allow users to share their progress or custom tricks
5. **Advanced Filtering**: Implement more advanced search and filtering options
6. **Trick Combinations**: Add support for trick combinations and sequences
7. **Achievement System**: Implement achievements for learning tricks or winning games
8. **Offline Support**: Ensure full functionality without internet connection
9. **Localization**: Add support for multiple languages
10. **Accessibility**: Improve accessibility features for all users

## Getting Started for Developers

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Use Expo Go app to test on physical devices or use emulators

## Build and Deployment

The project uses EAS (Expo Application Services) for building and deploying:
- Configuration in `eas.json`
- Commands for building:
  - `eas build --platform android`
  - `eas build --platform ios`
  - `eas submit` for app store submission

### GitHub Actions CI/CD Pipeline

The project includes an automated CI/CD pipeline using GitHub Actions:
- Configuration in `.github/workflows/android-build-deploy.yml`
- Automatically builds and deploys to Google Play based on branch:
  - `dev` branch → Internal testing track
  - `staging` branch → Closed testing track
  - `main` branch → Production track
- Required secrets:
  - `EXPO_TOKEN`: Expo access token for building
  - `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: Google Play service account credentials

To use the CI/CD pipeline:
1. Push changes to the appropriate branch
2. GitHub Actions will automatically build and deploy
3. Monitor the workflow in the Actions tab of the repository
