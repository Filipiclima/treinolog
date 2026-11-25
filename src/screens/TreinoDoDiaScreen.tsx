import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import RegistroSeries from '../components/RegistroSeries';
import { useTreino } from '../contexto/TreinoContext';
import { useAlturaTeclado } from '../hooks/useAlturaTeclado';
import { tituloDoTreino } from '../services/analise';
import { cores, espaco, raio } from '../theme';
import { ItemTreino } from '../types';

function volumeDoItem(item: ItemTreino): number {
  return item.series.reduce(
    (total, serie) => total + serie.repeticoes * serie.carga,
    0
  );
}

export default function TreinoDoDiaScreen() {
  const {
    treino,
    carregando,
    removerExercicio,
    adicionarSerie,
    removerSerie,
    concluirTreino,
    treinosFavoritos,
    repetirTreino,
  } = useTreino();
  const [aviso, setAviso] = useState<string | null>(null);
  const alturaTeclado = useAlturaTeclado();
  const listaRef = useRef<FlatList<ItemTreino>>(null);

  function rolarParaItem(indice: number) {
    setTimeout(() => {
      listaRef.current?.scrollToIndex({
        index: indice,
        viewPosition: 0,
        animated: true,
      });
    }, 300);
  }

  function confirmarConclusao() {
    Alert.alert(
      'Concluir treino',
      'O treino será salvo no histórico e uma nova sessão começa vazia.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: () => {
            const salvou = concluirTreino();
            if (!salvou) {
              setAviso('Registre pelo menos uma série antes de concluir.');
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator color={cores.destaque} size="large" />
      </View>
    );
  }

  if (treino.itens.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>Nenhum exercício ainda</Text>
          <Text style={styles.vazioTexto}>
            Vá até a aba Exercícios, escolha um exercício e toque em adicionar
            ao treino para montar a sessão de hoje.
          </Text>
        </View>

        {treinosFavoritos.length > 0 && (
          <View style={styles.modelos}>
            <Text style={styles.modelosTitulo}>Começar por um treino salvo</Text>
            {treinosFavoritos.map((modelo) => (
              <Pressable
                key={modelo.id}
                onPress={() => repetirTreino(modelo)}
                style={({ pressed }) => [
                  styles.modelo,
                  pressed && styles.pressionado,
                ]}
              >
                <Ionicons name="star" size={18} color={cores.favorito} />
                <View style={styles.modeloTexto}>
                  <Text style={styles.modeloNome}>{tituloDoTreino(modelo)}</Text>
                  <Text style={styles.modeloDetalhe}>
                    {modelo.itens.length}{' '}
                    {modelo.itens.length === 1 ? 'exercício' : 'exercícios'}
                  </Text>
                </View>
                <Ionicons name="refresh" size={18} color={cores.destaque} />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  }

  const totalSeries = treino.itens.reduce(
    (total, item) => total + item.series.length,
    0
  );
  const volumeTotal = treino.itens.reduce(
    (total, item) => total + volumeDoItem(item),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{treino.titulo}</Text>
      <Text style={styles.resumo}>
        {treino.itens.length}{' '}
        {treino.itens.length === 1 ? 'exercício' : 'exercícios'} · {totalSeries}{' '}
        {totalSeries === 1 ? 'série' : 'séries'}
        {volumeTotal > 0 ? ` · ${volumeTotal.toLocaleString('pt-BR')} kg` : ''}
      </Text>

      <FlatList
        ref={listaRef}
        data={treino.itens}
        keyExtractor={(item) => String(item.exercicio.id)}
        contentContainerStyle={[
          styles.lista,
          { paddingBottom: alturaTeclado + espaco.gg },
        ]}
        keyboardShouldPersistTaps="handled"
        onScrollToIndexFailed={() => undefined}
        renderItem={({ item, index }) => (
          <Cartao
            item={item}
            onFocar={() => rolarParaItem(index)}
            onRemover={() => removerExercicio(item.exercicio.id)}
            onAdicionarSerie={(reps, carga) =>
              adicionarSerie(item.exercicio.id, reps, carga)
            }
            onRemoverSerie={(serieId) => removerSerie(item.exercicio.id, serieId)}
          />
        )}
        ListFooterComponent={
          <View style={styles.rodape}>
            {aviso && <Text style={styles.avisoConclusao}>{aviso}</Text>}
            <Botao texto="Concluir treino" onPress={confirmarConclusao} />
          </View>
        }
      />
    </View>
  );
}

type CartaoProps = {
  item: ItemTreino;
  onFocar: () => void;
  onRemover: () => void;
  onAdicionarSerie: (repeticoes: number, carga: number) => void;
  onRemoverSerie: (serieId: string) => void;
};

function Cartao({
  item,
  onFocar,
  onRemover,
  onAdicionarSerie,
  onRemoverSerie,
}: CartaoProps) {
  const volume = volumeDoItem(item);

  return (
    <View style={styles.cartao}>
      <View style={styles.cartaoTopo}>
        <View style={styles.cartaoTexto}>
          <Text style={styles.nome}>{item.exercicio.nome}</Text>
          {item.exercicio.grupoMuscular ? (
            <Text style={styles.grupo}>{item.exercicio.grupoMuscular}</Text>
          ) : null}
        </View>
        <Pressable
          onPress={onRemover}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressionado}
        >
          <Text style={styles.remover}>remover</Text>
        </Pressable>
      </View>

      {volume > 0 && (
        <Text style={styles.volume}>
          Volume: {volume.toLocaleString('pt-BR')} kg
        </Text>
      )}

      <RegistroSeries
        item={item}
        onAdicionar={onAdicionarSerie}
        onRemoverSerie={onRemoverSerie}
        onFocar={onFocar}
      />
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
  rodape: {
    marginTop: espaco.m,
    gap: espaco.p,
  },
  avisoConclusao: {
    color: cores.erro,
    fontSize: 13,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.p,
  },
  cartaoTexto: {
    flex: 1,
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
  remover: {
    color: cores.erro,
    fontSize: 13,
  },
  volume: {
    color: cores.textoFraco,
    fontSize: 13,
  },
  pressionado: {
    opacity: 0.7,
  },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.p,
    paddingHorizontal: espaco.g,
  },
  modelos: {
    gap: espaco.p,
    paddingBottom: espaco.g,
  },
  modelosTitulo: {
    color: cores.textoFraco,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modelo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.m,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    padding: espaco.m,
  },
  modeloTexto: {
    flex: 1,
    gap: 2,
  },
  modeloNome: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  modeloDetalhe: {
    color: cores.textoFraco,
    fontSize: 13,
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
