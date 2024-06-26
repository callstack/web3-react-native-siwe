import { StyleSheet, View, Text, Pressable } from "react-native";
import { useAccount, useSignMessage } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { mainnet } from "viem/chains";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();

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

      // Create SIWE message with the nonce
      const message = createSiweMessage({
        address,
        chainId: mainnet.id,
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

      // If valid, navigate to the authenticated route
      const valid = await verifyRes.json();

      if (valid) {
        // To keep the example short, this route is not properly protected
        // If you want real protected routes, check the Expo docs: https://docs.expo.dev/router/reference/authentication
        router.replace("/authenticated");
      }
    }
  };

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Text>You can also sign in manually:</Text>
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
        <Text>Please Connect Wallet to begin</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 20,
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
