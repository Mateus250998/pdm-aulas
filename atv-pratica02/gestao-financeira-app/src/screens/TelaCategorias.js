import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  listarCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
} from '../api/categorias.api';

export function TelaCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const [nome, setNome] = useState('');
  const [nomeExibicao, setNomeExibicao] = useState('');
  const [icone, setIcone] = useState('');
  const [corFundo, setCorFundo] = useState('#FFB6B6');
  const [ehReceita, setEhReceita] = useState(false);

  async function carregarCategorias() {
    try {
      setCarregando(true);
      const dados = await listarCategorias();
      setCategorias(dados);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  function limparFormulario() {
    setCategoriaSelecionada(null);
    setNome('');
    setNomeExibicao('');
    setIcone('');
    setCorFundo('#FFB6B6');
    setEhReceita(false);
  }

  function abrirNovaCategoria() {
    limparFormulario();
    setModalVisivel(true);
  }

  function abrirEdicaoCategoria(categoria) {
    setCategoriaSelecionada(categoria);
    setNome(categoria.name);
    setNomeExibicao(categoria.displayName);
    setIcone(categoria.icon);
    setCorFundo(categoria.background);
    setEhReceita(categoria.isIncome);
    setModalVisivel(true);
  }

  function gerarNomeTecnico(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function salvarCategoria() {
    if (!nomeExibicao.trim() || !icone.trim() || !corFundo.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const nomeFinal = nome.trim() || gerarNomeTecnico(nomeExibicao);

    if (!nomeFinal) {
      Alert.alert('Atenção', 'Informe um nome válido para a categoria.');
      return;
    }

    const dados = {
      name: nomeFinal,
      displayName: nomeExibicao.trim(),
      icon: icone.trim(),
      background: corFundo.trim(),
      isIncome: ehReceita,
    };

    try {
      if (categoriaSelecionada) {
        await atualizarCategoria(categoriaSelecionada.id, dados);
        Alert.alert('Sucesso', 'Categoria atualizada com sucesso.');
      } else {
        await criarCategoria(dados);
        Alert.alert('Sucesso', 'Categoria criada com sucesso.');
      }

      setModalVisivel(false);
      limparFormulario();
      carregarCategorias();
    } catch (erro) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar a categoria. Verifique se o nome técnico não está duplicado.'
      );
    }
  }

  function confirmarExclusao(categoria) {
    Alert.alert(
      'Excluir categoria',
      `Deseja realmente excluir a categoria ${categoria.displayName}?`,
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
              await excluirCategoria(categoria.id);
              carregarCategorias();
            } catch (erro) {
              Alert.alert(
                'Erro',
                'Não foi possível excluir a categoria. Categorias padrão ou vinculadas a transações não podem ser excluídas.'
              );
            }
          },
        },
      ]
    );
  }

  function renderizarCategoria({ item }) {
    return (
      <View style={estilos.itemCategoria}>
        <View style={estilos.linhaCategoria}>
          <View
            style={[
              estilos.iconeCategoria,
              { backgroundColor: item.background },
            ]}
          >
            <Text style={estilos.textoIcone}>{item.icon.slice(0, 2)}</Text>
          </View>

          <View style={estilos.areaTexto}>
            <Text style={estilos.nomeCategoria}>{item.displayName}</Text>
            <Text style={estilos.detalhesCategoria}>
              {item.isIncome ? 'Receita' : 'Despesa'} • {item.name}
            </Text>

            {item.isDefault && (
              <Text style={estilos.categoriaPadrao}>Categoria padrão</Text>
            )}
          </View>
        </View>

        <View style={estilos.acoes}>
          <TouchableOpacity
            style={estilos.botaoEditar}
            onPress={() => abrirEdicaoCategoria(item)}
          >
            <Text style={estilos.textoBotaoEditar}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botaoExcluir,
              item.isDefault && estilos.botaoDesabilitado,
            ]}
            onPress={() => confirmarExclusao(item)}
            disabled={item.isDefault}
          >
            <Text style={estilos.textoBotaoExcluir}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.titulo}>Categorias</Text>
          <Text style={estilos.subtitulo}>
            Gerencie categorias fixas e personalizadas.
          </Text>
        </View>

        <TouchableOpacity style={estilos.botaoAdicionar} onPress={abrirNovaCategoria}>
          <Text style={estilos.textoBotaoAdicionar}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#2563EB" style={estilos.carregando} />
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id}
          renderItem={renderizarCategoria}
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={
            <Text style={estilos.listaVazia}>Nenhuma categoria cadastrada.</Text>
          }
        />
      )}

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={estilos.fundoModal}>
          <View style={estilos.modal}>
            <Text style={estilos.tituloModal}>
              {categoriaSelecionada ? 'Editar categoria' : 'Nova categoria'}
            </Text>

            <Text style={estilos.rotulo}>Nome técnico</Text>
            <TextInput
              style={[
                estilos.campo,
                categoriaSelecionada?.isDefault && estilos.campoDesabilitado,
              ]}
              placeholder="Ex.: health"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="none"
              editable={!categoriaSelecionada?.isDefault}
            />

            <Text style={estilos.ajuda}>
              Use letras minúsculas, números e hífen. Se ficar vazio, será gerado pelo nome de exibição.
            </Text>

            <Text style={estilos.rotulo}>Nome de exibição</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Ex.: Saúde"
              value={nomeExibicao}
              onChangeText={setNomeExibicao}
            />

            <Text style={estilos.rotulo}>Ícone</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Ex.: favorite"
              value={icone}
              onChangeText={setIcone}
              autoCapitalize="none"
            />

            <Text style={estilos.rotulo}>Cor de fundo</Text>
            <TextInput
              style={estilos.campo}
              placeholder="Ex.: #FFB6B6"
              value={corFundo}
              onChangeText={setCorFundo}
              autoCapitalize="characters"
            />

            <View style={estilos.linhaSwitch}>
              <View>
                <Text style={estilos.rotuloSwitch}>Categoria de receita?</Text>
                <Text style={estilos.ajudaSwitch}>
                  Ative para entradas de dinheiro.
                </Text>
              </View>

              <Switch value={ehReceita} onValueChange={setEhReceita} />
            </View>

            <TouchableOpacity style={estilos.botaoSalvar} onPress={salvarCategoria}>
              <Text style={estilos.textoBotaoSalvar}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoCancelar}
              onPress={() => {
                setModalVisivel(false);
                limparFormulario();
              }}
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
    padding: 16,
  },
  cabecalho: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  subtitulo: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    maxWidth: 210,
  },
  botaoAdicionar: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  textoBotaoAdicionar: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  carregando: {
    marginTop: 40,
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
  itemCategoria: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },
  linhaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeCategoria: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textoIcone: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  areaTexto: {
    flex: 1,
  },
  nomeCategoria: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  detalhesCategoria: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  categoriaPadrao: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '800',
    marginTop: 4,
  },
  acoes: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
  },
  botaoEditar: {
    flex: 1,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoEditar: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  botaoExcluir: {
    flex: 1,
    height: 40,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.45,
  },
  textoBotaoExcluir: {
    color: '#B91C1C',
    fontWeight: '800',
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
  tituloModal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
  },
  campo: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  campoDesabilitado: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  ajuda: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: -4,
    marginBottom: 10,
  },
  linhaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  rotuloSwitch: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  ajudaSwitch: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
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
    fontWeight: '900',
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
    fontWeight: '900',
  },
});