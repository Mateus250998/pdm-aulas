import { api } from './cliente';

export async function listarTransacoes(filtros = {}) {
  const resposta = await api.get('/transactions', {
    params: filtros,
  });

  return resposta.data;
}

export async function criarTransacao(transacao) {
  const resposta = await api.post('/transactions', transacao);
  return resposta.data;
}

export async function atualizarTransacao(id, transacao) {
  const resposta = await api.put(`/transactions/${id}`, transacao);
  return resposta.data;
}

export async function excluirTransacao(id) {
  await api.delete(`/transactions/${id}`);
}