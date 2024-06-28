import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { WagmiProvider } from "wagmi";
import { mainnet } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from "@web3modal/wagmi-react-native";
import Header from "@/components/Header";
import { siweConfig } from "@/utils/siweConfig";

// Setup QueryClient
const queryClient = new QueryClient();

// Web3Modal projectId
const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_CLOUD_PROJECT_ID ?? "";

// Web3Modal metadata
const metadata = {
  name: "React Native SIWE",
  description: "React Native SIWE Example",
  url: "https://callstack.com",
  icons: ["https://avatars.githubusercontent.com/u/42239399?v=4"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

// Choose chains to enable
const chains = [mainnet] as const;

// Use Web3Modal's utils to create the Wagmi config and attach to Web3Modal
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Init Web3Modal instance
createWeb3Modal({
  projectId,
  wagmiConfig,
  siweConfig,
  defaultChain: mainnet,
});

export default function RootLayout() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              header: () => <Header />,
              presentation: "modal",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="authenticated" />
          </Stack>
        </ThemeProvider>
        <Web3Modal />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
