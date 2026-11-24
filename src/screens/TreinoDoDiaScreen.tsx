import { FlatList, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import { useTreino } from '../contexto/TreinoContext';
import { cores, espaco, raio } from '../theme';
import { ItemTreino } from '../types';

export default function TreinoDoDiaScreen() {
  const { treino, removerExercicio } = useTreino();

  if (treino.itens.length === 0) {
    return (
      <View style={[styles.container, styles.centro]}>
        <Text style={styles.vazioTitulo}>Nenhum exercício ainda</Text>
        <Text style={styles.vazioTexto}>
          Vá até a aba Exercícios, escolha um exercício e toque em adicionar ao
          treino para montar a sessão de hoje.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{treino.titulo}</Text>
      <Text style={styles.resumo}>
        {treino.itens.length}{' '}
        {treino.itens.length === 1 ? 'exercício' : 'exercícios'}
      </Text>

      <FlatList
        data={treino.itens}
        keyExtractor={(item) => String(item.exercicio.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Cartao item={item} onRemover={() => removerExercicio(item.exercicio.id)} />
        )}
      />
    </View>
  );
}

function Cartao({ item, onRemover }: { item: ItemTreino; onRemover: () => void }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.cartaoTopo}>
        <Text style={styles.nome}>{item.exercicio.nome}</Text>
        {item.exercicio.grupoMuscular ? (
          <Text style={styles.grupo}>{item.exercicio.grupoMuscular}</Text>
        ) : null}
      </View>

      <Text style={styles.series}>
        {item.series.length === 0
          ? 'Nenhuma série registrada'
          : `${item.series.length} séries registradas`}
      </Text>

      <Botao texto="Remover" onPress={onRemover} variante="perigo" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espaco.m,
    paddingTop: espaco.m,
    gap: espaco.pp,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.p,
    paddingHorizontal: espaco.g,
  },
  titulo: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '700',
  },
  resumo: {
    color: cores.textoFraco,
    fontSize: 13,
    marginBottom: espaco.p,
  },
  lista: {
    gap: espaco.p,
    paddingBottom: espaco.gg,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    padding: espaco.m,
    gap: espaco.p,
  },
  cartaoTopo: {
    gap: 2,
  },
  nome: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  grupo: {
    color: cores.destaque,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  series: {
    color: cores.textoFraco,
    fontSize: 14,
  },
  vazioTitulo: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: '700',
  },
  vazioTexto: {
    color: cores.textoFraco,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
