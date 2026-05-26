# Testes da API no Postman

Este arquivo documenta o fluxo de testes da API de gestão financeira.

A Collection do Postman está versionada em:

gestao-financeira-api/postman/collection.json

## Variável de ambiente

A API deve ser testada com a variável:

baseUrl = http://localhost:3000

## 1. Health-check

Método: GET

Rota:

{{baseUrl}}/

Resposta esperada:

{
  "ok": true,
  "name": "gestao-financeira-api"
}

## 2. Listar categorias

Método: GET

Rota:

{{baseUrl}}/categories

Resultado esperado:

A API deve retornar as categorias cadastradas pelo seed, incluindo a categoria income.

## 3. Criar categoria

Método: POST

Rota:

{{baseUrl}}/categories

Body:

{
  "name": "health",
  "displayName": "Saúde",
  "icon": "favorite",
  "background": "#FFB6B6",
  "isIncome": false
}

Resposta esperada:

Status 201 Created com o objeto da categoria criada, incluindo o id gerado.

## 4. Atualizar categoria

Método: PUT

Rota:

{{baseUrl}}/categories/:id

Body:

{
  "displayName": "Saúde e Bem-estar"
}

Resposta esperada:

Status 200 OK com a categoria atualizada.

## 5. Excluir categoria

Método: DELETE

Rota:

{{baseUrl}}/categories/:id

Resposta esperada:

Status 204 No Content.

Regra adicional:

Categorias padrão não podem ser excluídas. Ao tentar excluir a categoria income, a API deve retornar status 400 com a mensagem:

Categorias padrão não podem ser excluídas

## 6. Criar transação

Método: POST

Rota:

{{baseUrl}}/transactions

Body:

{
  "description": "Salário de outubro",
  "value": 3500.50,
  "date": "2026-04-29",
  "categoryId": "ID_DA_CATEGORIA_INCOME"
}

Resposta esperada:

Status 201 Created com a transação criada e a categoria aninhada.

## 7. Listar transações

Método: GET

Rota:

{{baseUrl}}/transactions

Resposta esperada:

Status 200 OK com lista de transações e category expandida.

## 8. Listar transações com filtro de mês e ano

Método: GET

Rota:

{{baseUrl}}/transactions?month=4&year=2026

Resposta esperada:

Status 200 OK com transações filtradas pelo mês e ano informados.

## 9. Excluir transação

Método: DELETE

Rota:

{{baseUrl}}/transactions/:id

Resposta esperada:

Status 204 No Content.

## 10. Validar erros

Método: POST

Rota:

{{baseUrl}}/transactions

Body inválido:

{
  "description": ""
}

Resposta esperada:

Status 400 Bad Request com:

{
  "error": "Dados inválidos",
  "details": []
}

A validação é feita no servidor usando Zod.