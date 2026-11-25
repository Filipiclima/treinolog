import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTreino } from '../contexto/TreinoContext';
import { cores, espaco, raio } from '../theme';
import { ItemTreino, Treino } from '../types';

function volumeDoTreino(treino: Treino): number {
  return treino.itens.reduce(
    (total, item) =>
      total +
      item.series.reduce((soma, serie) => soma + serie.repeticoes * serie.carga, 0),
    0
  );
}

function totalSeries(treino: Treino): number {
  return treino.itens.reduce((total, item) => total + item.series.length, 0);
}

function dataLonga(iso: string): string {
  const data = new Date(iso);
  const formatada = data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  return formatada.charAt(0).toUpperCase() + formatada.slice(1);
}

export default function HistoricoScreen() {
  const { historico, removerDoHistorico } = useTreino();

  if (historico.length === 0) {
    return (
      <View style={[styles.container, styles.centro]}>
        <Ionicons name="time-outline" size={48} color={cores.textoFraco} />
        <Text style={styles.vazioTitulo}>Nenhum treino concluído</Text>
        <Text style={styles.vazioTexto}>
          Quando você concluir um treino na aba Treino, ele aparece aqui com as
          séries e o volume daquela sessão.
        </Text>
      </View>
    );
  }

  function confirmarExclusao(treino: Treino) {
    Alert.alert('Excluir treino', `Remover ${treino.titulo} do histórico?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removerDoHistorico(treino.id),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <CartaoTreino treino={item} onExcluir={() => confirmarExclusao(item)} />
        )}
      />
    </View>
  );
}

function CartaoTreino({
  treino,
  onExcluir,
}: {
  treino: Treino;
  onExcluir: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const volume = volumeDoTreino(treino);
  const series = totalSeries(treino);

  return (
    <View style={styles.cartao}>
      <Pressable
        onPress={() => setAberto((atual) => !atual)}
        style={({ pressed }) => [styles.cabecalho, pressed && styles.pressionado]}
      >
        <View style={styles.cabecalhoTexto}>
          <Text style={styles.data}>{dataLonga(treino.data)}</Text>
          <Text style={styles.resumo}>
            {treino.itens.length}{' '}
            {treino.itens.length === 1 ? 'exercício' : 'exercícios'} · {series}{' '}
            {series === 1 ? 'série' : 'séries'}
            {volume > 0 ? ` · ${volume.toLocaleString('pt-BR')} kg` : ''}
          </Text>
        </View>
        <Ionicons
          name={aberto ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={cores.textoFraco}
        />
      </Pressable>

      {aberto && (
        <View style={styles.detalhes}>
          {treino.itens.map((item) => (
            <LinhaExercicio key={item.exercicio.id} item={item} />
          ))}
          <Pressable onPress={onExcluir} hitSlop={8}>
            <Text style={styles.excluir}>Excluir do histórico</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function LinhaExercicio({ item }: { item: ItemTreino }) {
  if (item.series.length === 0) return null;

  const descricao = item.series
    .map((serie) =>
      serie.carga > 0 ? `${serie.repeticoes}x${serie.carga}kg` : `${serie.repeticoes} reps`
    )
    .join('  ');

  return (
    <View style={styles.linha}>
      <Text style={styles.exercicio}>{item.exercicio.nome}</Text>
      <Text style={styles.series}>{descricao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espaco.m,
    paddingTop: espaco.p,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.p,
    paddingHorizontal: espaco.g,
  },
  lista: {
    gap: espaco.p + 2,
    paddingBottom: espaco.gg,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    overflow: 'hidden',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.p,
    padding: espaco.m,
  },
  pressionado: {
    opacity: 0.8,
  },
  cabecalhoTexto: {
    flex: 1,
    gap: 2,
  },
  data: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  resumo: {
    color: cores.textoFraco,
    fontSize: 13,
  },
  detalhes: {
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    padding: espaco.m,
    gap: espaco.p + 2,
  },
  linha: {
    gap: 2,
  },
  exercicio: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '500',
  },
  series: {
    color: cores.destaque,
    fontSize: 13,
  },
  excluir: {
    color: cores.erro,
    fontSize: 13,
    paddingTop: espaco.pp,
  },
  vazioTitulo: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: '700',
    marginTop: espaco.p,
  },
  vazioTexto: {
    color: cores.textoFraco,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
