import React from "react";
import { useSession } from "@/utils/SessionContext";
import { Redirect, Slot } from "expo-router";
import { Text } from "react-native";

export default function AuthLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
