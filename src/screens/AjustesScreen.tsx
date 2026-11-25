import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFavoritos } from '../contexto/FavoritosContext';
import { useTreino } from '../contexto/TreinoContext';
import { dataDoCatalogo, limparCacheCatalogo } from '../services/catalogo';
import { cores, espaco, raio } from '../theme';

export default function AjustesScreen() {
  const { historico, limparHistorico } = useTreino();
  const { total: totalFavoritos, limparFavoritos } = useFavoritos();
  const [atualizadoEm, setAtualizadoEm] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      const data = await dataDoCatalogo();
      setAtualizadoEm(
        data ? data.toLocaleDateString('pt-BR') : 'ainda não baixado'
      );
    }
    carregar();
  }, []);

  function confirmar(titulo: string, mensagem: string, acao: () => void) {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: acao },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Secao titulo="Dados salvos no aparelho">
        <Linha
          icone="bookmark-outline"
          titulo="Favoritos"
          detalhe={`${totalFavoritos} ${totalFavoritos === 1 ? 'exercício' : 'exercícios'}`}
          acao="Limpar"
          onPress={() =>
            confirmar(
              'Limpar favoritos',
              'Todos os exercícios favoritados serão desmarcados.',
              limparFavoritos
            )
          }
          desabilitado={totalFavoritos === 0}
        />
        <Linha
          icone="time-outline"
          titulo="Histórico de treinos"
          detalhe={`${historico.length} ${historico.length === 1 ? 'sessão' : 'sessões'}`}
          acao="Apagar"
          onPress={() =>
            confirmar(
              'Apagar histórico',
              'Todas as sessões concluídas serão removidas. Isso não pode ser desfeito.',
              limparHistorico
            )
          }
          desabilitado={historico.length === 0}
        />
        <Linha
          icone="cloud-download-outline"
          titulo="Catálogo de exercícios"
          detalhe={`Atualizado em ${atualizadoEm ?? '...'}`}
          acao="Baixar de novo"
          onPress={() =>
            confirmar(
              'Baixar catálogo novamente',
              'O catálogo salvo será descartado e buscado de novo na próxima vez que você abrir a aba Exercícios.',
              async () => {
                await limparCacheCatalogo();
                setAtualizadoEm('ainda não baixado');
              }
            )
          }
        />
      </Secao>

      <Secao titulo="Sobre">
        <View style={styles.bloco}>
          <Text style={styles.textoSobre}>
            TreinoLog é um diário de treinos desenvolvido como projeto final da
            disciplina de Desenvolvimento de Aplicativo Móvel com React Native.
          </Text>
          <Text style={styles.textoSobre}>
            Os dados de exercícios vêm do projeto wger Workout Manager, de
            acesso público e licença aberta mantida pela comunidade.
          </Text>
          <Pressable
            onPress={() => Linking.openURL('https://wger.de')}
            style={({ pressed }) => pressed && styles.pressionado}
          >
            <Text style={styles.link}>wger.de</Text>
          </Pressable>
        </View>
      </Secao>
    </ScrollView>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

type LinhaProps = {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  detalhe: string;
  acao: string;
  onPress: () => void;
  desabilitado?: boolean;
};

function Linha({
  icone,
  titulo,
  detalhe,
  acao,
  onPress,
  desabilitado = false,
}: LinhaProps) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={22} color={cores.destaque} />
      <View style={styles.linhaTexto}>
        <Text style={styles.linhaTitulo}>{titulo}</Text>
        <Text style={styles.linhaDetalhe}>{detalhe}</Text>
      </View>
      <Pressable
        onPress={onPress}
        disabled={desabilitado}
        style={({ pressed }) => [
          styles.acao,
          pressed && styles.pressionado,
          desabilitado && styles.desabilitado,
        ]}
      >
        <Text style={styles.acaoTexto}>{acao}</Text>
      </Pressable>
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
    gap: espaco.g,
    paddingBottom: espaco.gg,
  },
  secao: {
    gap: espaco.p,
  },
  secaoTitulo: {
    color: cores.textoFraco,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.m,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    padding: espaco.m,
  },
  linhaTexto: {
    flex: 1,
    gap: 2,
  },
  linhaTitulo: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  linhaDetalhe: {
    color: cores.textoFraco,
    fontSize: 13,
  },
  acao: {
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.redondo,
    paddingVertical: espaco.p - 2,
    paddingHorizontal: espaco.p + 4,
  },
  acaoTexto: {
    color: cores.texto,
    fontSize: 13,
    fontWeight: '600',
  },
  desabilitado: {
    opacity: 0.4,
  },
  pressionado: {
    opacity: 0.7,
  },
  bloco: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    padding: espaco.m,
    gap: espaco.p,
  },
  textoSobre: {
    color: cores.textoFraco,
    fontSize: 14,
    lineHeight: 21,
  },
  link: {
    color: cores.destaque,
    fontSize: 14,
    fontWeight: '600',
  },
});
