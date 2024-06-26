import { StyleSheet, View, Text } from "react-native";

export default function AuthenticatedScreen() {
  return (
    <View style={styles.container}>
      <Text>Authenticated</Text>
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
});
