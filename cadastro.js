import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { setDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Cadastro com e-mail e senha
document.getElementById('formCadastro').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha.length < 6) {
    alert('A senha deve ter no mínimo 6 caracteres.');
    return;
  }

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem.');
    return;
  }

  try {
    // Cria o usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Espera a autenticação estar ativa
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth && userAuth.uid === user.uid) {
        try {
          await setDoc(doc(db, "users", user.uid), {
            nome: nome,
            email: email,
            criadoEm: new Date()
          });

          alert("Cadastro realizado com sucesso!");
          window.location.href = "index.html";
        } catch (erroFirestore) {
          console.error("Erro ao salvar no Firestore:", erroFirestore);
          alert("Erro ao salvar dados no Firestore.");
        }
      }
    });

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Este e-mail já está cadastrado.");
    } else if (error.code === "auth/weak-password") {
      alert("A senha deve ter no mínimo 6 caracteres.");
    } else {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar: " + error.message);
    }
  }
});

// Cadastro/Login com Google
window.loginComGoogle = async function () {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Verifica se o usuário já existe no Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Usuário novo — salva no Firestore
      await setDoc(docRef, {
        nome: user.displayName || "",
        email: user.email,
        criadoEm: new Date()
      });
    }

    localStorage.setItem('usuarioLogado', user.uid);
    localStorage.setItem('usuarioEmail', user.email);
    localStorage.setItem('usuarioNome', user.displayName || '');

    alert("Login com Google realizado com sucesso!");
    window.location.href = "index.html";

  } catch (error) {
    console.error("Erro no login com Google:", error);
    alert("Erro ao fazer login com Google: " + traduzErroFirebase(error.code));
  }
};

// Traduz erros Firebase
function traduzErroFirebase(codigo) {
  switch (codigo) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/missing-password':
      return 'Senha não informada.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou o pop-up. Permita e tente novamente.';
    case 'auth/popup-closed-by-user':
      return 'O pop-up foi fechado antes da conclusão.';
    case 'auth/cancelled-popup-request':
      return 'A solicitação de login foi cancelada.';
    default:
      return 'Erro desconhecido. Tente novamente.';
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

// Mostrar/ocultar senha ou confirmar senha
window.toggleSenha = function (campoId, iconeId) {
  const campo = document.getElementById(campoId);
  const icone = document.getElementById(iconeId);

  const mostrando = campo.type === 'text';
  campo.type = mostrando ? 'password' : 'text';

  icone.src = mostrando ? 'imagens/ocultar-senha.png' : 'imagens/revelar-senha.png';
  icone.alt = mostrando ? 'Mostrar senha' : 'Ocultar senha';
};
