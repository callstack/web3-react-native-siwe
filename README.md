# web3-react-native-siwe

This repository showcases how to configure Sign-In With Ethereum (SIWE) on a React Native app, while validating the SIWE message in a Node.js backend.

The React Native [Expo](https://expo.dev/) project is built with [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/) and [WalletConnect AppKit](https://docs.walletconnect.com/appkit/overview). The app asks the backend to validate the SIWE message (also using Viem) and navigates to an authenticated route using Expo Router.

![demo.gif](demo.gif)

## Requirements

- [Expo environment setup](https://docs.expo.dev/get-started/installation/#requirements) (Node.js, Git, Watchman)
- A [Wallet Connect Cloud](https://cloud.walletconnect.com/sign-in) project ID
- Expo Go app installed in your smartphone
- One or more web3 wallets installed in your smartphone (e.g. MetaMask, Rainbow Wallet, Trust Wallet, etc)

## Running the application

Run `npm start` on both the `/backend` and `/mobile` directories.

### Backend

- `cd backend`
- `npm install`
- `npm start`

### Mobile

- `cd mobile`
- Rename `.env.example` to `.env` and fill in your Wallet Connect Cloud project ID, and your computer's local IP
- `npm install`
- `npm start`
- Open Expo Go app in your smartphone
- If your smartphone is in the same network as your computer, the local dev server should appear as the first option. If it doesn't, use the app to scan the QR Code presented in the terminal
