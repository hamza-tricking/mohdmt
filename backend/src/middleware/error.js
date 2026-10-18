exports.notFound = (req, res) => res.status(404).json({ message: 'غير موجود' });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'معرّف غير صالح' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: 'بيانات غير صالحة' });
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'خطأ في الخادم' : err.message });
};
