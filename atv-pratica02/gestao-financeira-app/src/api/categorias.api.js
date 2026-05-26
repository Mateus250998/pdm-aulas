import { api } from './cliente';

export async function listarCategorias() {
  const resposta = await api.get('/categories');
  return resposta.data;
}

export async function criarCategoria(categoria) {
  const resposta = await api.post('/categories', categoria);
  return resposta.data;
}

export async function atualizarCategoria(id, categoria) {
  const resposta = await api.put(`/categories/${id}`, categoria);
  return resposta.data;
}

export async function excluirCategoria(id) {
  await api.delete(`/categories/${id}`);
}