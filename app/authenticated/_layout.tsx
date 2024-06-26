import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function AuthenticatedLayout() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // When user disconnects the wallet, move back to the unauthenticated route
    if (!isConnected) {
      router.replace("/");
    }
  }, [isConnected]);

  return <Slot />;
}
