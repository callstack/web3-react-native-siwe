import {
  createSIWEConfig,
  formatMessage,
  type SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs,
  type SIWESession,
} from "@web3modal/siwe-react-native";
import { defaultWagmiConfig } from "@web3modal/wagmi-react-native";
import { mainnet } from "viem/chains";
import { useSession } from "./SessionContext";

// Web3Modal projectId
export const projectId =
  process.env.EXPO_PUBLIC_WALLETCONNECT_CLOUD_PROJECT_ID ?? "";

// Web3Modal metadata
export const metadata = {
  name: "React Native SIWE",
  description: "React Native SIWE Example",
  url: "https://callstack.com",
  icons: ["https://avatars.githubusercontent.com/u/42239399?v=4"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

// Choose chains to enable
export const chains = [mainnet] as const;

// Use Web3Modal's utils to create the Wagmi config and attach to Web3Modal
export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Hook to create the WalletConnect SIWE config
// We do it like this to be able to persist the session in the `onSignIn` function, when SIWE succeeds
export function useSIWEConfig() {
  const { signIn } = useSession();

  const siweConfig = createSIWEConfig({
    getNonce: async (): Promise<string> => {
      try {
        const nonceRes = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/nonce`
        );
        return await nonceRes.text();
      } catch (error) {
        return "";
      }
    },
    verifyMessage: async ({
      message,
      signature,
      cacao,
    }: SIWEVerifyMessageArgs): Promise<boolean> => {
      try {
        const verifyRes = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, signature }),
          }
        );
        return await verifyRes.json();
      } catch (error) {
        return false;
      }
    },
    getSession: async (): Promise<SIWESession | null> => {
      const sessionRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/get_session`
      );
      const session = await sessionRes.json();

      if (!session) throw new Error("[APPKIT SIWE] Failed to get session!");

      const { address, chainId } = session;
      return { address, chainId };
    },
    signOut: async (): Promise<boolean> => {
      try {
        const signOutRes = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/sign_out`
        );
        return await signOutRes.json();
      } catch {
        return false;
      }
    },
    getMessageParams: async () => {
      const expirationTime = new Date();
      expirationTime.setDate(expirationTime.getDate() + 1);

      return {
        domain: "callstack.com",
        uri: "rnsiwe://",
        chains: [mainnet.id],
        statement: "Please sign with your account",
        iat: new Date().toISOString(),
        // TODO: This doesn't work: `exp` is not included in the message
        // Check with the WalletConnect team
        exp: expirationTime.toISOString(),
      };
    },
    createMessage: ({ address, ...args }: SIWECreateMessageArgs): string => {
      let formattedMessage = formatMessage(args, address);

      // This works: had to manually insert expiration time here
      // Shouldn't be needed once the WC SDK is fixed
      const expirationTime = new Date();
      expirationTime.setDate(expirationTime.getDate() + 1);
      formattedMessage = `${formattedMessage}\nExpiration Time: ${expirationTime.toISOString()}`;

      return formattedMessage;
    },
    onSignIn: async (session?: SIWESession) => {
      if (session) {
        // When SIWE succeeds, persist the session and navigate to the authenticated route
        signIn(session);
      }
    },
  });

  return { siweConfig };
}
