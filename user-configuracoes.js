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
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.appspot.com",
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
  
document.addEventListener("DOMContentLoaded", () => {
  const foto = document.getElementById("fotoPerfil");
  const input = document.getElementById("inputFotoPerfil");

  console.log("Foto encontrada:", !!foto);
  console.log("Input encontrado:", !!input);

  foto?.addEventListener("click", () => {
    console.log("Clique na imagem detectado");
  });

  input?.addEventListener("change", () => {
    console.log("Arquivo selecionado");
  });
});
  
  const inputFoto = document.getElementById("inputFotoPerfil");
  const imgPreview = document.getElementById("fotoPerfil");

  if (imgPreview && inputFoto) {
    imgPreview.addEventListener("click", () => {
      console.log("Clique na imagem detectado");
      inputFoto.click();
    });

    inputFoto.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function () {
        const previewUrl = reader.result;
        imgPreview.src = previewUrl;

        Swal.fire({
          title: 'Confirmar nova foto?',
          text: 'Deseja realmente usar esta imagem?',
          imageUrl: previewUrl,
          imageAlt: 'Pré-visualização',
          showCancelButton: true,
          confirmButtonText: 'Sim, salvar',
          cancelButtonText: 'Cancelar'
        }).then(async (confirm) => {
          if (confirm.isConfirmed) {
            try {
              const caminho = `usuarios/${user.uid}/avatar.jpg`;
              const storageRef = ref(storage, caminho);
              await uploadBytes(storageRef, file);

              const url = await getDownloadURL(storageRef);
              imgPreview.src = url;

              await Swal.fire('Sucesso', 'Foto de perfil atualizada!', 'success');
            } catch (error) {
              console.error(error);
              showAlertaErro('Erro ao salvar imagem', error.message || 'Falha desconhecida.');
            }
          } else {
            // Reverter para a imagem anterior
            const caminho = `usuarios/${user.uid}/avatar.jpg`;
            try {
              const url = await getDownloadURL(ref(storage, caminho));
              imgPreview.src = url;
            } catch {
              imgPreview.src = 'assets/perfil-padrao.jpg';
            }
          }
        });
      };

      reader.readAsDataURL(file);
    });
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

  document.querySelector(".alterar-email")?.addEventListener("click", async () => {
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

  document.querySelector(".alterar-senha")?.addEventListener("click", async () => {
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

  document.querySelector(".excluir-conta")?.addEventListener("click", async () => {
    const isSenha = user?.providerData[0]?.providerId === "password";
    if (isSenha) {
      const reauth = await reautenticarUsuario();
      if (!reauth) return;
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação é irreversível. Todos os seus dados serão excluídos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "usuarios", user.uid));

        const anunciosQuery = query(collection(db, "anuncios"), where("uid", "==", user.uid));
        const anunciosSnapshot = await getDocs(anunciosQuery);
        for (const docSnap of anunciosSnapshot.docs) {
          await deleteDoc(docSnap.ref);
        }

        await deleteUser(user);

        Swal.fire("Excluído", "Sua conta e dados foram removidos.", "success").then(() => {
          window.location.href = "index.html";
        });
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          Swal.fire("Sessão expirada", "Faça login novamente e tente excluir a conta.", "error");
        } else {
          showAlertaErro("Erro", "Falha ao excluir conta ou dados.");
        }
      }
    }
  });

  document.querySelector(".config-notificacoes")?.addEventListener("click", async () => {
    Swal.fire({
      title: 'Notificações',
      text: 'Configuração de notificações em breve.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  });
});

document.addEventListener("click", (e) => {
  const menu = document.getElementById("menuHamburguer");
  const botao = menu?.querySelector(".botao-menu");

  if (botao?.contains(e.target)) {
    menu.classList.toggle("ativo");
  } else if (!menu?.contains(e.target)) {
    menu?.classList.remove("ativo");
  }
});
