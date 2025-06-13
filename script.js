function toggleMenu() {
  const menu = document.getElementById('menuNavegacao');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function toggleBusca() {
  const campo = document.querySelector('.campo-busca');
  campo.style.display = campo.style.display === 'none' || campo.style.display === '' ? 'block' : 'none';
  campo.focus();
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
const btnEsquerdaDestaque = document.querySelector('.seta.destaque-esquerda');
const btnDireitaDestaque = document.querySelector('.seta.destaque-direita');
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

// Botão Voltar ao Topo
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 100 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
