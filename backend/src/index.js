import cors from "cors";
import express from "express";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { generateSiweNonce } from "viem/siwe";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/nonce", function (_, res) {
  res.setHeader("Content-Type", "text/plain");

  // Generate nonce
  const nonce = generateSiweNonce();

  console.log("[BACKEND] Generated nonce:", nonce);

  // Send back response
  res.send(nonce);
});

app.post("/verify", async function (req, res) {
  const { message, signature } = req.body;

  // Create publicClient
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  // Verify whether the signed message coming from the frontend is valid for the given address
  const valid = await publicClient.verifySiweMessage({
    message,
    signature,
  });

  console.log(`[BACKEND] SIWE Message valid: ${valid}`);

  // Send back response
  res.send(valid);
});

app.listen(3000);
