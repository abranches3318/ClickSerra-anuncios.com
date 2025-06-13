// Toggle menu
function toggleMenu() {
  const menu = document.getElementById('menuNavegacao');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Toggle busca (não usada mais diretamente)
function toggleBusca() {
  const busca = document.querySelector('.campo-busca');
  busca.focus();
}

// Carrossel categorias
const cards = document.querySelector('.top-categorias .cards');
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
let posScroll = 0;
const passo = 160;
const maxScroll = cards.scrollWidth / 2;

cards.innerHTML += cards.innerHTML; // efeito infinito

setaDireita.onclick = () => {
  posScroll += passo;
  if (posScroll >= maxScroll) posScroll = 0;
  cards.style.transform = `translateX(-${posScroll}px)`;
};

setaEsquerda.onclick = () => {
  posScroll -= passo;
  if (posScroll < 0) posScroll = maxScroll;
  cards.style.transform = `translateX(-${posScroll}px)`;
};

setInterval(() => {
  setaDireita.click();
}, 4000);

// Destaques
const cardsDestaque = document.querySelector('.cards-destaque');
const btnEsquerdaD = document.querySelector('.destaque-esquerda');
const btnDireitaD = document.querySelector('.destaque-direita');
let indexD = 0;
const totalD = cardsDestaque.children.length;

function atualizaDestaque() {
  cardsDestaque.style.transform = `translateX(-${indexD * 100}%)`;
}

btnEsquerdaD.onclick = () => {
  indexD = (indexD - 1 + totalD) % totalD;
  atualizaDestaque();
};

btnDireitaD.onclick = () => {
  indexD = (indexD + 1) % totalD;
  atualizaDestaque();
};

setInterval(() => {
  btnDireitaD.click();
}, 5000);

// Botão voltar ao topo
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 100 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
