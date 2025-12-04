const { verifyToken } = require("./Providers/jwt");
const { handleError } = require("../utils/errorHandler");
const config = require("config");

const tokenGenerator = config.get("TOKEN_GENERATOR") || "jwt";

const auth = (req, res, next) => {
  if (tokenGenerator === "jwt") {
    try {
      const tokenFromClient = req.header("x-auth-token");
      if (!tokenFromClient) {
        throw new Error("Authantication Error: Please Login/Authunticate");
      }

      const userData = verifyToken(tokenFromClient);
      if (!userData) {
        throw new Error("Authantication Error: Unauthrize User");
      }

      req.user = userData;
      return next();
    } catch (error) {
      handleError(res, 401, error.message);
    }
  }
  return handleError(res, 500, "Use jwt!");
};

exports.auth = auth;
