export const meses = [
  { rotulo: 'Janeiro', valor: 1 },
  { rotulo: 'Fevereiro', valor: 2 },
  { rotulo: 'Março', valor: 3 },
  { rotulo: 'Abril', valor: 4 },
  { rotulo: 'Maio', valor: 5 },
  { rotulo: 'Junho', valor: 6 },
  { rotulo: 'Julho', valor: 7 },
  { rotulo: 'Agosto', valor: 8 },
  { rotulo: 'Setembro', valor: 9 },
  { rotulo: 'Outubro', valor: 10 },
  { rotulo: 'Novembro', valor: 11 },
  { rotulo: 'Dezembro', valor: 12 },
];

export function obterMesAtual() {
  return new Date().getMonth() + 1;
}

export function obterAnoAtual() {
  return new Date().getFullYear();
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatarData(data) {
  if (!data) {
    return '';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}b