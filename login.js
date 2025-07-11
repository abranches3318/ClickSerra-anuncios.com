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
import { auth } from "/ClickSerra-anuncios.com/firebase-config.js";

let confirmationResult;

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
  if (!window.recaptchaVerifier && auth) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
      window.recaptchaVerifier.render();
    } catch (error) {
      console.error("Erro ao inicializar reCAPTCHA:", error);
    }
  }
}

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

// === Mostrar formulário de login com telefone ===
window.exibirLoginTelefone = function () {
  inicializarRecaptcha();
  document.getElementById('formTelefone').style.display = 'block';
  document.querySelector('.telefone').style.display = 'none';
  document.getElementById('senhaContainer').style.display = 'none';
  document.getElementById('novoCadastroContainer').style.display = 'none';
  document.getElementById('codigoContainer').style.display = 'none';
  document.getElementById('btnAvancarTelefone').style.display = 'block';
};

// === Verificar telefone e decidir fluxo login/cadastro ===
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
      // Usuário existe, pedir senha
      document.getElementById('senhaContainer').style.display = 'block';
      document.getElementById('btnAvancarTelefone').style.display = 'none';
      document.getElementById('novoCadastroContainer').style.display = 'none';
    } else {
      // Usuário não existe, iniciar cadastro via SMS
      try {
        confirmationResult = await signInWithPhoneNumber(auth, numeroFormatado, window.recaptchaVerifier);
        document.getElementById('codigoContainer').style.display = 'block';
        document.getElementById('btnAvancarTelefone').style.display = 'none';
        Swal.fire('Verificação', 'SMS enviado com sucesso.', 'success');
      } catch (smsError) {
        Swal.fire('Erro', traduzErroFirebase(smsError.code), 'error');
      }
    }
  } catch (error) {
    Swal.fire('Erro', traduzErroFirebase(error.code), 'error');
  }
};

// === Confirmar código SMS para cadastro ===
window.confirmarCodigoSMS = async function () {
  const codigo = document.getElementById('codigoSMS').value.trim();
  if (!codigo) {
    Swal.fire('Erro', 'Informe o código recebido por SMS.', 'error');
    return;
  }
  try {
    const result = await confirmationResult.confirm(codigo);
    // Usuário autenticado via telefone, mostrar campos de criação de senha
    document.getElementById('novoCadastroContainer').style.display = 'block';
    document.getElementById('codigoContainer').style.display = 'none';
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

// === Criar conta com telefone (definir senha e email fake) ===
window.criarContaTelefone = async function () {
  const user = auth.currentUser;
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha').value;

  if (!senha || !confirmar) {
    Swal.fire('Erro', 'Preencha ambos os campos de senha.', 'error');
    return;
  }

  if (senha !== confirmar) {
    Swal.fire('Erro', 'As senhas não coincidem.', 'error');
    return;
  }

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

// === Entrar com telefone e senha ===
window.entrarTelefone = async function () {
  const telefoneInput = document.getElementById('telefoneLogin').value.trim();
  const senha = document.getElementById('senhaTelefone').value;
  let numeroFormatado;

  try {
    numeroFormatado = formatarTelefoneParaE164(telefoneInput);
  } catch (e) {
    Swal.fire('Erro', e.message, 'error');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, numeroFormatado + '@clickserra.com', senha);
    finalizarLogin(userCredential.user.phoneNumber);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

// === Recuperar senha ===
window.esqueciSenha = async function () {
  const { value: entrada } = await Swal.fire({
    title: 'Recuperar Acesso',
    input: 'text',
    inputLabel: 'Informe seu email ou telefone:',
    inputPlaceholder: 'exemplo@email.com ou +55...',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    inputValidator: (value) => {
      if (!value) return 'Informe um valor!';
    }
  });

  if (!entrada) return;

  if (entrada.includes('@')) {
    // Reset via email
    try {
      await sendPasswordResetEmail(auth, entrada.trim());
      Swal.fire('Verifique seu email', 'Link de redefinição enviado.', 'success');
    } catch (err) {
      Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
    }
  } else {
    // Reset via telefone
    let numeroFormatado;
    try {
      numeroFormatado = formatarTelefoneParaE164(entrada.trim());
    } catch (e) {
      Swal.fire('Erro', e.message, 'error');
      return;
    }

    try {
      inicializarRecaptcha();
      confirmationResult = await signInWithPhoneNumber(auth, numeroFormatado, window.recaptchaVerifier);

      const { value: codigo } = await Swal.fire({
        title: 'Informe o código',
        input: 'text',
        inputPlaceholder: 'Código SMS',
        confirmButtonText: 'Verificar',
        inputValidator: (value) => {
          if (!value) return 'Informe o código!';
        }
      });

      if (!codigo) return;

      const result = await confirmationResult.confirm(codigo);
      const user = result.user;

      const { value: novaSenha } = await Swal.fire({
        title: 'Nova senha',
        input: 'password',
        inputPlaceholder: 'Digite a nova senha',
        inputAttributes: { minlength: 8, required: true },
        confirmButtonText: 'Confirmar',
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

// === Validação das regras da senha ===
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

// === Finalizar login ===
function finalizarLogin(numeroFormatado) {
  localStorage.setItem('usuarioLogado', auth.currentUser?.uid || '');
  localStorage.setItem('usuarioTelefone', numeroFormatado);
  const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
  localStorage.removeItem('destinoAposLogin');
  Swal.fire('Bem-vindo!', 'Login realizado com sucesso.', 'success').then(() => {
    window.location.href = destino;
  });
}

// === Confirmação visual de senha ===
window.validarConfirmacaoSenha = function () {
  const senha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha');
  confirmar.style.borderColor = confirmar.value && confirmar.value !== senha ? 'red' : '';
};
