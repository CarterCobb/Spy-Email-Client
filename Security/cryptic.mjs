import child_process from "child_process";
import crypto from "crypto";
import fs from "fs";

export default class Cryptic {
  /**
   * Hash a string with SHA256
   * @param {String} data
   * @returns {String} hash delimited with 'g' then salt
   */
  static hashSHA256(data) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .createHash("sha256")
      .update(`${data}${salt}`)
      .digest("hex");
    return `${hash}g${salt}`;
  }

  /**
   * Compare SHA256 hash to string
   * @param {String} hash
   * @param {String} str
   * @returns {Boolean} is valid
   */
  static compareHashSHA256(hash, str) {
    const [hasedValue, salt] = hash.split("g");
    const re_hash = crypto
      .createHash("sha256")
      .update(`${str}${salt}`)
      .digest("hex");
    return re_hash.toString("hex") === hasedValue;
  }

  /**
   * Encrypt data with public key for `user_id`
   * @param {String} data
   * @param {String} user_id
   * @returns {String} base64 encoded string of encrypted data
   */
  static encryptRSA(data, user_id) {
    const publicKey = Buffer.from(
      fs.readFileSync(`./keys/${user_id}_public.pem`, { encoding: "utf-8" })
    );
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data)
    );
    return encryptedData.toString("base64");
  }

  /**
   * Decrypt base64 encoded string
   * @param {String} data
   * @param {String} user_id of `public_key`
   * @returns {String} decripted original content
   */
  static decryptRSA(data, user_id, pass) {
    const privateKey = child_process.execSync(
      `openssl rsa -in ./keys/${user_id}_private.pem -passin pass:${pass}`,
      { encoding: "utf-8" }
    );
    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data, "base64")
    );
    return decryptedData.toString("utf-8");
  }

  /**
   * Sign some data
   * @param {String} data
   * @param {String} user_id
   * @param {String} pass
   * @returns {String} base64 encoded string of signature
   */
  static signRSA(data, user_id, pass) {
    const privateKey = child_process.execSync(
      `openssl rsa -in ./keys/${user_id}_private.pem -passin pass:${pass}`,
      { encoding: "utf-8" }
    );
    const signature = crypto.sign("sha256", Buffer.from(data), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });
    return signature.toString("base64");
  }

  /**
   * Verify data with a signature
   * @param {String} data
   * @param {String} signature
   * @param {String} user_id
   * @returns {Boolean} is verified
   */
  static verifyRSA(data, signature, user_id) {
    const publicKey = Buffer.from(
      fs.readFileSync(`./keys/${user_id}_public.pem`, { encoding: "utf-8" })
    );
    return crypto.verify(
      "sha256",
      Buffer.from(data),
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature, "base64")
    );
  }
}
