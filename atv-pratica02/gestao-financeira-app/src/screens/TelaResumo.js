import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { listarTransacoes } from '../api/transacoes.api';
import { GraficoPizza } from '../components/GraficoPizza';

import {
  meses,
  obterMesAtual,
  obterAnoAtual,
  formatarMoeda,
} from '../utils/meses';

export function TelaResumo() {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [mesSelecionado, setMesSelecionado] = useState(obterMesAtual());
  const [anoSelecionado, setAnoSelecionado] = useState(obterAnoAtual());

  async function carregarTransacoes() {
    try {
      setCarregando(true);

      const dados = await listarTransacoes({
        month: mesSelecionado,
        year: anoSelecionado,
      });

      setTransacoes(dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar o resumo financeiro.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTransacoes();
  }, [mesSelecionado, anoSelecionado]);

  const resumo = useMemo(() => {
    const receitas = transacoes
      .filter((transacao) => transacao.category?.isIncome)
      .reduce((soma, transacao) => soma + Number(transacao.value), 0);

    const despesas = transacoes
      .filter((transacao) => !transacao.category?.isIncome)
      .reduce((soma, transacao) => soma + Number(transacao.value), 0);

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    };
  }, [transacoes]);

  const dadosGrafico = useMemo(() => {
    const agrupamento = {};

    transacoes
      .filter((transacao) => !transacao.category?.isIncome)
      .forEach((transacao) => {
        const nomeCategoria = transacao.category?.displayName || 'Sem categoria';
        const corCategoria = transacao.category?.background || '#9CA3AF';

        if (!agrupamento[nomeCategoria]) {
          agrupamento[nomeCategoria] = {
            nome: nomeCategoria,
            valor: 0,
            cor: corCategoria,
          };
        }

        agrupamento[nomeCategoria].valor += Number(transacao.value);
      });

    return Object.values(agrupamento);
  }, [transacoes]);

  function mudarAno(valor) {
    setAnoSelecionado((anoAtual) => anoAtual + valor);
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.filtros}>
        <Text style={estilos.tituloSecao}>Resumo por mês e ano</Text>

        <View style={estilos.linhaAno}>
          <TouchableOpacity style={estilos.botaoAno} onPress={() => mudarAno(-1)}>
            <Text style={estilos.textoBotaoAno}>-</Text>
          </TouchableOpacity>

          <Text style={estilos.ano}>{anoSelecionado}</Text>

          <TouchableOpacity style={estilos.botaoAno} onPress={() => mudarAno(1)}>
            <Text style={estilos.textoBotaoAno}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {meses.map((mes) => (
            <TouchableOpacity
              key={mes.valor}
              style={[
                estilos.botaoMes,
                mesSelecionado === mes.valor && estilos.botaoMesAtivo,
              ]}
              onPress={() => setMesSelecionado(mes.valor)}
            >
              <Text
                style={[
                  estilos.textoMes,
                  mesSelecionado === mes.valor && estilos.textoMesAtivo,
                ]}
              >
                {mes.rotulo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#2563EB" style={estilos.carregando} />
      ) : (
        <>
          <View style={estilos.cartaoResumo}>
            <Text style={estilos.tituloCartao}>Receitas</Text>
            <Text style={estilos.valorReceita}>{formatarMoeda(resumo.receitas)}</Text>
          </View>

          <View style={estilos.cartaoResumo}>
            <Text style={estilos.tituloCartao}>Despesas</Text>
            <Text style={estilos.valorDespesa}>{formatarMoeda(resumo.despesas)}</Text>
          </View>

          <View style={estilos.cartaoSaldo}>
            <Text style={estilos.tituloCartao}>Saldo do período</Text>
            <Text
              style={[
                estilos.valorSaldo,
                resumo.saldo >= 0 ? estilos.saldoPositivo : estilos.saldoNegativo,
              ]}
            >
              {formatarMoeda(resumo.saldo)}
            </Text>
          </View>

          <View style={estilos.cartaoGrafico}>
            <Text style={estilos.tituloSecao}>Despesas por categoria</Text>
            <GraficoPizza dados={dadosGrafico} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  conteudo: {
    padding: 16,
    paddingBottom: 28,
  },
  filtros: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  linhaAno: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 16,
  },
  botaoAno: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoAno: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  ano: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  botaoMes: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  botaoMesAtivo: {
    backgroundColor: '#2563EB',
  },
  textoMes: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  textoMesAtivo: {
    color: '#FFFFFF',
  },
  carregando: {
    marginTop: 40,
  },
  cartaoResumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  cartaoSaldo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tituloCartao: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 6,
  },
  valorReceita: {
    fontSize: 26,
    color: '#16A34A',
    fontWeight: '900',
  },
  valorDespesa: {
    fontSize: 26,
    color: '#DC2626',
    fontWeight: '900',
  },
  valorSaldo: {
    fontSize: 28,
    fontWeight: '900',
  },
  saldoPositivo: {
    color: '#16A34A',
  },
  saldoNegativo: {
    color: '#DC2626',
  },
  cartaoGrafico: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },
});