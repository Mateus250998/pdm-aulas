import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function converterParaCoordenada(centroX, centroY, raio, angulo) {
  const anguloRadiano = ((angulo - 90) * Math.PI) / 180;

  return {
    x: centroX + raio * Math.cos(anguloRadiano),
    y: centroY + raio * Math.sin(anguloRadiano),
  };
}

function criarCaminhoFatia(centroX, centroY, raio, anguloInicial, anguloFinal) {
  const inicio = converterParaCoordenada(centroX, centroY, raio, anguloFinal);
  const fim = converterParaCoordenada(centroX, centroY, raio, anguloInicial);
  const arcoGrande = anguloFinal - anguloInicial <= 180 ? '0' : '1';

  return [
    `M ${centroX} ${centroY}`,
    `L ${inicio.x} ${inicio.y}`,
    `A ${raio} ${raio} 0 ${arcoGrande} 0 ${fim.x} ${fim.y}`,
    'Z',
  ].join(' ');
}

export function GraficoPizza({ dados }) {
  const total = dados.reduce((soma, item) => soma + item.valor, 0);

  if (!dados.length || total <= 0) {
    return (
      <View style={estilos.semDados}>
        <Text style={estilos.textoSemDados}>
          Sem dados suficientes para gerar o gráfico.
        </Text>
      </View>
    );
  }

  let anguloAtual = 0;
  const tamanho = 180;
  const centro = tamanho / 2;
  const raio = 80;

  return (
    <View style={estilos.container}>
      <Svg width={tamanho} height={tamanho}>
        {dados.map((item) => {
          const porcentagem = item.valor / total;
          const anguloFinal = anguloAtual + porcentagem * 360;
          const caminho = criarCaminhoFatia(
            centro,
            centro,
            raio,
            anguloAtual,
            anguloFinal >= 360 ? 359.99 : anguloFinal
          );

          anguloAtual = anguloFinal;

          return (
            <Path
              key={item.nome}
              d={caminho}
              fill={item.cor}
            />
          );
        })}
      </Svg>

      <View style={estilos.legenda}>
        {dados.map((item) => {
          const porcentagem = ((item.valor / total) * 100).toFixed(1);

          return (
            <View key={item.nome} style={estilos.itemLegenda}>
              <View style={[estilos.corLegenda, { backgroundColor: item.cor }]} />
              <Text style={estilos.textoLegenda}>
                {item.nome} - {porcentagem}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  legenda: {
    width: '100%',
    marginTop: 12,
  },
  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  corLegenda: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  textoLegenda: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  semDados: {
    height: 140,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  textoSemDados: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 14,
  },
});