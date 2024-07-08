import { useSession } from "@/utils/SessionContext";
import { StyleSheet, View, Text, Pressable } from "react-native";

export default function AuthenticatedScreen() {
  const { signOut } = useSession();

  return (
    <View style={styles.container}>
      <Text>Authenticated</Text>

      <Pressable
        onPress={signOut}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.button]}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 10,
  },
  button: {
    padding: 10,
    height: 50,
    minWidth: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
