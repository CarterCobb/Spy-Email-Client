import * as NSR from "node-server-router";
import auth from "../auth.mjs";
import nodemailer from "nodemailer";
import Cryptic from "../security/cryptic.mjs";
import imaps from "imap-simple";

/**
 * Get the header value OR null
 * @param {Object} str
 * @returns {String | null}
 */
const tryGetHeader = (header) => {
  if (header instanceof Array) return header[0] || null;
  else return null;
};

/**
 * @type {NSR.Routes}
 */
export default [
  /**
   * Sends an email and mutates the encryptions based on `settings`
   * @example body
   * {
   *    "subject": "test",
   *    "to": "text@example.com, test2@example.com",
   *    "message": "Hello World!",
   *    "settings": {
   *       "aes": true,
   *       "sign": true,
   *       "raw": false
   *    }
   * }
   */
  {
    url: "/send",
    action: NSR.HTTPAction.POST,
    handlers: [
      auth,
      async (req, res) => {
        try {
          const { to, message, subject, settings } = req.body;
          if (!to || !message || !settings)
            return res.status(400).json({ message: "Invalid body" });
          const transporter = nodemailer.createTransport({
            secure: true,
            port: 465,
            host: "smtp.gmail.com",
            auth: {
              user: req.session.EMAIL_USERNAME,
              pass: req.session.EMAIL_PASSWORD,
            },
            connectionTimeout: 8000,
          });
          const caller_user_id =
            req.session.EMAIL_USERNAME.split("@")[0].toLowerCase();
          const pass = req.session.EMAIL_PASSWORD;
          for await (var recipient of to.split(",")) {
            const recipient_user_id = recipient
              .split("@")[0]
              .trim()
              .toLowerCase();
            var mutatedMessage = message,
              aesKey = null,
              aesEncrypedKey = null,
              signature = null;
            if (settings.aes) {
              aesKey = Cryptic.generateAESKey();
              aesEncrypedKey = Cryptic.encryptRSA(aesKey, recipient_user_id);
              mutatedMessage = Cryptic.encryptAES(mutatedMessage, aesKey);
            }
            if (settings.sign)
              signature = Cryptic.signRSA(mutatedMessage, caller_user_id, pass);
            if (settings.raw) mutatedMessage = message;
            await transporter.sendMail({
              from: req.session.EMAIL_USERNAME,
              to: recipient,
              subject,
              headers: {
                "x-se-client": "SPY_EMAIL_CLIENT",
                "x-se-aes-encryption-key": aesEncrypedKey,
                "x-se-signature": signature || "NONE",
                "x-se-settings": JSON.stringify(settings),
              },
              text: mutatedMessage,
            });
          }
          return res.sendStatus(200);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },
    ],
  },
  /**
   * Retrive new emails from the inbox
   */
  {
    url: "/receive",
    action: NSR.HTTPAction.GET,
    handlers: [
      auth,
      async (req, res) => {
        try {
          const connection = await imaps.connect({
            imap: {
              user: req.session.EMAIL_USERNAME,
              password: req.session.EMAIL_PASSWORD,
              host: "imap.gmail.com",
              port: 993,
              authTimeout: 10000,
              tls: true,
              tlsOptions: { rejectUnauthorized: false },
            },
          });
          await connection.openBox("INBOX");
          const fetchOptions = {
            bodies: ["HEADER", "TEXT"],
            markSeen: false,
          };
          const results = await connection.search(
            ["UNSEEN", ["SINCE", new Date()]],
            fetchOptions
          );
          const messages = [];
          const user_id =
            req.session.EMAIL_USERNAME.split("@")[0].toLowerCase();
          const pass = req.session.EMAIL_PASSWORD;
          results.forEach((result) => {
            const text = result.parts.filter((part) => part.which === "TEXT");
            const headers = result.parts.filter(
              (part) => part.which === "HEADER"
            )[0].body;
            if (tryGetHeader(headers["x-se-client"]) === "SPY_EMAIL_CLIENT") {
              const settings = JSON.parse(
                tryGetHeader(headers["x-se-settings"])?.trim() || ""
              );
              const rawMessage = text[0]?.body?.trim();
              const encryptionKey = settings?.aes
                ? tryGetHeader(headers["x-se-aes-encryption-key"])
                : null;
              const signature = settings?.sign
                ? tryGetHeader(headers["x-se-signature"])
                : "NONE";
              const decodedAESKey = settings?.aes
                ? Cryptic.decryptRSA(encryptionKey, user_id, pass)
                : null;
              const message = settings?.aes
                ? Cryptic.decryptAES(rawMessage, decodedAESKey)
                : rawMessage;
              const sender_id = tryGetHeader(headers["from"])
                .split("@")[0]
                .toLowerCase();
              messages.push({
                uid: result.attributes.uid,
                from: tryGetHeader(headers["from"]),
                subject: tryGetHeader(headers["subject"]),
                message,
                signed: signature !== "NONE",
                verified_signature: settings?.sign
                  ? Cryptic.verifyRSA(rawMessage, signature, sender_id)
                  : false,
                received_at: new Date(tryGetHeader(headers["date"])),
                raw: {
                  message: rawMessage,
                  signature,
                  encryption_key: encryptionKey,
                },
              });
            }
          });
          for await (var message of messages)
            await connection.addFlags(message.uid, "\\Seen");
          connection.end();
          return res.status(200).json(messages);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },
    ],
  },
];
