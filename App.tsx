import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BuscaExerciciosScreen from './src/screens/BuscaExerciciosScreen';
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
function Icone({ simbolo, ativo }: { simbolo: string; ativo: boolean }) {
  return <Text style={[styles.icone, !ativo && styles.iconeInativo]}>{simbolo}</Text>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={tema}>
        <Abas.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: cores.fundo },
            headerTitleStyle: { color: cores.texto },
            headerShadowVisible: false,
            tabBarStyle: {
              backgroundColor: cores.superficie,
              borderTopColor: cores.borda,
            },
            tabBarActiveTintColor: cores.destaque,
            tabBarInactiveTintColor: cores.textoFraco,
          }}
        >
          <Abas.Screen
            name="Exercicios"
            component={BuscaExerciciosScreen}
            options={{
              title: 'Exercícios',
              tabBarLabel: 'Exercícios',
              tabBarIcon: ({ focused }) => <Icone simbolo="🔍" ativo={focused} />,
            }}
          />
          <Abas.Screen
            name="Treino"
            component={TreinoDoDiaScreen}
            options={{
              title: 'Treino do dia',
              tabBarLabel: 'Treino',
              tabBarIcon: ({ focused }) => <Icone simbolo="🏋️" ativo={focused} />,
            }}
          />
          <Abas.Screen
            name="Historico"
            component={HistoricoScreen}
            options={{
              title: 'Histórico',
              tabBarLabel: 'Histórico',
              tabBarIcon: ({ focused }) => <Icone simbolo="📈" ativo={focused} />,
            }}
          />
        </Abas.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  icone: {
    fontSize: 18,
  },
  iconeInativo: {
    opacity: 0.5,
  },
});
