// login.js
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updatePassword,
  updateEmail,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// === Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.appspot.com",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult = null;

// === Funções auxiliares ===
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
    'auth/invalid-credential': 'Credencial inválida. Tente novamente.'
  };
  return erros[codigo] || 'Erro desconhecido: ' + codigo;
}

function formatarTelefoneParaE164(input) {
  const numeros = input.replace(/\D/g, '');
  if (numeros.length === 11) return '+55' + numeros;
  if (numeros.length === 13 && numeros.startsWith('55')) return '+' + numeros;
  throw new Error('Telefone inválido. Use formato +55 (DDD) + número.');
}

function inicializarRecaptcha() {
  if (typeof window === 'undefined') return;
  if (window.recaptchaVerifier) return;

  // Garante que o container existe
  const container = document.getElementById('recaptcha-container');
  if (!container) {
    const div = document.createElement('div');
    div.id = 'recaptcha-container';
    document.body.appendChild(div);
  }

  try {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA resolvido
          console.log('reCAPTCHA verificado:', response);
        }
      },
      auth // <-- aqui estará corretamente inicializado
    );

    window.recaptchaVerifier.render().then(widgetId => {
      window.recaptchaWidgetId = widgetId;
      console.log('reCAPTCHA renderizado com ID:', widgetId);
    });
  } catch (error) {
    console.error("Erro ao inicializar reCAPTCHA:", error);
  }
}

function validarRegrasSenha(senha) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  if (!regex.test(senha)) {
    Swal.fire(
      'Senha fraca',
      'Use ao menos 8 caracteres com letras maiúsculas, minúsculas, número e caractere especial.',
      'warning'
    );
    return false;
  }
  return true;
}

function finalizarLogin(identificador) {
  localStorage.setItem('usuarioLogado', auth.currentUser?.uid || '');
  localStorage.setItem('usuarioTelefone', identificador);
  const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
  localStorage.removeItem('destinoAposLogin');
  Swal.fire('Bem-vindo!', 'Login realizado com sucesso.', 'success').then(() => {
    window.location.href = destino;
  });
}

// === E-mail e Senha ===
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
    finalizarLogin(userCredential.user.email);
  } catch (error) {
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
});

// === Google ===
window.loginComGoogle = async function () {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    finalizarLogin(result.user.email);
  } catch (error) {
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

// === Mostrar campos de telefone ===
window.exibirLoginTelefone = function () {
  inicializarRecaptcha();
  document.getElementById('formTelefone').style.display = 'block';
  document.querySelector('.telefone').style.display = 'none';
  document.getElementById('senhaContainer').style.display = 'none';
  document.getElementById('novoCadastroContainer').style.display = 'none';
  document.getElementById('codigoContainer').style.display = 'none';
  document.getElementById('btnAvancarTelefone').style.display = 'block';
};

// === Verifica se já existe conta com telefone ===
window.verificarTelefone = async function () {
  const telefoneInput = document.getElementById('telefoneLogin').value.trim();
  let numeroFormatado;

  try {
    numeroFormatado = formatarTelefoneParaE164(telefoneInput);
  } catch (e) {
    Swal.fire('Erro', e.message, 'error');
    return;
  }

  const emailFake = numeroFormatado + '@clickserra.com';

  try {
    const metodos = await fetchSignInMethodsForEmail(auth, emailFake);
    if (metodos.length > 0) {
      document.getElementById('senhaContainer').style.display = 'block';
      document.getElementById('btnAvancarTelefone').style.display = 'none';
    } else {
      confirmationResult = await signInWithPhoneNumber(auth, numeroFormatado, window.recaptchaVerifier);
      document.getElementById('codigoContainer').style.display = 'block';
      document.getElementById('btnAvancarTelefone').style.display = 'none';
      Swal.fire('Verificação', 'SMS enviado com sucesso.', 'success');
    }
  } catch (error) {
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

window.confirmarCodigoSMS = async function () {
  const codigo = document.getElementById('codigoSMS').value.trim();
  if (!codigo) {
    Swal.fire('Erro', 'Informe o código recebido por SMS.', 'error');
    return;
  }
  try {
    const result = await confirmationResult.confirm(codigo);
    document.getElementById('novoCadastroContainer').style.display = 'block';
    document.getElementById('codigoContainer').style.display = 'none';
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

window.criarContaTelefone = async function () {
  const user = auth.currentUser;
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha').value;

  if (!senha || !confirmar) return Swal.fire('Erro', 'Preencha ambos os campos de senha.', 'error');
  if (senha !== confirmar) return Swal.fire('Erro', 'As senhas não coincidem.', 'error');
  if (!validarRegrasSenha(senha)) return;

  try {
    const emailFake = user.phoneNumber + '@clickserra.com';
    await updateEmail(user, emailFake);
    await updatePassword(user, senha);
    finalizarLogin(user.phoneNumber);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

window.entrarTelefone = async function () {
  const telefoneInput = document.getElementById('telefoneLogin').value.trim();
  const senha = document.getElementById('senhaTelefone').value;
  try {
    const numeroFormatado = formatarTelefoneParaE164(telefoneInput);
    const userCredential = await signInWithEmailAndPassword(auth, numeroFormatado + '@clickserra.com', senha);
    finalizarLogin(userCredential.user.phoneNumber);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

window.esqueciSenha = async function () {
  const { value: entrada } = await Swal.fire({
    title: 'Recuperar Acesso',
    input: 'text',
    inputLabel: 'Informe seu email ou telefone:',
    inputPlaceholder: 'exemplo@email.com ou +55...',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    inputValidator: (value) => (!value ? 'Informe um valor!' : null)
  });

  if (!entrada) return;

  if (entrada.includes('@')) {
    try {
      await sendPasswordResetEmail(auth, entrada.trim());
      Swal.fire('Verifique seu email', 'Link de redefinição enviado.', 'success');
    } catch (err) {
      Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
    }
  } else {
    try {
      const numeroFormatado = formatarTelefoneParaE164(entrada.trim());
      inicializarRecaptcha();
      confirmationResult = await signInWithPhoneNumber(auth, numeroFormatado, window.recaptchaVerifier);
      const { value: codigo } = await Swal.fire({
        title: 'Código SMS',
        input: 'text',
        inputPlaceholder: 'Digite o código recebido',
        confirmButtonText: 'Verificar',
        inputValidator: (value) => (!value ? 'Informe o código!' : null)
      });
      if (!codigo) return;

      const result = await confirmationResult.confirm(codigo);
      const user = result.user;

      const { value: novaSenha } = await Swal.fire({
        title: 'Nova senha',
        input: 'password',
        inputPlaceholder: 'Digite a nova senha',
        confirmButtonText: 'Confirmar',
        inputAttributes: { minlength: 8, required: true },
        inputValidator: (value) => {
          if (!value) return 'Informe uma nova senha!';
          if (!validarRegrasSenha(value)) return 'Senha fraca.';
        }
      });

      if (!novaSenha) return;

      await updatePassword(user, novaSenha);
      Swal.fire('Senha redefinida!', 'Acesse com sua nova senha.', 'success');
    } catch (err) {
      Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
    }
  }
};

window.validarConfirmacaoSenha = function () {
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha');
  confirmar.style.borderColor = confirmar.value && confirmar.value !== senha ? 'red' : '';
};
