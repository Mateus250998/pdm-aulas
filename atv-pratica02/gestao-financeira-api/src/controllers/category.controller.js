const {
  createCategorySchema,
  updateCategorySchema,
} = require('../schemas/category.schema');

const categoryService = require('../services/category.service');

function formatZodError(error) {
  return error.errors.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

async function listCategories(request, response, next) {
  try {
    const categories = await categoryService.listCategories();

    return response.json(categories);
  } catch (error) {
    return next(error);
  }
}

async function createCategory(request, response, next) {
  try {
    const validation = createCategorySchema.safeParse(request.body);

    if (!validation.success) {
      return response.status(400).json({
        error: 'Dados inválidos',
        details: formatZodError(validation.error),
      });
    }

    const category = await categoryService.createCategory(validation.data);

    return response.status(201).json(category);
  } catch (error) {
    return next(error);
  }
}

async function updateCategory(request, response, next) {
  try {
    const validation = updateCategorySchema.safeParse(request.body);

    if (!validation.success) {
      return response.status(400).json({
        error: 'Dados inválidos',
        details: formatZodError(validation.error),
      });
    }

    const { id } = request.params;

    const category = await categoryService.updateCategory(id, validation.data);

    return response.json(category);
  } catch (error) {
    return next(error);
  }
}

async function deleteCategory(request, response, next) {
  try {
    const { id } = request.params;

    await categoryService.deleteCategory(id);

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};