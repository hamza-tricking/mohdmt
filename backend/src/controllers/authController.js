const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

exports.me = (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ user: { id: _id, name, email } });
};
