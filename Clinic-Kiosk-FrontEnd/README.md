# Dr Fazel's Chiro Clinic - Kiosk App

A tablet-friendly check-in system for Dr Fazel's Chiro Clinic, built with React Native and Expo.

## Features

### Patient Flow
- **Home Screen**: Welcome screen with a large "Check In" button.
- **Appointment Search**: Find appointments by name or phone number.
- **Appointment Review**: Confirm details before checking in.
- **Consent & Signature**: SMS notification consent and digital signature capture.
- **Check-In Success**: Real-time queue position and estimated wait time.

### Admin Dashboard
- **Secure Login**: Access for clinic staff.
- **Queue Overview**: Monitor PT, Chiro Adjustment, and Review queues.
- **Queue Management**: Reorder patients (Move Up/Down) or remove them with reason comments.
- **Wait Time Control**: Live updates for estimated wait times across all queues.

## Tech Stack
- **Framework**: React Native (via Expo)
- **Navigation**: React Navigation
- **Icons**: Lucide React Native
- **UI**: Custom premium design system

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo Go app on your phone (to test)

### Installation
1. Clone the repository
2. Run `npm install`

### Running the app
- **Web**: `npm run web`
- **Android**: `npm run android`
- **iOS**: `npm run ios`

## Building for Android (APK)

We recommend using EAS Build for the easiest APK generation.

1. Install EAS CLI: `npm install -g eas-cli`
2. Run the build script: `./scripts/build_android.sh`
3. Follow the prompts to generate your APK.

## Project Structure
- `src/components`: Reusable UI elements (Button, Input, etc.)
- `src/screens`: All application screens (Patient & Admin flows)
- `src/navigation`: App navigation configuration
- `src/constants`: Theme, colors, and sizing
- `src/services`: Mock data and API interface
