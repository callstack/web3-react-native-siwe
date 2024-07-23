import cors from "cors";
import express from "express";
import Session from "express-session";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { generateSiweNonce, parseSiweMessage } from "viem/siwe";
import { createThirdwebClient } from "thirdweb";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";

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
  }),
);

// ========== GENERIC SIWE ENDPOINTS ==========

app.get("/nonce", function (req, res) {
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
  } else {
    // If the message is not valid, clear the session
    req.session.siwe = null;
    req.session.nonce = null;
    req.session.save(() =>
      res.status(422).json({ message: "Invalid signature" }),
    );
    return;
  }

  // Send back response
  res.status(200).send(valid);
});

app.get("/get_session", function (req, res) {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to first sign_in" });
    return;
  }

  console.log("[BACKEND] User is authenticated!");

  res.setHeader("Content-Type", "text/plain");

  // Send back session data
  res.status(200).send({
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

// ========== THIRDWEB ENDPOINTS ==========
// The Thirdweb SDK follows a slightly different structure

const thirdwebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY ?? "",
});

const auth = createAuth({
  // domain: "localhost:3000",
  client: thirdwebClient,
  adminAccount: privateKeyToAccount({
    client: thirdwebClient,
    privateKey: process.env.THIRDWEB_PRIVATE_KEY ?? "",
  }),
});

app.get("/thirdweb_get_login_payload", async function (req, res) {
  res.setHeader("Content-Type", "text/plain");

  const { address } = req.body;

  if (!address) {
    res.status(422).json({ message: "Expected address in body" });
    return;
  }

  // Generator login payload
  const loginPayload = await auth.generatePayload({ address });

  console.log("GET LOGIN PAYLOAD - address:", address);
  console.log("GET LOGIN PAYLOAD - loginPayload", JSON.stringify(loginPayload));

  // Send back response
  res.status(200).send(loginPayload);
});

app.get("/thirdweb_do_login", async function (req, res) {
  res.setHeader("Content-Type", "text/plain");

  const { payload, signature } = req.body;

  if (!payload) {
    res.status(422).json({ message: "Expected payload in body" });
    return;
  }

  if (!signature) {
    res.status(422).json({ message: "Expected signature in body" });
    return;
  }

  // Verify the login payload and signature
  const verifiedPayload = await auth.verifyPayload({
    payload,
    signature,
  });

  // Generate a JWT for the client
  const jwt = await auth.generateJWT({ payload: verifiedPayload });

  // Set the JWT as a cookie
  req.session.thirdwebJWT = jwt;

  console.log("DO LOGIN - received payload: ", JSON.stringify(payload));
  console.log("DO LOGIN - received signature: ", signature);
  console.log("DO LOGIN - generated JWT: ", jwt);

  res.status(200).send(true);
});

app.get("/thirdweb_is_logged_in", async function (req, res) {
  res.setHeader("Content-Type", "text/plain");

  // Verify if the JWT in the session is valid
  const { valid } = await auth.verifyJWT({ jwt: req.session.thirdwebJWT });

  console.log("IS LOGGED IN - valid: ", valid);

  // Send back response
  res.status(200).send(valid);
});

app.get("/thirdweb_do_logout", function (req, res) {
  console.log("DO LOGOUT");

  // Clear session
  req.session.thirdwebJWT = null;
  req.session.save(() => res.status(200).send(true));
});

app.listen(3000, () => {
  console.log("[BACKEND] Listening on port 3000");
});
