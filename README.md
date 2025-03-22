# 🛼 TrickyDex - Rollerblading Trick Dictionary & BLADE Game

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.1-blue)
![Platform](https://img.shields.io/badge/platform-Android-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)

</div>

TrickyDex is a mobile application for rollerblading enthusiasts that combines a comprehensive trick dictionary with an interactive BLADE game for practicing tricks with friends.

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=TrickyDex+App+Screenshot" alt="TrickyDex App Screenshot" width="80%">
</div>

## ✨ Features

### 📚 Trick Catalog
- 🔍 Comprehensive dictionary of rollerblading tricks
- ⭐ Detailed descriptions and difficulty ratings
- 📋 Organized by categories: Soul Grinds, Groove Grinds, Special Grinds, Air Tricks, and more
- 🔎 Search and filter functionality to find specific tricks

### 🎮 BLADE Game
The BLADE game follows these rules:
1. All players must attempt the SAME trick in each round
2. If a player fails a trick, they get a letter (B-L-A-D-E)
3. When a player spells BLADE, they're eliminated
4. Last player standing wins

#### Game Features:
- 🎯 Select specific trick categories to customize your game
- 📊 Track player progress and trick history
- 🧭 Intuitive navigation between game screens
- 🔊 Sound effects for button presses and game events

## 🚧 Development Status

TrickyDex is currently in early development. The UI/UX is in its initial stages and we welcome contributions to improve the visual design and user experience. Feel free to fork the project and submit pull requests with enhancements.

## 🚀 CI/CD and Deployment

TrickyDex uses GitHub Actions for continuous integration and deployment to Google Play.

### 🔄 Automated Workflow

The app is automatically built and deployed using a GitHub Actions workflow defined in `.github/workflows/android-build-deploy.yml`. This workflow:

- 🏗️ Builds the Android app when code is pushed to `dev`, `staging`, or `main` branches
- 📲 Deploys to different Google Play tracks based on the branch:
  - `dev` → Internal testing
  - `staging` → Closed testing
  - `main` → Production

### 🔢 Versioning

The CI/CD pipeline automatically handles versioning:

- 📝 Version numbers follow semantic versioning (MAJOR.MINOR.PATCH)
- 🔄 Version codes are automatically incremented for Google Play
- 💾 Version changes are committed back to the repository
- 🏷️ Commit messages with `#minor` or `#major` tags trigger corresponding version increments

### 🖱️ Manual Deployment

You can also trigger the workflow manually with options to:
- ⏭️ Skip the build and use the latest artifact
- 🎯 Specify a different Google Play track
- 🔢 Choose the version increment type (patch, minor, major, none)

For more details, see the [Project Documentation](./PROJECT_DOCUMENTATION.md).

## 🚀 Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## 👥 Contributing

We welcome contributions to TrickyDex! Here are some areas where we'd especially appreciate help:

- 🎨 UI/UX improvements
- 📚 Additional trick data and categories
- ⚡ Performance optimizations
- 🎮 New game modes or features

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🛠️ Technologies Used

- ⚛️ React Native
- 📱 Expo
- 📘 TypeScript
- 🧭 Expo Router for navigation
- 🔊 Expo Audio for sound effects
- 🔄 GitHub Actions for CI/CD
- 🏗️ EAS Build for local builds

## 📄 License

This project is open source and available under the MIT License.

## 📬 Contact

For questions or suggestions, please open an issue on the GitHub repository.

---

<div align="center">

Built with ❤️ for the Rollerblading community

</div>
