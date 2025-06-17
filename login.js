import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);

document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  if (!email || !senha) {
    alert('Preencha e-mail e senha corretamente.');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Redireciona para destino salvo (ou index)
    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');

    alert('Login realizado com sucesso!');
    window.location.href = destino;

  } catch (error) {
    console.error("Erro no login:", error.message);
    alert("Erro ao fazer login: " + traduzErroFirebase(error.code));
  }
});

// Tradutor de códigos de erro do Firebase
function traduzErroFirebase(codigo) {
  switch (codigo) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    default:
      return 'Erro desconhecido. Tente novamente.';
  }
}
