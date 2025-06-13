// Menu hambúrguer
function toggleMenu() {
  const menu = document.getElementById('menuNavegacao');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Busca
function toggleBusca() {
  const busca = document.querySelector('.busca-ativa');
  busca.style.display = busca.style.display === 'flex' ? 'none' : 'flex';

  // Se mostrar busca, esconder menu
  if (busca.style.display === 'flex') {
    document.getElementById('menuNavegacao').style.display = 'none';
  }
}

// Carrossel Categorias
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
const cards = document.querySelector('.top-categorias .cards');

const cardsConteudo = cards.innerHTML;
cards.innerHTML += cardsConteudo;

let posScroll = 0;
const passoScroll = 160;

setaEsquerda.addEventListener('click', () => {
  posScroll -= passoScroll;
  if (posScroll < 0) posScroll = cards.scrollWidth / 2;
  cards.style.transform = `translateX(${-posScroll}px)`;
});
setaDireita.addEventListener('click', () => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
  cards.style.transform = `translateX(${-posScroll}px)`;
});
setInterval(() => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
  cards.style.transform = `translateX(${-posScroll}px)`;
}, 4000);

// Carrossel Destaques
const cardsDestaque = document.querySelector('.cards-destaque');
const btnEsquerdaDestaque = document.querySelector('.destaque-esquerda');
const btnDireitaDestaque = document.querySelector('.destaque-direita');
const totalDestaques = cardsDestaque.children.length;
let indexDestaque = 0;

function atualizaDestaque() {
  cardsDestaque.style.transform = `translateX(-${indexDestaque * 100}%)`;
}
btnEsquerdaDestaque.addEventListener('click', () => {
  indexDestaque = (indexDestaque - 1 + totalDestaques) % totalDestaques;
  atualizaDestaque();
});
btnDireitaDestaque.addEventListener('click', () => {
  indexDestaque = (indexDestaque + 1) % totalDestaques;
  atualizaDestaque();
});
setInterval(() => {
  indexDestaque = (indexDestaque + 1) % totalDestaques;
  atualizaDestaque();
}, 5000);

// Botão topo
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 100 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
