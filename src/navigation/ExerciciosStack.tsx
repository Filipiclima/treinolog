import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BuscaExerciciosScreen from '../screens/BuscaExerciciosScreen';
import DetalheExercicioScreen from '../screens/DetalheExercicioScreen';
import { cores } from '../theme';
import { ExerciciosStackParamList } from './tipos';

const Pilha = createNativeStackNavigator<ExerciciosStackParamList>();

/** Pilha da aba de exercícios: a busca abre o detalhe do exercício. */
export default function ExerciciosStack() {
  return (
    <Pilha.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: cores.fundo },
        headerTitleStyle: { color: cores.texto },
        headerTintColor: cores.destaque,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Pilha.Screen
        name="Busca"
        component={BuscaExerciciosScreen}
        options={{ title: 'Exercícios' }}
      />
      <Pilha.Screen
        name="Detalhe"
        component={DetalheExercicioScreen}
        options={{ title: 'Detalhe' }}
      />
    </Pilha.Navigator>
  );
}
