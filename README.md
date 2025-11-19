# Medicalist

Medicalist is a React Native (Expo) application that helps users explore medicines, medical equipment, diseases, and nearby pharmacies. The refreshed experience focuses on a clean visual language, quick access to the most important sections, and actionable insights powered by real-time Firebase data.

## Features

- **Modern dashboard** – A redesigned home screen with a gradient hero card, contextual greeting, and quick-action grid for fast navigation.
- **Location-aware pharmacy recommendations** – Retrieves the user's position (with permission handling) and surfaces the closest pharmacies with shortcuts to Google Maps.
- **Rich medicine catalogue** – Search across the medicine database, view detail pages, and manage favorites that stay synced with Firebase Realtime Database.
- **In-app chat shortcuts** – Jump into conversations with administrators from the hero section.
- **Dark-mode aware styling** – Components adapt automatically when users toggle the theme provided by `react-native-rapi-ui`.

## Tech Stack

- [Expo](https://expo.dev/) / React Native 0.76
- React Navigation (stack + bottom tabs)
- Firebase Authentication, Firestore, and Realtime Database
- Expo Location + `haversine` for geospatial calculations
- Rapi UI design system and Expo Vector Icons

## Project Structure

```
src/
├── navigation/      # Root navigators and tab configuration
├── provider/        # Authentication context
├── screens/         # All feature screens (Home, Obat, Apotek, Profile, etc.)
└── components/      # Reusable presentation helpers
```

Key configuration lives inside `src/screens/firebaseConfig.js`. Update this file with your own Firebase project credentials before running the app in a new environment.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Firebase**

   - Create a Firebase project and enable Authentication, Firestore, and Realtime Database.
   - Copy the web configuration and update `src/screens/firebaseConfig.js` with the new values.

3. **Run the development server**

   ```bash
   npm run start
   ```

   Use the Expo CLI output to launch the app on Android, iOS, or the web. For native targets make sure you have the Expo Go application installed on your device/emulator.

## Available Scripts

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `npm run start`  | Start the Expo bundler                        |
| `npm run android`| Start Expo and open the Android target        |
| `npm run ios`    | Start Expo and open the iOS simulator         |
| `npm run web`    | Launch the project in a web browser           |

## Troubleshooting

- **Location permission denied** – Enable location services for Expo Go or your emulator to see nearby pharmacies.
- **Firebase permission errors** – Ensure your Firestore and Realtime Database security rules allow the authenticated operations performed by the app.
- **Metro bundler cache issues** – Clear the cache with `expo start -c` if you see stale assets or unexpected runtime errors.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-improvement`)
3. Commit your changes and push the branch
4. Open a pull request describing your updates

---

Designed with ❤️ to make healthcare information more accessible.
