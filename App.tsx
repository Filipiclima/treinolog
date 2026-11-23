import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, raio } from './src/theme';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.conteudo}>
        <Text style={styles.marca}>TreinoLog</Text>
        <Text style={styles.subtitulo}>
          Seu diário de treinos. Busque o exercício, registre as séries e
          acompanhe a evolução da carga.
        </Text>

        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>Próximos passos</Text>
          <Text style={styles.cartaoItem}>Navegação entre as telas</Text>
          <Text style={styles.cartaoItem}>Busca de exercícios na API wger</Text>
          <Text style={styles.cartaoItem}>Registro local de séries e cargas</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: espaco.g,
    gap: espaco.m,
  },
  marca: {
    color: cores.destaque,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitulo: {
    color: cores.textoFraco,
    fontSize: 16,
    lineHeight: 24,
  },
  cartao: {
    marginTop: espaco.m,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    padding: espaco.m,
    gap: espaco.p,
  },
  cartaoTitulo: {
    color: cores.texto,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: espaco.pp,
  },
  cartaoItem: {
    color: cores.textoFraco,
    fontSize: 15,
  },
});
