const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    console.log(token);

    const decoded = jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNTEzOTk0OSwiaWF0IjoxNzA1MTM5OTQ5fQ.u17qfbQbdIbKM0Cw4yx_qqxu_SyYWNaFsN5ia1tsOdc');
    console.log('UserID >>>>', decoded.userId);

    req.userId = decoded.userId;
    req.name = decoded.name;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Failed to Authenticate' });
    }

    req.user = user;
    console.log('User verification Successful');
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Failed to Authenticate' });
  }
};

module.exports = { authenticate };