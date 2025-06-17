import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

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

    // Redireciona para destino salvo (ou para a index.html se não houver)
    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');

    alert('Login realizado com sucesso!');
    window.location.href = destino;

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login: " + traduzErroFirebase(error.code));
  }
});

// Função para traduzir mensagens de erro do Firebase
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
    default:
      return 'Erro desconhecido. Tente novamente.';
  }
}
