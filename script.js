// ===========================
// 🔍 Campo de busca
// ===========================
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

// ===========================
// 🌙 Dark Mode
// ===========================
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// ===========================
// 🔼 Botão Voltar ao Topo
// ===========================
const btnTopo = document.getElementById('voltar-topo');
window.addEventListener('scroll', () => {
    btnTopo.style.display = window.scrollY > 300 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===========================
// 🌀 Carrossel Infinito JS
// ===========================
const cardsContainer = document.querySelector('.cards');
const esquerda = document.querySelector('.seta.esquerda');
const direita = document.querySelector('.seta.direita');

let velocidade = 1.5; // 🚀 Aumente esse valor para mais velocidade
let posicao = 0;

// Clonar cards para efeito infinito
cardsContainer.innerHTML += cardsContainer.innerHTML;

// Função de rolagem automática
function animarCarrossel() {
    posicao -= velocidade;
    if (Math.abs(posicao) >= cardsContainer.scrollWidth / 2) {
        posicao = 0; // Reset quando chega no meio (porque duplicamos)
    }
    cardsContainer.style.transform = `translateX(${posicao}px)`;
    requestAnimationFrame(animarCarrossel);
}

animarCarrossel(); // Iniciar

// ===========================
// ⏸️ Pausar no Hover
// ===========================
let pausado = false;
cardsContainer.addEventListener('mouseenter', () => pausado = true);
cardsContainer.addEventListener('mouseleave', () => pausado = false);

function animarCarrossel() {
    if (!pausado) {
        posicao -= velocidade;
        if (Math.abs(posicao) >= cardsContainer.scrollWidth / 2) {
            posicao = 0;
        }
        cardsContainer.style.transform = `translateX(${posicao}px)`;
    }
    requestAnimationFrame(animarCarrossel);
}

animarCarrossel();

// ===========================
// ⬅️➡️ Setas para Navegar
// ===========================
esquerda.addEventListener('click', () => {
    posicao += 300; // Rola para esquerda
});
direita.addEventListener('click', () => {
    posicao -= 300; // Rola para direita
});
