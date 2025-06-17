import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.firebasestorage.app",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Funções de menu e busca
window.toggleMenu = function () {
  const menu = document.getElementById("menuNavegacao");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

window.toggleBusca = function () {
  const campo = document.querySelector(".campo-busca");
  campo.style.display = campo.style.display === "none" || campo.style.display === "" ? "block" : "none";
  campo.focus();
};

// Carrossel Categorias
const setaEsquerda = document.querySelector(".seta.esquerda");
const setaDireita = document.querySelector(".seta.direita");
const cards = document.querySelector(".top-categorias .cards");

const cardsConteudo = cards.innerHTML;
cards.innerHTML += cardsConteudo;

let posScroll = 0;
const passoScroll = 160;

setaEsquerda.addEventListener("click", () => {
  posScroll -= passoScroll;
  if (posScroll < 0) posScroll = cards.scrollWidth / 2;
  cards.style.transform = `translateX(-${posScroll}px)`;
});

setaDireita.addEventListener("click", () => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
  cards.style.transform = `translateX(-${posScroll}px)`;
});

setInterval(() => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
  cards.style.transform = `translateX(-${posScroll}px)`;
}, 4000);

// Carrossel Destaques
const cardsDestaque = document.querySelector(".cards-destaque");
const btnEsquerdaDestaque = document.querySelector(".seta.destaque-esquerda");
const btnDireitaDestaque = document.querySelector(".seta.destaque-direita");
const totalDestaques = cardsDestaque.children.length;
let indexDestaque = 0;

function atualizaDestaque() {
  cardsDestaque.style.transform = `translateX(-${indexDestaque * 100}%)`;
}

btnEsquerdaDestaque.addEventListener("click", () => {
  indexDestaque = (indexDestaque - 1 + totalDestaques) % totalDestaques;
  atualizaDestaque();
});

btnDireitaDestaque.addEventListener("click", () => {
  indexDestaque = (indexDestaque + 1) % totalDestaques;
  atualizaDestaque();
});

setInterval(() => {
  indexDestaque = (indexDestaque + 1) % totalDestaques;
  atualizaDestaque();
}, 5000);

// Botão Voltar ao Topo
const btnTopo = document.getElementById("btnTopo");
window.addEventListener("scroll", () => {
  btnTopo.style.display = window.scrollY > 100 ? "block" : "none";
});
btnTopo.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Login/Logout com Firebase
onAuthStateChanged(auth, (user) => {
  const botaoEntrar = document.getElementById("botao-entrar");
  const botaoSair = document.getElementById("botao-sair");
  const botaoAnuncie = document.getElementById("botao-anuncie");

  if (user) {
    if (botaoEntrar) botaoEntrar.style.display = "none";
    if (botaoSair) botaoSair.style.display = "inline-block";
    if (botaoAnuncie) botaoAnuncie.style.display = "inline-block";
  } else {
    if (botaoEntrar) botaoEntrar.style.display = "inline-block";
    if (botaoSair) botaoSair.style.display = "none";
    if (botaoAnuncie) botaoAnuncie.style.display = "inline-block";
  }
});

window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Erro ao sair:", error);
    });
};

window.irParaAnuncio = function () {
  const user = auth.currentUser;
  if (user) {
    window.location.href = "criar-anuncio.html";
  } else {
    window.location.href = "login.html";
  }
};
