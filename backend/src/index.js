import cors from "cors";
import express from "express";
import { generateNonce, SiweMessage } from "siwe";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/nonce", function (_, res) {
  res.setHeader("Content-Type", "text/plain");

  const nonce = generateNonce();
  console.log("[BACKEND] Generated nonce:", nonce);

  res.send(nonce);
});

app.post("/verify", async function (req, res) {
  const { message, signature } = req.body;
  const siweMessage = new SiweMessage(message);
  try {
    await siweMessage.verify({ signature });
    console.log("[BACKEND] SIWE Message valid: true");
    res.send(true);
  } catch {
    console.log("[BACKEND] SIWE Message valid: false");
    res.send(false);
  }
});

app.listen(3000);
