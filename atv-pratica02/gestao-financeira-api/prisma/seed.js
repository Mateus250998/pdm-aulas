const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: 'income',
    displayName: 'Receita',
    icon: 'attach-money',
    background: '#B8F5C8',
    isIncome: true,
    isDefault: true,
  },
  {
    name: 'food',
    displayName: 'Alimentação',
    icon: 'restaurant',
    background: '#FFD6A5',
    isIncome: false,
    isDefault: true,
  },
  {
    name: 'transport',
    displayName: 'Transporte',
    icon: 'directions-car',
    background: '#BDE0FE',
    isIncome: false,
    isDefault: true,
  },
  {
    name: 'home',
    displayName: 'Casa',
    icon: 'home',
    background: '#CDB4DB',
    isIncome: false,
    isDefault: true,
  },
  {
    name: 'leisure',
    displayName: 'Lazer',
    icon: 'sports-esports',
    background: '#FFAFCC',
    isIncome: false,
    isDefault: true,
  },
];

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }

  console.log('Seed executado com sucesso.');
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });