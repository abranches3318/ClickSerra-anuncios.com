// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.firebasestorage.app",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Menu hambúrguer
const botaoMenu = document.getElementById('botaoMenu');
const menuHamburguer = document.getElementById('menuHamburguer');

botaoMenu.addEventListener('click', function (e) {
  e.stopPropagation();
  menuHamburguer.classList.toggle('ativo');
});

document.addEventListener('click', function (e) {
  if (!menuHamburguer.contains(e.target)) {
    menuHamburguer.classList.remove('ativo');
  }
});

// Exibe ou esconde menu hambúrguer dependendo do login
document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    const menuHamburguer = document.getElementById("menuHamburguer");
    if (menuHamburguer) {
      menuHamburguer.style.display = user ? "none" : "flex";
    }
  });
});

// Campo de busca
function buscar() {
  const termo = document.getElementById("campoBusca").value.trim();
  if (termo) {
    window.location.href = `busca.html?q=${encodeURIComponent(termo)}`;
  }
}
window.buscar = buscar;

// Aciona busca ao clicar na lupa
const botaoLupa = document.getElementById("botaoLupa");
if (botaoLupa) {
  botaoLupa.addEventListener("click", buscar);
}

// Aciona busca ao pressionar Enter
const campoBusca = document.getElementById("campoBusca");
if (campoBusca) {
  campoBusca.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buscar();
    }
  });
}

// Menu suspenso da conta
const botaoConta = document.getElementById("botaoConta");
const menuConta = document.getElementById("menuConta");
const menuSuspenso = document.getElementById("menuSuspenso");

if (botaoConta && menuConta && menuSuspenso) {
  botaoConta.addEventListener("click", (e) => {
    e.stopPropagation();
    menuConta.classList.toggle("ativo");
  });

  document.addEventListener("click", (e) => {
    if (!menuConta.contains(e.target)) {
      menuConta.classList.remove("ativo");
    }
  });
}

auth.onAuthStateChanged((user) => {
  const menuConta = document.getElementById("menuConta");
  const menuHamburguer = document.getElementById("menuHamburguer");

  if (user) {
    if (menuConta) menuConta.style.display = "flex";
    if (menuHamburguer) menuHamburguer.style.display = "none";
  } else {
    if (menuConta) {
      menuConta.style.display = "none";
      menuConta.classList.remove("ativo"); // fecha o menu suspenso se estiver aberto
    }
    if (menuHamburguer) menuHamburguer.style.display = "flex";
  }
});

// Ir para criar anúncio
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

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
window.logout = logout;

// Confirmação com SweetAlert2
function confirmarLogout() {
  Swal.fire({
    title: 'Deseja realmente sair?',
    text: 'Você será desconectado da sua conta.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Sim, sair',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      logout(); // Chama a função já definida
    }
  });
}

// Login com Google
function loginComGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  auth.signInWithPopup(provider)
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
document.addEventListener("DOMContentLoaded", () => {
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

const footer = document.getElementById('footer');

function checkScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight;

  if (scrollTop + windowHeight >= scrollHeight - 10) {
    footer.classList.add('visible');
  } else {
    footer.classList.remove('visible');
  }
}

window.addEventListener('scroll', checkScroll);
checkScroll(); // Verifica já no carregamento
