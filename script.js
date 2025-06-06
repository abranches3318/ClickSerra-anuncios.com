function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = () => {
  document.getElementById('btnTopo').style.display = window.scrollY > 200 ? 'block' : 'none';
};

function toggleMenu() {
  const nav = document.querySelector('.itens-navegacao');
  nav.classList.toggle('active');
}

function toggleBusca() {
  const busca = document.querySelector('.busca');
  busca.classList.toggle('active');
  if (busca.classList.contains('active')) {
    busca.querySelector('input').focus();
  }
}

function buscar() {
  const termo = document.querySelector('.campo-busca').value.toLowerCase();
  console.log(`Busca por: ${termo}`);
  // Simulação de busca - adicionar lógica real
}

// Carrossel rolagem manual
let posDestaques = 0;
function rolarDestaques(dir) {
  const cards = document.querySelector(".cards-destaques");
  const largura = cards.children[0].offsetWidth + 20;
  posDestaques += dir * largura;
  cards.style.transform = `translateX(-${posDestaques}px)`;
}

let posCategorias = 0;
function rolarCategorias(dir) {
  const cards = document.querySelector(".cards");
  const largura = cards.children[0].offsetWidth + 10;
  posCategorias += dir * largura;
  cards.style.transform = `translateX(-${posCategorias}px)`;
}
