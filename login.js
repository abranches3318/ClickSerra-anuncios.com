import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "/ClickSerra-anuncios.com/firebase-config.js";

// === LOGIN COM EMAIL E SENHA ===
document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  if (!email || !senha) {
    Swal.fire('Atenção', 'Preencha e-mail e senha corretamente.', 'warning');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    salvarDadosUsuario(user);
    Swal.fire('Sucesso', 'Login realizado com sucesso!', 'success').then(() => {
      redirecionarAposLogin();
    });
  } catch (error) {
    Swal.fire('Erro no login', traduzErroFirebase(error.code), 'error');
  }
});

// === LOGIN COM GOOGLE ===
window.loginComGoogle = async function () {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    salvarDadosUsuario(result.user);
    Swal.fire('Sucesso', 'Login com Google realizado com sucesso!', 'success').then(() => {
      redirecionarAposLogin();
    });
  } catch (error) {
    Swal.fire('Erro no login com Google', traduzErroFirebase(error.code), 'error');
  }
};

// === LOGIN COM TELEFONE ===
let confirmationResult = null;

window.enviarCodigoSMS = async function () {
  const telefone = document.getElementById('telefoneLogin').value.trim();

  if (!telefone) {
    Swal.fire('Atenção', 'Informe um número de telefone válido.', 'warning');
    return;
  }

  try {
    const appVerifier = new RecaptchaVerifier('enviarSMS', {
      size: 'invisible',
      callback: () => {}
    }, auth);

    confirmationResult = await signInWithPhoneNumber(auth, telefone, appVerifier);
    document.getElementById('codigoContainer').style.display = 'block';
    Swal.fire('Código Enviado', 'Verifique seu SMS e insira o código.', 'info');
  } catch (error) {
    Swal.fire('Erro ao enviar SMS', traduzErroFirebase(error.code), 'error');
  }
};

window.confirmarCodigoSMS = async function () {
  const codigo = document.getElementById('codigoSMS').value.trim();

  if (!codigo || !confirmationResult) {
    Swal.fire('Erro', 'Código inválido ou não enviado.', 'error');
    return;
  }

  try {
    const result = await confirmationResult.confirm(codigo);
    salvarDadosUsuario(result.user);
    Swal.fire('Sucesso', 'Login com telefone realizado com sucesso!', 'success').then(() => {
      redirecionarAposLogin();
    });
  } catch (error) {
    Swal.fire('Erro na confirmação', traduzErroFirebase(error.code), 'error');
  }
};

// === SALVA DADOS DO USUÁRIO NO LOCALSTORAGE ===
function salvarDadosUsuario(user) {
  localStorage.setItem('usuarioLogado', user.uid);
  localStorage.setItem('usuarioEmail', user.email || '');
  localStorage.setItem('usuarioNome', user.displayName || '');
}

// === REDIRECIONA APÓS LOGIN ===
function redirecionarAposLogin() {
  const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
  localStorage.removeItem('destinoAposLogin');
  window.location.href = destino;
}

// === MOSTRAR/OCULTAR SENHA ===
window.toggleSenha = function () {
  const campo = document.getElementById('senhaLogin');
  const icone = document.getElementById('iconeOlho');
  const visivel = campo.type === 'text';
  campo.type = visivel ? 'password' : 'text';
  icone.src = visivel ? 'imagens/ocultar-senha.png' : 'imagens/revelar-senha.png';
  icone.alt = visivel ? 'Mostrar senha' : 'Ocultar senha';
};

// === TRADUÇÃO DE ERROS FIREBASE ===
function traduzErroFirebase(codigo) {
  switch (codigo) {
    case 'auth/user-not-found': return 'Usuário não encontrado.';
    case 'auth/wrong-password': return 'Senha incorreta.';
    case 'auth/invalid-email': return 'E-mail inválido.';
    case 'auth/missing-password': return 'Senha não informada.';
    case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/popup-blocked': return 'Pop-up bloqueado. Permita e tente novamente.';
    case 'auth/popup-closed-by-user': return 'Pop-up fechado antes da conclusão.';
    case 'auth/invalid-verification-code': return 'Código de verificação inválido.';
    case 'auth/missing-verification-code': return 'Informe o código recebido por SMS.';
    case 'auth/invalid-phone-number': return 'Número de telefone inválido.';
    case 'auth/code-expired': return 'O código expirou. Envie novamente.';
    default: return 'Erro desconhecido. Tente novamente.';
  }
}

// === FECHAR MENU LATERAL ===
document.addEventListener('click', function (event) {
  const menu = document.getElementById('menuNavegacao');
  const botao = document.querySelector('.hamburguer');
  const clicouFora = !menu.contains(event.target) && !botao.contains(event.target);
  if (menu && menu.style.display === 'flex' && clicouFora) {
    menu.style.display = 'none';
  }
});
