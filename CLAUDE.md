# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrickyDex is a React Native mobile app for the rollerblading community, combining a searchable trick dictionary with an interactive BLADE game. Built with Expo, TypeScript, and Expo Router.

## Development Commands

```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device
npm run web        # Web browser

# Testing and quality
npm test           # Run Jest tests (with --watchAll)
npm run lint       # Run Expo linter
```

## Architecture Overview

### File-Based Routing (Expo Router)

The app uses Expo Router with file-based navigation:

- **app/_layout.tsx**: Root layout with AppContext provider and theme configuration
- **app/index.tsx**: Home screen (landing page)
- **app/(tricks)/**: Route group for trick catalog
  - `index.tsx`: Trick list with search and category filtering
  - `[id].tsx`: Dynamic trick detail screen (URL param: id)
- **app/(game)/**: Route group for BLADE game
  - `index.tsx`: Game setup (player names + category selection)
  - `play.tsx`: Active game screen (receives players/categories via route params)
  - `game-over.tsx`: Game results and statistics

Route groups (parentheses) organize screens without affecting URLs. Navigation uses `useRouter()` hooks and `<Link>` components. Data is passed between game screens via URL parameters, not Context.

### State Management

**context/AppContext.tsx** provides lightweight, non-persistent state:
- Favorites: Add/remove favorite tricks
- Recently Viewed: Maintains last 10 viewed tricks
- Initial Load: Controls first-time animations

Important: State resets on app restart. No AsyncStorage or backend persistence exists.

### Data Structures

**types/trick.ts**:
- Contains all 32 tricks as hardcoded data (in-memory database)
- 6 categories: Soul Grinds, Groove Grinds, Special Grinds, Air Tricks, Spins, Flips
- Helper functions: `getTricksByCategory()`, `getTrickById()`, `trickCategories`

```typescript
interface Trick {
  id: number;
  name: string;
  description: string;
  difficulty: number;      // 1-10 scale
  category: string;
  variations?: string[];
  imageUrl?: string;       // Future use
}
```

**types/game.ts**:
- `GameState`: Manages players, current trick, round progression, attempt history
- `Player`: Tracks BLADE letters (penalties) and elimination status
- `TrickAttempt`: Records each attempt in game history
- Game logic in [app/(game)/play.tsx](app/(game)/play.tsx) handles turn progression and elimination

### Theme and Styling

Dark theme with Pokédex-inspired design (defined in [app/_layout.tsx](app/_layout.tsx)):
- Primary Red: `#D13B40`
- Dark Background: `#2D2D2D`
- Card Background: `#393E44`
- Text: `#FFFFFF`
- Success Green: `#2E8B57`

Font: Roboto (Regular 400, Medium 500, Bold 700, Black 900) loaded from @expo-google-fonts/roboto.

All styling uses `StyleSheet.create()`. LinearGradient used for backgrounds.

### Animations

React Native Reanimated v3 for GPU-accelerated animations. Utility hooks in [utils/animations.ts](utils/animations.ts):

- `useCardAnimation()`: Scale and fade for card transitions
- `useScoreAnimation()`: Bounce effect for score updates
- `useLetterAnimation()`: Scale + rotation for BLADE letter reveals

Animation patterns favor spring physics for natural, playful feel.

## Key Architectural Decisions

1. **No Data Persistence**: Game sessions, favorites, and recently viewed tricks are lost on app restart. Future enhancement would add AsyncStorage.

2. **In-Memory Trick Database**: All tricks hardcoded in [types/trick.ts](types/trick.ts). Scalable to a few hundred tricks; larger collections would need database.

3. **Route Parameters for Game State**: Players and category selections passed via URL params to play screen. Enables deep linking but loses state on refresh.

4. **No Backend**: Entirely client-side. Perfect for offline-first experience but limits multiplayer features.

5. **Sound Effects Ready but Unused**: MP3 files exist in [assets/sounds/](assets/sounds/) but not yet integrated. expo-av dependency installed for future implementation.

## BLADE Game Rules

The game follows these mechanics (implemented in [app/(game)/play.tsx](app/(game)/play.tsx)):

1. All players attempt the SAME trick each round
2. Failed attempt = one BLADE letter (B → L → A → D → E)
3. Five letters = elimination
4. Last player standing wins
5. Single-player mode = training (no elimination, stats tracking)

Trick selection prevents repetition via `usedTrickIds` array. When all tricks exhausted, resets to allow repetition.

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` points to root (e.g., `import { Trick } from '@/types/trick'`)
- Typed routes enabled via Expo Router plugin

## Dependencies Note

- **expo-av**: Installed but unused (sound effects not implemented)
- **expo-haptics**: Installed but unused (haptic feedback not implemented)
- **expo-blur**: Installed but unused
- **react-native-reanimated**: Used extensively for animations
- **expo-router**: File-based navigation system
