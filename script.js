// 🔍 Campo de busca
const lupa = document.querySelector('.icone-lupa');
const campoBusca = document.querySelector('.campo-busca');

lupa.addEventListener('click', () => {
    campoBusca.style.display = campoBusca.style.display === 'block' ? 'none' : 'block';
    if (campoBusca.style.display === 'block') {
        campoBusca.focus();
    }
});

campoBusca.addEventListener('focus', () => campoBusca.placeholder = '');
campoBusca.addEventListener('blur', () => campoBusca.placeholder = 'Buscar');

// 🌙 Dark Mode
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// 🔼 Botão Voltar ao Topo (corrigido ID)
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
    btnTopo.style.display = window.scrollY > 300 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 🌀 Carrossel Infinito com Pausa no Hover e Setas
const cardsContainer = document.querySelector('.cards');
const esquerda = document.querySelector('.seta.esquerda');
const direita = document.querySelector('.seta.direita');

let velocidade = 2.5;
let posicao = 0;
let pausado = false;

// Clona os cards para criar efeito de carrossel infinito
cardsContainer.innerHTML += cardsContainer.innerHTML;

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

// Setas para rolar manualmente
esquerda.addEventListener('click', () => {
    posicao += 300;
});
direita.addEventListener('click', () => {
    posicao -= 300;
});
