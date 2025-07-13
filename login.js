// login.js

let app, auth;
let confirmationResult = null;

// === Inicializar Firebase ===
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

// === Inicializar reCAPTCHA ===
window.inicializarRecaptcha = function () {
  if (!window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: response => console.log('reCAPTCHA resolvido', response)
      });
      window.recaptchaVerifier.render().then(id => {
        window.recaptchaWidgetId = id;
        console.log('reCAPTCHA widget ID:', id);
      });
    } catch (err) {
      console.error("Erro ao inicializar reCAPTCHA:", err);
    }
  }
};

function traduzErroFirebase(code) {
  const mensagens = {
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
    'auth/operation-not-allowed': 'Este tipo de login não está ativado.'
  };
  return mensagens[code] || 'Erro desconhecido: ' + code;
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

// === Login por e-mail ===
document.getElementById('formLogin').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;
  if (!email || !senha) return Swal.fire('Atenção', 'Preencha e-mail e senha corretamente.', 'warning');

  try {
    const cred = await auth.signInWithEmailAndPassword(email, senha);
    finalizarLogin(cred.user.email);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
});

// === Google ===
window.loginComGoogle = async function () {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    finalizarLogin(result.user.email);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

window.exibirLoginTelefone = function () {
  document.getElementById('formTelefone').style.display = 'block';
  document.querySelector('.telefone').style.display = 'none';
  document.getElementById('senhaContainer').style.display = 'none';
  document.getElementById('novoCadastroContainer').style.display = 'none';
  document.getElementById('codigoContainer').style.display = 'none';
  document.getElementById('btnAvancarTelefone').style.display = 'block';
};

// === Verificar se telefone possui senha ou precisa cadastrar ===
window.verificarTelefone = async function () {
  const telefone = document.getElementById('telefoneLogin').value.trim();
  let numero;

  try {
    numero = formatarTelefoneParaE164(telefone);
  } catch (e) {
    return Swal.fire('Erro', e.message, 'error');
  }

  const emailFake = numero + '@clickserra.com';

  try {
    const methods = await auth.fetchSignInMethodsForEmail(emailFake);
    if (methods.length > 0) {
      document.getElementById('senhaContainer').style.display = 'block';
      document.getElementById('btnAvancarTelefone').style.display = 'none';
    } else {
      window.inicializarRecaptcha();
      confirmationResult = await auth.signInWithPhoneNumber(numero, window.recaptchaVerifier);
      document.getElementById('codigoContainer').style.display = 'block';
      document.getElementById('btnAvancarTelefone').style.display = 'none';
      Swal.fire('Verificação', 'SMS enviado com sucesso.', 'success');
    }
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

// === Confirmar código SMS ===
window.confirmarCodigoSMS = async function () {
  const codigo = document.getElementById('codigoSMS').value.trim();
  if (!codigo) return Swal.fire('Erro', 'Informe o código.', 'error');

  try {
    const result = await confirmationResult.confirm(codigo);
    document.getElementById('novoCadastroContainer').style.display = 'block';
    document.getElementById('codigoContainer').style.display = 'none';
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

// === Criar senha nova para telefone ===
window.cadastrarTelefone = async function () {
  const user = auth.currentUser;
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha').value;

  if (!senha || !confirmar) return Swal.fire('Erro', 'Preencha ambas as senhas.', 'error');
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

// === Entrar com telefone já com senha ===
window.entrarTelefone = async function () {
  const telefone = document.getElementById('telefoneLogin').value.trim();
  const senha = document.getElementById('senhaTelefone').value;

  try {
    const numero = formatarTelefoneParaE164(telefone);
    const cred = await auth.signInWithEmailAndPassword(numero + '@clickserra.com', senha);
    finalizarLogin(cred.user.phoneNumber);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

// === Esqueci minha senha ===
window.esqueciSenha = async function () {
  const { value: entrada } = await Swal.fire({
    title: 'Recuperar Acesso',
    input: 'text',
    inputLabel: 'Informe seu email ou telefone:',
    inputPlaceholder: 'exemplo@email.com ou +55...',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    inputValidator: value => (!value ? 'Informe um valor!' : null)
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
      const numero = formatarTelefoneParaE164(entrada.trim());
      window.inicializarRecaptcha();
      confirmationResult = await auth.signInWithPhoneNumber(numero, window.recaptchaVerifier);

      const { value: codigo } = await Swal.fire({
        title: 'Código SMS',
        input: 'text',
        inputPlaceholder: 'Digite o código recebido',
        confirmButtonText: 'Verificar',
        inputValidator: val => (!val ? 'Informe o código!' : null)
      });

      if (!codigo) return;
      const result = await confirmationResult.confirm(codigo);

      const { value: novaSenha } = await Swal.fire({
        title: 'Nova senha',
        input: 'password',
        inputPlaceholder: 'Digite a nova senha',
        confirmButtonText: 'Confirmar',
        inputAttributes: { minlength: 8, required: true },
        inputValidator: val => (!val ? 'Informe a nova senha!' : null)
      });

      if (!novaSenha) return;

      await result.user.updatePassword(novaSenha);
      Swal.fire('Senha redefinida!', 'Acesse com sua nova senha.', 'success');
    } catch (err) {
      Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
    }
  }
};

// === Validação visual da confirmação de senha ===
window.validarConfirmacaoSenha = function () {
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha');
  confirmar.style.borderColor = confirmar.value && confirmar.value !== senha ? 'red' : '';
};
