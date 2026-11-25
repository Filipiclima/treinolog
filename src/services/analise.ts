import { Treino } from '../types';

export type Classificacao = {
  nome: string;
  explicacao: string;
};

export function volumeDoTreino(treino: Treino): number {
  return treino.itens.reduce(
    (total, item) =>
      total + item.series.reduce((soma, s) => soma + s.repeticoes * s.carga, 0),
    0
  );
}

export function totalSeries(treino: Treino): number {
  return treino.itens.reduce((total, item) => total + item.series.length, 0);
}

export function mediaRepeticoes(treino: Treino): number {
  const series = treino.itens.flatMap((item) => item.series);
  if (series.length === 0) return 0;
  const soma = series.reduce((total, serie) => total + serie.repeticoes, 0);
  return soma / series.length;
}

export function classificarTreino(treino: Treino): Classificacao | null {
  const media = mediaRepeticoes(treino);
  if (media === 0) return null;

  const arredondada = Math.round(media);

  if (media <= 6) {
    return {
      nome: 'Força',
      explicacao: `Média de ${arredondada} repetições por série, faixa de cargas altas e poucas repetições.`,
    };
  }

  if (media <= 12) {
    return {
      nome: 'Hipertrofia',
      explicacao: `Média de ${arredondada} repetições por série, faixa clássica de ganho de massa.`,
    };
  }

  return {
    nome: 'Resistência',
    explicacao: `Média de ${arredondada} repetições por série, faixa de cargas leves e volume alto.`,
  };
}

export function tituloDoTreino(treino: Treino): string {
  const grupos: string[] = [];

  for (const item of treino.itens) {
    const grupo = item.exercicio.grupoMuscular;
    if (grupo && !grupos.includes(grupo)) grupos.push(grupo);
  }

  if (grupos.length === 0) return 'Treino';
  if (grupos.length === 1) return grupos[0];
  if (grupos.length === 2) return `${grupos[0]} e ${grupos[1]}`;

  return `${grupos.slice(0, -1).join(', ')} e ${grupos[grupos.length - 1]}`;
}

export function duracaoEmMinutos(treino: Treino): number | null {
  if (!treino.concluidoEm) return null;

  const inicio = new Date(treino.data).getTime();
  const fim = new Date(treino.concluidoEm).getTime();
  const minutos = Math.round((fim - inicio) / 60000);

  if (minutos < 1 || minutos > 360) return null;
  return minutos;
}

export function formatarVolume(quilos: number): string {
  if (quilos >= 10000) {
    const toneladas = quilos / 1000;
    return `${toneladas.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} t`;
  }
  return `${quilos.toLocaleString('pt-BR')} kg`;
}

export type GrupoMensal = {
  chave: string;
  rotulo: string;
  data: Treino[];
};

export function agruparPorMes(historico: Treino[]): GrupoMensal[] {
  const grupos = new Map<string, GrupoMensal>();

  for (const treino of historico) {
    const data = new Date(treino.data);
    const chave = `${data.getFullYear()}-${data.getMonth()}`;

    if (!grupos.has(chave)) {
      const rotulo = data
        .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        .replace(' de ', ' de ');
      grupos.set(chave, {
        chave,
        rotulo: rotulo.charAt(0).toUpperCase() + rotulo.slice(1),
        data: [],
      });
    }

    grupos.get(chave)?.data.push(treino);
  }

  return Array.from(grupos.values());
}

export function resumoDoMes(historico: Treino[]): {
  treinos: number;
  volume: number;
  rotulo: string;
} {
  const agora = new Date();
  const doMes = historico.filter((treino) => {
    const data = new Date(treino.data);
    return (
      data.getMonth() === agora.getMonth() &&
      data.getFullYear() === agora.getFullYear()
    );
  });

  const rotulo = agora.toLocaleDateString('pt-BR', { month: 'long' });

  return {
    treinos: doMes.length,
    volume: doMes.reduce((total, treino) => total + volumeDoTreino(treino), 0),
    rotulo: rotulo.toUpperCase(),
  };
}
