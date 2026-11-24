import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { cores, espaco, raio } from '../theme';

type Props = {
  grupos: string[];
  selecionado: string | null;
  onSelecionar: (grupo: string | null) => void;
};

export default function FiltroGrupos({ grupos, selecionado, onSelecionar }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.faixa}
      keyboardShouldPersistTaps="handled"
    >
      {grupos.map((grupo) => {
        const ativo = selecionado === grupo;
        return (
          <Pressable
            key={grupo}
            onPress={() => onSelecionar(ativo ? null : grupo)}
            style={({ pressed }) => [
              styles.chip,
              ativo && styles.chipAtivo,
              pressed && styles.pressionado,
            ]}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>{grupo}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  faixa: {
    gap: espaco.p,
    paddingRight: espaco.m,
  },
  chip: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.redondo,
    paddingVertical: espaco.p,
    paddingHorizontal: espaco.m,
  },
  chipAtivo: {
    backgroundColor: cores.destaque,
    borderColor: cores.destaque,
  },
  pressionado: {
    opacity: 0.75,
  },
  texto: {
    color: cores.textoFraco,
    fontSize: 14,
    fontWeight: '600',
  },
  textoAtivo: {
    color: '#ffffff',
  },
});
