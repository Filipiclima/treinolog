import AsyncStorage from '@react-native-async-storage/async-storage';
import { Treino } from '../types';

const CHAVE_TREINO_ATUAL = '@treinolog:treinoAtual';
const CHAVE_HISTORICO = '@treinolog:historico';

export async function salvarTreinoAtual(treino: Treino): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_TREINO_ATUAL, JSON.stringify(treino));
  } catch {
    return;
  }
}

export async function lerTreinoAtual(): Promise<Treino | null> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_TREINO_ATUAL);
    if (!bruto) return null;
    const treino = JSON.parse(bruto) as Treino;
    return Array.isArray(treino.itens) ? treino : null;
  } catch {
    return null;
  }
}

export async function apagarTreinoAtual(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CHAVE_TREINO_ATUAL);
  } catch {
    return;
  }
}

export async function lerHistorico(): Promise<Treino[]> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_HISTORICO);
    if (!bruto) return [];
    const historico = JSON.parse(bruto) as Treino[];
    return Array.isArray(historico) ? historico : [];
  } catch {
    return [];
  }
}

export async function salvarHistorico(historico: Treino[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
  } catch {
    return;
  }
}
