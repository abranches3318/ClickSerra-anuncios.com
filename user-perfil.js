// Firebase inicialização (modifique para sua config)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Alternar entre PF e PJ
window.alternarTipo = function () {
  const tipo = document.getElementById("tipoUsuario").value;
  document.getElementById("campoNomePF").style.display = tipo === "fisica" ? "block" : "none";
  document.getElementById("campoNomePJ").style.display = tipo === "juridica" ? "block" : "none";
  document.getElementById("campoCPF").style.display = tipo === "fisica" ? "block" : "none";
  document.getElementById("campoCNPJ").style.display = tipo === "juridica" ? "block" : "none";
};

// Lógica principal
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Você precisa estar logado para acessar o perfil.");
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;

  // Preenche os dados se já existir
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const dados = docSnap.data();
    document.getElementById("tipoUsuario").value = dados.tipoUsuario || "fisica";
    alternarTipo();

    if (dados.tipoUsuario === "fisica") {
      document.getElementById("nomePessoa").value = dados.nome || "";
      document.getElementById("cpf").value = dados.cpf || "";
    } else {
      document.getElementById("nomeEmpresa").value = dados.nome || "";
      document.getElementById("cnpj").value = dados.cnpj || "";
    }

    document.getElementById("descricao").value = dados.descricao || "";
    document.getElementById("cidade").value = dados.cidade || "";
    document.getElementById("categoria").value = dados.categoria || "";
    document.getElementById("whatsapp").value = dados.whatsapp || "";
    document.getElementById("site").value = dados.site || "";

    if (dados.fotoPerfilUrl) {
      document.getElementById("fotoPerfil").src = dados.fotoPerfilUrl;
    }
  }

  // Upload da foto
  const inputFoto = document.getElementById("uploadFotoPerfil");
  inputFoto.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `usuarios/${uid}/fotoPerfil.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    document.getElementById("fotoPerfil").src = url;

    await setDoc(docRef, { fotoPerfilUrl: url }, { merge: true });
  });

  // Envio do formulário
  const form = document.getElementById("formPerfil");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const nome = tipoUsuario === "fisica"
      ? document.getElementById("nomePessoa").value
      : document.getElementById("nomeEmpresa").value;

    const cpf = document.getElementById("cpf").value || null;
    const cnpj = document.getElementById("cnpj").value || null;
    const descricao = document.getElementById("descricao").value;
    const cidade = document.getElementById("cidade").value;
    const categoria = document.getElementById("categoria").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const site = document.getElementById("site").value;

    const dados = {
      tipoUsuario,
      nome,
      cpf,
      cnpj,
      descricao,
      cidade,
      categoria,
      whatsapp,
      site
    };

    try {
      await setDoc(docRef, dados, { merge: true });
      alert("Perfil salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil.");
    }
  });
});
