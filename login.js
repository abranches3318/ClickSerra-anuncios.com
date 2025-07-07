import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updatePassword,
  updateEmail
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
    Swal.fire('Bem-vindo!', 'Login realizado com sucesso.', 'success').then(() => window.location.href = destino);
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
    Swal.fire('Bem-vindo!', 'Login com Google realizado com sucesso.', 'success').then(() => window.location.href = destino);
  } catch (error) {
    console.error("Erro no login com Google:", error);
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

// === Login com Telefone ===
let confirmationResult;

window.iniciarLoginTelefone = async function () {
  const telefone = document.getElementById('telefoneLogin').value.trim();
  const senha = document.getElementById('senhaTelefone').value;
  if (!telefone || !senha) {
    Swal.fire('Atenção', 'Informe telefone e senha.', 'warning');
    return;
  }
  try {
    const numeroFormatado = formatarTelefoneParaE164(telefone);
    await signInWithEmailAndPassword(auth, numeroFormatado + '@clickserra.com', senha);
    localStorage.setItem('usuarioLogado', auth.currentUser.uid);
    localStorage.setItem('usuarioTelefone', numeroFormatado);
    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');
    Swal.fire('Bem-vindo!', 'Login com telefone realizado com sucesso.', 'success').then(() => window.location.href = destino);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      try {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
          await window.recaptchaVerifier.render();
        }
        confirmationResult = await signInWithPhoneNumber(auth, formatarTelefoneParaE164(telefone), window.recaptchaVerifier);
        document.getElementById('codigoContainer').style.display = 'block';
        document.getElementById('btnEnviarSMS').style.display = 'none';
        document.getElementById('telefoneLogin').disabled = true;
        document.getElementById('senhaTelefone').disabled = true;
        Swal.fire('Código enviado!', 'Verifique seu SMS para concluir.', 'success');
      } catch (smsError) {
        console.error('Erro ao enviar SMS:', smsError);
        Swal.fire('Erro', traduzErroFirebase(smsError.code), 'error');
      }
    } else {
      console.error('Erro no login com telefone:', error);
      Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
    }
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
    const emailFake = user.phoneNumber + '@clickserra.com';
    const senha = document.getElementById('senhaTelefone').value;
    await updateEmail(user, emailFake);
    await updatePassword(user, senha);
    localStorage.setItem('usuarioLogado', user.uid);
    localStorage.setItem('usuarioTelefone', user.phoneNumber);
    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');
    Swal.fire('Cadastro concluído!', 'Login realizado com sucesso.', 'success').then(() => window.location.href = destino);
  } catch (error) {
    console.error('Erro ao confirmar código:', error);
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

function formatarTelefoneParaE164(input) {
  const numeros = input.replace(/\D/g, '');
  if (numeros.length === 11) return '+55' + numeros;
  if (numeros.length === 13 && numeros.startsWith('55')) return '+' + numeros;
  throw new Error('Telefone inválido. Use formato +55 (DDD) número.');
}

window.toggleSenha = function (campoId, iconeId) {
  const campo = document.getElementById(campoId);
  const icone = document.getElementById(iconeId);
  const mostrando = campo.type === 'text';
  campo.type = mostrando ? 'password' : 'text';
  icone.src = mostrando ? 'imagens/ocultar-senha.png' : 'imagens/revelar-senha.png';
  icone.alt = mostrando ? 'Mostrar senha' : 'Ocultar senha';
};

window.exibirLoginTelefone = function () {
  document.getElementById('formTelefone').style.display = 'block';
  document.querySelector('.telefone').style.display = 'none';
};

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

document.addEventListener('click', function (event) {
  const menu = document.getElementById('menuNavegacao');
  const botao = document.querySelector('.hamburguer');
  if (menu && menu.style.display === 'flex' && !menu.contains(event.target) && !botao.contains(event.target)) {
    menu.style.display = 'none';
  }
});
