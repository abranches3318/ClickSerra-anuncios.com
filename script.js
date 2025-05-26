/ 🔍 Funcionalidade da lupa
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

// 🌙 Dark Mode
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// 🔼 Voltar ao topo
const btnTopo = document.getElementById('voltar-topo');
window.addEventListener('scroll', () => {
    btnTopo.style.display = window.scrollY > 300 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 🌀 Carrossel infinito com setas
const cardsContainer = document.querySelector('.cards');
const cards = Array.from(cardsContainer.children);

cards.forEach(card => {
    const clone = card.cloneNode(true);
    cardsContainer.appendChild(clone);
});

cardsContainer.classList.add('animacao-carrossel');

// ➕ Pausar ao passar o mouse
cardsContainer.addEventListener('mouseenter', () => {
    cardsContainer.style.animationPlayState = 'paused';
});
cardsContainer.addEventListener('mouseleave', () => {
    cardsContainer.style.animationPlayState = 'running';
});

// ➕ Setas para controle manual
const esquerda = document.querySelector('.seta.esquerda');
const direita = document.querySelector('.seta.direita');

esquerda.addEventListener('click', () => {
    cardsContainer.scrollBy({ left: -300, behavior: 'smooth' });
});
direita.addEventListener('click', () => {
    cardsContainer.scrollBy({ left: 300, behavior: 'smooth' });
});
