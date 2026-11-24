/**
 * Cache local do catálogo de exercícios.
 *
 * O catálogo muda pouco, então guardamos no dispositivo com a data da última
 * carga e só buscamos na API novamente depois de uma semana. Assim a busca é
 * instantânea e o app continua funcionando sem conexão.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercicio } from '../types';
import { baixarCatalogo } from './wger';

const CHAVE = '@treinolog:catalogo';
const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000;

type CatalogoSalvo = {
  salvoEm: number;
  exercicios: Exercicio[];
};

async function lerCache(): Promise<CatalogoSalvo | null> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as CatalogoSalvo) : null;
  } catch {
    return null;
  }
}

/**
 * Devolve o catálogo, usando o cache quando ele existe e ainda está válido.
 * Com forcarAtualizacao, ignora o cache e busca na API.
 */
export async function obterCatalogo(forcarAtualizacao = false): Promise<Exercicio[]> {
  const cache = await lerCache();
  const valido = cache && Date.now() - cache.salvoEm < VALIDADE_MS;

  if (!forcarAtualizacao && valido && cache.exercicios.length > 0) {
    return cache.exercicios;
  }

  try {
    const exercicios = await baixarCatalogo();
    const paraSalvar: CatalogoSalvo = { salvoEm: Date.now(), exercicios };
    await AsyncStorage.setItem(CHAVE, JSON.stringify(paraSalvar));
    return exercicios;
  } catch (erro) {
    if (cache && cache.exercicios.length > 0) return cache.exercicios;
    throw erro;
  }
}
