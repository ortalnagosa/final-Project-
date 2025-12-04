
const checkAdminOrSelf = (reqUser, targetId) => {
  if (reqUser._id !== targetId && reqUser.role !== "admin") {
    const err = new Error(
      "Authorization Error: Must be admin or the same user"
    );
    err.status = 403;
    throw err;
  }
};

module.exports = { checkAdminOrSelf };
