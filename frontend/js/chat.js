import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// adicionar chat na página
createChat({
    webhookUrl: 'https://n8n.wcambruzzi.com.br/webhook/4268c3f5-f6b0-40c9-bba4-a8104dc9fb49/chat',
    initialMessages: [
        'Olá, eu sou a IA do StoryVision. Estou aqui para te auxiliar com storytelling com dados.',
        'No que posso te ajudar hoje?'
    ],
    mode: 'fullscreen',
    target: '#main',
    i18n: {
        en: {
            title: 'Olá',
            subtitle: 'Mande uma mensagem. Estamos disponíveis 24 horas',
            inputPlaceholder: 'Digite sua mensagem',

        }
    }
});