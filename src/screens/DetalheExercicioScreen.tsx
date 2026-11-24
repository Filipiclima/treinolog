import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import { useFavoritos } from '../contexto/FavoritosContext';
import { useTreino } from '../contexto/TreinoContext';
import { ExerciciosStackParamList } from '../navigation/tipos';
import { buscarMusculos } from '../services/wger';
import { cores, espaco, raio } from '../theme';
import { Exercicio } from '../types';

type Props = NativeStackScreenProps<ExerciciosStackParamList, 'Detalhe'>;

export default function DetalheExercicioScreen({ route }: Props) {
  const [exercicio, setExercicio] = useState<Exercicio>(route.params.exercicio);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { adicionarExercicio, estaNoTreino } = useTreino();
  const { ehFavorito, alternarFavorito } = useFavoritos();
  const favorito = ehFavorito(exercicio.id);
  const jaAdicionado = estaNoTreino(exercicio.id);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const musculos = await buscarMusculos(route.params.exercicio.id);
        if (ativo) setExercicio((atual) => ({ ...atual, musculos }));
      } catch {
        if (ativo)
          setErro('Não foi possível carregar os detalhes deste exercício.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [route.params.exercicio.id]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.nome}>{exercicio.nome}</Text>

      {carregando && <ActivityIndicator color={cores.destaque} />}
      {erro && <Text style={styles.erro}>{erro}</Text>}

      {exercicio.imagem ? (
        <Image
          source={{ uri: exercicio.imagem }}
          style={styles.imagem}
          resizeMode="contain"
        />
      ) : null}

      <View style={styles.acoes}>
        <View style={styles.acaoPrincipal}>
          <Botao
            texto={
              jaAdicionado ? 'Já está no treino de hoje' : 'Adicionar ao treino'
            }
            onPress={() => adicionarExercicio(exercicio)}
            desabilitado={jaAdicionado}
          />
        </View>
        <Pressable
          onPress={() => alternarFavorito(exercicio.id)}
          style={({ pressed }) => [
            styles.botaoEstrela,
            favorito && styles.botaoEstrelaAtivo,
            pressed && styles.pressionado,
          ]}
        >
          <Ionicons
            name={favorito ? 'star' : 'star-outline'}
            size={22}
            color={favorito ? cores.fundo : cores.favorito}
          />
        </Pressable>
      </View>

      <View style={styles.etiquetas}>
        {exercicio.grupoMuscular ? (
          <Etiqueta rotulo="Grupo muscular" valor={exercicio.grupoMuscular} />
        ) : null}
        {exercicio.equipamento ? (
          <Etiqueta rotulo="Equipamento" valor={exercicio.equipamento} />
        ) : null}
        {exercicio.musculos && exercicio.musculos.length > 0 ? (
          <Etiqueta rotulo="Músculos" valor={exercicio.musculos.join(', ')} />
        ) : null}
      </View>

      {exercicio.descricao ? (
        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Como executar</Text>
          <Text style={styles.descricao}>{exercicio.descricao}</Text>
        </View>
      ) : (
        !carregando && (
          <Text style={styles.aviso}>
            Este exercício ainda não tem descrição em português na wger.
          </Text>
        )
      )}
    </ScrollView>
  );
}

function Etiqueta({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.etiqueta}>
      <Text style={styles.etiquetaRotulo}>{rotulo}</Text>
      <Text style={styles.etiquetaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: espaco.m,
    gap: espaco.m,
    paddingBottom: espaco.gg,
  },
  nome: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: '700',
  },
  imagem: {
    width: '100%',
    height: 220,
    backgroundColor: cores.superficie,
    borderRadius: raio.m,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  acoes: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: espaco.p,
  },
  acaoPrincipal: {
    flex: 1,
  },
  botaoEstrela: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: raio.m,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  botaoEstrelaAtivo: {
    backgroundColor: cores.favorito,
    borderColor: cores.favorito,
  },
  pressionado: {
    opacity: 0.75,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.p,
  },
  etiqueta: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.p,
    paddingVertical: espaco.p,
    paddingHorizontal: espaco.m,
    gap: 2,
  },
  etiquetaRotulo: {
    color: cores.textoFraco,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  etiquetaValor: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  bloco: {
    gap: espaco.p,
  },
  blocoTitulo: {
    color: cores.texto,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  descricao: {
    color: cores.textoFraco,
    fontSize: 15,
    lineHeight: 23,
  },
  aviso: {
    color: cores.textoFraco,
    fontSize: 14,
    fontStyle: 'italic',
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
  },
});
