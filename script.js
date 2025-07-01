// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.appspot.com",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('botaoMenu').addEventListener('click', function (e) {
    e.stopPropagation(); // Evita fechamento imediato ao clicar no botão
    const menu = document.getElementById('menuHamburguer');
    menu.classList.toggle('ativo');
  });

  // Fecha o menu ao clicar fora
  document.addEventListener('click', function (e) {
    const menu = document.getElementById('menuHamburguer');
    if (!menu.contains(e.target)) {
      menu.classList.remove('ativo');
    }
  });

function alternarMenu() {
  const menu = document.getElementById("menuHamburguer");
  menu.classList.toggle("ativo");
}


firebase.auth().onAuthStateChanged((user) => {
  const menuHamburguer = document.getElementById("menuHamburguer");
  if (user) {
    // Usuário logado → esconder menu hambúrguer
    menuHamburguer.style.display = "none";
  } else {
    // Usuário deslogado → mostrar menu
    menuHamburguer.style.display = "flex";
  }
});

// Campo de Busca
function buscar() {
  const termo = document.getElementById('campoBusca').value;
  if (termo.trim()) {
    window.location.href = `busca.html?q=${encodeURIComponent(termo)}`;
  }
}
window.buscar = buscar;

// Menu suspenso da conta
const botaoConta = document.getElementById("botaoConta");
const menuConta = document.getElementById("menuConta");

if (botaoConta) {
  botaoConta.addEventListener("click", () => {
    menuConta.classList.toggle("ativo");
  });
}

// Ir para página de anúncio
function irParaAnuncio() {
  const user = auth.currentUser;
  if (user) {
    window.location.href = 'criar-anuncio.html';
  } else {
    localStorage.setItem('destinoAposLogin', 'criar-anuncio.html');
    window.location.href = 'login.html';
  }
}
window.irParaAnuncio = irParaAnuncio;

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
    cards.style.transform = `translateX(${-posScroll}px)`;
  });

  setaDireita.addEventListener("click", () => {
    posScroll += passoScroll;
    if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
    cards.style.transform = `translateX(${-posScroll}px)`;
  });

  setInterval(() => {
    posScroll += passoScroll;
    if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
    cards.style.transform = `translateX(${-posScroll}px)`;
  }, 4000);
}

// Carrossel Destaques
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

// Botão Voltar ao Topo
const btnTopo = document.getElementById("btnTopo");
if (btnTopo) {
  window.addEventListener("scroll", () => {
    btnTopo.style.display = window.scrollY > 100 ? "block" : "none";
  });

  btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Verifica login para mostrar/esconder botões
auth.onAuthStateChanged((user) => {
  const btnEntrar = document.getElementById("botao-entrar");
  const btnMeusAnuncios = document.getElementById("botao-meus-anuncios");
  const menuConta = document.getElementById("menuConta");
  const barraLogado = document.getElementById("barra-superior-logado");
  const espacoBarra = document.getElementById("espacoBarraSuperior");

  if (user) {
    if (btnEntrar) btnEntrar.style.display = "none";
    if (btnMeusAnuncios) btnMeusAnuncios.style.display = "inline-block";
    if (menuConta) menuConta.style.display = "block";
    if (barraLogado) barraLogado.style.display = "flex";
    if (espacoBarra) espacoBarra.style.display = "none";
  } else {
    if (btnEntrar) btnEntrar.style.display = "inline-block";
    if (btnMeusAnuncios) btnMeusAnuncios.style.display = "none";
    if (menuConta) menuConta.style.display = "none";
    if (barraLogado) barraLogado.style.display = "none";
    if (espacoBarra) espacoBarra.style.display = "block";
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

// Animação do mascote
document.addEventListener("DOMContentLoaded", function () {
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
