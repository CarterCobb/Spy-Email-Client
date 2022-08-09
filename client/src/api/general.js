import axios from "axios";
import SecureLS from "secure-ls";

export const ls = new SecureLS({ encodingType: "aes" });

export default class GeneralAPI {
  /**
   * Loin and return is successfull
   * @param {{username: String, password: String}} creds
   * @returns {Boolean} if successfull login
   */
  static async login(creds) {
    try {
      await axios.post("/v1/login", JSON.stringify(creds), {
        headers: { "Content-Type": "application/json" },
      });
      ls.set("@creds", JSON.stringify(creds));
      return true;
    } catch (e) {
      console.log("LOGIN ERR:", e);
      return false;
    }
  }

  /**
   * Logout the user, destroy the session & clear ls
   * @returns {Boolean} id successfull logout
   */
  static async logout() {
    try {
      await axios.post("/v1/logout");
      ls.remove("@creds");
      return true;
    } catch (e) {
      console.log("LOGOUT ERR:", e);
      return false;
    }
  }
}
