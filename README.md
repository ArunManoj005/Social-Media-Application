# DeepMark - Social Media Mobile Application

DeepMark is a React Native mobile application built with Expo that allows users to share photos and videos also engage with content through likes.

## Features

- **Authentication System**
  - User registration and login
  - Token-based authentication
  - Persistent sessions using AsyncStorage

- **Social Media Core Features**
  - Photo and video uploads
  - User profiles with bio and profile picture
  - Feed with posts 
  - Like functionality
  - Activity notifications

- **User Interface**
  - Modern, responsive design with NativeWind (Tailwind CSS for React Native)
  - Animated components using React Native Reanimated
  - Tab-based navigation

- **Media Handling**
  - Image and video uploads via Expo Image Picker
  - Cloud storage and optimization using Cloudinary

## Tech Stack

- **Frontend**
  - React Native & Expo
  - TypeScript
  - NativeWind (Tailwind CSS)
  - React Native Reanimated (for animations)
  - Expo Router (for navigation)

- **Storage & Media**
  - AsyncStorage (for local data)
  - Cloudinary (for media storage and management)
  - Expo Image Picker (for media selection)

- **Authentication**
  - JWT-based authentication
  - Context API for auth state management

## Project Structure

- **`src/app`**: Contains the main app screens organized by routes
  - `(auth)`: Authentication screens (login, signup)
  - `(tabs)`: Main app tabs (feed, new post, profile)
  - `(screens)`: Other screens (activity, edit profile)

- **`src/components`**: Reusable UI components
  - UI elements (Button, ActivityListItem, Modal)
  - Post-related components (PostListItem, PostContent)
  - Profile components (ProfileHeader, ProfilePostGrid)

- **`src/providers`**: Context providers
  - AuthProvider: Manages authentication state

- **`src/lib`**: Utility functions and services
  - Cloudinary configuration and helpers

## Setup and Installation

1. **Prerequisites**
   - Node.js
   - Expo CLI (`npm install -g expo-cli`)
   - Expo Go app for iOS/Android (for testing)

2. **Environment Setup**
   ```
   # Create a .env file in the root directory with:
   EXPO_PUBLIC_BASE_URL=your_backend_api_url
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

3. **Install Dependencies**
   ```
   npm install
   ```

4. **Start Development Server**
   ```
   npm start
   ```

5. **Run on Mobile Device**
   - Scan the QR code with Expo Go app
   - Or run on simulator: `npm run ios` or `npm run android`

## Backend Requirements

You can use the DeepMark-backend project as the backend or create your own.

## Contributing

Contributions to DeepMark are welcome! Please feel free to submit a Pull Request.
