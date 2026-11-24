/**
 * Acesso à API pública da wger (https://wger.de/api/v2).
 *
 * A wger descontinuou o endpoint /exercise/search/, e o filtro por nome em
 * /exercise-translation/ só aceita correspondência exata. Por isso o app baixa
 * o catálogo de exercícios em português uma única vez e faz a busca por nome
 * localmente, o que também permite usar o app sem internet depois da primeira
 * carga.
 */
import { Exercicio } from '../types';

const BASE = 'https://wger.de/api/v2';

/** Id do idioma português na wger. */
const IDIOMA_PT = 7;

/** Categorias da wger vêm em inglês; traduzimos para exibir. */
const CATEGORIAS: Record<string, string> = {
  Abs: 'Abdômen',
  Arms: 'Braços',
  Back: 'Costas',
  Calves: 'Panturrilhas',
  Cardio: 'Cardio',
  Chest: 'Peito',
  Legs: 'Pernas',
  Shoulders: 'Ombros',
};

type RespostaPaginada<T> = {
  count: number;
  next: string | null;
  results: T[];
};

type Traducao = {
  id: number;
  name: string;
  exercise: number;
  description: string;
};

async function pegarJson<T>(url: string): Promise<T> {
  const resposta = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!resposta.ok) {
    throw new Error(`A wger respondeu ${resposta.status} em ${url}`);
  }
  return resposta.json() as Promise<T>;
}

/** Remove as tags HTML que a wger envia no campo de descrição. */
function limparHtml(texto: string): string {
  return texto
    .replace(/<li>/gi, '\n• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}

/**
 * Baixa o catálogo completo de exercícios em português, seguindo a paginação
 * da API. São pouco mais de quatrocentos exercícios.
 */
export async function baixarCatalogo(): Promise<Exercicio[]> {
  let url: string | null =
    `${BASE}/exercise-translation/?language=${IDIOMA_PT}&limit=100&format=json`;
  const exercicios: Exercicio[] = [];
  const vistos = new Set<number>();

  for (let pagina = 0; url && pagina < 20; pagina += 1) {
    const dados: RespostaPaginada<Traducao> = await pegarJson(url);

    for (const traducao of dados.results) {
      const nome = traducao.name?.trim();
      if (!nome || vistos.has(traducao.exercise)) continue;
      vistos.add(traducao.exercise);
      exercicios.push({
        id: traducao.exercise,
        nome,
        descricao: traducao.description ? limparHtml(traducao.description) : undefined,
      });
    }

    url = dados.next;
  }

  return exercicios.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

type DetalheExercicio = {
  id: number;
  category?: { id: number; name: string };
  equipment?: { id: number; name: string }[];
  images?: { image: string; is_main: boolean }[];
};

/**
 * Busca grupo muscular, equipamento e imagem de um exercício. Esses dados não
 * vêm na listagem de traduções, então são carregados ao abrir o detalhe.
 */
export async function buscarDetalhe(id: number): Promise<Partial<Exercicio>> {
  const dados = await pegarJson<DetalheExercicio>(
    `${BASE}/exerciseinfo/${id}/?format=json`
  );

  const categoria = dados.category?.name;
  const principal =
    dados.images?.find((imagem) => imagem.is_main) ?? dados.images?.[0];

  return {
    grupoMuscular: categoria ? CATEGORIAS[categoria] ?? categoria : undefined,
    equipamento: dados.equipment?.map((e) => e.name).join(', ') || undefined,
    imagem: principal?.image,
  };
}

/** Filtra o catálogo por nome, ignorando acentos e caixa. */
export function filtrarPorNome(catalogo: Exercicio[], termo: string): Exercicio[] {
  const alvo = normalizar(termo);
  if (!alvo) return catalogo;
  return catalogo.filter((exercicio) => normalizar(exercicio.nome).includes(alvo));
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
