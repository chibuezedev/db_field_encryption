import crypto from "crypto";
import config from "../../configs/env";

const ENCRYPTION_KEY = Buffer.from(
  config.security.encryptionKey,
  "hex"
);
const ALGORITHM = "aes-256-cbc";

const encrypt = (text) => {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(":")) {
    return encryptedText;
  }
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const validateRoutingNumber = (routingNumber) =>
  /^[0-9]{9}$/.test(routingNumber);

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateWalletAddress = (address, cryptoType) => {
  const patterns = {
    BITCOIN: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
    ETHEREUM: /^0x[a-fA-F0-9]{40}$/,
    USDC: /^0x[a-fA-F0-9]{40}$/, // USDC on Ethereum
  };
  return patterns[cryptoType]?.test(address) || false;
};

export {
  encrypt,
  decrypt,
  validateRoutingNumber,
  validateEmail,
  validateWalletAddress,
};
