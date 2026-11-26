# TreinoLog

Aplicativo mobile de diário de treinos desenvolvido em React Native com Expo. O projeto é a entrega final da disciplina de Desenvolvimento de Aplicativo Móvel do curso de Gestão de Sistemas de Informação do Centro Universitário Academia.

## Proposta

A ideia é resolver um problema simples de quem treina com regularidade: registrar o que foi feito em cada sessão sem depender de papel ou de planilha. O usuário busca um exercício em uma base externa de exercícios, adiciona esse exercício ao treino do dia e registra as séries realizadas com repetições e carga. Todo o histórico fica salvo no próprio aparelho, o que permite consultar a última carga usada antes de iniciar a série seguinte.

## Funcionalidades previstas

Busca de exercícios por nome e por grupo muscular, consumindo a API pública da wger.

Montagem do treino do dia a partir dos exercícios encontrados.

Registro de séries com número de repetições e carga utilizada.

Persistência local dos treinos no dispositivo, sem necessidade de servidor próprio.

Histórico de treinos anteriores com a evolução de carga por exercício.

## Tecnologias

React Native com Expo e TypeScript. A navegação entre telas usa React Navigation. A persistência local usa AsyncStorage. Os dados de exercícios vêm da API pública wger.de.

## Como executar

Clone o repositório e instale as dependências.

```
npm install
```

Inicie o servidor de desenvolvimento.

```
npx expo start
```

Em seguida leia o QR Code com o aplicativo Expo Go no celular, ou pressione a tecla indicada no terminal para abrir em emulador Android.

## Estrutura de pastas

A pasta src concentra o código da aplicação. Dentro dela, screens guarda as telas, components guarda os componentes reutilizáveis e services guarda o acesso à API e a persistência local. Os tipos do domínio ficam em src/types.ts e a paleta de cores em src/theme.ts.

## Autor

Filipi Lima
e
Luiz Eduardo
