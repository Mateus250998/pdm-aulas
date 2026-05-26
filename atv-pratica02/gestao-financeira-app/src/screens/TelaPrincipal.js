import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { TelaTransacoes } from './TelaTransacoes';
import { TelaResumo } from './TelaResumo';
import { TelaCategorias } from './TelaCategorias';

export function TelaPrincipal({ usuario, aoSair }) {
  const [abaAtual, setAbaAtual] = useState('transacoes');

  function renderizarConteudo() {
    if (abaAtual === 'resumo') {
      return <TelaResumo />;
    }

    if (abaAtual === 'categorias') {
      return <TelaCategorias />;
    }

    return <TelaTransacoes />;
  }

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar style="dark" />

      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.boasVindas}>Bem-vindo(a),</Text>
          <Text style={estilos.nomeUsuario}>{usuario.nome}</Text>
        </View>

        <TouchableOpacity style={estilos.botaoSair} onPress={aoSair}>
          <Text style={estilos.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.abas}>
        <TouchableOpacity
          style={[
            estilos.botaoAba,
            abaAtual === 'transacoes' && estilos.botaoAbaAtivo,
          ]}
          onPress={() => setAbaAtual('transacoes')}
        >
          <Text
            style={[
              estilos.textoAba,
              abaAtual === 'transacoes' && estilos.textoAbaAtivo,
            ]}
          >
            Transações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            estilos.botaoAba,
            abaAtual === 'resumo' && estilos.botaoAbaAtivo,
          ]}
          onPress={() => setAbaAtual('resumo')}
        >
          <Text
            style={[
              estilos.textoAba,
              abaAtual === 'resumo' && estilos.textoAbaAtivo,
            ]}
          >
            Resumo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            estilos.botaoAba,
            abaAtual === 'categorias' && estilos.botaoAbaAtivo,
          ]}
          onPress={() => setAbaAtual('categorias')}
        >
          <Text
            style={[
              estilos.textoAba,
              abaAtual === 'categorias' && estilos.textoAbaAtivo,
            ]}
          >
            Categorias
          </Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.conteudo}>{renderizarConteudo()}</View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boasVindas: {
    fontSize: 14,
    color: '#6B7280',
  },
  nomeUsuario: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  botaoSair: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  textoBotaoSair: {
    color: '#B91C1C',
    fontWeight: '700',
    fontSize: 13,
  },
  abas: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  botaoAba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  botaoAbaAtivo: {
    backgroundColor: '#2563EB',
  },
  textoAba: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  textoAbaAtivo: {
    color: '#FFFFFF',
  },
  conteudo: {
    flex: 1,
  },
});