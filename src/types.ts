/** Exercício vindo da API da wger, reduzido ao que o app usa. */
export type Exercicio = {
  /** Id do exercício na wger (campo "exercise" da tradução). */
  id: number;
  nome: string;
  /** Categoria traduzida, por exemplo "Peito". Carregada no detalhe. */
  grupoMuscular?: string;
  equipamento?: string;
  imagem?: string;
  descricao?: string;
  musculos?: string[];
};

/** Uma série executada de um exercício. */
export type Serie = {
  id: string;
  repeticoes: number;
  carga: number;
};

/** Um exercício dentro de um treino, com as séries registradas. */
export type ItemTreino = {
  exercicio: Exercicio;
  series: Serie[];
};

/** Uma sessão de treino de um dia. */
export type Treino = {
  id: string;
  data: string;
  titulo: string;
  itens: ItemTreino[];
  concluido: boolean;
  concluidoEm?: string;
};
