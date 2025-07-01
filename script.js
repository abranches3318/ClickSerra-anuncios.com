// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.appspot.com",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function alternarMenu() {
  const opcoes = document.getElementById("menuHamburguerOpcoes");
  opcoes.classList.toggle("ativo");
}

window.addEventListener("click", function (e) {
  const menu = document.getElementById("menuHamburguer");
  const opcoes = document.getElementById("menuHamburguerOpcoes");
  if (!menu.contains(e.target)) {
    opcoes.classList.remove("ativo");
  }
});


// Campo de Busca
function buscar() {
  const termo = document.getElementById("campoBusca").value;
  if (termo.trim()) {
    window.location.href = `busca.html?q=${encodeURIComponent(termo)}`;
  }
}
window.buscar = buscar;

// Menu Conta (usuário logado)
const botaoConta = document.getElementById("botaoConta");
const menuConta = document.getElementById("menuConta");

if (botaoConta) {
  botaoConta.addEventListener("click", () => {
    menuConta.classList.toggle("ativo");
  });
}

// Botão Anuncie Aqui
window.irParaAnuncio = function () {
  const user = auth.currentUser;
  if (user) {
    window.location.href = "criar-anuncio.html";
  } else {
    localStorage.setItem("destinoAposLogin", "criar-anuncio.html");
    window.location.href = "login.html";
  }
};

// Carrossel de Categorias
const setaEsquerda = document.querySelector(".seta.esquerda");
const setaDireita = document.querySelector(".seta.direita");
const cards = document.querySelector(".top-categorias .cards");

if (cards && setaEsquerda && setaDireita) {
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
}

// Carrossel de Destaques
const cardsDestaque = document.querySelector(".cards-destaque");
const btnEsquerdaDestaque = document.querySelector(".seta.destaque-esquerda");
const btnDireitaDestaque = document.querySelector(".seta.destaque-direita");

if (cardsDestaque && btnEsquerdaDestaque && btnDireitaDestaque) {
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
}

// Botão Topo
const btnTopo = document.getElementById("btnTopo");
if (btnTopo) {
  window.addEventListener("scroll", () => {
    btnTopo.style.display = window.scrollY > 100 ? "block" : "none";
  });

  btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Autenticação - controle de visibilidade de menus
auth.onAuthStateChanged((user) => {
  const menuHamburguer = document.getElementById("menuHamburguer");
  const menuConta = document.getElementById("menuConta");

  if (user) {
    if (menuHamburguer) menuHamburguer.style.display = "none";
    if (menuConta) menuConta.style.display = "flex";
  } else {
    if (menuHamburguer) menuHamburguer.style.display = "flex";
    if (menuConta) menuConta.style.display = "none";
  }
});

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
window.logout = logout;

// Login com Google
function loginComGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  auth
    .signInWithPopup(provider)
    .then(() => {
      const destino = localStorage.getItem("destinoAposLogin") || "index.html";
      window.location.href = destino;
    })
    .catch((error) => {
      console.error("Erro no login com Google:", error);
      alert("Erro ao fazer login com Google.");
    });
}
window.loginComGoogle = loginComGoogle;

// Mascote animação
window.addEventListener("DOMContentLoaded", () => {
  const mascoteAberto = document.querySelector(".mascote-aberto");
  const mascoteFechado = document.querySelector(".mascote-fechado");

  if (mascoteAberto && mascoteFechado) {
    setInterval(() => {
      mascoteAberto.style.opacity = "0";
      mascoteFechado.style.opacity = "1";

      setTimeout(() => {
        mascoteAberto.style.opacity = "1";
        mascoteFechado.style.opacity = "0";
      }, 500);
    }, 3500);
  }
});
