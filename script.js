// Firebase Config

Const firebaseConfig = {

  apiKey: “AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0”,

  authDomain: “clickserra-anuncios.firebaseapp.com”,

  databaseURL: https://clickserra-anuncios-default-rtdb.firebaseio.com,

  projectId: “clickserra-anuncios”,

  storageBucket: “clickserra-anuncios.firebasestorage.app”,

  messagingSenderId: “251868045964”,

  appId: “1:251868045964:web:34f527f3d7c380746211a9”,

};



Firebase.initializeApp(firebaseConfig);

Window.auth = firebase.auth();



// menu hambúrguer 

  Document.getElementById(‘botaoMenu’).addEventListener(‘click’, function () {

  Document.querySelector(‘.menu-hamburguer’).classList.toggle(‘ativo’);

});



  // Fecha o menu ao clicar fora

  Document.addEventListener(‘click’, function (e) {

    Const menu = document.getElementById(‘menuHamburguer’);

    If (!menu.contains(e.target)) {

      Menu.classList.remove(‘ativo’);

    }

  });



Function alternarMenu() {

  Const menu = document.getElementById(“menuHamburguer”);

  Menu.classList.toggle(“ativo”);

}





// Campo de Busca

Function buscar() {

  Const termo = document.getElementById(‘campoBusca’).value;

  If (termo.trim()) {

    Window.location.href = `busca.html?q=${encodeURIComponent(termo)}`;

  }

}



// Menu suspenso

Const botaoConta = document.getElementById(“botaoConta”);

Const menuConta = document.getElementById(“menuConta”);

Const menuSuspenso = document.getElementById(“menuSuspenso”);



If (botaoConta) {

  botaoConta.addEventListener(“click”, () => {

    menuConta.classList.toggle(“ativo”);

  });

}



// Navegar para página de anúncio

Window.irParaAnuncio = function () {

  Const user = auth.currentUser;

  If (user) {

    Window.location.href = ‘criar-anuncio.html’;

  } else {

    localStorage.setItem(‘destinoAposLogin’, ‘criar-anuncio.html’);

    window.location.href = ‘login.html’;

  }

};



// Carrossel de Categorias

Const setaEsquerda = document.querySelector(“.seta.esquerda”);

Const setaDireita = document.querySelector(“.seta.direita”);

Const cards = document.querySelector(“.top-categorias .cards”);



If (cards && setaEsquerda && setaDireita) {

  Const cardsConteudo = cards.innerHTML;

  Cards.innerHTML += cardsConteudo;



  Let posScroll = 0;

  Const passoScroll = 160;



  setaEsquerda.addEventListener(“click”, () => {

    posScroll -= passoScroll;

    if (posScroll < 0) posScroll = cards.scrollWidth / 2;

    cards.style.transform = `translateX(${-posScroll}px)`;

  });



  setaDireita.addEventListener(“click”, () => {

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

Const cardsDestaque = document.querySelector(“.cards-destaque”);

Const btnEsquerdaDestaque = document.querySelector(“.seta.destaque-esquerda”);

Const btnDireitaDestaque = document.querySelector(“.seta.destaque-direita”);



If (cardsDestaque && btnEsquerdaDestaque && btnDireitaDestaque) {

  Const totalDestaques = cardsDestaque.children.length;

  Let indexDestaque = 0;



  Function atualizaDestaque() {

    cardsDestaque.style.transform = `translateX(-${indexDestaque * 100}%)`;

  }



  btnEsquerdaDestaque.addEventListener(“click”, () => {

    indexDestaque = (indexDestaque – 1 + totalDestaques) % totalDestaques;

    atualizaDestaque();

  });



  btnDireitaDestaque.addEventListener(“click”, () => {

    indexDestaque = (indexDestaque + 1) % totalDestaques;

    atualizaDestaque();

  });



  setInterval(() => {

    indexDestaque = (indexDestaque + 1) % totalDestaques;

    atualizaDestaque();

  }, 5000);

}



// Botão Voltar ao Topo

Const btnTopo = document.getElementById(“btnTopo”);

If (btnTopo) {

  Window.addEventListener(“scroll”, () => {

    btnTopo.style.display = window.scrollY > 100 ? “block” : “none”;

  });



  btnTopo.addEventListener(“click”, () => {

    window.scrollTo({ top: 0, behavior: “smooth” });

  });

}



// Autenticação – visibilidade de botões

Auth.onAuthStateChanged((user) => {

  Const btnEntrar = document.getElementById(“botao-entrar”);

  Const btnMeusAnuncios = document.getElementById(“botao-meus-anuncios”);

  Const botaoConta = document.getElementById(“botaoConta”);

  Const menuConta = document.getElementById(“menuConta”);

  Const barraLogado = document.getElementById(‘barra-superior-logado’);

  Const espacoBarra = document.getElementById(‘espacoBarraSuperior’);



  If (user) {

    If (btnEntrar) btnEntrar.style.display = “none”;

    If (btnMeusAnuncios) btnMeusAnuncios.style.display = “inline-block”;

    If (menuConta) menuConta.style.display = “block”;

    If (barraLogado) barraLogado.style.display = ‘flex’;

    If (espacoBarra) espacoBarra.style.display = ‘none’;

  } else {

    If (btnEntrar) btnEntrar.style.display = “inline-block”;

    If (btnMeusAnuncios) btnMeusAnuncios.style.display = “none”;

    If (menuConta) menuConta.style.display = “none”;

    If (barraLogado) barraLogado.style.display = ‘none’;

    If (espacoBarra) espacoBarra.style.display = ‘block’;

  }

});



Firebase.auth().onAuthStateChanged((user) => {

  Const menuHamburguer = document.getElementById(“menuHamburguer”);

  If (user) {

    // Usuário logado → esconder menu hambúrguer

    menuHamburguer.style.display = “none”;

  } else {

    // Usuário deslogado → mostrar menu

    menuHamburguer.style.display = “flex”;

  }

});





// Logout

Function logout() {

  Auth.signOut().then(() => {

    Window.location.href = “index.html”;

  });

}

Window.logout = logout;



// Login com Google

Function loginComGoogle() {

  Const provider = new firebase.auth.GoogleAuthProvider();

  Provider.setCustomParameters({ prompt: “select_account” });



  Auth

    .signInWithPopup(provider)

    .then(() => {

      Const destino = localStorage.getItem(“destinoAposLogin”) || “index.html”;

      Window.location.href = destino;

    })

    .catch((error) => {

      Console.error(“Erro no login com Google:”, error);

      Alert(“Erro ao fazer login com Google.”);

    });

}

Window.loginComGoogle = loginComGoogle;



// Mascote animação

Document.addEventListener(“DOMContentLoaded”, function () {

  Const mascoteAberto = document.querySelector(‘.mascote-aberto’);

  Const mascoteFechado = document.querySelector(‘.mascote-fechado’);



  If (mascoteAberto && mascoteFechado) {

    setInterval(() => {

      mascoteAberto.style.opacity = ‘0’;

      mascoteFechado.style.opacity = ‘1’;



      setTimeout(() => {

        mascoteAberto.style.opacity = ‘1’;

        mascoteFechado.style.opacity = ‘0’;

      }, 500); // Fecha por 500ms

    }, 3500); // Pisca a cada 3.5s

  }

});

  



