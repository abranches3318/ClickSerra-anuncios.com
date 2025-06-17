import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

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
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Aguarda autenticação estar completa
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        try {
          await setDoc(doc(db, "users", user.uid), {
            nome: nome,
            email: email,
            criadoEm: new Date()
          });

          alert("Cadastro realizado com sucesso!");
          window.location.href = "index.html";
        } catch (firestoreError) {
          console.error("Erro ao salvar no Firestore:", firestoreError.message);
          alert("Erro ao salvar no Firestore: " + firestoreError.message);
        }
      }
    });

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Este e-mail já está cadastrado. Faça login ou use outro.");
    } else if (error.code === "auth/weak-password") {
      alert("A senha deve ter no mínimo 6 caracteres.");
    } else {
      alert("Erro ao cadastrar: " + error.message);
    }
    console.error("Erro ao cadastrar:", error);
  }
});
