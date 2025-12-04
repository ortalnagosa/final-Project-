const { handleError } = require("../utils/errorHandler");

const requireRole = (allowedRoles) => (req, res, next) => {
  const { role } = req.user;
  if (!allowedRoles.includes(role)) {
    return handleError(
      res,
      403,
      "Authorization Error: Insufficient permissions"
    );
  }
  next();
};


module.exports = { requireRole };
