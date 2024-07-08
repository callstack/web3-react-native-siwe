import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { W3mButton } from "@web3modal/wagmi-react-native";

export default function SIWEAppKit() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect and SIWE with WC AppKit</Text>
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
