import { Pressable, StyleSheet, Text } from 'react-native';
import { cores, espaco, raio } from '../theme';

type Props = {
  texto: string;
  onPress: () => void;
  variante?: 'principal' | 'secundario' | 'perigo';
  desabilitado?: boolean;
};

export default function Botao({
  texto,
  onPress,
  variante = 'principal',
  desabilitado = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      style={({ pressed }) => [
        styles.base,
        styles[variante],
        pressed && styles.pressionado,
        desabilitado && styles.desabilitado,
      ]}
    >
      <Text style={[styles.texto, variante === 'principal' && styles.textoPrincipal]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: raio.m,
    paddingVertical: espaco.p + 4,
    paddingHorizontal: espaco.m,
    alignItems: 'center',
    borderWidth: 1,
  },
  principal: {
    backgroundColor: cores.destaque,
    borderColor: cores.destaque,
  },
  secundario: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
  },
  perigo: {
    backgroundColor: 'transparent',
    borderColor: cores.erro,
  },
  pressionado: {
    opacity: 0.75,
  },
  desabilitado: {
    opacity: 0.5,
  },
  texto: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  textoPrincipal: {
    color: cores.fundo,
  },
});
