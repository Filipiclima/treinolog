import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { cores, espaco, raio } from '../theme';

type Props = {
  valor: string;
  onMudar: (texto: string) => void;
  placeholder?: string;
};

export default function CampoBusca({ valor, onMudar, placeholder }: Props) {
  return (
    <View style={styles.caixa}>
      <Ionicons name="search" size={20} color={cores.textoFraco} />
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
      {valor.length > 0 && (
        <Pressable onPress={() => onMudar('')} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color={cores.textoFraco} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.p + 2,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    paddingHorizontal: espaco.m,
  },
  campo: {
    flex: 1,
    color: cores.texto,
    fontSize: 16,
    paddingVertical: espaco.p + 6,
  },
});
