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
- **Storage**: AsyncStorage for persisting player data and game settings

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
│   │   ├── game-over.tsx     # Game over screen
│   │   └── statistics.tsx    # Game statistics screen
│   ├── _layout.tsx           # Root layout component
│   └── index.tsx             # Home screen
├── assets/                   # Static assets (images, fonts, etc.)
├── context/                  # React Context for state management
│   └── AppContext.tsx        # App-wide state management
├── types/                    # TypeScript type definitions
│   ├── trick.ts              # Trick-related types and data
│   └── game.ts               # Game-related types
└── utils/                    # Utility functions
    └── storage.ts            # AsyncStorage utilities for data persistence
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
- Difficulty rating (1-30)
- Category
- Variations (when applicable)

### 2. BLADE Game

The BLADE game is a challenge-based game where players attempt to perform tricks:

- Players take turns attempting the same trick
- If a player fails a trick, they receive a letter (B-L-A-D-E)
- When a player spells "BLADE", they are eliminated
- The last player standing wins
- The game can end in multiple ways:
  - One player remains (standard win)
  - All players are eliminated (the game wins)
  - Multiple players are eliminated on the same trick (tie/draw)
- Fair elimination system: if multiple players fail on the same trick and would spell BLADE, they tie rather than unfairly eliminating only the first player who failed
- Single-player mode is also available for practice
- Player names and game settings are remembered between sessions using local storage

### 3. Persistent Storage

The app implements local storage to enhance the user experience by remembering:

- Player names from previous games
- Difficulty preferences
- Selected trick categories
- Maximum difficulty settings

This ensures that when a user returns to the app, their previous game configurations are automatically loaded, creating a seamless and personalized experience.

## Reference Documentation

### TrickList.md

The project includes a comprehensive reference document (`TrickList.md`) that serves as the definitive source of truth for all trick data in the application:

- **Purpose**: Provides detailed documentation of all tricks, variations, entrances, and difficulty combinations
- **Format**: Structured Markdown with clear sections for each trick category
- **Content**:
  - Full descriptions of each trick and its execution
  - Base difficulty ratings on the 10-point scale
  - Popularity ratings on the 10-point scale
  - All possible variations with their respective difficulty additions
  - All possible entrances with their respective difficulty additions
  - Complete list of difficulty combinations for each trick
  - Table of contents for easy navigation

This document is invaluable for:
- Developers implementing new features related to tricks
- Content editors updating trick descriptions or difficulty ratings
- Users who want to explore the comprehensive trick database outside the app
- Maintaining consistency between the app data and documentation

The data in this file serves as the source material for the `trick.ts` implementation, ensuring that all difficulty ratings and trick descriptions in the app accurately reflect the documented values.

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
- Automatically loads previously saved player names and game settings
- Saves player configurations as they're updated

#### Game Play (`app/(game)/play.tsx`)

The main game screen where:
- Displays current player and trick
- Success/Fail buttons for trick attempts
- Shows player status with BLADE letters
- Tracks game progress
- Handles player elimination
- Animates trick reveals and letter additions
- Saves difficulty preferences as they're adjusted

#### Game Over (`app/(game)/game-over.tsx`)

Displays the final results of the game:
- Winner announcement
- Player rankings
- Game statistics
- Option to play again

#### Statistics (`app/(game)/statistics.tsx`)

Provides comprehensive game analytics:
- Overview with total games played and latest game date
- Player rankings based on performance metrics:
  - Win rates across all games
  - Trick success rates
  - Total games played
- Visual data representations through charts:
  - Difficulty distribution chart showing usage of different difficulty levels
  - Game mode distribution chart showing preference for easy/medium/hard modes
- Responsive design with loading states and empty state messaging
- Utilizes react-native-chart-kit for data visualization
- Reads data directly from the persistent game history

## Difficulty System

The TrickyDex game features a comprehensive difficulty management system that ensures appropriate challenge levels for players:

### Difficulty Components

1. **Base Trick Difficulty**:
   - Each trick has a base difficulty rating (1-30)
   - Higher numbers indicate more challenging tricks

2. **Variation Difficulty**:
   - Optional variations add complexity to tricks
   - Each variation has its own difficulty rating that adds to the base trick difficulty

3. **Entrance Difficulty**:
   - Optional entrances (ways to initiate tricks) add additional complexity
   - Each entrance has its own difficulty rating that further adds to the total difficulty

4. **Total Difficulty Calculation**:
   - Sum of base trick + variation + entrance difficulties
   - Capped at a maximum of 30 for the final value

### Adaptive Difficulty

The game intelligently adjusts difficulty based on player performance:

- **Difficulty Preferences**:
  - Easy mode: Favors tricks with difficulty ≤ 9
  - Medium mode: Balances between difficulty 6-18
  - Hard mode: Favors tricks with difficulty ≥ 12

- **Dynamic Adjustment**:
  - System tracks player success/failure
  - Automatically increases difficulty after multiple successful attempts
  - Automatically decreases difficulty after multiple failed attempts
  - Difficulty preference is saved between sessions

- **User Controls**:
  - Players can manually adjust the maximum difficulty (1-30)
  - Setting persists between game sessions
  - Controls are accessible directly from the game screen

### Max Difficulty Setting

Players can control the maximum difficulty of tricks with a user-adjustable setting (1-30):

- Accessible through UI controls during gameplay
- Strictly enforced across base trick, variation, and entrance selection
- Ensures proper progression as player skill increases
- Prevents overwhelming players with tricks beyond their current skill level

### Trick Selection Algorithm

The trick selection algorithm ensures appropriate challenge levels:

- Uses weighted selection based on popularity ratings (1-10)
- Filters tricks by selected categories and maximum difficulty
- Ensures variations and entrances respect the maximum difficulty constraint
- Implements a 30% chance to skip entrances for variety
- Balances between challenge and accessibility based on difficulty preference

## Persistent Storage System

The app implements a robust local storage system using AsyncStorage to save and retrieve:

- **Player Names**: The app remembers player names between sessions, so returning players don't need to re-enter their information
- **Game Settings**: Including selected trick categories, maximum difficulty, and difficulty preferences
- **Storage Implementation**: Utilities in `utils/storage.ts` provide a clean API for saving and loading data
- **Data Structure**: Storage keys are organized by data type to allow for selective loading and saving

This storage system enhances the user experience by:
- Reducing friction for returning players
- Maintaining consistent game settings based on player preferences
- Providing continuity between game sessions
- Supporting a personalized experience for individual or group play

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

1. **Video Demonstrations**: Include video tutorials for each trick
2. **User Accounts**: Add user authentication for personalized experiences
3. **Community Features**: Allow users to share their progress or custom tricks
4. **Advanced Filtering**: Implement more advanced search and filtering options
5. **Trick Combinations**: Add support for trick combinations and sequences
6. **Achievement System**: Implement achievements for learning tricks or winning games
7. **Offline Support**: Ensure full functionality without internet connection
8. **Localization**: Add support for multiple languages
9. **Accessibility**: Improve accessibility features for all users

## CI/CD and Deployment

TrickyDex uses GitHub Actions for continuous integration and deployment to Google Play.

### Workflow Overview

The CI/CD pipeline is defined in `.github/workflows/android-build-deploy.yml` and consists of two main jobs:

1. **Build Job**: Builds the Android app locally in the GitHub runner
2. **Deploy Job**: Deploys the built artifact to Google Play

### Key Features

- **Automated Builds**: Triggered on pushes to `dev`, `staging`, and `main` branches
- **Environment-Based Deployment**:
  - `dev` branch → Internal testing track
  - `staging` branch → Closed testing track
  - `main` branch → Production track
- **Manual Workflow Triggers**: Supports manual workflow dispatch with options to:
  - Skip the build and use the latest artifact
  - Manually specify the Google Play track
  - Choose version increment type (patch, minor, major, none)

### Versioning System

The workflow includes an intelligent versioning system that:

1. **Automatically Increments Version Numbers**:
   - Follows semantic versioning (MAJOR.MINOR.PATCH)
   - Increments version code for Google Play requirements

2. **Smart Version Determination**:
   - Manual selection via workflow dispatch
   - Commit message tags (`#major`, `#minor`) for automatic detection
   - Branch-based defaults (main branch uses at least minor increments)

3. **Version Persistence**:
   - Commits version changes back to the repository
   - Uses `[skip ci]` tag to prevent workflow loops
   - Maintains consistent versioning across builds

4. **EAS Configuration**:
   - Uses `"appVersionSource": "local"` in eas.json to ensure EAS Build uses version codes from app.json
   - This is critical for proper version management in the CI/CD pipeline
   - Without this setting, EAS would ignore the version code in app.json, causing version conflicts

### Required Secrets

The workflow requires the following GitHub secrets:

- `EXPO_TOKEN`: For authenticating with Expo services
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: For deploying to Google Play

### Local Development vs CI/CD

When developing locally, version numbers in `app.json` remain static. The CI/CD pipeline handles version incrementation automatically during the build process, so developers don't need to manually update versions for each release.

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
