import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.firebasestorage.app",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function showAlertaErro(titulo, mensagem) {
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: mensagem,
    confirmButtonText: 'OK'
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    Swal.fire("Erro", "Usuário não autenticado", "error");
    return;
  }

  const isSenha = user.providerData[0]?.providerId === "password";

  async function reautenticarUsuario() {
    const { value: senha } = await Swal.fire({
      title: 'Confirme sua senha',
      input: 'password',
      inputPlaceholder: 'Digite sua senha atual',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!senha) return null;

    try {
      const cred = EmailAuthProvider.credential(user.email, senha);
      return await reauthenticateWithCredential(user, cred);
    } catch (error) {
      showAlertaErro("Erro de autenticação", "Senha incorreta ou sessão expirada.");
      return null;
    }
  }

  // ALTERAR SENHA
  document.querySelector(".alterar-senha")?.addEventListener("click", async () => {
    if (!isSenha) {
      showAlertaErro("Indisponível para contas Google/Facebook.");
      return;
    }

    const { value: opcao } = await Swal.fire({
      title: "Redefinir Senha",
      input: "radio",
      inputOptions: {
        redefinir: "Esqueci minha senha (receber email)",
        alterar: "Lembrar senha atual e alterar direto"
      },
      inputValidator: (value) => !value && "Escolha uma opção.",
      showCancelButton: true,
      confirmButtonText: "Continuar"
    });

    if (!opcao) return;

    if (opcao === "redefinir") {
      try {
        await sendPasswordResetEmail(auth, user.email);
        Swal.fire("Enviado", "Link enviado para seu email.", "success");
      } catch (error) {
        showAlertaErro("Erro", "Não foi possível enviar o email.");
      }
    }

    if (opcao === "alterar") {
      const reauth = await reautenticarUsuario();
      if (!reauth) return;

      const { value: formData } = await Swal.fire({
        title: "Alterar Senha",
        html: `
          <input id="novaSenha" type="password" placeholder="Nova senha" class="swal2-input">
          <input id="confirmarSenha" type="password" placeholder="Confirmar nova senha" class="swal2-input">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Atualizar",
        preConfirm: () => {
          const nova = document.getElementById("novaSenha").value;
          const confirmar = document.getElementById("confirmarSenha").value;

          if (!nova || !confirmar) return Swal.showValidationMessage("Preencha todos os campos.");
          if (nova !== confirmar) return Swal.showValidationMessage("As senhas não coincidem.");
          if (nova.length < 8) return Swal.showValidationMessage("Mínimo 8 caracteres.");
          if (!/[A-Z]/.test(nova)) return Swal.showValidationMessage("Inclua letra maiúscula.");
          if (!/[a-z]/.test(nova)) return Swal.showValidationMessage("Inclua letra minúscula.");
          if (!/\d/.test(nova)) return Swal.showValidationMessage("Inclua um número.");
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(nova)) return Swal.showValidationMessage("Inclua caractere especial.");
          if (nova === document.getElementById("novaSenha").value) return nova;
        }
      });

      if (formData) {
        try {
          await updatePassword(user, formData);
          Swal.fire("Sucesso", "Senha alterada com sucesso.", "success");
        } catch (error) {
          showAlertaErro("Erro", "Não foi possível alterar a senha.");
        }
      }
    }
  });

  // EXCLUIR CONTA
  document.querySelector(".excluir-conta")?.addEventListener("click", async () => {
    if (isSenha) {
      const reauth = await reautenticarUsuario();
      if (!reauth) return;
    }

    const { isConfirmed } = await Swal.fire({
      title: "Tem certeza?",
      text: "Sua conta e dados serão permanentemente apagados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar"
    });

    if (!isConfirmed) return;

    try {
      // Exclui imagem de perfil
      const fotoRef = ref(storage, `usuarios/${user.uid}/avatar.jpg`);
      await deleteObject(fotoRef).catch(() => {}); // ignora se não existir

      // Exclui documentos Firestore
      await deleteDoc(doc(db, "usuarios", user.uid));
      const anunciosQuery = query(collection(db, "anuncios"), where("uid", "==", user.uid));
      const anunciosSnapshot = await getDocs(anunciosQuery);
      for (const anuncio of anunciosSnapshot.docs) {
        await deleteDoc(anuncio.ref);
      }

      // Exclui conta
      await deleteUser(user);

      Swal.fire("Conta excluída", "Seus dados foram removidos.", "success").then(() => {
        window.location.href = "index.html";
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        showAlertaErro("Sessão expirada", "Faça login novamente e tente excluir a conta.");
      } else {
        showAlertaErro("Erro", "Erro ao excluir conta.");
      }
    }
  });

  // Notificações placeholder
  document.querySelector(".config-notificacoes")?.addEventListener("click", () => {
    Swal.fire("Em breve", "Configurações de notificações disponíveis em breve.", "info");
  });
});

// Fecha menu hambúrguer ao clicar fora
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menuHamburguer");
  const botao = menu?.querySelector(".botao-menu");
  if (botao?.contains(e.target)) {
    menu.classList.toggle("ativo");
  } else if (!menu?.contains(e.target)) {
    menu?.classList.remove("ativo");
  }
});

