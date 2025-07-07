import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "/ClickSerra-anuncios.com/firebase-config.js";

// 🔐 SweetAlert padrão de erro
function erro(titulo, mensagem) {
  Swal.fire({ icon: 'error', title: titulo, text: mensagem });
}

// ✅ Login com email e senha
document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  if (!email || !senha) return erro('Atenção', 'Preencha email e senha');

  try {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    Swal.fire({ icon: 'success', title: 'Bem-vindo!', text: 'Login realizado com sucesso' })
      .then(() => window.location.href = 'index.html');
  } catch (err) {
    erro('Erro ao logar', traduzErroFirebase(err.code));
  }
});

// ✅ Login com Google
window.loginComGoogle = async function () {
  try {
    const provedor = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provedor);
    Swal.fire({ icon: 'success', title: 'Google conectado!', text: 'Login realizado com sucesso' })
      .then(() => window.location.href = 'index.html');
  } catch (err) {
    erro('Erro Google', traduzErroFirebase(err.code));
  }
};

// ✅ Mostrar/ocultar senha
window.toggleSenha = function () {
  const campo = document.getElementById('senhaLogin');
  const icone = document.getElementById('iconeOlho');
  const mostrando = campo.type === 'text';
  campo.type = mostrando ? 'password' : 'text';
  icone.src = mostrando ? 'imagens/ocultar-senha.png' : 'imagens/revelar-senha.png';
  icone.alt = mostrando ? 'Mostrar senha' : 'Ocultar senha';
};

// ✅ Iniciar fluxo de login com telefone
window.iniciarLoginTelefone = function () {
  const div = document.getElementById('areaTelefone');
  div.style.display = 'block';
  document.getElementById('btnTelefone').style.display = 'none';
};

// ✅ Enviar SMS
window.enviarCodigoSMS = async function () {
  const tel = document.getElementById('telefoneLogin').value.trim();
  const senha = document.getElementById('senhaTelefone').value;

  if (!tel || !senha) return erro('Campos obrigatórios', 'Preencha telefone e senha');

  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible'
    });

    const provedor = new PhoneAuthProvider(auth);
    const verifId = await provedor.verifyPhoneNumber(tel, window.recaptchaVerifier);

    // Oculta inputs, exibe campo do código
    document.getElementById('areaTelefone').style.display = 'none';
    document.getElementById('codigoContainer').style.display = 'block';
    window.confirmationResult = { verifId, tel, senha };

  } catch (err) {
    erro('Erro ao enviar SMS', traduzErroFirebase(err.code));
  }
};

// ✅ Confirmar código do SMS
window.confirmarCodigoSMS = async function () {
  const cod = document.getElementById('codigoSMS').value.trim();
  if (!cod) return erro('Atenção', 'Informe o código recebido');

  try {
    const cred = PhoneAuthProvider.credential(window.confirmationResult.verifId, cod);
    const res = await signInWithCredential(auth, cred);

    Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Login com telefone realizado' })
      .then(() => window.location.href = 'index.html');

  } catch (err) {
    erro('Código inválido', traduzErroFirebase(err.code));
  }
};

// 🔁 Tradutor de erros do Firebase
function traduzErroFirebase(codigo) {
  switch (codigo) {
    case 'auth/user-not-found': return 'Usuário não encontrado.';
    case 'auth/wrong-password': return 'Senha incorreta.';
    case 'auth/invalid-email': return 'E-mail inválido.';
    case 'auth/missing-password': return 'Senha não informada.';
    case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/popup-blocked': return 'Navegador bloqueou o pop-up.';
    case 'auth/popup-closed-by-user': return 'Pop-up fechado antes da conclusão.';
    case 'auth/cancelled-popup-request': return 'Solicitação cancelada.';
    case 'auth/invalid-verification-code': return 'Código inválido.';
    case 'auth/invalid-phone-number': return 'Telefone inválido.';
    default: return 'Erro desconhecido. Tente novamente.';
  }
}

// ✅ Fecha menu lateral ao clicar fora
document.addEventListener('click', e => {
  const menu = document.getElementById('menuNavegacao');
  const botao = document.querySelector('.hamburguer');
  if (menu && !menu.contains(e.target) && !botao.contains(e.target)) {
    menu.style.display = 'none';
  }
});
