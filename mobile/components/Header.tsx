import React from "react";
import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import { useAccount, useDisconnect } from "wagmi";

function Header() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>React Native SIWE</Text>

        {isConnected && (
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 },
              styles.disconnectButton,
            ]}
            onPress={() => disconnect?.()}
          >
            <Text style={styles.disconnectText}>Disconnect</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderColor: "lightgray",
    marginHorizontal: 10,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -1,
    fontStyle: "italic",
  },
  disconnectButton: {
    marginLeft: "auto",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderCurve: "continuous",
    backgroundColor: "red",
  },
  disconnectText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Header;
