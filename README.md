# 🛼 TrickyDex
# Rollerblading Trick Dictionary & BLADE Game

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.6-blue)
![Platform](https://img.shields.io/badge/platform-Android-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)

</div>

TrickyDex is a mobile application for rollerblading enthusiasts that combines a comprehensive trick dictionary with an interactive BLADE game for practicing tricks with friends.
<style>
  .img__container {
    display: flex;
    gap: 5px;
    img {
      flex: 1;
    }
  }
</style>
<div class="img__container" align="center">
  <a href="https://postimg.cc/pynxcTbH" target="_blank"><img src="https://i.postimg.cc/2j066b0V/Screenshot-1742727917.png" alt="Screenshot-1742727917"/></a><br/><br/>
<a href="https://postimg.cc/21TfLLv4" target="_blank"><img src="https://i.postimg.cc/fbQWFxRg/Screenshot-1742727921.png" alt="Screenshot-1742727921"/></a><br/><br/>
<a href="https://postimg.cc/k27m5vVJ" target="_blank"><img src="https://i.postimg.cc/XYC7Q24C/Screenshot-1742727927.png" alt="Screenshot-1742727927"/></a><br/><br/>
<a href="https://postimg.cc/3dXh7cxf" target="_blank"><img src="https://i.postimg.cc/BQyn5W93/Screenshot-1742727956.png" alt="Screenshot-1742727956"/></a><br/><br/>
<a href="https://postimg.cc/hfWnkBc7" target="_blank"><img src="https://i.postimg.cc/tC7gVqcD/Screenshot-1742727968.png" alt="Screenshot-1742727968"/></a><br/><br/>
<a href="https://postimg.cc/R3Fx7CQ2" target="_blank"><img src="https://i.postimg.cc/5t59M6H9/Screenshot-1742727983.png" alt="Screenshot-1742727983"/></a><br/><br/>

</div>

## ✨ Features

### 📚 Trick Catalog
- 🔍 Comprehensive dictionary of rollerblading tricks
- ⭐ Detailed descriptions and difficulty ratings
- 📋 Organized by categories: Soul Grinds, Groove Grinds, Special Grinds, Air Tricks, and more
- 🔎 Search and filter functionality to find specific tricks
- 📄 Complete trick reference document ([TrickList.md](./TrickList.md)) with detailed difficulty combinations (Open to modifications)

### 🎮 BLADE Game
The BLADE game follows these rules:
1. All players must attempt the SAME trick in each round
2. If a player fails a trick, they get a letter (B-L-A-D-E)
3. When a player spells BLADE, they're eliminated
4. Last player standing wins

#### Game Features:
- 🎯 Select specific trick categories to customize your game
- 🔢 Adjustable difficulty system with settings from 1-10
- 🎚️ Adaptive difficulty that responds to player performance
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
- ⚙️ Uses `"appVersionSource": "local"` in eas.json to ensure proper version management

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

## 🙏 Acknowledgements

- 📚 Trick data and descriptions are based on information from [Book of Grinds](https://bookofgrinds.com/), a comprehensive resource for aggressive inline skating tricks
- Special thanks to the rollerblading community for maintaining and sharing this knowledge

## 📄 License

This project is open source and available under the MIT License.

## 📬 Contact

For questions or suggestions, please open an issue on the GitHub repository.

---

<div align="center">

Built with ❤️ for the Rollerblading community

</div>
