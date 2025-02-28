# MusiSyncCapstone

MusiSync is a cross platform application that aims to allow for users to sync their owned music files across their devices.

## How to Run

Navigate to the downloaded repository in your terminal.

`npm install -save`

`npx react-native *platform*`

**Platform Options**
- `run-android`
- `run-windows`
- `run-ios` *untested
- `run-macos` *untested

## Technical Description
MusiSync aims to accomplish this without a centralised user database. The decentralised nature we are aiming for means we never handle any files a user sends. This not only ensures user privacy, but helps protect us from copyright infringement claims. Our tool will work on the local network, which aims to limit our tool's usefulness for music piracy and potential cybersecurity risks that were prevalent in applications like Napster.

## Tech Stack
Our current plan for MusicSync is a fairly straightforward stack. The networking framework is subject to change as the team does not have much experience in the area.

UI - TypeScript React Native

Middleware - Node JS, Typescript

Backend - React Native File System, Web RTC (Networking)



