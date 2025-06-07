// Carrossel
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
const cards = document.querySelector('.cards');

let scrollAmount = 0;
const scrollStep = 200;

setaEsquerda.addEventListener('click', () => {
  cards.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});
setaDireita.addEventListener('click', () => {
  cards.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

// Auto-scroll
setInterval(() => {
  cards.scrollBy({ left: scrollStep, behavior: 'smooth' });
}, 4000);

// Botão Voltar ao Topo
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 100 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Menu Hambúrguer
function toggleMenu() {
  const menu = document.getElementById('menuNavegacao');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}
