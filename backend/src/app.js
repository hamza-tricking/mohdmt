const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '100kb' }));
app.use('/files', express.static(path.join(__dirname, '../uploads'), { maxAge: '30d' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
