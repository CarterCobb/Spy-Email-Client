import * as NSR from "node-server-router";
import child_process from "child_process";
import fs from "fs";

/**
 * General login and logout routes
 * @type {NSR.Routes}
 */
export default [
  /**
   * Login and store user session in memory.
   * Also will create an AES256 key pair for the user if not exists
   */
  {
    url: "/login",
    action: NSR.HTTPAction.POST,
    handlers: [
      async (req, res) => {
        if (!req.body.username || !req.body.password)
          return res.status(400).json({ message: "Missing credentials" });
        req.session.EMAIL_USERNAME = req.body.username;
        req.session.EMAIL_PASSWORD = req.body.password;
        await req.session.save();
        const user_id = req.session.EMAIL_USERNAME.split("@")[0].toLowerCase();
        if (fs.existsSync(`./keys/${user_id}_private.pem`))
          return res.sendStatus(200);
        child_process.exec(
          `openssl genrsa -aes256 -out ./keys/${user_id}_private.pem -passout pass:${req.session.EMAIL_PASSWORD} 2048`,
          (err) => {
            if (err) return res.status(500).json({ message: err.message });
            else
              child_process.exec(
                `openssl rsa -in ./keys/${user_id}_private.pem -passin pass:${req.session.EMAIL_PASSWORD} -pubout > ./keys/${user_id}_public.pem`,
                (err2) => {
                  if (err2)
                    return res.status(500).json({ message: err2.message });
                  return res.sendStatus(200);
                }
              );
          }
        );
      },
    ],
  },
  /**
   * Logout and destroy the user session
   */
  {
    url: "/logout",
    action: NSR.HTTPAction.POST,
    handlers: [
      (req, res) => {
        req.session.destroy();
        return res.sendStatus(204);
      },
    ],
  },
];
