# MusiSyncCapstone

MusiSync is a cross platform application that aims to allow for users to sync their owned music files across their devices.

## How to Run
First, [set up your enviornment.](https://reactnative.dev/docs/0.76/set-up-your-environment)

Next, [configure Android emulator](https://www.waldo.com/blog/run-a-react-native-app)

Navigate to the downloaded repository in your terminal.

`npm install -save`

`npx react-native *platform*`

**Platform Options**
- `run-android`
- `run-windows`
- `run-ios` *untested
- `run-macos` *untested

Note: `react-native-safe-area-context` throws a lot of warnings when launching, the developers know about this and have attempted to fix it. Functionality is still preserved, and they can be ignored.

## Technical Description
MusiSync aims to accomplish this without a centralised user database. The decentralised nature we are aiming for means we never handle any files a user sends. This not only ensures user privacy, but helps protect us from copyright infringement claims. Our tool will work on the local network, which aims to limit our tool's usefulness for music piracy and potential cybersecurity risks that were prevalent in applications like Napster.

## Tech Stack
Our current plan for MusicSync is a fairly straightforward stack. The networking framework is subject to change as the team does not have much experience in the area.

UI - TypeScript React Native, NativeWind CSS wrapper

Middleware - Node JS, Typescript, React Native Crypto JS, React Native TCP socket, React native netinfo

Backend - React Native File System, Realm, Buffer



