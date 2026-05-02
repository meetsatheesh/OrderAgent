#!/bin/bash

# This script helps in generating the Android APK using EAS Build (Expo Application Services)
# Prerequisite: npm install -g eas-cli

echo "Starting Android APK generation process..."

# 1. Install dependencies
echo "Installing dependencies..."
npm install

# 2. Check if EAS is installed
if ! command -v eas &> /dev/null
then
    echo "EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# 3. Configure EAS if not already done
# echo "Configuring EAS..."
# eas build:configure

# 4. Build for Android (APK)
echo "Building APK for Android (Preview profile)..."
echo "Note: You need to be logged into EAS account (eas login)"
# eas build -p android --profile preview

echo "Follow the EAS CLI prompts to complete the build."
echo "Once complete, you will receive a link to download the APK."
