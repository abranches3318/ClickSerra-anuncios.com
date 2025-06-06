// Voltar ao topo
const btnTopo = document.getElementById("btnTopo");
window.addEventListener("scroll", () => {
    btnTopo.style.display = window.scrollY > 200 ? "block" : "none";
});
btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Campo de busca
const iconeLupa = document.querySelector(".icone-lupa");
const campoBusca = document.querySelector(".campo-busca");
iconeLupa.addEventListener("click", () => {
    campoBusca.style.display = campoBusca.style.display === "block" ? "none" : "block";
});

// Carrossel manual
const cards = document.querySelector(".cards");
const setaEsquerda = document.querySelector(".seta.esquerda");
const setaDireita = document.querySelector(".seta.direita");

let scrollAmount = 0;
const cardWidth = 220; // Largura aproximada do card (200px + gap)

setaDireita.addEventListener("click", () => {
    scrollAmount += cardWidth;
    if (scrollAmount > cards.scrollWidth - cards.clientWidth) {
        scrollAmount = 0; // Volta ao início
    }
    cards.style.transform = `translateX(-${scrollAmount}px)`;
});

setaEsquerda.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    if (scrollAmount < 0) {
        scrollAmount = 0;
    }
    cards.style.transform = `translateX(-${scrollAmount}px)`;
});

// Carrossel automático
setInterval(() => {
    scrollAmount += cardWidth;
    if (scrollAmount > cards.scrollWidth - cards.clientWidth) {
        scrollAmount = 0;
    }
    cards.style.transform = `translateX(-${scrollAmount}px)`;
}, 5000);
