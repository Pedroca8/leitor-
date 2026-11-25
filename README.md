# Leitor de PDF com Voz

Este é um aplicativo web que permite carregar arquivos PDF e lê-los em voz alta, utilizando a tecnologia de síntese de voz do navegador ou vozes de alta qualidade baseadas em IA.

## Funcionalidades

- Carregar e visualizar arquivos PDF
- Navegação por páginas
- Leitura do texto do PDF em voz alta
- Dois modos de leitura:
  - **Vozes do Navegador**: usando a Web Speech API nativa
  - **Vozes com IA**: usando o ElevenLabs para vozes de alta qualidade com IA
- Controles para iniciar, pausar, continuar e parar a leitura
- Seleção de diferentes vozes (baseado nas disponíveis no seu sistema)
- Ajuste da velocidade de leitura (para vozes do navegador)
- Armazenamento da API key do ElevenLabs para uso futuro

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge, etc.)
2. Clique no botão "Escolher arquivo" e selecione um arquivo PDF
3. Clique em "Carregar PDF" para visualizá-lo
4. Use os botões "Página Anterior" e "Próxima Página" para navegar pelo documento

### Usando vozes do navegador (padrão)
5. Para ouvir o texto da página atual, clique em "Ler Página Atual"
6. Você pode pausar, continuar ou parar a leitura a qualquer momento
7. Ajuste a velocidade de leitura usando o controle deslizante
8. Selecione uma voz diferente no menu suspenso (se disponível)

### Usando vozes com IA (qualidade superior)
5. Selecione a opção "Vozes com IA"
6. Registre-se gratuitamente no [ElevenLabs](https://elevenlabs.io/) e obtenha uma API key
7. Cole sua API key no campo apropriado e clique em "Salvar Key"
8. Selecione uma voz IA no menu suspenso (vozes em português e inglês disponíveis)
9. Clique em "Ler com IA" para gerar e reproduzir o áudio
10. Use o player de áudio para controlar a reprodução

## Requisitos

- Navegador web moderno com suporte a JavaScript
- Suporte à Web Speech API (para vozes do navegador)
- Conexão com a internet (para carregar a biblioteca PDF.js e usar as vozes com IA)
- Conta gratuita no ElevenLabs para usar as vozes com IA (opcional)

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- [PDF.js](https://mozilla.github.io/pdf.js/) - Biblioteca para visualização de PDFs
- [Web Speech API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Speech_API) - API para síntese de voz do navegador
- [ElevenLabs API](https://elevenlabs.io/) - Serviço de síntese de voz com IA de alta qualidade

## Limitações

- A qualidade da extração de texto depende da estrutura do PDF
- PDFs com texto em formato de imagem não podem ser lidos
- O plano gratuito do ElevenLabs permite apenas 10.000 caracteres por mês
- Para economizar caracteres, o texto é limitado a 2.000 caracteres por página quando usado com ElevenLabs

## Dicas

- Para melhor experiência, use um navegador baseado em Chromium (Chrome, Edge, etc.)
- Se disponível, vozes em português serão selecionadas automaticamente
- Arquivos PDF protegidos ou criptografados podem não funcionar corretamente
- A API key do ElevenLabs é armazenada localmente no seu navegador para conveniência 