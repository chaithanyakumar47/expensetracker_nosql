const User = require('../models/User');
const jwt = require('jsonwebtoken');

function generateAccessToken(userId, name, isPremium) {
  return jwt.sign({ userId, name, isPremium }, 'your_secret_key'); // Replace with your actual secret key
}

const setPremium = async (req, res) => {
  try {
    const userId = req.userId;
    const name = req.name;

    // Update user to premium in Mongoose
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { isPremium: true } }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = generateAccessToken(userId, name, true);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error setting premium' });
  }
};

const checkPremium = async (req, res) => {
  try {
    if (req.isPremium) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking premium status' });
  }
};

const showLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ totalExpenses: -1 }); // Sort by totalExpenses descending
    res.status(200).json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving leaderboard' });
  }
};

module.exports = {
  setPremium,
  checkPremium,
  showLeaderboard,
};
