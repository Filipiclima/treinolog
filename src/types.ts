// Tipos do domínio do TreinoLog.

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
};

/** Uma série executada de um exercício. */
export type Serie = {
  id: string;
  repeticoes: number;
  carga: number; // em quilos
};

/** Um exercício dentro de um treino, com as séries registradas. */
export type ItemTreino = {
  exercicio: Exercicio;
  series: Serie[];
};

/** Uma sessão de treino de um dia. */
export type Treino = {
  id: string;
  data: string; // ISO 8601
  titulo: string;
  itens: ItemTreino[];
  concluido: boolean;
};
