import React, { useMemo } from "react";
import { Stack } from "expo-router";
import { Web3Modal, createWeb3Modal } from "@web3modal/wagmi-react-native";
import { mainnet } from "viem/chains";
import { projectId, useSIWEConfig, wagmiConfig } from "@/utils/walletConnect";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import { ThirdwebProvider } from "thirdweb/react";

// Setup the QueryClient
const queryClient = new QueryClient();

// In the App Layout, we initialize Web3Modal and Wagmi
export default function AppLayout() {
  const { siweConfig } = useSIWEConfig();

  // Init Web3Modal instance
  // We create it inside the component to be able to get the siweConfig from the hook
  createWeb3Modal({
    projectId,
    wagmiConfig,
    defaultChain: mainnet,
    siweConfig,
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <Stack
            screenOptions={{
              header: () => <Header />,
              presentation: "modal",
            }}
          />
        </ThirdwebProvider>
        <Web3Modal />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
