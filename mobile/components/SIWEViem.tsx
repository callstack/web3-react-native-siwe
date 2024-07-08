import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { mainnet } from "viem/chains";
import { createSiweMessage } from "viem/siwe";
import { useAccount, useSignMessage } from "wagmi";
import { W3mButton } from "@web3modal/wagmi-react-native";
import { useSession } from "@/utils/SessionContext";

export default function SIWEViem() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { signIn } = useSession();

  // Sign In With Ethereum manually using Viem
  const signInWithEthereum = async () => {
    if (address) {
      // Fetch nonce from the backend
      const nonceRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/nonce`
      );
      const nonce = await nonceRes.text();

      const expirationTime = new Date();
      expirationTime.setDate(expirationTime.getDate() + 1);

      const chainId = mainnet.id;

      // Create SIWE message with the nonce
      const message = createSiweMessage({
        address,
        chainId,
        domain: "callstack.com",
        nonce,
        uri: "rnsiwe://",
        version: "1",
        expirationTime,
      });

      // Ask wallet to sign the message
      const signature = await signMessageAsync({ account: address, message });

      // Ask backend to verify the message and signature
      const verifyRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, signature }),
        }
      );
      const valid = await verifyRes.json();

      if (valid) {
        // If valid, persist the session and navigate to the authenticated route
        signIn({ address, chainId });
      }
    }
  };

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Text style={styles.title}>SIWE manually with Viem</Text>
          <Pressable
            onPress={signInWithEthereum}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 },
              styles.siweButton,
            ]}
          >
            <Text style={styles.siweText}>Sign In With Ethereum</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>Connect with WalletConnect AppKit</Text>
          <W3mButton />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 20,
  },
  siweButton: {
    padding: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: "rgb(103,215,105)",
  },
  siweText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
