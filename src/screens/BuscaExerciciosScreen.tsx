import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CampoBusca from '../components/CampoBusca';
import CartaoExercicio from '../components/CartaoExercicio';
import FiltroGrupos from '../components/FiltroGrupos';
import { useFavoritos } from '../contexto/FavoritosContext';
import { ExerciciosStackParamList } from '../navigation/tipos';
import { obterCatalogo } from '../services/catalogo';
import { filtrarExercicios, GRUPOS_MUSCULARES } from '../services/wger';
import { cores, espaco, raio } from '../theme';
import { Exercicio } from '../types';

type Props = NativeStackScreenProps<ExerciciosStackParamList, 'Busca'>;

export default function BuscaExerciciosScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [catalogo, setCatalogo] = useState<Exercicio[]>([]);
  const [termo, setTermo] = useState('');
  const [grupo, setGrupo] = useState<string | null>(null);
  const [soFavoritos, setSoFavoritos] = useState(false);
  const { ehFavorito, alternarFavorito, total: totalFavoritos } = useFavoritos();
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

  const resultados = useMemo(() => {
    const filtrados = filtrarExercicios(catalogo, termo, grupo);
    return soFavoritos ? filtrados.filter((item) => ehFavorito(item.id)) : filtrados;
  }, [catalogo, termo, grupo, soFavoritos, ehFavorito]);

  if (carregando) {
    return (
      <View
        style={[styles.container, styles.centro, { paddingTop: insets.top }]}
      >
        <ActivityIndicator color={cores.destaque} size="large" />
        <Text style={styles.aviso}>Carregando catálogo de exercícios</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + espaco.p }]}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Exercícios</Text>
        <Pressable
          onPress={() => setSoFavoritos((atual) => !atual)}
          style={({ pressed }) => [
            styles.botaoFavoritos,
            soFavoritos && styles.botaoFavoritosAtivo,
            pressed && styles.pressionado,
          ]}
        >
          <Ionicons
            name={soFavoritos ? 'star' : 'star-outline'}
            size={16}
            color={soFavoritos ? cores.fundo : cores.favorito}
          />
          <Text
            style={[
              styles.botaoFavoritosTexto,
              soFavoritos && styles.botaoFavoritosTextoAtivo,
            ]}
          >
            Favoritos{totalFavoritos > 0 ? ` ${totalFavoritos}` : ''}
          </Text>
        </Pressable>
      </View>

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
            {soFavoritos && totalFavoritos === 0
              ? 'Você ainda não favoritou nenhum exercício. Toque na estrela de um exercício para salvá-lo aqui.'
              : 'Nenhum exercício encontrado com esses filtros.'}
          </Text>
        }
        renderItem={({ item }) => (
          <CartaoExercicio
            exercicio={item}
            onAbrir={() => navigation.navigate('Detalhe', { exercicio: item })}
            favorito={ehFavorito(item.id)}
            onAlternarFavorito={() => alternarFavorito(item.id)}
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
    gap: espaco.m,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.m,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.p,
  },
  titulo: {
    color: cores.texto,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  botaoFavoritos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.pp + 2,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.redondo,
    paddingVertical: espaco.p,
    paddingHorizontal: espaco.m,
  },
  botaoFavoritosAtivo: {
    backgroundColor: cores.favorito,
    borderColor: cores.favorito,
  },
  botaoFavoritosTexto: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: '600',
  },
  botaoFavoritosTextoAtivo: {
    color: cores.fundo,
  },
  pressionado: {
    opacity: 0.75,
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
