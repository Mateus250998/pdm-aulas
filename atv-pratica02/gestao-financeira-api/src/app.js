const express = require('express');
const cors = require('cors');

const categoryRoutes = require('./routes/category.routes');
const transactionRoutes = require('./routes/transaction.routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  return response.json({
    ok: true,
    name: 'gestao-financeira-api',
  });
});

app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);

app.use(errorHandler);

module.exports = app;