// 🔍 Funcionalidade da lupa (busca)
const lupa = document.querySelector('.icone-lupa');
const campoBusca = document.querySelector('.campo-busca');

lupa.addEventListener('click', () => {
    campoBusca.style.display = campoBusca.style.display === 'block' ? 'none' : 'block';
    if (campoBusca.style.display === 'block') {
        campoBusca.focus();
    }
});

campoBusca.addEventListener('focus', () => {
    campoBusca.placeholder = '';
});

campoBusca.addEventListener('blur', () => {
    campoBusca.placeholder = 'Buscar';
});

// 🌀 Carrossel Infinito com pausa no hover
const cardsContainer = document.querySelector('.cards');
const cards = Array.from(cardsContainer.children);

// ➕ Duplica os cards para criar efeito de loop infinito
cards.forEach(card => {
    const clone = card.cloneNode(true);
    cardsContainer.appendChild(clone);
});

// ➕ Adiciona classe de animação
cardsContainer.classList.add('animacao-carrossel');

// ➕ Pausar ao passar o mouse
cardsContainer.addEventListener('mouseenter', () => {
    cardsContainer.style.animationPlayState = 'paused';
});

cardsContainer.addEventListener('mouseleave', () => {
    cardsContainer.style.animationPlayState = 'running';
});

// 🔥 Remove setas se desejar (opcional)
const esquerda = document.querySelector('.seta.esquerda');
const direita = document.querySelector('.seta.direita');
if (esquerda) esquerda.style.display = 'none';
if (direita) direita.style.display = 'none';
