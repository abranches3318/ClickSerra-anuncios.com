let app, auth;

function inicializarFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
    authDomain: "clickserra-anuncios.firebaseapp.com",
    projectId: "clickserra-anuncios",
    storageBucket: "clickserra-anuncios.appspot.com",
    messagingSenderId: "251868045964",
    appId: "1:251868045964:web:34f527f3d7c380746211a9"
  };
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
}

inicializarFirebase();

function traduzErroFirebase(code) {
  const mensagens = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-disabled': 'Usuário desativado.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.'
  };
  return mensagens[code] || 'Erro desconhecido: ' + code;
}

function finalizarLogin(identificador) {
  localStorage.setItem('usuarioLogado', auth.currentUser?.uid || '');
  localStorage.setItem('usuarioEmail', identificador);
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

  if (!email || !senha) {
    return Swal.fire('Atenção', 'Preencha e-mail e senha corretamente.', 'warning');
  }

  try {
    const cred = await auth.signInWithEmailAndPassword(email, senha);
    finalizarLogin(cred.user.email);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
});

// === Login com Google ===
window.loginComGoogle = async function () {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    finalizarLogin(result.user.email);
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

// === Esqueci minha senha ===
window.esqueciSenha = async function () {
  const { value: email } = await Swal.fire({
    title: 'Recuperar Acesso',
    input: 'email',
    inputLabel: 'Informe seu e-mail:',
    inputPlaceholder: 'exemplo@email.com',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    inputValidator: val => (!val ? 'Informe um e-mail!' : null)
  });

  if (!email) return;

  try {
    await auth.sendPasswordResetEmail(email.trim());
    Swal.fire('Verifique seu e-mail', 'Link de redefinição enviado.', 'success');
  } catch (err) {
    Swal.fire('Erro', traduzErroFirebase(err.code), 'error');
  }
};

// Mostrar/ocultar senha ou confirmar senha
window.toggleSenha = function (campoId, iconeId) {
  const campo = document.getElementById(campoId);
  const icone = document.getElementById(iconeId);

  const mostrando = campo.type === 'text';
  campo.type = mostrando ? 'password' : 'text';

  icone.src = mostrando ? 'imagens/ocultar-senha.png' : 'imagens/revelar-senha.png';
  icone.alt = mostrando ? 'Mostrar senha' : 'Ocultar senha';
};


