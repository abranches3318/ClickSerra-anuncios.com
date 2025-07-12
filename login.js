// login.js

let auth, app;
let confirmationResult = null;

// Inicializa Firebase
function inicializarFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
    authDomain: "clickserra-anuncios.firebaseapp.com",
    databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
    projectId: "clickserra-anuncios",
    storageBucket: "clickserra-anuncios.appspot.com",
    messagingSenderId: "251868045964",
    appId: "1:251868045964:web:34f527f3d7c380746211a9"
  };

  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
}

inicializarFirebase();

// Função global
window.inicializarRecaptcha = function () {
  if (!window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => console.log('reCAPTCHA resolvido', response)
      });
      window.recaptchaVerifier.render().then(widgetId => {
        window.recaptchaWidgetId = widgetId;
        console.log('reCAPTCHA widget ID:', widgetId);
      });
    } catch (err) {
      console.error("Erro ao inicializar reCAPTCHA:", err);
    }
  }
};

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

function finalizarLogin(identificador) {
  localStorage.setItem('usuarioLogado', auth.currentUser?.uid || '');
  localStorage.setItem('usuarioTelefone', identificador);
  const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
  localStorage.removeItem('destinoAposLogin');
  Swal.fire('Bem-vindo!', 'Login realizado com sucesso.', 'success').then(() => {
    window.location.href = destino;
  });
}

// === E-mail e senha ===
document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;
  if (!email || !senha) {
    Swal.fire('Atenção', 'Preencha e-mail e senha corretamente.', 'warning');
    return;
  }
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, senha);
    finalizarLogin(userCredential.user.email);
  } catch (error) {
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
});

// === Google ===
window.loginComGoogle = async function () {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    finalizarLogin(result.user.email);
  } catch (error) {
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

// === Exibir Login Telefone ===
window.exibirLoginTelefone = function () {
  document.getElementById('formTelefone').style.display = 'block';
  document.querySelector('.telefone').style.display = 'none';
  document.getElementById('senhaContainer').style.display = 'none';
  document.getElementById('novoCadastroContainer').style.display = 'none';
  document.getElementById('codigoContainer').style.display = 'none';
  document.getElementById('btnAvancarTelefone').style.display = 'block';
};

// === Verificar Telefone ===
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
    const methods = await auth.fetchSignInMethodsForEmail(emailFake);
    if (methods.length > 0) {
      document.getElementById('senhaContainer').style.display = 'block';
      document.getElementById('btnAvancarTelefone').style.display = 'none';
    } else {
      window.inicializarRecaptcha();
      confirmationResult = await auth.signInWithPhoneNumber(numeroFormatado, window.recaptchaVerifier);
      document.getElementById('codigoContainer').style.display = 'block';
      document.getElementById('btnAvancarTelefone').style.display = 'none';
      Swal.fire('Verificação', 'SMS enviado com sucesso.', 'success');
    }
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
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

window.cadastrarTelefone = async function () {
  const user = auth.currentUser;
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha').value;

  if (!senha || !confirmar) return Swal.fire('Erro', 'Preencha ambos os campos de senha.', 'error');
  if (senha !== confirmar) return Swal.fire('Erro', 'As senhas não coincidem.', 'error');

  try {
    const emailFake = user.phoneNumber + '@clickserra.com';
    await user.updateEmail(emailFake);
    await user.updatePassword(senha);
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
    const userCredential = await auth.signInWithEmailAndPassword(numeroFormatado + '@clickserra.com', senha);
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
      await auth.sendPasswordResetEmail(entrada.trim());
      Swal.fire('Verifique seu email', 'Link de redefinição enviado.', 'success');
    } catch (err) {
      Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
    }
  } else {
    try {
      const numeroFormatado = formatarTelefoneParaE164(entrada.trim());
      window.inicializarRecaptcha();
      confirmationResult = await auth.signInWithPhoneNumber(numeroFormatado, window.recaptchaVerifier);
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
        inputValidator: (value) => (!value ? 'Informe a nova senha!' : null)
      });

      if (!novaSenha) return;

      await user.updatePassword(novaSenha);
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
