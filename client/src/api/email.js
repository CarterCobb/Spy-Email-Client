import axios from "axios";

export default class EmailAPI {
  /**
   * Sends a email to recipient(s) with optional encrypted patterns.
   * @param {String} to `test@test.com` or `test@test.com, test2@test.com`
   * @param {String} subject
   * @param {String} message
   * @param {{aes: Boolean, sign: Boolean, raw: Boolean}} settings
   * @returns {Boolean} successfully sent email to recipient(s)
   */
  static async sendEmail(to, subject, message, settings) {
    try {
      await axios.post(
        "/v1/send",
        JSON.stringify({ to, subject, message, settings }),
        { headers: { "Content-Type": "application/json" } }
      );
      return true;
    } catch (e) {
      console.log("EMAIL SEND ERR:", e);
      return false;
    }
  }
}
