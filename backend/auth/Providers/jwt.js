const jwt = require("jsonwebtoken");
const config = require("config");
const {
  comparePassword,
} = require("../../users/helpers/bcrypt");
const User = require("../../users/models/mongodb/User");

const key = config.get("JWT_KEY");

const generateAuthToken = (user) => {
  const { _id, isAdmin, isBusiness } = user;
  const token = jwt.sign({ _id: user._id, role: user.role }, key, {
    expiresIn: "24h",
  });
  return token;
};

const canAttemptLogin = (user) => {
  if (!user.lockUntil) return true;
  return new Date() > user.lockUntil;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!canAttemptLogin(user)) {
    throw new Error("Account locked. Try again later.");
  }

  const validPassword = comparePassword(password, user.password);

  if (!validPassword) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 3) {
      user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 שעות
      await user.save();
      throw new Error(
        "Account locked due to 3 failed login attempts. Try again in 24 hours."
      );
    }

    await user.save();
    throw new Error("Invalid email or password");
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  return generateAuthToken(user);
};

const verifyToken = (token) => {
  try {
    const userData = jwt.verify(token, key);
    return userData;
  } catch (error) {
    return null;
  }
};

exports.generateAuthToken = generateAuthToken;
exports.verifyToken = verifyToken;
exports.loginUser = loginUser;
