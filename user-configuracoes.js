import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ CONFIGURAÇÃO DO FIREBASE (sua chave abaixo)
const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.appspot.com",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9"
};

// ✅ Inicializa o app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Função de alerta de erro
function showAlertaErro(titulo, mensagem) {
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: mensagem,
    confirmButtonText: 'OK'
  });
}

// Envolve tudo em onAuthStateChanged
onAuthStateChanged(auth, (user) => {
  if (!user) {
    Swal.fire("Erro", "Usuário não autenticado", "error");
    return;
  }

  function verificarLoginSenha() {
    return user?.providerData[0]?.providerId === "password";
  }

  async function reautenticarUsuario() {
    const { value: senha } = await Swal.fire({
      title: 'Confirme sua senha',
      input: 'password',
      inputPlaceholder: 'Digite sua senha',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!senha) return null;

    try {
      const cred = EmailAuthProvider.credential(user.email, senha);
      return await reauthenticateWithCredential(user, cred);
    } catch (error) {
      showAlertaErro("Falha na autenticação", "Senha incorreta ou sessão expirada.");
      return null;
    }
  }

  // Alterar Email
  document.querySelector(".alterar-email").addEventListener("click", async () => {
    if (!verificarLoginSenha()) {
      showAlertaErro("Indisponível para contas Google/Facebook.");
      return;
    }

    const reauth = await reautenticarUsuario();
    if (!reauth) return;

    const { value: novoEmail } = await Swal.fire({
      title: 'Novo Email',
      input: 'email',
      inputLabel: 'Digite seu novo email',
      inputPlaceholder: 'usuario@email.com',
      showCancelButton: true
    });

    if (novoEmail) {
      try {
        await updateEmail(user, novoEmail);
        Swal.fire('Sucesso', 'Email atualizado com sucesso.', 'success');
      } catch (error) {
        showAlertaErro("Erro", "Falha ao atualizar o email.");
      }
    }
  });

  // Alterar Senha
  document.querySelector(".alterar-senha").addEventListener("click", async () => {
    if (!verificarLoginSenha()) {
      showAlertaErro("Indisponível para contas Google/Facebook.");
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Redefinir Senha',
      text: 'Deseja receber um link de redefinição?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        Swal.fire("Enviado", "Email de redefinição enviado.", "success");
      } catch (error) {
        showAlertaErro("Erro", "Não foi possível enviar o email.");
      }
    }
  });

// Excluir Conta
document.querySelector(".excluir-conta").addEventListener("click", async () => {
  const isSenha = user?.providerData[0]?.providerId === "password";

  // Reautenticar se for usuário com email/senha
  if (isSenha) {
    const reauth = await reautenticarUsuario();
    if (!reauth) return;
  }

  const { isConfirmed } = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação é irreversível.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  });

  if (isConfirmed) {
    try {
      await deleteUser(user);
      Swal.fire("Excluído", "Sua conta foi removida.", "success").then(() => {
        window.location.href = "index.html";
      });
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Swal.fire("Sessão expirada", "Faça login novamente e tente excluir a conta.", "error");
      } else {
        showAlertaErro("Erro", "Falha ao excluir conta.");
      }
    }
  }
});

// Menu hambúrguer (fora de onAuthStateChanged, pois não depende de login)
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menuHamburguer");
  const botao = menu?.querySelector(".botao-menu");

  if (botao?.contains(e.target)) {
    menu.classList.toggle("ativo");
  } else if (!menu?.contains(e.target)) {
    menu?.classList.remove("ativo");
  }
});
