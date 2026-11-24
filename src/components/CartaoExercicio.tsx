import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, raio } from '../theme';
import { Exercicio } from '../types';

const ICONES: Record<string, keyof typeof Ionicons.glyphMap> = {
  Peito: 'barbell-outline',
  Costas: 'body-outline',
  Pernas: 'walk-outline',
  Ombros: 'barbell-outline',
  Braços: 'fitness-outline',
  Abdômen: 'ellipse-outline',
  Panturrilhas: 'footsteps-outline',
  Cardio: 'heart-outline',
};

type Props = {
  exercicio: Exercicio;
  onAbrir: () => void;
  favorito: boolean;
  onAlternarFavorito: () => void;
};

export default function CartaoExercicio({
  exercicio,
  onAbrir,
  favorito,
  onAlternarFavorito,
}: Props) {
  const legenda = [exercicio.grupoMuscular, exercicio.equipamento]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={onAbrir}
      style={({ pressed }) => [styles.cartao, pressed && styles.pressionado]}
    >
      <View style={styles.miniatura}>
        {exercicio.imagem ? (
          <Image
            source={{ uri: exercicio.imagem }}
            style={styles.imagem}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name={ICONES[exercicio.grupoMuscular ?? ''] ?? 'barbell-outline'}
            size={22}
            color={cores.destaque}
          />
        )}
      </View>

      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={2}>
          {exercicio.nome}
        </Text>
        {legenda ? <Text style={styles.legenda}>{legenda}</Text> : null}
      </View>

      <Pressable
        onPress={onAlternarFavorito}
        hitSlop={10}
        style={({ pressed }) => pressed && styles.estrelaPressionada}
      >
        <Ionicons
          name={favorito ? 'star' : 'star-outline'}
          size={22}
          color={favorito ? cores.favorito : cores.textoFraco}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.m,
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.m,
    padding: espaco.p + 4,
  },
  pressionado: {
    opacity: 0.8,
    borderColor: cores.destaque,
  },
  miniatura: {
    width: 48,
    height: 48,
    borderRadius: raio.p + 2,
    backgroundColor: cores.superficieAlta,
    borderColor: cores.borda,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nome: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  legenda: {
    color: cores.textoFraco,
    fontSize: 13,
  },
  estrelaPressionada: {
    opacity: 0.6,
  },
});
