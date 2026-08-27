const crypto = require("crypto");
const express = require("express");
const sendEmail = require("./MailServ");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const verificationCodes = new Map();

app.use(express.json());
app.use(express.static(__dirname));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  next();
});

app.post("/api/send-code", async (request, response) => {
  const { email, type } = request.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: "Enter a valid email address." });
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  verificationCodes.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    type,
  });

  try {
    await sendEmail(
      email,
      type === "reset" ? "Password reset verification code" : "Email verification code",
      `<h2>Password reset verification</h2><p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
    );
    return response.json({ sent: true });
  } catch (error) {
    verificationCodes.delete(email.toLowerCase());
    return response.status(500).json({ error: "Unable to send the verification email." });
  }
});

app.post("/api/verify-code", (request, response) => {
  const { email, code } = request.body;
  const savedCode = verificationCodes.get(String(email).toLowerCase());

  if (!savedCode || savedCode.code !== code || savedCode.expiresAt < Date.now()) {
    return response.status(400).json({ verified: false });
  }

  verificationCodes.delete(String(email).toLowerCase());
  return response.json({ verified: true });
});

app.listen(port, () => {
  console.log(`Login system running at http://localhost:${port}`);
});