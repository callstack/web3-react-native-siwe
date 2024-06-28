import {
  createSIWEConfig,
  formatMessage,
  type SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs,
  type SIWESession,
} from "@web3modal/siwe-react-native";
import { mainnet } from "viem/chains";

export const siweConfig = createSIWEConfig({
  getNonce: async (): Promise<string> => {
    const nonceRes = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/nonce`
    );
    const nonce = await nonceRes.text();
    return nonce;
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
      const valid = await verifyRes.json();
      return valid;
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
  createMessage: ({ address, ...args }: SIWECreateMessageArgs): string => {
    return formatMessage(args, address);
  },
  getMessageParams: async () => {
    return {
      domain: "rnsiwe://",
      uri: "rnsiwe://",
      chains: [mainnet.id],
      statement: "Please sign with your account",
      iat: new Date().toISOString(),
    };
  },
});
