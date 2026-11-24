import { Exercicio } from '../types';

const BASE = 'https://wger.de/api/v2';
const IDIOMA_PT = 7;
const POR_PAGINA = 200;

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

const EQUIPAMENTOS: Record<string, string> = {
  Barbell: 'Barra',
  Bench: 'Banco',
  'Cable machine': 'Cabo',
  Dumbbell: 'Halteres',
  'Gym mat': 'Colchonete',
  'Incline bench': 'Banco inclinado',
  Kettlebell: 'Kettlebell',
  'Pull-up bar': 'Barra fixa',
  'Resistance band': 'Elástico',
  'SZ-Bar': 'Barra W',
  'Swiss Ball': 'Bola suíça',
  'none (bodyweight exercise)': 'Peso corporal',
};

export const GRUPOS_MUSCULARES = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
  'Abdômen',
  'Panturrilhas',
  'Cardio',
];

type Pagina<T> = { count: number; next: string | null; results: T[] };

async function pegarJson<T>(url: string): Promise<T> {
  const resposta = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!resposta.ok) {
    throw new Error(`A wger respondeu ${resposta.status} em ${url}`);
  }
  return resposta.json() as Promise<T>;
}

async function pegarTudo<T>(caminho: string): Promise<T[]> {
  let url: string | null = `${BASE}/${caminho}&limit=${POR_PAGINA}&format=json`;
  const tudo: T[] = [];

  for (let pagina = 0; url && pagina < 15; pagina += 1) {
    const dados: Pagina<T> = await pegarJson(url);
    tudo.push(...dados.results);
    url = dados.next;
  }

  return tudo;
}

function limparHtml(texto: string): string {
  return texto
    .replace(/<li>/gi, '\n• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}

type Traducao = { name: string; exercise: number; description: string };
type ExercicioBruto = { id: number; category: number; equipment: number[] };
type Nomeado = { id: number; name: string };
type Imagem = { exercise: number; image: string; is_main: boolean };

export async function baixarCatalogo(): Promise<Exercicio[]> {
  const [categorias, equipamentos, traducoes, exercicios, imagens] = await Promise.all([
    pegarTudo<Nomeado>('exercisecategory/?'),
    pegarTudo<Nomeado>('equipment/?'),
    pegarTudo<Traducao>(`exercise-translation/?language=${IDIOMA_PT}`),
    pegarTudo<ExercicioBruto>('exercise/?'),
    pegarTudo<Imagem>('exerciseimage/?is_main=true'),
  ]);

  const nomeCategoria = new Map(
    categorias.map((c) => [c.id, CATEGORIAS[c.name] ?? c.name])
  );
  const nomeEquipamento = new Map(
    equipamentos.map((e) => [e.id, EQUIPAMENTOS[e.name] ?? e.name])
  );
  const dadosExercicio = new Map(exercicios.map((e) => [e.id, e]));
  const imagemPrincipal = new Map(imagens.map((i) => [i.exercise, i.image]));

  const catalogo: Exercicio[] = [];
  const vistos = new Set<number>();

  for (const traducao of traducoes) {
    const nome = traducao.name?.trim();
    if (!nome || vistos.has(traducao.exercise)) continue;
    vistos.add(traducao.exercise);

    const bruto = dadosExercicio.get(traducao.exercise);
    const equipamento = (bruto?.equipment ?? [])
      .map((id) => nomeEquipamento.get(id))
      .filter(Boolean)
      .join(', ');

    catalogo.push({
      id: traducao.exercise,
      nome,
      grupoMuscular: bruto ? nomeCategoria.get(bruto.category) : undefined,
      equipamento: equipamento || undefined,
      imagem: imagemPrincipal.get(traducao.exercise),
      descricao: traducao.description ? limparHtml(traducao.description) : undefined,
    });
  }

  return catalogo.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

type DetalheBruto = {
  muscles?: { name: string; name_en: string }[];
  muscles_secondary?: { name: string; name_en: string }[];
};

export async function buscarMusculos(id: number): Promise<string[]> {
  const dados = await pegarJson<DetalheBruto>(`${BASE}/exerciseinfo/${id}/?format=json`);
  const principais = dados.muscles ?? [];
  return principais.map((musculo) => musculo.name_en || musculo.name);
}

export function filtrarExercicios(
  catalogo: Exercicio[],
  termo: string,
  grupo: string | null
): Exercicio[] {
  const alvo = normalizar(termo);

  return catalogo.filter((exercicio) => {
    const casaGrupo = !grupo || exercicio.grupoMuscular === grupo;
    const casaTermo = !alvo || normalizar(exercicio.nome).includes(alvo);
    return casaGrupo && casaTermo;
  });
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
