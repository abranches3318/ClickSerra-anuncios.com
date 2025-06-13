// Menu hambúrguer e busca
function toggleMenu() {
  const menu = document.getElementById('menuNavegacao');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
}

function toggleBusca() {
  const busca = document.querySelector('.busca-ativa');
  busca.style.display = busca.style.display === 'flex' ? 'none' : 'flex';

  // Se mostrar busca, esconder menu
  if (busca.style.display === 'flex') {
    document.getElementById('menuNavegacao').style.display = 'none';
  }
}

// Carrossel Categorias - rolagem infinita
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
const cards = document.querySelector('.top-categorias .cards');

// Duplicar cards para efeito infinito
const cardsConteudo = cards.innerHTML;
cards.innerHTML += cardsConteudo;

let posScroll = 0;
const passoScroll = 160; // considerando card + gap

setaEsquerda.addEventListener('click', () => {
  posScroll -= passoScroll;
  if (posScroll < 0) {
    posScroll = cards.scrollWidth / 2;
  }
  cards.style.transform = `translateX(${-posScroll}px)`;
});

setaDireita.addEventListener('click', () => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) {
    posScroll = 0;
  }
  cards.style.transform = `translateX(${-posScroll}px)`;
});

// Auto scroll categorias
setInterval(() => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) {
    posScroll = 0;
  }
  cards.style.transform = `translateX(${-posScroll}px)`;
}, 4000);

// Carrossel Destaques - 100% width por card
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

// Auto scroll Destaques
setInterval(() => {
  indexDestaque = (indexDestaque + 1) % totalDestaques;
  atualizaDestaque();
}, 5000);

// Botão voltar ao topo
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 100 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
