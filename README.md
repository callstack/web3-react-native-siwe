# web3-react-native-siwe

This repository showcases how to configure a React Native [Expo](https://expo.dev/) project with [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/) and [WalletConnect Web3Modal](https://docs.walletconnect.com/web3modal/about), and how to use Sign-In With Ethereum (SIWE) and navigate to an authenticated route with Expo Router.

![demo.gif](demo.gif)

## Requirements

- [Expo environment setup](https://docs.expo.dev/get-started/installation/#requirements) (Node.js, Git, Watchman)
- A [Wallet Connect Cloud](https://cloud.walletconnect.com/sign-in) project ID
- Expo Go app installed in your smartphone
- One or more web3 wallets installed in your smartphone (e.g. MetaMask, Rainbow Wallet, Trust Wallet, etc)

## Running the application

- Rename `.env.example` to `.env` and fill in your Wallet Connect Cloud project ID
- `npm install`
- `npm start`
- Open Expo Go app in your smartphone
- If your smartphone is in the same network as your computer, the local dev server should appear as the first option. If it doesn't, use the app to scan the QR Code presented in the terminal
