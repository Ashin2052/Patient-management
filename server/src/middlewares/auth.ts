import { applicationConfig } from "../configs/config";
import { envConstant } from "../constants/application.constants";
const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * @param {object} req
 * @param {object} req
 * @param {object} next
 */
const verifyToken = (req, res, next) => {
  // for super test
  if (applicationConfig.ENV === envConstant.TEST) return next();
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
