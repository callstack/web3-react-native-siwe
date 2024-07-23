import React from "react";
import { StyleSheet, View } from "react-native";
import SIWEViem from "@/components/SIWEViem";
import SIWEAppKit from "@/components/SIWEAppKit";
import SIWEThirdweb from "@/components/SIWEThirdweb";

export default function SignIn() {
  return (
    <View style={styles.container}>
      <SIWEViem />
      <SIWEThirdweb />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    gap: 40,
    padding: 20,
  },
});
