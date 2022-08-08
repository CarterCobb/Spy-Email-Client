/**
 * Authenticates logged in state
 * @param {globalThis.Express.Request} req
 * @param {globalThis.Express.Response} res
 * @param {import("express").NextFunction} next
 */
const auth = (req, res, next) => {
  if (req.session.EMAIL_USERNAME && req.session.EMAIL_PASSWORD) return next();
  return res.status(403).json({ message: "Not logged in" });
};

export default auth;
