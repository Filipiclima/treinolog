import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AbasParamList } from '../navigation/tipos';
import { useTreino } from '../contexto/TreinoContext';
import {
  agruparPorMes,
  classificarTreino,
  duracaoEmMinutos,
  formatarVolume,
  resumoDoMes,
  tituloDoTreino,
  volumeDoTreino,
} from '../services/analise';
import { cores, espaco, raio } from '../theme';
import { ItemTreino, Treino } from '../types';

export default function HistoricoScreen() {
  const { historico, removerDoHistorico, alternarFavoritoTreino, treino, repetirTreino } =
    useTreino();
  const insets = useSafeAreaInsets();
  const navegacao = useNavigation<BottomTabNavigationProp<AbasParamList>>();

  function confirmarRepeticao(modelo: Treino) {
    function repetir() {
      repetirTreino(modelo);
      navegacao.navigate('Treino');
    }

    if (treino.itens.length > 0) {
      Alert.alert(
        'Substituir treino atual',
        'Você já tem um treino em andamento. Ele será descartado e substituído por este modelo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Substituir', style: 'destructive', onPress: repetir },
        ]
      );
      return;
    }

    repetir();
  }

  if (historico.length === 0) {
    return (
      <View
        style={[styles.container, styles.centro, { paddingTop: insets.top }]}
      >
        <Ionicons name="time-outline" size={48} color={cores.textoFraco} />
        <Text style={styles.vazioTitulo}>Nenhum treino concluído</Text>
        <Text style={styles.vazioTexto}>
          Quando você concluir um treino na aba Treino, ele aparece aqui com as
          séries, o volume e a classificação daquela sessão.
        </Text>
      </View>
    );
  }

  const resumo = resumoDoMes(historico);
  const secoes = agruparPorMes(historico);

  function confirmarExclusao(treino: Treino) {
    Alert.alert('Excluir treino', 'Remover esta sessão do histórico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removerDoHistorico(treino.id),
      },
    ]);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + espaco.p }]}>
      <Text style={styles.tituloTela}>Histórico</Text>

      <SectionList
        sections={secoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={styles.painel}>
            <Indicador
              rotulo={`Treinos em ${resumo.rotulo}`}
              valor={String(resumo.treinos)}
            />
            <Indicador rotulo="Volume no mês" valor={formatarVolume(resumo.volume)} />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.mes}>{section.rotulo.toUpperCase()}</Text>
        )}
        renderItem={({ item }) => (
          <CartaoTreino
            treino={item}
            onExcluir={() => confirmarExclusao(item)}
            onAlternarFavorito={() => alternarFavoritoTreino(item.id)}
            onRepetir={() => confirmarRepeticao(item)}
          />
        )}
      />
    </View>
  );
}

function Indicador({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.indicador}>
      <Text style={styles.indicadorRotulo}>{rotulo.toUpperCase()}</Text>
      <Text style={styles.indicadorValor}>{valor}</Text>
    </View>
  );
}

function CartaoTreino({
  treino,
  onExcluir,
  onAlternarFavorito,
  onRepetir,
}: {
  treino: Treino;
  onExcluir: () => void;
  onAlternarFavorito: () => void;
  onRepetir: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const data = new Date(treino.data);
  const dia = String(data.getDate()).padStart(2, '0');
  const semana = data
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '')
    .slice(0, 3)
    .toUpperCase();

  const volume = volumeDoTreino(treino);
  const minutos = duracaoEmMinutos(treino);
  const classificacao = classificarTreino(treino);

  const legenda = [
    minutos ? `${minutos} min` : null,
    `${formatarVolume(volume)} de volume`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={[styles.cartao, aberto && styles.cartaoAberto]}>
      <Pressable
        onPress={() => setAberto((atual) => !atual)}
        style={({ pressed }) => [styles.cabecalho, pressed && styles.pressionado]}
      >
        <View style={[styles.selo, aberto && styles.seloAberto]}>
          <Text style={[styles.seloDia, aberto && styles.seloDiaAberto]}>{dia}</Text>
          <Text style={styles.seloSemana}>{semana}</Text>
        </View>

        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>{tituloDoTreino(treino)}</Text>
          <Text style={styles.legenda}>{legenda}</Text>
        </View>

        <Pressable
          onPress={onAlternarFavorito}
          hitSlop={10}
          style={({ pressed }) => pressed && styles.pressionado}
        >
          <Ionicons
            name={treino.favorito ? 'star' : 'star-outline'}
            size={20}
            color={treino.favorito ? cores.favorito : cores.textoFraco}
          />
        </Pressable>

        <Ionicons
          name={aberto ? 'chevron-down' : 'chevron-forward'}
          size={18}
          color={cores.textoFraco}
        />
      </Pressable>

      {aberto && (
        <View style={styles.detalhes}>
          {classificacao && (
            <View style={styles.classificacao}>
              <View style={styles.etiqueta}>
                <Text style={styles.etiquetaTexto}>{classificacao.nome}</Text>
              </View>
              <Text style={styles.explicacao}>{classificacao.explicacao}</Text>
            </View>
          )}

          <View style={styles.exercicios}>
            {treino.itens.map((item) => (
              <LinhaExercicio key={item.exercicio.id} item={item} />
            ))}
          </View>

          <View style={styles.acoes}>
            <Pressable
              onPress={onRepetir}
              style={({ pressed }) => [styles.repetir, pressed && styles.pressionado]}
            >
              <Ionicons name="refresh" size={16} color={cores.fundo} />
              <Text style={styles.repetirTexto}>Repetir este treino</Text>
            </Pressable>

            <Pressable onPress={onExcluir} hitSlop={8}>
              <Text style={styles.excluir}>Excluir do histórico</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function LinhaExercicio({ item }: { item: ItemTreino }) {
  if (item.series.length === 0) return null;

  const series = item.series
    .map((serie) =>
      serie.carga > 0 ? `${serie.carga}×${serie.repeticoes}` : `${serie.repeticoes} reps`
    )
    .join(' · ');

  return (
    <View style={styles.linha}>
      <Text style={styles.exercicio} numberOfLines={1}>
        {item.exercicio.nome}
      </Text>
      <Text style={styles.series}>{series}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espaco.m,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.p,
    paddingHorizontal: espaco.g,
  },
  tituloTela: {
    color: cores.texto,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: espaco.m,
  },
  lista: {
    gap: espaco.p + 2,
    paddingBottom: espaco.gg,
  },
  painel: {
    flexDirection: 'row',
    gap: espaco.p + 2,
    marginBottom: espaco.p,
  },
  indicador: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    padding: espaco.m,
    gap: espaco.p,
  },
  indicadorRotulo: {
    color: cores.textoFraco,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  indicadorValor: {
    color: cores.texto,
    fontSize: 26,
    fontWeight: '800',
  },
  mes: {
    color: cores.textoFraco,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: espaco.p,
    marginBottom: espaco.pp,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    overflow: 'hidden',
  },
  cartaoAberto: {
    borderColor: cores.destaqueFraco,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.m,
    padding: espaco.p + 4,
  },
  pressionado: {
    opacity: 0.8,
  },
  selo: {
    width: 52,
    height: 52,
    borderRadius: raio.p + 2,
    backgroundColor: cores.superficieAlta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seloAberto: {
    backgroundColor: cores.destaqueFraco,
  },
  seloDia: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  seloDiaAberto: {
    color: cores.destaque,
  },
  seloSemana: {
    color: cores.textoFraco,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cabecalhoTexto: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  legenda: {
    color: cores.textoFraco,
    fontSize: 13,
  },
  detalhes: {
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    padding: espaco.m,
    gap: espaco.m,
  },
  classificacao: {
    gap: espaco.pp + 2,
  },
  etiqueta: {
    alignSelf: 'flex-start',
    backgroundColor: cores.destaqueFraco,
    borderRadius: raio.redondo,
    paddingVertical: espaco.pp,
    paddingHorizontal: espaco.p + 4,
  },
  etiquetaTexto: {
    color: cores.destaque,
    fontSize: 13,
    fontWeight: '700',
  },
  explicacao: {
    color: cores.textoFraco,
    fontSize: 12,
    lineHeight: 17,
  },
  exercicios: {
    gap: espaco.p,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.p,
  },
  exercicio: {
    color: cores.texto,
    fontSize: 14,
    flex: 1,
  },
  series: {
    color: cores.textoFraco,
    fontSize: 13,
  },
  acoes: {
    gap: espaco.m,
    alignItems: 'center',
  },
  repetir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.p,
    alignSelf: 'stretch',
    backgroundColor: cores.destaque,
    borderRadius: raio.m,
    paddingVertical: espaco.p + 4,
  },
  repetirTexto: {
    color: cores.fundo,
    fontSize: 15,
    fontWeight: '700',
  },
  excluir: {
    color: cores.erro,
    fontSize: 13,
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
