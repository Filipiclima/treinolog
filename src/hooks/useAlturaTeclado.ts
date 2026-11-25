import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useAlturaTeclado(): number {
  const [altura, setAltura] = useState(0);

  useEffect(() => {
    const eventoMostrar =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const eventoEsconder =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const aoMostrar = Keyboard.addListener(eventoMostrar, (evento) => {
      setAltura(evento.endCoordinates.height);
    });
    const aoEsconder = Keyboard.addListener(eventoEsconder, () => {
      setAltura(0);
    });

    return () => {
      aoMostrar.remove();
      aoEsconder.remove();
    };
  }, []);

  return altura;
}
