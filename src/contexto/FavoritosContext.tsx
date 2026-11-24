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
import { lerFavoritos, salvarFavoritos } from '../services/armazenamento';

type ValorContexto = {
  favoritos: number[];
  ehFavorito: (exercicioId: number) => boolean;
  alternarFavorito: (exercicioId: number) => void;
  total: number;
};

const FavoritosContext = createContext<ValorContexto | null>(null);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const carregado = useRef(false);

  useEffect(() => {
    async function restaurar() {
      const salvos = await lerFavoritos();
      setFavoritos(salvos);
      carregado.current = true;
    }
    restaurar();
  }, []);

  useEffect(() => {
    if (!carregado.current) return;
    salvarFavoritos(favoritos);
  }, [favoritos]);

  const ehFavorito = useCallback(
    (exercicioId: number) => favoritos.includes(exercicioId),
    [favoritos]
  );

  const alternarFavorito = useCallback((exercicioId: number) => {
    setFavoritos((atuais) =>
      atuais.includes(exercicioId)
        ? atuais.filter((id) => id !== exercicioId)
        : [...atuais, exercicioId]
    );
  }, []);

  const valor = useMemo(
    () => ({ favoritos, ehFavorito, alternarFavorito, total: favoritos.length }),
    [favoritos, ehFavorito, alternarFavorito]
  );

  return (
    <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>
  );
}

export function useFavoritos(): ValorContexto {
  const contexto = useContext(FavoritosContext);
  if (!contexto) {
    throw new Error('useFavoritos precisa estar dentro de FavoritosProvider.');
  }
  return contexto;
}
