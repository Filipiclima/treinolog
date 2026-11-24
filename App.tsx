import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TreinoProvider } from './src/contexto/TreinoContext';
import ExerciciosStack from './src/navigation/ExerciciosStack';
import HistoricoScreen from './src/screens/HistoricoScreen';
import TreinoDoDiaScreen from './src/screens/TreinoDoDiaScreen';
import { cores } from './src/theme';

const Abas = createBottomTabNavigator();

/** Tema escuro do app aplicado à navegação. */
const tema: Theme = {
  dark: true,
  colors: {
    primary: cores.destaque,
    background: cores.fundo,
    card: cores.superficie,
    text: cores.texto,
    border: cores.borda,
    notification: cores.destaque,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

/** Ícone simples em emoji, para não depender de uma biblioteca de ícones. */

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <TreinoProvider>
        <NavigationContainer theme={tema}>
          <Abas.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: cores.fundo },
              headerTitleStyle: { color: cores.texto },
              headerShadowVisible: false,
              tabBarStyle: {
                backgroundColor: cores.superficie,
                borderTopColor: cores.borda,
                height: 62,
                paddingTop: 6,
                paddingBottom: 8,
              },
              tabBarActiveTintColor: cores.destaque,
              tabBarInactiveTintColor: cores.textoFraco,
            }}
          >
            <Abas.Screen
              name="Exercicios"
              component={ExerciciosStack}
              options={{
                headerShown: false,
                tabBarLabel: 'Exercícios',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="barbell-outline" size={size} color={color} />
                ),
              }}
            />
            <Abas.Screen
              name="Treino"
              component={TreinoDoDiaScreen}
              options={{
                title: 'Treino do dia',
                tabBarLabel: 'Treino',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="list-outline" size={size} color={color} />
                ),
              }}
            />
            <Abas.Screen
              name="Historico"
              component={HistoricoScreen}
              options={{
                title: 'Histórico',
                tabBarLabel: 'Histórico',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="time-outline" size={size} color={color} />
                ),
              }}
            />
          </Abas.Navigator>
        </NavigationContainer>
      </TreinoProvider>
    </SafeAreaProvider>
  );
}
