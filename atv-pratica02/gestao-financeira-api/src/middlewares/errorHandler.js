function errorHandler(error, request, response, next) {
  console.error(error);

  if (error.statusCode) {
    return response.status(error.statusCode).json({
      error: error.message,
      details: error.details || null,
    });
  }

  return response.status(500).json({
    error: 'Erro interno do servidor',
  });
}

module.exports = {
  errorHandler,
};