import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { W3mButton } from "@web3modal/wagmi-react-native";

export default function SIWEThirdweb() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect and SIWE with Thirdweb</Text>
      <W3mButton />
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
});
