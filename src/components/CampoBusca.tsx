import { StyleSheet, TextInput, View } from 'react-native';
import { cores, espaco, raio } from '../theme';

type Props = {
  valor: string;
  onMudar: (texto: string) => void;
  placeholder?: string;
};

export default function CampoBusca({ valor, onMudar, placeholder }: Props) {
  return (
    <View style={styles.caixa}>
      <TextInput
        style={styles.campo}
        value={valor}
        onChangeText={onMudar}
        placeholder={placeholder ?? 'Buscar exercício'}
        placeholderTextColor={cores.textoFraco}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    paddingHorizontal: espaco.m,
  },
  campo: {
    color: cores.texto,
    fontSize: 16,
    paddingVertical: espaco.p + 4,
  },
});
