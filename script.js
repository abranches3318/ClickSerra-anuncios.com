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

// Auto-scroll opcional
setInterval(() => {
  destaqueIndex = (destaqueIndex + 1) % totalDestaques;
  atualizarCarrosselDestaque();
}, 6000);
