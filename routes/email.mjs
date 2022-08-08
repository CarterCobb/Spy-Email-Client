import * as NSR from "node-server-router";
import auth from "../auth.mjs";
import nodemailer from "nodemailer";

/**
 * @type {NSR.Routes}
 */
export default [
  /**
   * Sends an email and mutates the encryptions based on `settings`
   * @todo Add mutaions based on `settings`
   */
  {
    url: "/send",
    action: NSR.HTTPAction.POST,
    handlers: [
      auth,
      async (req, res) => {
        const { to, message, settings } = req.body;
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
        await transporter.sendMail({
          from: req.session.EMAIL_USERNAME,
          to,
          subject: "TEST",
          text: message,
        });
        return res.status(200).json({});
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
