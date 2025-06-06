const esquerda = document.querySelector('.seta.esquerda');
const direita = document.querySelector('.seta.direita');
const cards = document.querySelector('.cards');
let scrollX = 0;

direita.addEventListener('click', () => {
  cards.scrollBy({ left: 200, behavior: 'smooth' });
});

esquerda.addEventListener('click', () => {
  cards.scrollBy({ left: -200, behavior: 'smooth' });
});

// Carrossel automático
setInterval(() => {
  cards.scrollBy({ left: 200, behavior: 'smooth' });
}, 4000);

// Botão voltar ao topo
const btnTopo = document.getElementById('btnTopo');

window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 200 ? 'block' : 'none';
});

btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Menu Hamburguer
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('ativo');
});
