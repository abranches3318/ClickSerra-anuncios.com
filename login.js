// login.js
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updatePassword,
  updateEmail,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth } from "/ClickSerra-anuncios.com/firebase-config.js";

let confirmationResult;

// === Inicialização do reCAPTCHA invisível ===
try {
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: (response) => {
      console.log('reCAPTCHA resolvido automaticamente:', response);
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expirado.');
    }
  }, auth);

  window.recaptchaVerifier.render().then(widgetId => {
    window.recaptchaWidgetId = widgetId;
    console.log('reCAPTCHA renderizado com sucesso. Widget ID:', widgetId);
  });
} catch (e) {
  console.error('Erro ao inicializar reCAPTCHA:', e);
}

// === Tradução de erros do Firebase ===
function traduzErroFirebase(codigo) {
  const erros = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-disabled': 'Usuário desativado.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.',
    'auth/code-expired': 'Código expirado.',
    'auth/invalid-verification-code': 'Código inválido.',
    'auth/missing-verification-code': 'Código ausente.',
    'auth/missing-phone-number': 'Telefone ausente ou inválido.',
    'auth/invalid-phone-number': 'Telefone inválido.',
    'auth/invalid-credential': 'Credencial inválida. Tente novamente.',
  };
  return erros[codigo] || 'Erro desconhecido: ' + (codigo || 'erro-desconhecido');
}

// === Login com E-mail e Senha ===
document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;
  if (!email || !senha) return Swal.fire('Atenção', 'Preencha e-mail e senha corretamente.', 'warning');
  try {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    const user = cred.user;
    localStorage.setItem('usuarioLogado', user.uid);
    localStorage.setItem('usuarioEmail', user.email);
    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');
    Swal.fire('Bem-vindo!', 'Login realizado com sucesso.', 'success').then(() => window.location.href = destino);
  } catch (error) {
    console.error('Erro no login:', error);
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
    console.error('Erro no login com Google:', error);
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

// === Login com Telefone ===
window.exibirLoginTelefone = function () {
  document.getElementById('formTelefone').style.display = 'block';
  document.querySelector('.telefone').style.display = 'none';
};

window.verificarTelefone = async function () {
  const telefone = document.getElementById('telefoneLogin').value.trim();
  let numeroFormatado;

  if (!telefone) return Swal.fire('Atenção', 'Informe seu telefone.', 'warning');

  try {
    numeroFormatado = formatarTelefoneParaE164(telefone);
  } catch (e) {
    return Swal.fire('Erro', e.message, 'error');
  }

  try {
    await signInWithEmailAndPassword(auth, numeroFormatado + '@clickserra.com', 'verificacaoFake');
  } catch (error) {
    console.warn('Verificação de telefone falhou:', error);
    if (error.code === 'auth/wrong-password') {
      document.getElementById('senhaContainer').style.display = 'block';
    } else if (error.code === 'auth/user-not-found') {
      iniciarCadastroTelefone(numeroFormatado);
    } else {
      Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
    }
  }
};

async function iniciarCadastroTelefone(numeroFormatado) {
  try {
    confirmationResult = await signInWithPhoneNumber(auth, numeroFormatado, window.recaptchaVerifier);
    document.getElementById('codigoContainer').style.display = 'block';
    Swal.fire('Verificação', 'SMS enviado com sucesso.', 'success');
  } catch (smsError) {
    console.error('Erro SMS:', smsError);
    Swal.fire('Erro', traduzErroFirebase(smsError.code), 'error');
  }
}

window.confirmarCodigoSMS = async function () {
  const codigo = document.getElementById('codigoSMS').value.trim();
  if (!codigo) return Swal.fire('Erro', 'Informe o código recebido por SMS.', 'error');
  try {
    const result = await confirmationResult.confirm(codigo);
    const user = result.user;
    document.getElementById('novoCadastroContainer').style.display = 'block';
    document.getElementById('codigoContainer').style.display = 'none';
  } catch (err) {
    console.error('Erro ao confirmar SMS:', err);
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

window.cadastrarTelefone = async function () {
  const user = auth.currentUser;
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha').value;

  if (senha !== confirmar) return Swal.fire('Erro', 'As senhas não coincidem.', 'error');
  if (!validarRegrasSenha(senha)) return;

  try {
    const emailFake = user.phoneNumber + '@clickserra.com';
    await updateEmail(user, emailFake);
    await updatePassword(user, senha);
    finalizarLogin(user.phoneNumber);
  } catch (err) {
    console.error('Erro ao cadastrar telefone:', err);
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

window.entrarTelefone = async function () {
  const telefone = document.getElementById('telefoneLogin').value.trim();
  const senha = document.getElementById('senhaTelefone').value;
  try {
    const cred = await signInWithEmailAndPassword(auth, formatarTelefoneParaE164(telefone) + '@clickserra.com', senha);
    finalizarLogin(cred.user.phoneNumber);
  } catch (err) {
    console.error('Erro ao logar com telefone:', err);
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

function finalizarLogin(numero) {
  localStorage.setItem('usuarioLogado', auth.currentUser?.uid);
  localStorage.setItem('usuarioTelefone', numero);
  const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
  localStorage.removeItem('destinoAposLogin');
  Swal.fire('Bem-vindo!', 'Login realizado com sucesso.', 'success').then(() => window.location.href = destino);
}

function formatarTelefoneParaE164(input) {
  const numeros = input.replace(/\D/g, '');
  if (numeros.length === 11) return '+55' + numeros;
  if (numeros.length === 13 && numeros.startsWith('55')) return '+' + numeros;
  throw new Error('Telefone inválido. Use formato +55 (DDD) + número.');
}

function validarRegrasSenha(senha) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  if (!regex.test(senha)) {
    Swal.fire('Senha fraca', 'Use ao menos 8 caracteres com letras maiúsculas, minúsculas, número e caractere especial.', 'warning');
    return false;
  }
  return true;
}

window.validarConfirmacaoSenha = function () {
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha');
  confirmar.style.borderColor = confirmar.value && confirmar.value !== senha ? 'red' : '';
}
