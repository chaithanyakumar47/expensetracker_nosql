const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your Mongoose User model

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    console.log(token);

    // Verify the JWT token
    const decoded = jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc'); // Replace with your actual secret key

    // Find the user associated with the decoded user ID using Mongoose
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('Invalid User'); // Handle invalid user ID more gracefully
    }

    // Attach user data to the request object
    req.userId = user._id; // Use Mongoose's _id convention
    req.name = user.name;
    req.user = user;

    // Check for premium status using Mongoose query
    req.isPremium = user.isPremium; // Assuming 'isPremium' is a boolean field

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Failed to Authenticate' });
  }
};

module.exports = { authenticate };
