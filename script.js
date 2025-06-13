// Carrossel padrão (categorias)
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
const cards = document.querySelector('.cards');
const scrollStep = 200;

cards.innerHTML += cards.innerHTML; // rolagem infinita

setaEsquerda.addEventListener('click', () => {
  cards.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});
setaDireita.addEventListener('click', () => {
  cards.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

setInterval(() => {
  cards.scrollBy({ left: scrollStep, behavior: 'smooth' });
  if (cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - scrollStep) {
    cards.scrollLeft = 0;
  }
}, 4000);

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

// Carrossel Destaque
const cardsDestaque = document.querySelector('.cards-destaque');
const setaDestaqueEsquerda = document.querySelector('.destaque-esquerda');
const setaDestaqueDireita = document.querySelector('.destaque-direita');

let destaqueIndex = 0;
const totalDestaques = document.querySelectorAll('.card-destaque').length;

function atualizarCarrosselDestaque() {
  cardsDestaque.style.transform = `translateX(-${destaqueIndex * 100}%)`;
}

setaDestaqueDireita.addEventListener('click', () => {
  destaqueIndex = (destaqueIndex + 1) % totalDestaques;
  atualizarCarrosselDestaque();
});

setaDestaqueEsquerda.addEventListener('click', () => {
  destaqueIndex = (destaqueIndex - 1 + totalDestaques) % totalDestaques;
  atualizarCarrosselDestaque();
});

setInterval(() => {
  destaqueIndex = (destaqueIndex + 1) % totalDestaques;
  atualizarCarrosselDestaque();
}, 6000);
