# Nuresp VirtuAir Mobile Companion
Aplicativo para integração entre o dispositivo Virtuair e smartphones.

# Instalação
Para construir ou modificar o aplicativo, é necessário instalar o  [Node JS](https://nodejs.org/ "Node JS"), além do Android SDK através do [Android Studio](https://developer.android.com/studio "Android Studio"). No caso do MacOS, o [Xcode](https://developer.apple.com/xcode/ "Xcode") deve estar atualizado.

É recomendado utilizar o [GIT](https://git-scm.com/downloads "GIT") para acessar ao repositório e utilizar o [Visual Studio Code](https://code.visualstudio.com/ "Visual Studio Code") para editar o código.

Após a instalação, deve-se utilizar o terminal em modo administrador para navegar até a pasta do projeto e executar os seguintes passos:
- Instalação do ionic e cordova
```bash
npm install -g ionic cordova
```
-  Construção do aplicativo para android
```bash
ionic cordova build android
```
- ou ios
```bash
ionic cordova build ios
```
Para construir o aplicativo para produção, deve-se usar as flags
```bash
--minifyjs --minifycss --release
```


No caso do Android, o .apk de produção gerado deve ser otimizado através do zipalign e assinado, através dos comandos
```bash
zipalign -v 4 app-release-unsigned.apk nuresp_release.apk
jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore nuresp_virtuair.keystore app-release-unsigned.apk alias_name
```

# Versões

## 1.1.4
App funcional no iOS, testado no iPhone 6S Plus.
Correções no design, como posicionamento e fluidez do incentivador.

### Modificações
- Plugin instalado para que o iOS suporte a abertura do browser através do app. As chamadas foram atualizadas para funcionar em ambas as plataformas;
- Incentivador passa a monitorar os dados de pressão todo o tempo, evitando o atraso entre o começo da inspiração e o movimento do incentivador;
- Leitura de pressão fica ativa por todo o treinameto, ao invés de desligar em cada ciclo;
- Perda de conexão faz com que o app cancele o teste/treinamento e volte à tela inicial;
- Correção no momento em que o BLE e Localização são checados. A maneira implementada anteriormente permitia que o plugin Diagnostic fosse chamado antes da plataforma estar pronta;
- Retirada de alguns resources desnecessários;
- Correção do posicionamento dos botões.

### Problemas conhecidos
- Vibração no iOS não funciona;
- Quando o BLE força uma desconexão logo após a conexão, o usuário é informado do problema, mas uma nova busca só pode ser feita após o timeout de conexão;
- Plugin NativeAudio pede a permissão PHONE_STATE, o que não é muito interessante. Segundo alguns relatos, ele precisa dessa permissão para cancelar o audio em caso de chamada ou notificação, mas apenas para certas SDKs.

## 1.1.3
Modo como o app verifica o dispositivo agora depende da versão do FW.
O app só mantém o dispositivo conectado caso consiga ler o Serial Number e a versão do FW, porém nenhuma das informações é tratada.

### Modificações
- Alert genéricos mudados para alert com título;
- Tratamento da rotina de conexão modificada. A rotina só é validada quando se consegue ler o SN e a versão do FW. Em caso negativo, o app força a desconexão;
- Tempo de scan do BLE aumentado de 5 para 8 segundos;
- Correção no nome de algumas variáveis;
- Plugin statusbar removido, já que não era utilizado.

### Problemas conhecidos
- Quando o BLE força uma desconexão logo após a conexão, o usuário é informado do problema, mas uma nova busca só pode ser feita após o timeout de conexão;
- Desconexão com o BLE não cancela o teste ou treinamento corrente. Um aviso é exibido nesse caso, mas não há tratamento do problema;
- App pode demorar até 10s para iniciar. Build com AOT ativo pode solucionar o problema;
- Contador regressivo do teste de força máxima pode, raramente, contar de 2 em 2 segundos;
- Plugin NativeAudio pede a permissão PHONE_STATE, o que não é muito interessante. Segundo alguns relatos, ele precisa dessa permissão para cancelar o audio em caso de chamada ou notificação, mas apenas para certas SDKs.

## 1.1.2
Modificação no texto de política de privacidade.

### Modificações
- Texto de política de privacidade atualizado;
- Alert dialog da política de privacidade modificada para não aceitar clicks fora da área de conteúdo, e só é ignorada quando a pessoa clica em "concordo".

### Problemas conhecidos
- Quando o BLE força uma desconexão logo após a conexão, o usuário é informado do problema, mas uma nova busca só pode ser feita após o timeout de conexão;
- Beep do treinamento falhando raramente;
- Desconexão com o BLE não cancela o teste ou treinamento corrente. Um aviso é exibido nesse caso, mas não há tratamento do problema;
- App pode demorar até 10s para iniciar. Build com AOT ativo pode solucionar o problema;
- Contador regressivo do teste de força máxima pode, raramente, contar de 2 em 2 segundos.

## 1.1.1
Devido à rejeição na PlayStore por coleta de dados não explicitada, uma tela exibindo o básico da política é exibida quando o aplicativo é aberto pela primeira vez, e um link para a política de privacidade foi inserido na tela inicial.

### Modificações
- Tela de aceitação da política de privacidade é exibida na primeira execução do aplicativo;
- Referências a dados do usuário e APIs referentes não utilizadas foram retiradas do código;
- Tempo de vibração ao clicar num botão modificado para 30ms;
- Link para política de privacidade incluído na tela inicial;
- Página de configurações criada, mas não é acessível;
- Retirada de recursos não utilizados;
- Mais limpeza no código

### Problemas conhecidos
- Quando o BLE força uma desconexão logo após a conexão, o usuário é informado do problema, mas uma nova busca só pode ser feita após o timeout de conexão;
- Beep do treinamento falhando raramente;
- Desconexão com o BLE não cancela o teste ou treinamento corrente. Um aviso é exibido nesse caso, mas não há tratamento do problema;
- App pode demorar até 10s para iniciar. Build com AOT ativo pode solucionar o problema;
- Contador regressivo do teste de força máxima pode, raramente, contar de 2 em 2 segundos.

## 1.1.0
Versão com correções nas animações dos incentivadores e inclusão do toast de informação do nível de bateria.

Obs. Como o app ainda não envia para a nuvem se o resultado do teste de força máxima foi validado, o resultado do teste inválido não é enviado para a nuvem para evitar confusão. Esse bloqueio deve ser retirado quando o app passar a enviar os dados de validade para a nuvem.

### Modificações
- Diminuição da frequência de atualização dos incentivadores - passa a ser 5 vezes por segundo;
- Correção nos valores limite dos incentivadores, preservando o tamanho máximo do design;
- Dados incorretos (ex. pressão maior que 500) passam a ser descartados;
- Padrão de animação dos incentivadores passaram a ser ease-out, por ser mais natural;
- Tempo de transição das animações diminuído, para ser mais natural;
- Tipo do buffer de recepção mudado para int32_t, para casar com o formato enviado pelo BLE;
- Adicionado toast com informação do nível de bateria do dispositivo. O toast aparece 1,5s após a conexão do dispositivo, por 2,5s;
- Dispositivo vibra ao fim de cada contagem regressiva no teste de força máxima, para indicar que é possível começar um novo teste;
- Dispositivo vibra ao finalizar teste/treinamento com sucesso mínimo.
- Botão de iniciar teste/treinament só é ativado após metade da animação inicial de exemplo ser exibida, para evitar sobreposição;
- Testes de força máxima não reprodutíveis não são enviados para a nuvem. Um toast relata o caso ao usuário.
- Limpeza no código.

### Problemas conhecidos
- Quando o BLE força uma desconexão logo após a conexão, o usuário é informado do problema, mas uma nova busca só pode ser feita após o timeout de conexão;
- Beep do treinamento falhando raramente;
- Desconexão com o BLE não cancela o teste ou treinamento corrente. Um aviso é exibido nesse caso, mas não há tratamento do problema;
- App pode demorar até 10s para iniciar. Build com AOT ativo pode solucionar o problema;
- Contador regressivo do teste de força máxima pode, raramente, contar de 2 em 2 segundos.


## 1.0.1
Versão com animações dos incentivadores implementadas de acordo com a proposta de design.

### Modificações
- Nome do aplicativo passa a ser Nuresp Virtuair, como solicitado pelo time;
- Implementação da animação dos incentivadores de treinamento e teste de força máxima;
- Animação do incentivador passa a ser dependente do valor de pressão recebido. O valor máximo é adaptado ao maior valor recebido, para criar a sensação de progresso;
- App passa a desligar a notificação da característica de pressão entre inspirações do treinamento, a fim de diminuir o consumo do dispositivo;
- Incluído um atraso de 500ms entre inspirações do treinamento para garantir que o app modifique o incentivador entre inspirações. No caso de inspirações muito longas do usuário, a pausa pode ajudar a padronizar o exercício.

### Problemas conhecidos
- Quando o BLE força uma desconexão logo após a conexão, o usuário é informado do problema, mas uma nova busca só pode ser feita após o timeout de conexão;
- Beep do treinamento falhando raramente;
- Desconexão com o BLE não cancela o teste ou treinamento corrente. Um aviso é exibido nesse caso, mas não há tratamento do problema;
- App pode demorar até 10s para iniciar. Build com AOT ativo pode solucionar o problema.


## 1.0.0
Primeira versão publicada na App Store e Google Play Store, com nome de Virtuair Mobile Companion.

Treinamento funcional
- Identificação de ciclos de inspiração considera um valor mínimo de 1s por inspiração;
- Resultado do treinamento é publicado com os dados de Valor médio máximo de pressão e número de inspirações realizadas, conforme sugerido pela fisioterapeuta Bruna Silveira, da UFMG.

Teste de Força Máxima funcional:
- Esforço mínimo de 1s é necessário para se considerar um teste válido;
- Logica de validação do teste segundo ATS implementada levando em consideração o limite de 20% recomendado;
- Contador de 1 minuto de descanso entre os testes implementado;
- Mínimo de 3 manobras são necessárias para cálculo de validade;
- Máximo de 6 manobras possíveis por teste.

### Problemas conhecidos
- Animações não funcionam;
- Quando o BLE força uma desconexão logo após a conexão, o usuário é informado do problema, mas uma nova busca só pode ser feita após o timeout de conexão;
- Beep do treinamento falhando raramente.

# Modificações futuras
- Implementar teste de endurance;
- Exibição do nível de bateria do dispositivo conectado - toast implementado, mas não é suficiente;
- Inclusão do menu de configurações;
- Inclusão de uma lista de créditos para imagens;
- Inclusão do link para a política de privacidade;
- Criação de notificações e lembretes;
- Criação de um sistema de recepção de mensagens WEB -> App;
- Criação de um sistema de recepção de configurações WEB -> App;
- Reconexão automática com o último dispositivo conectado;
- Conexão automática com o último dispositivo utilizado ao buscar dispositivos;
- Gravação dos dados offline para sincronismo posterior;
- Identificação de funcionamento de internet;
- Forçar a desconexão quando o app ficar em background por um tempo determinado.
