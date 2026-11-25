// Inicializar o worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// Variáveis globais
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let canvas = document.getElementById('pdf-render');
let ctx = canvas.getContext('2d');
let currentText = '';
let synth = window.speechSynthesis;
let utterance = null;
let voices = [];
let isPaused = false;
let isPlayingAI = false;
let elevenlabsApiKey = localStorage.getItem('elevenlabs_api_key') || '';

// Elementos da interface
const fileInput = document.getElementById('pdf-file');
const uploadButton = document.getElementById('upload-button');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const currentPageElem = document.getElementById('current-page');
const totalPagesElem = document.getElementById('total-pages');
const readButton = document.getElementById('read-page');
const pauseButton = document.getElementById('pause-reading');
const resumeButton = document.getElementById('resume-reading');
const stopButton = document.getElementById('stop-reading');
const voiceSelect = document.getElementById('voice-select');
const speedRange = document.getElementById('speed-range');
const speedValue = document.getElementById('speed-value');
const textContent = document.getElementById('text-content');
const voiceTypeRadios = document.querySelectorAll('input[name="voice-type"]');
const browserVoicesDiv = document.getElementById('browser-voices');
const aiVoicesDiv = document.getElementById('ai-voices');
const readAiButton = document.getElementById('read-page-ai');
const stopAiButton = document.getElementById('stop-reading-ai');
const aiVoiceSelect = document.getElementById('ai-voice-select');
const aiApiKeyInput = document.getElementById('ai-api-key');
const saveApiKeyButton = document.getElementById('save-api-key');
const audioPlayer = document.getElementById('ai-audio-player');
const audioPlayerContainer = document.getElementById('audio-player-container');

// Desabilitar botões inicialmente
prevButton.disabled = true;
nextButton.disabled = true;
readButton.disabled = true;
pauseButton.disabled = true;
resumeButton.disabled = true;
stopButton.disabled = true;
readAiButton.disabled = true;
stopAiButton.disabled = true;

// Se já tiver uma API key salva, preencha o campo
if (elevenlabsApiKey) {
    aiApiKeyInput.value = elevenlabsApiKey;
}

// Renderizar uma página do PDF
function renderPage(num) {
    pageRendering = true;
    
    // Obter a página
    pdfDoc.getPage(num).then(function(page) {
        // Ajustar a escala da página para se adequar à largura da visualização
        const viewport = page.getViewport({scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Renderizar a página no canvas
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        // Extrair o texto da página
        page.getTextContent().then(function(textContent) {
            const textItems = textContent.items;
            let text = '';
            
            for (let i = 0; i < textItems.length; i++) {
                text += textItems[i].str + ' ';
            }
            
            currentText = text;
            document.getElementById('text-content').textContent = text;
            readButton.disabled = false;
            readAiButton.disabled = false;
        });
        
        // Aguardar a conclusão da renderização
        renderTask.promise.then(function() {
            pageRendering = false;
            
            // Se está aguardando para renderizar outra página
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    
    // Atualizar a exibição do número da página atual
    currentPageElem.textContent = num;
}

// Ir para a página anterior
function prevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
    stopReading();
    stopAIAudio();
}

// Ir para a próxima página
function nextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
    stopReading();
    stopAIAudio();
}

// Colocar na fila a renderização da página
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// Carregar o PDF
function loadPDF(file) {
    const fileReader = new FileReader();
    
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            pdfDoc = pdf;
            totalPagesElem.textContent = pdf.numPages;
            
            // Habilitar botões de navegação
            prevButton.disabled = false;
            nextButton.disabled = false;
            
            // Renderizar a primeira página
            renderPage(pageNum);
        }).catch(function(error) {
            console.error('Erro ao carregar o PDF:', error);
            alert('Erro ao carregar o PDF. Verifique se o arquivo é válido.');
        });
    };
    
    fileReader.readAsArrayBuffer(file);
}

// Ler o texto em voz alta
function readPageAloud() {
    if (synth.speaking) {
        synth.cancel();
    }
    
    if (currentText) {
        utterance = new SpeechSynthesisUtterance(currentText);
        
        // Configurar a voz selecionada
        const selectedVoice = voiceSelect.value;
        if (selectedVoice) {
            utterance.voice = voices.find(voice => voice.voiceURI === selectedVoice);
        }
        
        // Configurar a velocidade da leitura
        utterance.rate = parseFloat(speedRange.value);
        
        // Configurar eventos para os botões de controle
        utterance.onstart = function() {
            readButton.disabled = true;
            pauseButton.disabled = false;
            resumeButton.disabled = true;
            stopButton.disabled = false;
        };
        
        utterance.onend = function() {
            readButton.disabled = false;
            pauseButton.disabled = true;
            resumeButton.disabled = true;
            stopButton.disabled = true;
        };
        
        utterance.onerror = function(event) {
            console.error('Erro na síntese de voz:', event);
            readButton.disabled = false;
            pauseButton.disabled = true;
            resumeButton.disabled = true;
            stopButton.disabled = true;
        };
        
        // Iniciar a leitura
        synth.speak(utterance);
    }
}

// Pausar a leitura
function pauseReading() {
    if (synth.speaking) {
        synth.pause();
        isPaused = true;
        pauseButton.disabled = true;
        resumeButton.disabled = false;
    }
}

// Continuar a leitura
function resumeReading() {
    if (isPaused) {
        synth.resume();
        isPaused = false;
        pauseButton.disabled = false;
        resumeButton.disabled = true;
    }
}

// Parar a leitura
function stopReading() {
    if (synth.speaking) {
        synth.cancel();
        readButton.disabled = false;
        pauseButton.disabled = true;
        resumeButton.disabled = true;
        stopButton.disabled = true;
    }
}

// Preencher o seletor de vozes
function populateVoiceList() {
    voices = synth.getVoices();
    
    // Limpar a lista de vozes atual
    voiceSelect.innerHTML = '';
    
    // Adicionar cada voz ao seletor
    voices.forEach(function(voice) {
        const option = document.createElement('option');
        option.value = voice.voiceURI;
        option.textContent = `${voice.name} (${voice.lang})`;
        
        // Dar preferência às vozes em português
        if (voice.lang.includes('pt')) {
            option.selected = true;
        }
        
        voiceSelect.appendChild(option);
    });
    
    if (voiceSelect.options.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'Nenhuma voz disponível';
        voiceSelect.appendChild(option);
        voiceSelect.disabled = true;
    }
}

// Atualizar a exibição do valor da velocidade
function updateSpeedValue() {
    speedValue.textContent = speedRange.value;
}

// Salvar a API key do ElevenLabs
function saveApiKey() {
    const apiKey = aiApiKeyInput.value.trim();
    if (apiKey) {
        elevenlabsApiKey = apiKey;
        localStorage.setItem('elevenlabs_api_key', apiKey);
        alert('API Key salva com sucesso!');
    } else {
        alert('Por favor, insira uma API Key válida.');
    }
}

// Ler texto usando a API do ElevenLabs
async function readWithElevenLabs() {
    // Verificar se tem texto para ler
    if (!currentText || currentText.trim() === '') {
        alert('Não há texto para ler nesta página.');
        return;
    }
    
    // Limitar texto para não exceder o limite de caracteres gratuito (aconselhável para testes)
    let truncatedText = currentText;
    if (truncatedText.length > 2000) {
        truncatedText = truncatedText.substring(0, 2000) + "... (texto limitado para preservar o plano gratuito)";
    }
    
    // Alterar estado dos botões
    readAiButton.disabled = true;
    readAiButton.textContent = 'Gerando áudio...';
    
    try {
        const apiKey = elevenlabsApiKey;
        if (!apiKey) {
            alert('Por favor, configure sua API Key do ElevenLabs primeiro!');
            readAiButton.disabled = false;
            readAiButton.textContent = 'Ler com IA';
            return;
        }
        
        const voiceId = aiVoiceSelect.value;
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text: truncatedText,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail?.message || `Erro: ${response.status}`);
        }
        
        // Converter resposta em blob de áudio
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Configurar o player de áudio
        audioPlayer.src = audioUrl;
        audioPlayerContainer.classList.remove('hidden');
        isPlayingAI = true;
        stopAiButton.disabled = false;
        
        // Evento de fim da reprodução
        audioPlayer.onended = function() {
            isPlayingAI = false;
            readAiButton.disabled = false;
            stopAiButton.disabled = true;
            readAiButton.textContent = 'Ler com IA';
        };
        
        // Iniciar reprodução
        audioPlayer.play();
        
    } catch (error) {
        console.error('Erro ao usar ElevenLabs TTS:', error);
        alert(`Erro ao gerar áudio: ${error.message || 'Falha na requisição.'}`);
    } finally {
        readAiButton.disabled = false;
        readAiButton.textContent = 'Ler com IA';
    }
}

// Parar a reprodução de áudio da IA
function stopAIAudio() {
    if (isPlayingAI) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        isPlayingAI = false;
        readAiButton.disabled = false;
        stopAiButton.disabled = true;
    }
}

// Alternar entre tipos de vozes (navegador ou IA)
function toggleVoiceType() {
    const selectedValue = document.querySelector('input[name="voice-type"]:checked').value;
    
    if (selectedValue === 'browser') {
        browserVoicesDiv.classList.add('active');
        aiVoicesDiv.classList.remove('active');
        audioPlayerContainer.classList.add('hidden');
    } else {
        browserVoicesDiv.classList.remove('active');
        aiVoicesDiv.classList.add('active');
    }
}

// Listeners de eventos
uploadButton.addEventListener('click', function() {
    if (fileInput.files.length > 0) {
        loadPDF(fileInput.files[0]);
    } else {
        alert('Por favor, selecione um arquivo PDF primeiro.');
    }
});

prevButton.addEventListener('click', prevPage);
nextButton.addEventListener('click', nextPage);
readButton.addEventListener('click', readPageAloud);
pauseButton.addEventListener('click', pauseReading);
resumeButton.addEventListener('click', resumeReading);
stopButton.addEventListener('click', stopReading);
speedRange.addEventListener('input', updateSpeedValue);
saveApiKeyButton.addEventListener('click', saveApiKey);
readAiButton.addEventListener('click', readWithElevenLabs);
stopAiButton.addEventListener('click', stopAIAudio);

// Evento para alternar entre tipos de vozes
voiceTypeRadios.forEach(function(radio) {
    radio.addEventListener('change', toggleVoiceType);
});

// Inicializar a lista de vozes quando a página carregar
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoiceList;
}

// Se as vozes já estiverem disponíveis, preencher a lista
if (synth.getVoices().length > 0) {
    populateVoiceList();
}

// Aguardar o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Leitor de PDF com Voz iniciado.');
}); 