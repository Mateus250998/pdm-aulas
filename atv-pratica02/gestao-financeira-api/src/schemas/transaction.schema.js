const { z } = require('zod');

const createTransactionSchema = z.object({
  description: z
    .string({
      required_error: 'A descrição é obrigatória.',
    })
    .trim()
    .min(1, 'A descrição não pode ficar vazia.'),

  value: z
    .number({
      required_error: 'O valor é obrigatório.',
      invalid_type_error: 'O valor deve ser numérico.',
    })
    .positive('O valor deve ser maior que zero.'),

  date: z
    .string({
      required_error: 'A data é obrigatória.',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato YYYY-MM-DD.'),

  categoryId: z
    .string({
      required_error: 'A categoria é obrigatória.',
    })
    .trim()
    .min(1, 'A categoria é obrigatória.'),
});

const updateTransactionSchema = createTransactionSchema.partial();

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
};