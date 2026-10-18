require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');
const { ensureAdmin, ensureProducts } = require('./utils/bootstrap');

(async () => {
  await connectDB();
  await ensureAdmin();
  await ensureProducts();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API on :${port}`));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
