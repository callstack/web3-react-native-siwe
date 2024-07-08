import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { SessionProvider } from "@/utils/SessionContext";
import "react-native-reanimated";

// In this Root Layout, we mount the session provider that will be needed in the children routes
export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider value={DefaultTheme}>
        <Slot />
      </ThemeProvider>
    </SessionProvider>
  );
}
