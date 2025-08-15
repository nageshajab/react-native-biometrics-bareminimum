# react-native-biometrics-bareminimum

This is a new [**React Native**] project, bootstrapped using [`@react-native-community/cli`]

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start debugging locally

````sh
# Using npm
npm start

## Step 2: Build and run your app

### Android

```sh
# Using npm
npm run android
````

### Install React Navigation

run these commands

### for navigation

```sh
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
```

### for bottom tab navigation

```sh
npm install @react-navigation/bottom-tabs

```

## using react-native-biometrics library

npm install react-native-biometrics
Using this library to handle biometric authentication
check out its code in LoginScreen.tsx

## using react-native-keychain

npm install react-native-keychain

### store token

Once user logged in we store token in LoginScreen.tsx

```sh
await Keychain.setGenericPassword
```

### get token, validate at common place

```sh
const credentials = await Keychain.getGenericPassword();
```

if credentilas is true, that means valid user
code is handled in file AuthService.tsx

### clear token after user logout

code is in App.tsx file, handleLoginStatusChange function

```sh
   await Keychain.resetGenericPassword();
```

## troubleshooting help

1. When app suddenly stop working check whether you have installed any new npm packages
2. Go to android folder, and run "gradlew clean" and then start debugging
3. Check from android studio whether the emulator is starting normally
4. In some cases you might have to create a new device emulator

// redirectUri: 'msauth://com.biometrics/2FJUv0rohqwxD0YdLtUvR0XYCv8%3D',
