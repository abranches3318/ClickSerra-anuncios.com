import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "/ClickSerra-anuncios.com/firebase-config.js";

// Login com e-mail e senha
document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  if (!email || !senha) {
    alert('Preencha e-mail e senha corretamente.');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    localStorage.setItem('usuarioLogado', user.uid);
    localStorage.setItem('usuarioEmail', user.email);

    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');

    alert('Login realizado com sucesso!');
    window.location.href = destino;

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login: " + traduzErroFirebase(error.code));
  }
});

// Login com Google
window.loginComGoogle = async function () {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    localStorage.setItem('usuarioLogado', user.uid);
    localStorage.setItem('usuarioEmail', user.email);
    localStorage.setItem('usuarioNome', user.displayName || '');

    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');

    alert('Login com Google realizado com sucesso!');
    window.location.href = destino;

  } catch (error) {
    console.error("Erro no login com Google:", error);
    alert("Erro ao fazer login com Google: " + traduzErroFirebase(error.code));
  }
};

// Mostrar/ocultar senha
window.toggleSenha = function () {
  const campoSenha = document.getElementById('senhaLogin');
  const icone = document.getElementById('iconeOlho');

  const mostrando = campoSenha.type === 'text';
  campoSenha.type = mostrando ? 'password' : 'text';

  icone.src = mostrando ? 'imagens/ocultar-senha.png' : 'imagens/revelar-senha.png';
  icone.alt = mostrando ? 'Mostrar senha' : 'Ocultar senha';
};

// Traduz mensagens de erro do Firebase
function traduzErroFirebase(codigo) {
  switch (codigo) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/missing-password':
      return 'Senha não informada.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou o pop-up. Permita e tente novamente.';
    case 'auth/popup-closed-by-user':
      return 'O pop-up foi fechado antes da conclusão.';
    case 'auth/cancelled-popup-request':
      return 'A solicitação de login foi cancelada.';
    default:
      return 'Erro desconhecido. Tente novamente.';
  }
}

// Fechar menu lateral ao clicar fora dele
document.addEventListener('click', function (event) {
  const menu = document.getElementById('menuNavegacao');
  const botao = document.querySelector('.hamburguer');

  const clicouFora = !menu.contains(event.target) && !botao.contains(event.target);

  if (menu && menu.style.display === 'flex' && clicouFora) {
    menu.style.display = 'none';
  }
});

