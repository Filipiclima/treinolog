import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CampoBusca from '../components/CampoBusca';
import CartaoExercicio from '../components/CartaoExercicio';
import FiltroGrupos from '../components/FiltroGrupos';
import { ExerciciosStackParamList } from '../navigation/tipos';
import { obterCatalogo } from '../services/catalogo';
import { filtrarExercicios, GRUPOS_MUSCULARES } from '../services/wger';
import { cores, espaco } from '../theme';
import { Exercicio } from '../types';

type Props = NativeStackScreenProps<ExerciciosStackParamList, 'Busca'>;

export default function BuscaExerciciosScreen({ navigation }: Props) {
  const [catalogo, setCatalogo] = useState<Exercicio[]>([]);
  const [termo, setTermo] = useState('');
  const [grupo, setGrupo] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async (forcar = false) => {
    try {
      setErro(null);
      const exercicios = await obterCatalogo(forcar);
      setCatalogo(exercicios);
    } catch {
      setErro('Não foi possível carregar os exercícios. Verifique a conexão.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const resultados = useMemo(
    () => filtrarExercicios(catalogo, termo, grupo),
    [catalogo, termo, grupo]
  );

  if (carregando) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator color={cores.destaque} size="large" />
        <Text style={styles.aviso}>Carregando catálogo de exercícios</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Exercícios</Text>

      <CampoBusca valor={termo} onMudar={setTermo} />

      <FiltroGrupos
        grupos={GRUPOS_MUSCULARES}
        selecionado={grupo}
        onSelecionar={setGrupo}
      />

      <Text style={styles.contador}>
        {resultados.length}{' '}
        {resultados.length === 1 ? 'exercício encontrado' : 'exercícios encontrados'}
      </Text>

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <FlatList
        data={resultados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              setAtualizando(true);
              carregar(true);
            }}
            tintColor={cores.destaque}
          />
        }
        ListEmptyComponent={
          <Text style={styles.aviso}>
            Nenhum exercício encontrado com esses filtros.
          </Text>
        }
        renderItem={({ item }) => (
          <CartaoExercicio
            exercicio={item}
            onAbrir={() => navigation.navigate('Detalhe', { exercicio: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espaco.m,
    paddingTop: espaco.p,
    gap: espaco.m,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.m,
  },
  titulo: {
    color: cores.texto,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  contador: {
    color: cores.textoFraco,
    fontSize: 13,
    marginBottom: -espaco.p,
  },
  lista: {
    gap: espaco.p + 2,
    paddingBottom: espaco.gg,
  },
  aviso: {
    color: cores.textoFraco,
    fontSize: 14,
    textAlign: 'center',
    paddingTop: espaco.g,
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
  },
});
