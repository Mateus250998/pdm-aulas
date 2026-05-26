import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  listarTransacoes,
  criarTransacao,
  atualizarTransacao,
  excluirTransacao,
} from '../api/transacoes.api';

import { listarCategorias } from '../api/categorias.api';

import {
  meses,
  obterMesAtual,
  obterAnoAtual,
  formatarMoeda,
  formatarData,
} from '../utils/meses';

export function TelaTransacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [mesSelecionado, setMesSelecionado] = useState(obterMesAtual());
  const [anoSelecionado, setAnoSelecionado] = useState(obterAnoAtual());

  const [modalFormularioVisivel, setModalFormularioVisivel] = useState(false);
  const [modalOpcoesVisivel, setModalOpcoesVisivel] = useState(false);

  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  async function carregarDados() {
    try {
      setCarregando(true);

      const [categoriasApi, transacoesApi] = await Promise.all([
        listarCategorias(),
        listarTransacoes({
          month: mesSelecionado,
          year: anoSelecionado,
        }),
      ]);

      setCategorias(categoriasApi);
      setTransacoes(transacoesApi);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as transações.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [mesSelecionado, anoSelecionado]);

  function abrirFormularioNovaTransacao() {
    setTransacaoSelecionada(null);
    setDescricao('');
    setValor('');
    setData('');
    setCategoriaId('');
    setModalFormularioVisivel(true);
  }

  function abrirOpcoesTransacao(transacao) {
    setTransacaoSelecionada(transacao);
    setModalOpcoesVisivel(true);
  }

  function abrirEdicaoTransacao() {
    if (!transacaoSelecionada) {
      return;
    }

    setDescricao(transacaoSelecionada.description);
    setValor(String(transacaoSelecionada.value));
    setData(String(transacaoSelecionada.date).slice(0, 10));
    setCategoriaId(transacaoSelecionada.categoryId);

    setModalOpcoesVisivel(false);
    setModalFormularioVisivel(true);
  }

  async function salvarTransacao() {
    if (!descricao.trim() || !valor.trim() || !data.trim() || !categoriaId) {
      Alert.alert('Atenção', 'Preencha todos os campos da transação.');
      return;
    }

    const valorNumerico = Number(valor.replace(',', '.'));

    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido maior que zero.');
      return;
    }

    const dados = {
      description: descricao.trim(),
      value: valorNumerico,
      date: data.trim(),
      categoryId: categoriaId,
    };

    try {
      if (transacaoSelecionada) {
        await atualizarTransacao(transacaoSelecionada.id, dados);
        Alert.alert('Sucesso', 'Transação atualizada com sucesso.');
      } else {
        await criarTransacao(dados);
        Alert.alert('Sucesso', 'Transação cadastrada com sucesso.');
      }

      setModalFormularioVisivel(false);
      setTransacaoSelecionada(null);
      carregarDados();
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    }
  }

  function confirmarExclusao() {
    if (!transacaoSelecionada) {
      return;
    }

    Alert.alert(
      'Excluir transação',
      'Deseja realmente excluir esta transação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirTransacao(transacaoSelecionada.id);
              setModalOpcoesVisivel(false);
              setTransacaoSelecionada(null);
              carregarDados();
            } catch (erro) {
              Alert.alert('Erro', 'Não foi possível excluir a transação.');
            }
          },
        },
      ]
    );
  }

  function mudarAno(valor) {
    setAnoSelecionado((anoAtual) => anoAtual + valor);
  }

  function renderizarCategoria(categoria) {
    const selecionada = categoria.id === categoriaId;

    return (
      <TouchableOpacity
        key={categoria.id}
        style={[
          estilos.botaoCategoria,
          selecionada && estilos.botaoCategoriaSelecionada,
        ]}
        onPress={() => setCategoriaId(categoria.id)}
      >
        <Text
          style={[
            estilos.textoCategoria,
            selecionada && estilos.textoCategoriaSelecionada,
          ]}
        >
          {categoria.displayName}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderizarTransacao({ item }) {
    const ehReceita = item.category?.isIncome;

    return (
      <TouchableOpacity
        style={estilos.itemTransacao}
        onLongPress={() => abrirOpcoesTransacao(item)}
      >
        <View style={estilos.linhaItem}>
          <View style={estilos.areaDescricao}>
            <Text style={estilos.descricao}>{item.description}</Text>
            <Text style={estilos.categoria}>
              {item.category?.displayName || 'Sem categoria'} • {formatarData(item.date)}
            </Text>
          </View>

          <Text
            style={[
              estilos.valor,
              ehReceita ? estilos.valorReceita : estilos.valorDespesa,
            ]}
          >
            {ehReceita ? '+' : '-'} {formatarMoeda(item.value)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.filtros}>
        <Text style={estilos.tituloSecao}>Filtrar por mês e ano</Text>

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

      <View style={estilos.areaLista}>
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.tituloSecao}>Transações</Text>

          <TouchableOpacity
            style={estilos.botaoAdicionar}
            onPress={abrirFormularioNovaTransacao}
          >
            <Text style={estilos.textoBotaoAdicionar}>+ Nova</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : (
          <FlatList
            data={transacoes}
            keyExtractor={(item) => item.id}
            renderItem={renderizarTransacao}
            contentContainerStyle={estilos.lista}
            ListEmptyComponent={
              <Text style={estilos.listaVazia}>
                Nenhuma transação encontrada para o período selecionado.
              </Text>
            }
          />
        )}
      </View>

      <Modal
        visible={modalFormularioVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalFormularioVisivel(false)}
      >
        <View style={estilos.fundoModal}>
          <View style={estilos.modal}>
            <Text style={estilos.tituloModal}>
              {transacaoSelecionada ? 'Editar transação' : 'Nova transação'}
            </Text>

            <Text style={estilos.rotulo}>Descrição</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Ex.: Salário de outubro"
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={estilos.rotulo}>Valor</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Ex.: 3500.50"
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
            />

            <Text style={estilos.rotulo}>Data</Text>
            <TextInput
              style={estilos.campo}
              placeholder="YYYY-MM-DD"
              value={data}
              onChangeText={setData}
            />

            <Text style={estilos.rotulo}>Categoria</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={estilos.listaCategorias}
            >
              {categorias.map(renderizarCategoria)}
            </ScrollView>

            <TouchableOpacity style={estilos.botaoSalvar} onPress={salvarTransacao}>
              <Text style={estilos.textoBotaoSalvar}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoCancelar}
              onPress={() => setModalFormularioVisivel(false)}
            >
              <Text style={estilos.textoBotaoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalOpcoesVisivel}
        animationType="fade"
        transparent
        onRequestClose={() => setModalOpcoesVisivel(false)}
      >
        <View style={estilos.fundoModal}>
          <View style={estilos.modalOpcoes}>
            <Text style={estilos.tituloModal}>Opções da transação</Text>

            <Text style={estilos.textoOpcaoDescricao}>
              {transacaoSelecionada?.description}
            </Text>

            <TouchableOpacity style={estilos.botaoSalvar} onPress={abrirEdicaoTransacao}>
              <Text style={estilos.textoBotaoSalvar}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botaoExcluir} onPress={confirmarExclusao}>
              <Text style={estilos.textoBotaoExcluir}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoCancelar}
              onPress={() => setModalOpcoesVisivel(false)}
            >
              <Text style={estilos.textoBotaoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  filtros: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
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
  areaLista: {
    flex: 1,
    padding: 16,
  },
  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botaoAdicionar: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  textoBotaoAdicionar: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lista: {
    paddingBottom: 24,
  },
  listaVazia: {
    marginTop: 32,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
  itemTransacao: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  linhaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  areaDescricao: {
    flex: 1,
  },
  descricao: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  categoria: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  valor: {
    fontSize: 15,
    fontWeight: '800',
  },
  valorReceita: {
    color: '#16A34A',
  },
  valorDespesa: {
    color: '#DC2626',
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalOpcoes: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
    textAlign: 'center',
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  campo: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  listaCategorias: {
    marginBottom: 16,
  },
  botaoCategoria: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  botaoCategoriaSelecionada: {
    backgroundColor: '#2563EB',
  },
  textoCategoria: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
  },
  textoCategoriaSelecionada: {
    color: '#FFFFFF',
  },
  botaoSalvar: {
    height: 46,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  botaoExcluir: {
    height: 46,
    backgroundColor: '#DC2626',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textoBotaoExcluir: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  botaoCancelar: {
    height: 46,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoCancelar: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '800',
  },
  textoOpcaoDescricao: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});