import {
  getAuth,
  sendPasswordResetEmail,
  updateEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();
const user = auth.currentUser;

function showAlertaErro(titulo, mensagem) {
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: mensagem,
    confirmButtonText: 'OK'
  });
}

function verificarLoginSenha() {
  return user?.providerData[0]?.providerId === "password";
}

// Reautenticar antes de ação sensível
async function reautenticarUsuario() {
  const { value: senha } = await Swal.fire({
    title: 'Confirme sua senha',
    input: 'password',
    inputPlaceholder: 'Digite sua senha',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off'
    },
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
    showAlertaErro("Indisponível", "A alteração de email só está disponível para contas com login por e-mail.");
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
    showAlertaErro("Indisponível", "Redefinição de senha só funciona com login por e-mail.");
    return;
  }

  const { isConfirmed } = await Swal.fire({
    title: 'Redefinir Senha',
    text: 'Deseja receber um link para redefinir sua senha?',
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
  if (!verificarLoginSenha()) {
    showAlertaErro("Indisponível", "Exclusão só disponível para login por email.");
    return;
  }

  const reauth = await reautenticarUsuario();
  if (!reauth) return;

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
      showAlertaErro("Erro", "Falha ao excluir conta.");
    }
  }
});
