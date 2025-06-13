// Carrossel infinito
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
const cards = document.querySelector('.cards');
const scrollStep = 200;

// Duplicar os cards para scroll infinito
cards.innerHTML += cards.innerHTML;

// Navegação manual
setaEsquerda.addEventListener('click', () => {
  cards.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});
setaDireita.addEventListener('click', () => {
  cards.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

// Auto-scroll infinito
setInterval(() => {
  cards.scrollBy({ left: scrollStep, behavior: 'smooth' });
  if (cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - scrollStep) {
    cards.scrollLeft = 0;
  }
}, 4000);

// Loop visual
cards.addEventListener('scroll', () => {
  if (cards.scrollLeft >= cards.scrollWidth / 2) {
    cards.scrollLeft = 0;
  }
});

// Botão voltar ao topo
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 100 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Menu hambúrguer
function toggleMenu() {
  const menu = document.getElementById("menuNavegacao");
  menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}

// Mostrar/ocultar busca
function toggleBusca() {
  const busca = document.getElementById("buscaAtiva");
  busca.style.display = (busca.style.display === "block") ? "none" : "block";
}
