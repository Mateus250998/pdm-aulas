const {
  createTransactionSchema,
  updateTransactionSchema,
} = require('../schemas/transaction.schema');

const transactionService = require('../services/transaction.service');

function formatZodError(error) {
  return error.errors.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

async function listTransactions(request, response, next) {
  try {
    const { month, year, categoryId } = request.query;

    const transactions = await transactionService.listTransactions({
      month,
      year,
      categoryId,
    });

    return response.json(transactions);
  } catch (error) {
    return next(error);
  }
}

async function createTransaction(request, response, next) {
  try {
    const validation = createTransactionSchema.safeParse(request.body);

    if (!validation.success) {
      return response.status(400).json({
        error: 'Dados inválidos',
        details: formatZodError(validation.error),
      });
    }

    const transaction = await transactionService.createTransaction(validation.data);

    return response.status(201).json(transaction);
  } catch (error) {
    return next(error);
  }
}

async function updateTransaction(request, response, next) {
  try {
    const validation = updateTransactionSchema.safeParse(request.body);

    if (!validation.success) {
      return response.status(400).json({
        error: 'Dados inválidos',
        details: formatZodError(validation.error),
      });
    }

    const { id } = request.params;

    const transaction = await transactionService.updateTransaction(id, validation.data);

    return response.json(transaction);
  } catch (error) {
    return next(error);
  }
}

async function deleteTransaction(request, response, next) {
  try {
    const { id } = request.params;

    await transactionService.deleteTransaction(id);

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};