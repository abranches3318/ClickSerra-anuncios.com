// Carrossel
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
const cards = document.querySelector('.cards');
const scrollStep = 200;

setaEsquerda.addEventListener('click', () => {
  cards.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});
setaDireita.addEventListener('click', () => {
  cards.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

// Menu hambúrguer
function toggleMenu() {
  const menu = document.getElementById("menuNavegacao");
  menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}

// Campo de busca
function toggleBusca() {
  const busca = document.getElementById("buscaAtiva");
  const input = document.getElementById("campoBusca");
  busca.style.display = (busca.style.display === "block") ? "none" : "block";
  if (busca.style.display === "block") {
    input.focus();
  }
}
