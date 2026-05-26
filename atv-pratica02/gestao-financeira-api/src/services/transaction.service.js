const prisma = require('../database/prisma');

function buildTransactionWhere(filters) {
  const where = {};

  if (filters.month && filters.year) {
    const month = Number(filters.month);
    const year = Number(filters.year);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    where.date = {
      gte: startDate,
      lt: endDate,
    };
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  return where;
}

async function listTransactions(filters = {}) {
  return prisma.transaction.findMany({
    where: buildTransactionWhere(filters),
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

async function createTransaction(data) {
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    const error = new Error('Categoria não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return prisma.transaction.create({
    data: {
      description: data.description,
      value: data.value,
      date: new Date(`${data.date}T00:00:00`),
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });
}

async function updateTransaction(id, data) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
  });

  if (!transaction) {
    const error = new Error('Transação não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      const error = new Error('Categoria não encontrada.');
      error.statusCode = 404;
      throw error;
    }
  }

  const updateData = {
    ...data,
  };

  if (data.date) {
    updateData.date = new Date(`${data.date}T00:00:00`);
  }

  return prisma.transaction.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      category: true,
    },
  });
}

async function deleteTransaction(id) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
  });

  if (!transaction) {
    const error = new Error('Transação não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  await prisma.transaction.delete({
    where: {
      id,
    },
  });
}

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};