import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  signOut,
  PhoneAuthProvider,
  updatePhoneNumber,
  multiFactor
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

function showError(t, m) {
  Swal.fire({ icon: 'error', title: t, text: m });
}

function promptAlterarSenha(user) {
  Swal.fire({
    title: 'Alterar Senha',
    html:
      `<input type="password" id="oldPwd" class="swal2-input" placeholder="Senha atual">
       <input type="password" id="newPwd" class="swal2-input" placeholder="Nova senha">
       <input type="password" id="confPwd" class="swal2-input" placeholder="Confirmar nova senha">
       <div style="font-size:0.9em;margin-top:5px;">
         <a href="#" id="esqueciLink">Esqueci minha senha</a>
       </div>`,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const oldPwd = Swal.getPopup().querySelector('#oldPwd').value;
      const newPwd = Swal.getPopup().querySelector('#newPwd').value;
      const confPwd = Swal.getPopup().querySelector('#confPwd').value;
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!oldPwd || !newPwd || !confPwd) throw 'Preencha todos os campos';
      if (newPwd !== confPwd) throw 'As senhas novas não conferem';
      if (!regex.test(newPwd)) throw 'Nova senha não atende requisitos (8+, maiúscula, minúscula, número, especial)';
      if (oldPwd === newPwd) throw 'A nova senha deve ser diferente da atual';
      return { oldPwd, newPwd };
    },
    didOpen: () => {
      Swal.getPopup().querySelector('#esqueciLink')
        .addEventListener('click', e => {
          e.preventDefault();
          sendPasswordResetEmail(auth, auth.currentUser.email)
            .then(() => Swal.fire('Enviado', 'Verifique seu email para redefinir a senha', 'success'))
            .catch(err => showError('Erro', err.message));
        });
    }
  }).then(async res => {
    if (res.isConfirmed) {
      try {
        const cred = EmailAuthProvider.credential(user.email, res.value.oldPwd);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, res.value.newPwd);
        Swal.fire('Sucesso', 'Senha alterada!', 'success');
      } catch (err) {
        showError('Erro ao alterar', err.message);
      }
    }
  });
}

async function handleExcluirConta(user) {
  try {
    const { isConfirmed } = await Swal.fire({
      title: 'Excluir conta',
      text: 'Confirma exclusão? Todos os dados serão removidos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir'
    });
    if (!isConfirmed) return;

    if (user.providerData[0].providerId === 'password') {
      const { value: senha } = await Swal.fire({
        title: 'Confirme sua senha',
        input: 'password', inputPlaceholder: 'Senha atual',
        showCancelButton: true
      });
      if (!senha) return;
      const cred = EmailAuthProvider.credential(user.email, senha);
      await reauthenticateWithCredential(user, cred);
    }

    await deleteDoc(doc(db, 'users', user.uid));
    const q = query(collection(db, 'anuncios'), where('userId', '==', user.uid));
    const snap = await getDocs(q);
    for (const d of snap.docs) await deleteDoc(doc(db, 'anuncios', d.id));

    await deleteUser(user);
    await signOut(auth);
    Swal.fire('Conta excluída', 'Sua conta foi removida.', 'success')
      .then(() => window.location.href = 'index.html');
  } catch (err) {
    if (err.code === 'auth/requires-recent-login')
      showError('Sessão expirada', 'Faça login novamente');
    else showError('Erro', err.message);
  }
}

function promptAlterarTelefone(user) {
  Swal.fire({
    title: 'Alterar Telefone',
    html: `
      <input type="password" id="senhaTelefone" class="swal2-input" placeholder="Confirme sua senha">
      <input type="tel" id="novoTelefone" class="swal2-input" placeholder="Novo número com DDD">
      <div id="recaptcha-container"></div>
    `,
    showCancelButton: true,
    preConfirm: async () => {
      const senha = document.getElementById('senhaTelefone').value;
      const novoTel = document.getElementById('novoTelefone').value;
      if (!senha || !novoTel) throw 'Preencha todos os campos';
      return { senha, novoTel };
    }
  }).then(async res => {
    if (!res.isConfirmed) return;
    try {
      const cred = EmailAuthProvider.credential(user.email, res.value.senha);
      await reauthenticateWithCredential(user, cred);

      const provider = new PhoneAuthProvider(auth);
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

      const verificationId = await provider.verifyPhoneNumber(res.value.novoTel, window.recaptchaVerifier);
      const { value: codigo } = await Swal.fire({
        title: 'Código SMS', input: 'text', inputLabel: 'Digite o código enviado para seu novo número',
        showCancelButton: true
      });
      if (!codigo) return;

      const phoneCred = PhoneAuthProvider.credential(verificationId, codigo);
      await updatePhoneNumber(user, phoneCred);
      Swal.fire('Sucesso', 'Telefone atualizado com sucesso', 'success');
    } catch (err) {
      showError('Erro', err.message);
    }
  });
}

onAuthStateChanged(auth, user => {
  if (!user) return Swal.fire('Erro', 'Usuário não autenticado', 'error');

  const provider = user.providerData[0]?.providerId;
  if (provider === 'google.com') {
    document.querySelector('.alterar-senha')?.remove();
    document.querySelector('.alterar-email')?.remove();
  }
  if (provider === 'phone') {
    document.querySelector('.alterar-telefone')?.style.display = 'block';
  }

  document.querySelector('.alterar-senha')?.addEventListener('click', () => {
    promptAlterarSenha(user);
  });

  document.querySelector('.alterar-email')?.addEventListener('click', async () => {
    const { value: novaSenha } = await Swal.fire({
      title: 'Confirme sua senha',
      input: 'password',
      showCancelButton: true
    });
    if (!novaSenha) return;
    try {
      const cred = EmailAuthProvider.credential(user.email, novaSenha);
      await reauthenticateWithCredential(user, cred);
      const { value: novoEmail } = await Swal.fire({
        title: 'Novo Email', input: 'email', showCancelButton: true
      });
      if (novoEmail) {
        await updateEmail(user, novoEmail);
        Swal.fire('Sucesso', 'Email atualizado', 'success');
      }
    } catch (err) {
      showError('Erro', err.message);
    }
  });

  document.querySelector('.alterar-telefone')?.addEventListener('click', () => {
    promptAlterarTelefone(user);
  });

  document.querySelector('.excluir-conta')?.addEventListener('click', () => {
    handleExcluirConta(user);
  });
});

document.addEventListener('click', e => {
  const m = document.getElementById('menuHamburguer');
  if (m && !m.contains(e.target)) m.classList.remove('ativo');
});
