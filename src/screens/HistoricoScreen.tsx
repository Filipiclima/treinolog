import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../theme';

export default function HistoricoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico</Text>
      <Text style={styles.texto}>
        Aqui ficarão os treinos já concluídos e a evolução de carga por
        exercício.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: espaco.g,
    gap: espaco.p,
    justifyContent: 'center',
  },
  titulo: { color: cores.texto, fontSize: 22, fontWeight: '700' },
  texto: { color: cores.textoFraco, fontSize: 15, lineHeight: 22 },
});
