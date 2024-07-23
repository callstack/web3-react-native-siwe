import React from "react";
import { client } from "@/utils/thirdweb";
import { View, Text, StyleSheet } from "react-native";
import { ConnectButton } from "thirdweb/react";
import { LoginPayload, VerifyLoginPayloadParams } from "thirdweb/auth";

export default function SIWEThirdweb() {
  console.log("trest");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect with Thirdweb</Text>
      <ConnectButton
        client={client}
        auth={{
          getLoginPayload: async ({ address }): Promise<LoginPayload> => {
            console.log("Calling getLoginPayload - address: ", address);

            const getLoginPayloadRes = await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/thirdweb_get_login_payload`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
              }
            );
            return await getLoginPayloadRes.json();
          },
          doLogin: async (params: VerifyLoginPayloadParams) => {
            console.log("Calling doLogin - params: ", JSON.stringify(params));

            await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/thirdweb_do_login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
              }
            );
          },
          isLoggedIn: async () => {
            console.log("Calling isLoggedIn");

            const isLoggedInRes = await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/thirdweb_is_logged_in`
            );
            return await isLoggedInRes.json();
          },
          doLogout: async () => {
            console.log("Calling doLogout");

            await fetch(
              `${process.env.EXPO_PUBLIC_BACKEND_URL}/thirdweb_do_logout`
            );
          },
        }}
      />
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
