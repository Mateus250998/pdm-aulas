# Gestão Financeira API

API desenvolvida para a atividade prática de PDM, responsável por gerenciar categorias, receitas e despesas da aplicação de gestão financeira.

## Tecnologias previstas

- Node.js
- Express
- Prisma
- SQLite
- Zod
- CORS
- Dotenv

## Funcionalidades

- Health-check da API
- Cadastro, listagem, atualização e exclusão de categorias
- Validação para impedir exclusão de categorias padrão
- Cadastro, listagem, atualização e exclusão de transações
- Relacionamento entre transações e categorias
- Validação de dados no servidor com Zod
- Collection do Postman versionada no repositório

## Como executar

Instalar dependências:

```bash
npm install