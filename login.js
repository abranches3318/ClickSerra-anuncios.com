// login.js

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "/ClickSerra-anuncios.com/firebase-config.js";

// === Login com E-mail e Senha ===
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

    localStorage.setItem('usuarioLogado', user.uid);
    localStorage.setItem('usuarioEmail', user.email);

    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');

    Swal.fire('Bem-vindo!', 'Login realizado com sucesso.', 'success')
      .then(() => window.location.href = destino);

  } catch (error) {
    console.error("Erro no login:", error);
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
});

// === Login com Google ===
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

    Swal.fire('Bem-vindo!', 'Login com Google realizado com sucesso.', 'success')
      .then(() => window.location.href = destino);

  } catch (error) {
    console.error("Erro no login com Google:", error);
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

// === Login com Telefone ===
let confirmationResult;

window.enviarCodigoSMS = async function () {
  const telefone = document.getElementById('telefoneLogin').value;
  const senha = document.getElementById('senhaTelefone').value;

  try {
    const numeroFormatado = formatarTelefoneParaE164(telefone);

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'enviarSMS', {
      size: 'invisible',
      callback: () => enviarCodigoSMS()
    });

    confirmationResult = await signInWithPhoneNumber(auth, numeroFormatado, window.recaptchaVerifier);

    document.getElementById('codigoContainer').style.display = 'block';
    document.getElementById('enviarSMS').style.display = 'none';
    document.getElementById('telefoneLogin').disabled = true;
    document.getElementById('senhaTelefone').disabled = true;
  
    Swal.fire('Código enviado!', 'Verifique seu SMS.', 'success');
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

window.confirmarCodigoSMS = async function () {
  const codigo = document.getElementById('codigoSMS').value;

  if (!codigo) {
    Swal.fire('Erro', 'Informe o código recebido por SMS.', 'error');
    return;
  }

  try {
    const result = await confirmationResult.confirm(codigo);
    const user = result.user;

    localStorage.setItem('usuarioLogado', user.uid);
    localStorage.setItem('usuarioTelefone', user.phoneNumber);

    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');

    Swal.fire('Bem-vindo!', 'Login com telefone realizado com sucesso.', 'success')
      .then(() => window.location.href = destino);

  } catch (error) {
    console.error('Erro ao confirmar código:', error);
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

function formatarTelefoneParaE164(input) {
  const numeros = input.replace(/\D/g, '');
  if (numeros.length === 11) return '+55' + numeros;
  throw new Error('Telefone inválido. Formato esperado: (DDD) número com 11 dígitos.');
}

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
    case 'auth/user-not-found': return 'Usuário não encontrado.';
    case 'auth/wrong-password': return 'Senha incorreta.';
    case 'auth/invalid-email': return 'E-mail inválido.';
    case 'auth/missing-password': return 'Senha não informada.';
    case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/popup-blocked': return 'O navegador bloqueou o pop-up. Permita e tente novamente.';
    case 'auth/popup-closed-by-user': return 'O pop-up foi fechado antes da conclusão.';
    case 'auth/cancelled-popup-request': return 'A solicitação de login foi cancelada.';
    case 'auth/invalid-phone-number': return 'Número de telefone inválido.';
    case 'auth/code-expired': return 'O código expirou. Reenvie o SMS.';
    case 'auth/invalid-verification-code': return 'Código inválido. Verifique o SMS.';
    default: return 'Erro desconhecido. Tente novamente.';
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
