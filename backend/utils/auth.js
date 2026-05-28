const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,  
  avatar: user.avatar || undefined,
});

module.exports = {
  generateToken,
  formatUser,
};
