import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { cores, espaco, raio } from '../theme';
import { ItemTreino } from '../types';

type Props = {
  item: ItemTreino;
  onAdicionar: (repeticoes: number, carga: number) => void;
  onRemoverSerie: (serieId: string) => void;
};

function paraNumero(texto: string): number {
  return Number(texto.replace(',', '.'));
}

export default function RegistroSeries({ item, onAdicionar, onRemoverSerie }: Props) {
  const [repeticoes, setRepeticoes] = useState('');
  const [carga, setCarga] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function confirmar() {
    const reps = paraNumero(repeticoes);
    const peso = paraNumero(carga);

    if (!Number.isInteger(reps) || reps <= 0) {
      setErro('Informe um número inteiro de repetições.');
      return;
    }
    if (Number.isNaN(peso) || peso < 0) {
      setErro('Informe uma carga válida em quilos.');
      return;
    }

    onAdicionar(reps, peso);
    setRepeticoes('');
    setCarga('');
    setErro(null);
  }

  return (
    <View style={styles.bloco}>
      {item.series.length > 0 && (
        <View style={styles.listaSeries}>
          {item.series.map((serie, indice) => (
            <View key={serie.id} style={styles.linhaSerie}>
              <Text style={styles.indice}>{indice + 1}ª</Text>
              <Text style={styles.valorSerie}>
                {serie.repeticoes} reps
                {serie.carga > 0 ? ` · ${serie.carga} kg` : ' · peso do corpo'}
              </Text>
              <Pressable
                onPress={() => onRemoverSerie(serie.id)}
                hitSlop={8}
                style={({ pressed }) => pressed && styles.pressionado}
              >
                <Text style={styles.excluir}>excluir</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={styles.formulario}>
        <TextInput
          style={styles.campo}
          value={repeticoes}
          onChangeText={setRepeticoes}
          placeholder="Reps"
          placeholderTextColor={cores.textoFraco}
          keyboardType="number-pad"
          maxLength={3}
        />
        <TextInput
          style={styles.campo}
          value={carga}
          onChangeText={setCarga}
          placeholder="Carga kg"
          placeholderTextColor={cores.textoFraco}
          keyboardType="decimal-pad"
          maxLength={6}
        />
        <Pressable
          onPress={confirmar}
          style={({ pressed }) => [styles.adicionar, pressed && styles.pressionado]}
        >
          <Text style={styles.adicionarTexto}>Registrar</Text>
        </Pressable>
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    gap: espaco.p,
  },
  listaSeries: {
    gap: espaco.pp,
  },
  linhaSerie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.p,
    paddingVertical: espaco.pp,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  indice: {
    color: cores.destaque,
    fontSize: 13,
    fontWeight: '700',
    width: 28,
  },
  valorSerie: {
    color: cores.texto,
    fontSize: 15,
    flex: 1,
  },
  excluir: {
    color: cores.erro,
    fontSize: 13,
  },
  formulario: {
    flexDirection: 'row',
    gap: espaco.p,
    alignItems: 'center',
  },
  campo: {
    flex: 1,
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.p,
    color: cores.texto,
    fontSize: 15,
    paddingHorizontal: espaco.p + 4,
    paddingVertical: espaco.p,
  },
  adicionar: {
    backgroundColor: cores.destaque,
    borderRadius: raio.p,
    paddingHorizontal: espaco.m,
    paddingVertical: espaco.p + 2,
  },
  adicionarTexto: {
    color: cores.fundo,
    fontSize: 14,
    fontWeight: '700',
  },
  pressionado: {
    opacity: 0.7,
  },
  erro: {
    color: cores.erro,
    fontSize: 13,
  },
});
