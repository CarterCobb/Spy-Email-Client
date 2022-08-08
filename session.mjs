import session from "express-session";
import Express from "express";
import { SESSION_SECRET } from "./keys.mjs";

/**
 * Session configuration
 */
export default class Session {
  /**
   * Configures the express session and its data stores.
   * @param {Express.Application}
   */
  static async configureOn(app) {
    const session_config = {
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 10800000,
        sameSite: "strict",
      },
    };
    app.use(session(session_config));
    // ------------- FOR DEBUGGING -------------
    // app.use((req, _, next) => {
    //   console.log(req.session);
    //   next();
    // });
  }
}
