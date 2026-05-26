# Documentação do Frontend

Este frontend foi desenvolvido em React Native com Expo para a atividade prática de gestão financeira.

## Objetivo

A aplicação permite que o usuário acesse o sistema, visualize suas transações financeiras, filtre dados por mês e ano, consulte um resumo financeiro, veja gráfico de despesas por categoria e gerencie categorias personalizadas.

## Funcionalidades implementadas

### Login

A aplicação possui uma tela de login com validação simples de acesso.

Usuário de teste:

- E-mail: aluno@pdm.com
- Senha: 123456

Após o login, o nome do usuário autenticado aparece na tela principal em uma mensagem de boas-vindas.

### Tela principal

A tela principal possui navegação por abas internas:

- Transações
- Resumo
- Categorias

### Transações

A tela de transações permite:

- Listar transações vindas da API
- Filtrar por mês e ano
- Criar nova transação
- Editar transação existente
- Excluir transação existente
- Abrir opções de edição e exclusão por toque longo no item da lista

### Resumo

A tela de resumo permite:

- Filtrar dados por mês e ano
- Visualizar total de receitas
- Visualizar total de despesas
- Visualizar saldo do período
- Visualizar gráfico de pizza com despesas agrupadas por categoria

### Categorias

A tela de categorias permite:

- Listar categorias vindas da API
- Criar categorias customizadas
- Editar categorias
- Excluir categorias não padrão
- Identificar categorias padrão
- Diferenciar categorias de receita e despesa

## Integração com backend

A comunicação com o backend é feita pelo cliente HTTP configurado no arquivo:

src/api/cliente.js

URL base utilizada:

http://localhost:3000

## Arquivos principais

- App.js
- src/NavegadorPrincipal.js
- src/api/cliente.js
- src/api/categorias.api.js
- src/api/transacoes.api.js
- src/screens/TelaLogin.js
- src/screens/TelaPrincipal.js
- src/screens/TelaTransacoes.js
- src/screens/TelaResumo.js
- src/screens/TelaCategorias.js
- src/components/GraficoPizza.js
- src/utils/meses.js

## Observação

O projeto foi estruturado para execução em ambiente com Node.js, Expo e dependências instaladas.