import * as NSR from "node-server-router";
import auth from "../auth.mjs";
import nodemailer from "nodemailer";
import Cryptic from "../security/cryptic.mjs";

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
            const recipient_user_id = recipient.split("@")[0].trim().toLowerCase();
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
              text: JSON.stringify({
                client: "SPY_EMAIL_CLIENT",
                aesEncrypedKey,
                signature,
                message: mutatedMessage,
                settings,
              }),
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
   * @todo implement
   */
  {
    url: "/receive",
    action: NSR.HTTPAction.GET,
    handlers: [
      auth,
      (req, res) => {
        return res.status(200).json([]);
      },
    ],
  },
];
