const { z } = require('zod');

const createCategorySchema = z.object({
  name: z
    .string({
      required_error: 'O nome da categoria é obrigatório.',
    })
    .trim()
    .min(2, 'O nome da categoria deve ter pelo menos 2 caracteres.')
    .regex(/^[a-z0-9-]+$/, 'O nome deve conter apenas letras minúsculas, números e hífen.'),

  displayName: z
    .string({
      required_error: 'O nome de exibição é obrigatório.',
    })
    .trim()
    .min(2, 'O nome de exibição deve ter pelo menos 2 caracteres.'),

  icon: z
    .string({
      required_error: 'O ícone é obrigatório.',
    })
    .trim()
    .min(2, 'O ícone deve ter pelo menos 2 caracteres.'),

  background: z
    .string({
      required_error: 'A cor de fundo é obrigatória.',
    })
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'A cor de fundo deve estar no formato hexadecimal. Exemplo: #FFB6B6'),

  isIncome: z.boolean({
    required_error: 'Informe se a categoria é de receita.',
  }),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};