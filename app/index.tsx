import { StyleSheet, View, Text, Pressable } from "react-native";
import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { mainnet } from "viem/chains";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();
  const router = useRouter();

  const signInWithEthereum = async () => {
    if (address) {
      // Create SIWE message
      const message = createSiweMessage({
        address,
        chainId: mainnet.id,
        domain: "callstack.com",
        nonce: generateSiweNonce(),
        uri: "https://www.callstack.com/blog/best-dx-for-react-native-web3-dapps-with-web3modal-and-wagmi",
        version: "1",
      });

      // Ask wallet to sign the message
      const signature = await signMessageAsync({ account: address, message });

      if (publicClient) {
        // Verify if the signed message is a valid SIWE message
        const valid = await publicClient.verifySiweMessage({
          message,
          signature,
        });

        // If valid, navigate to the authenticated route
        // To keep the example short, this route is not properly protected
        // If you want real protected routes, check the expo docs: https://docs.expo.dev/router/reference/authentication
        if (valid) {
          router.replace("/authenticated");
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {isConnected ? (
        <Pressable
          onPress={signInWithEthereum}
          style={({ pressed }) => [
            { opacity: pressed ? 0.8 : 1 },
            styles.siweButton,
          ]}
        >
          <Text style={styles.siweText}>Sign In With Ethereum</Text>
        </Pressable>
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
