import { Exercicio } from '../types';

/** Telas da pilha de navegação da aba de exercícios. */
export type ExerciciosStackParamList = {
  Busca: undefined;
  Detalhe: { exercicio: Exercicio };
};
