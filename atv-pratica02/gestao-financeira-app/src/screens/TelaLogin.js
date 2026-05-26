import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const usuariosPermitidos = [
  {
    email: 'aluno@pdm.com',
    senha: '123456',
    nome: 'Aluno PDM',
  },
  {
    email: 'professor@pdm.com',
    senha: '123456',
    nome: 'Professor',
  },
];

export function TelaLogin({ aoEntrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function validarAcesso() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Informe o e-mail e a senha para acessar.');
      return;
    }

    const usuarioEncontrado = usuariosPermitidos.find(
      (usuario) =>
        usuario.email.toLowerCase() === email.trim().toLowerCase() &&
        usuario.senha === senha
    );

    if (!usuarioEncontrado) {
      Alert.alert('Acesso negado', 'E-mail ou senha inválidos.');
      return;
    }

    aoEntrar({
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
    });
  }

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <View style={estilos.cartao}>
        <Text style={estilos.titulo}>Gestão Financeira</Text>
        <Text style={estilos.subtitulo}>
          Acesse sua conta para controlar receitas e despesas.
        </Text>

        <Text style={estilos.rotulo}>E-mail</Text>
        <TextInput
          style={estilos.campo}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={estilos.rotulo}>Senha</Text>
        <TextInput
          style={estilos.campo}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={estilos.botao} onPress={validarAcesso}>
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <View style={estilos.areaAjuda}>
          <Text style={estilos.textoAjuda}>Usuário de teste:</Text>
          <Text style={estilos.textoAjuda}>aluno@pdm.com</Text>
          <Text style={estilos.textoAjuda}>Senha: 123456</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cartao: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  campo: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  botao: {
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  areaAjuda: {
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  textoAjuda: {
    fontSize: 13,
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 2,
  },
});