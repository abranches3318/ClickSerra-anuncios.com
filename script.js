// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.firebasestorage.app",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Menu Hambúrguer
function toggleMenu() {
  const menu = document.getElementById('menuNavegacao');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Campo de Busca
function toggleBusca() {
  const campo = document.querySelector('.campo-busca');
  campo.style.display = campo.style.display === 'none' || campo.style.display === '' ? 'block' : 'none';
  campo.focus();
}

// Carrossel de Categorias
const setaEsquerda = document.querySelector('.seta.esquerda');
const setaDireita = document.querySelector('.seta.direita');
const cards = document.querySelector('.top-categorias .cards');

const cardsConteudo = cards.innerHTML;
cards.innerHTML += cardsConteudo;

let posScroll = 0;
const passoScroll = 160;

setaEsquerda.addEventListener('click', () => {
  posScroll -= passoScroll;
  if (posScroll < 0) posScroll = cards.scrollWidth / 2;
  cards.style.transform = `translateX(${-posScroll}px)`;
});

setaDireita.addEventListener('click', () => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
  cards.style.transform = `translateX(${-posScroll}px)`;
});

setInterval(() => {
  posScroll += passoScroll;
  if (posScroll >= cards.scrollWidth / 2) posScroll = 0;
  cards.style.transform = `translateX(${-posScroll}px)`;
}, 4000);

// Carrossel Destaques
const cardsDestaque = document.querySelector('.cards-destaque');
const btnEsquerdaDestaque = document.querySelector('.seta.destaque-esquerda');
const btnDireitaDestaque = document.querySelector('.seta.destaque-direita');
const totalDestaques = cardsDestaque.children.length;
let indexDestaque = 0;

function atualizaDestaque() {
  cardsDestaque.style.transform = `translateX(-${indexDestaque * 100}%)`;
}

btnEsquerdaDestaque.addEventListener('click', () => {
  indexDestaque = (indexDestaque - 1 + totalDestaques) % totalDestaques;
  atualizaDestaque();
});

btnDireitaDestaque.addEventListener('click', () => {
  indexDestaque = (indexDestaque + 1) % totalDestaques;
  atualizaDestaque();
});

setInterval(() => {
  indexDestaque = (indexDestaque + 1) % totalDestaques;
  atualizaDestaque();
}, 5000);


// Botão Voltar ao Topo
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 100 ? 'block' : 'none';
});
btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Visibilidade dos botões de autenticação
auth.onAuthStateChanged(user => {
  const btnEntrar = document.getElementById('botao-entrar');
  const btnSair = document.getElementById('botao-sair');

  if (user) {
    if (btnEntrar) btnEntrar.style.display = 'none';
    if (btnSair) btnSair.style.display = 'inline-block';
  } else {
    if (btnEntrar) btnEntrar.style.display = 'inline-block';
    if (btnSair) btnSair.style.display = 'none';
  }
});

// Redirecionamento do botão "Anuncie Aqui"
function irParaAnuncio() {
  const user = auth.currentUser;
  if (user) {
    window.location.href = 'criar-anuncio.html';
  } else {
    localStorage.setItem('destinoAposLogin', 'criar-anuncio.html');
    window.location.href = 'login.html';
  }
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}

// Login com Google (habilita login e cadastro)
function loginComGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  auth.signInWithPopup(provider)
    .then(result => {
      const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
      localStorage.removeItem('destinoAposLogin');
      localStorage.setItem('usuarioLogado', result.user.uid);
      window.location.href = destino;
    })
    .catch(error => {
      console.error("Erro no login com Google:", error);
      alert("Erro ao fazer login com Google.");
    });
}  
