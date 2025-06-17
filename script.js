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

// Alternância de visibilidade com base no login
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

// Função de logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Erro ao sair:", error);
  });
};

// Redirecionamento inteligente para criação de anúncio
window.irParaAnuncio = function () {
  const user = auth.currentUser;
  if (user) {
    window.location.href = "criar-anuncio.html";
  } else {
    window.location.href = "login.html";
  }
};
