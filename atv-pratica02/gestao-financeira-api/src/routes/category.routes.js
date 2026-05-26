const { Router } = require('express');

const categoryController = require('../controllers/category.controller');

const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.listCategories);
categoryRoutes.post('/', categoryController.createCategory);
categoryRoutes.put('/:id', categoryController.updateCategory);
categoryRoutes.delete('/:id', categoryController.deleteCategory);

module.exports = categoryRoutes;