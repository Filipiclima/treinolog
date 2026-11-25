import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  apagarTreinoAtual,
  lerHistorico,
  lerTreinoAtual,
  salvarHistorico,
  salvarTreinoAtual,
} from '../services/armazenamento';
import { Exercicio, ItemTreino, Serie, Treino } from '../types';

type ValorContexto = {
  treino: Treino;
  carregando: boolean;
  adicionarExercicio: (exercicio: Exercicio) => void;
  removerExercicio: (exercicioId: number) => void;
  estaNoTreino: (exercicioId: number) => boolean;
  adicionarSerie: (exercicioId: number, repeticoes: number, carga: number) => void;
  removerSerie: (exercicioId: number, serieId: string) => void;
  limparTreino: () => void;
  historico: Treino[];
  concluirTreino: () => boolean;
  removerDoHistorico: (treinoId: string) => void;
  limparHistorico: () => void;
};

const TreinoContext = createContext<ValorContexto | null>(null);

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function tituloDoDia(data: Date): string {
  const formatado = data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return `Treino de ${formatado}`;
}

function criarTreinoVazio(): Treino {
  const agora = new Date();
  return {
    id: gerarId(),
    data: agora.toISOString(),
    titulo: tituloDoDia(agora),
    itens: [],
    concluido: false,
  };
}

export function TreinoProvider({ children }: { children: ReactNode }) {
  const [treino, setTreino] = useState<Treino>(criarTreinoVazio);
  const [historico, setHistorico] = useState<Treino[]>([]);
  const [carregando, setCarregando] = useState(true);
  const carregado = useRef(false);

  useEffect(() => {
    async function restaurar() {
      const [salvo, historicoSalvo] = await Promise.all([
        lerTreinoAtual(),
        lerHistorico(),
      ]);
      if (salvo) setTreino(salvo);
      setHistorico(historicoSalvo);
      carregado.current = true;
      setCarregando(false);
    }
    restaurar();
  }, []);

  useEffect(() => {
    if (!carregado.current) return;
    salvarTreinoAtual(treino);
  }, [treino]);

  const adicionarExercicio = useCallback((exercicio: Exercicio) => {
    setTreino((atual) => {
      if (atual.itens.some((item) => item.exercicio.id === exercicio.id)) {
        return atual;
      }
      const novoItem: ItemTreino = { exercicio, series: [] };
      return { ...atual, itens: [...atual.itens, novoItem] };
    });
  }, []);

  const removerExercicio = useCallback((exercicioId: number) => {
    setTreino((atual) => ({
      ...atual,
      itens: atual.itens.filter((item) => item.exercicio.id !== exercicioId),
    }));
  }, []);

  const estaNoTreino = useCallback(
    (exercicioId: number) =>
      treino.itens.some((item) => item.exercicio.id === exercicioId),
    [treino.itens]
  );

  const adicionarSerie = useCallback(
    (exercicioId: number, repeticoes: number, carga: number) => {
      const novaSerie: Serie = { id: gerarId(), repeticoes, carga };
      setTreino((atual) => ({
        ...atual,
        itens: atual.itens.map((item) =>
          item.exercicio.id === exercicioId
            ? { ...item, series: [...item.series, novaSerie] }
            : item
        ),
      }));
    },
    []
  );

  const removerSerie = useCallback((exercicioId: number, serieId: string) => {
    setTreino((atual) => ({
      ...atual,
      itens: atual.itens.map((item) =>
        item.exercicio.id === exercicioId
          ? { ...item, series: item.series.filter((serie) => serie.id !== serieId) }
          : item
      ),
    }));
  }, []);

  const limparTreino = useCallback(() => {
    setTreino(criarTreinoVazio());
    apagarTreinoAtual();
  }, []);

  const concluirTreino = useCallback(() => {
    const temSerie = treino.itens.some((item) => item.series.length > 0);
    if (!temSerie) return false;

    const concluido: Treino = { ...treino, concluido: true };
    const novoHistorico = [concluido, ...historico];

    setHistorico(novoHistorico);
    salvarHistorico(novoHistorico);
    setTreino(criarTreinoVazio());

    return true;
  }, [treino, historico]);

  const limparHistorico = useCallback(() => {
    setHistorico([]);
    salvarHistorico([]);
  }, []);

  const removerDoHistorico = useCallback(
    (treinoId: string) => {
      const novoHistorico = historico.filter((item) => item.id !== treinoId);
      setHistorico(novoHistorico);
      salvarHistorico(novoHistorico);
    },
    [historico]
  );

  const valor = useMemo(
    () => ({
      treino,
      carregando,
      adicionarExercicio,
      removerExercicio,
      estaNoTreino,
      adicionarSerie,
      removerSerie,
      limparTreino,
      historico,
      concluirTreino,
      removerDoHistorico,
      limparHistorico,
    }),
    [
      treino,
      carregando,
      adicionarExercicio,
      removerExercicio,
      estaNoTreino,
      adicionarSerie,
      removerSerie,
      limparTreino,
      historico,
      concluirTreino,
      removerDoHistorico,
      limparHistorico,
    ]
  );

  return <TreinoContext.Provider value={valor}>{children}</TreinoContext.Provider>;
}

export function useTreino(): ValorContexto {
  const contexto = useContext(TreinoContext);
  if (!contexto) {
    throw new Error('useTreino precisa estar dentro de TreinoProvider.');
  }
  return contexto;
}
