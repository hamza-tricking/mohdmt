exports.handleUpload = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'لم يتم اختيار ملف' });
  res.json({ url: `/files/${req.file.filename}`, filename: req.file.filename, size: req.file.size });
};
