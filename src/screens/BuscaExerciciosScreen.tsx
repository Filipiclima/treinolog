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
import CampoBusca from '../components/CampoBusca';
import { ExerciciosStackParamList } from '../navigation/tipos';
import { obterCatalogo } from '../services/catalogo';
import { filtrarPorNome } from '../services/wger';
import { cores, espaco, raio } from '../theme';
import { Exercicio } from '../types';

type Props = NativeStackScreenProps<ExerciciosStackParamList, 'Busca'>;

export default function BuscaExerciciosScreen({ navigation }: Props) {
  const [catalogo, setCatalogo] = useState<Exercicio[]>([]);
  const [termo, setTermo] = useState('');
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
    () => filtrarPorNome(catalogo, termo),
    [catalogo, termo]
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
      <CampoBusca valor={termo} onMudar={setTermo} />

      <Text style={styles.contador}>
        {resultados.length} de {catalogo.length} exercícios
      </Text>

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <FlatList
        data={resultados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
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
          <Text style={styles.aviso}>Nenhum exercício encontrado para "{termo}".</Text>
        }
        renderItem={({ item }) => (
          <Cartao
            exercicio={item}
            onAbrir={() => navigation.navigate('Detalhe', { exercicio: item })}
          />
        )}
      />
    </View>
  );
}

function Cartao({
  exercicio,
  onAbrir,
}: {
  exercicio: Exercicio;
  onAbrir: () => void;
}) {
  return (
    <Pressable
      onPress={onAbrir}
      style={({ pressed }) => [styles.cartao, pressed && styles.cartaoAtivo]}
    >
      <Text style={styles.nome}>{exercicio.nome}</Text>
      {exercicio.descricao ? (
        <Text style={styles.descricao} numberOfLines={2}>
          {exercicio.descricao}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espaco.m,
    paddingTop: espaco.m,
    gap: espaco.p,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.m,
  },
  contador: {
    color: cores.textoFraco,
    fontSize: 13,
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
    gap: espaco.pp,
  },
  cartaoAtivo: {
    borderColor: cores.destaque,
  },
  nome: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  descricao: {
    color: cores.textoFraco,
    fontSize: 13,
    lineHeight: 18,
  },
  aviso: {
    color: cores.textoFraco,
    fontSize: 14,
    textAlign: 'center',
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
  },
});
