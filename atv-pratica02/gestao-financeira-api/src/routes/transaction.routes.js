const { Router } = require('express');

const transactionController = require('../controllers/transaction.controller');

const transactionRoutes = Router();

transactionRoutes.get('/', transactionController.listTransactions);
transactionRoutes.post('/', transactionController.createTransaction);
transactionRoutes.put('/:id', transactionController.updateTransaction);
transactionRoutes.delete('/:id', transactionController.deleteTransaction);

module.exports = transactionRoutes;