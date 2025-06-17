import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
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

    // Salvando dados no Firestore
    await setDoc(doc(db, "users", user.uid), {
      nome: nome,
      email: email,
      criadoEm: new Date()
    });

    alert('Cadastro realizado com sucesso!');
    window.location.href = "index.html"; // redirecionar

  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    alert("Erro ao cadastrar: " + error.message);
  }
});
