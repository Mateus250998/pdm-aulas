const prisma = require('../database/prisma');

async function listCategories() {
  return prisma.category.findMany({
    orderBy: {
      displayName: 'asc',
    },
  });
}

async function createCategory(data) {
  const categoryAlreadyExists = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (categoryAlreadyExists) {
    const error = new Error('Categoria já cadastrada.');
    error.statusCode = 400;
    throw error;
  }

  return prisma.category.create({
    data: {
      name: data.name,
      displayName: data.displayName,
      icon: data.icon,
      background: data.background,
      isIncome: data.isIncome,
      isDefault: false,
    },
  });
}

async function updateCategory(id, data) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    const error = new Error('Categoria não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  if (category.isDefault && data.name) {
    const error = new Error('Categorias padrão não podem ter o identificador alterado.');
    error.statusCode = 400;
    throw error;
  }

  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

async function deleteCategory(id) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      transactions: true,
    },
  });

  if (!category) {
    const error = new Error('Categoria não encontrada.');
    error.statusCode = 404;
    throw error;
  }

  if (category.isDefault) {
    const error = new Error('Categorias padrão não podem ser excluídas');
    error.statusCode = 400;
    throw error;
  }

  if (category.transactions.length > 0) {
    const error = new Error('Categoria possui transações vinculadas e não pode ser excluída.');
    error.statusCode = 400;
    throw error;
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};