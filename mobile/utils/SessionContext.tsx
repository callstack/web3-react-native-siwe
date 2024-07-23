import React from "react";
import { useStorageState } from "./useStorageState";
import { type SIWESession } from "@web3modal/siwe-react-native";
import { useRouter } from "expo-router";

// Context to store the SIWE session and continue authenticated between app launches

const SessionContext = React.createContext<{
  session: SIWESession | null;
  isLoading: boolean;
  signIn: (session: SIWESession) => void;
  signOut: () => void;
}>({
  session: null,
  isLoading: false,
  signIn: () => {},
  signOut: () => {},
});

export function useSession() {
  const value = React.useContext(SessionContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const router = useRouter();

  return (
    <SessionContext.Provider
      value={{
        session: session ? JSON.parse(session) : null,
        isLoading,
        signIn: async (session: SIWESession) => {
          setSession(JSON.stringify(session));
          router.replace("/");
        },
        signOut: () => {
          setSession(null);
        },
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}
