# Leitor de PDF com Voz

Este é um aplicativo web que permite carregar arquivos PDF e lê-los em voz alta, utilizando a tecnologia de síntese de voz do navegador.

## Funcionalidades

- Carregar e visualizar arquivos PDF
- Navegação por páginas
- Leitura do texto do PDF em voz alta
- Controles para iniciar, pausar, continuar e parar a leitura
- Seleção de diferentes vozes (baseado nas disponíveis no seu sistema)
- Ajuste da velocidade de leitura

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge, etc.)
2. Clique no botão "Escolher arquivo" e selecione um arquivo PDF
3. Clique em "Carregar PDF" para visualizá-lo
4. Use os botões "Página Anterior" e "Próxima Página" para navegar pelo documento
5. Para ouvir o texto da página atual, clique em "Ler Página Atual"
6. Você pode pausar, continuar ou parar a leitura a qualquer momento
7. Ajuste a velocidade de leitura usando o controle deslizante
8. Selecione uma voz diferente no menu suspenso (se disponível)

## Requisitos

- Navegador web moderno com suporte a JavaScript
- Suporte à Web Speech API (a maioria dos navegadores modernos)
- Conexão com a internet (para carregar a biblioteca PDF.js)

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- [PDF.js](https://mozilla.github.io/pdf.js/) - Biblioteca para visualização de PDFs
- [Web Speech API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Speech_API) - API para síntese de voz

## Limitações

- A qualidade da extração de texto depende da estrutura do PDF
- PDFs com texto em formato de imagem não podem ser lidos
- A disponibilidade e qualidade das vozes depende do sistema operacional
- Navegadores diferentes podem ter comportamentos ligeiramente diferentes na síntese de voz

## Dicas

- Para melhor experiência, use um navegador baseado em Chromium (Chrome, Edge, etc.)
- Se disponível, vozes em português serão selecionadas automaticamente
- Arquivos PDF protegidos ou criptografados podem não funcionar corretamente 