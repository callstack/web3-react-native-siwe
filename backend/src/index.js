import cors from "cors";
import express from "express";
import Session from "express-session";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { generateSiweNonce } from "viem/siwe";

const app = express();

app.use(express.json());

app.use(cors({ credentials: true }));

app.use(
  Session({
    name: "siwe-quickstart",
    secret: "siwe-quickstart-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true },
  })
);

app.get("/nonce", function (_, res) {
  res.setHeader("Content-Type", "text/plain");

  // Generate nonce
  const nonce = generateSiweNonce();
  console.log("[BACKEND] Generated nonce:", nonce);

  // Store nonce in session
  req.session.nonce = nonce;

  // Send back response
  res.status(200).send(nonce);
});

app.post("/verify", async function (req, res) {
  const { message, signature } = req.body;

  if (!message) {
    res.status(422).json({ message: "Expected SIWE message in body" });
    return;
  }

  // Create publicClient
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  // Parse message
  const messageFields = parseSiweMessage(message);

  // Verify whether the signed message coming from the frontend is valid for the given address
  const valid = await publicClient.verifySiweMessage({
    message,
    signature,
  });

  console.log(`[BACKEND] SIWE Message valid: ${valid}`);

  if (valid) {
    // If the message is valid, store the message object in the session
    req.session.siwe = messageFields;
    req.session.cookie.expires = new Date(messageFields.expirationTime);
    req.session.save(() => res.status(200).send(true));
  } else {
    // If the message is not valid, clear the session
    req.session.siwe = null;
    req.session.nonce = null;
    req.session.save(() =>
      res.status(422).json({ message: "Invalid signature" })
    );
  }

  // Send back response
  res.send(valid);
});

app.get("/get_session", function (req, res) {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to first sign_in" });
    return;
  }

  console.log("[BACKEND] User is authenticated!");

  res.setHeader("Content-Type", "text/plain");

  // Send back session data
  res.send({
    address: req.session.siwe.address,
    chainId: req.session.siwe.chainId,
  });
});

app.get("/sign_out", function (req, res) {
  // Clear session
  req.session.siwe = null;
  req.session.nonce = null;
  req.session.save(() => res.status(200).send(true));
});

app.listen(3000);
