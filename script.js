// Botão voltar ao topo
const btnTopo = document.getElementById("btnTopo");
window.onscroll = function () {
  btnTopo.style.display = window.scrollY > 100 ? "block" : "none";
};
btnTopo.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

// Carrossel
const cards = document.querySelector(".cards");
const btnEsquerda = document.querySelector(".esquerda");
const btnDireita = document.querySelector(".direita");

btnEsquerda.addEventListener("click", () => {
  cards.scrollBy({ left: -200, behavior: "smooth" });
});
btnDireita.addEventListener("click", () => {
  cards.scrollBy({ left: 200, behavior: "smooth" });
});

// Auto-carrossel
setInterval(() => {
  cards.scrollBy({ left: 150, behavior: "smooth" });
}, 4000);

// Menu hambúrguer
function toggleMenu(x) {
  x.classList.toggle("change");
  document.getElementById("menuMobile").classList.toggle("active");
}
