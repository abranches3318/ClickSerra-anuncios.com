// Firebase inicialização (modifique para sua config)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.firebasestorage.app"
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const form = document.getElementById("formPerfil");
const btnSalvar = document.getElementById("botaoSalvar");
const btnEditar = document.getElementById("botaoEditar");
const inputFoto = document.getElementById("uploadFotoPerfil");
const imagem = document.getElementById("fotoPerfil");

function setFormDisabled(disabled) {
  [...form.elements].forEach(el => {
    if (el.id !== "botaoEditar" && el.type !== "button" && el.id !== "botaoSalvar") {
      el.disabled = disabled;
    }
  });
  btnSalvar.style.display = disabled ? "none" : "block";
  btnEditar.style.display = disabled ? "block" : "none";
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

// Alterna o menu hambúrguer
function toggleMenuHamburguer() {
  const menu = document.getElementById("menuHamburguer");
  menu.classList.toggle("ativo");
}
window.toggleMenuHamburguer = toggleMenuHamburguer;


// Fecha o menu hambúrguer se clicar fora
document.addEventListener("click", function (event) {
  const menu = document.getElementById("menuHamburguer");
  const botao = menu.querySelector(".botao-menu");
  const opcoes = document.getElementById("menuHamburguerOpcoes");

  const clicouFora = !menu.contains(event.target);
  const clicouNoBotao = botao.contains(event.target);

  // Fecha se clicou fora e menu estiver aberto
  if (!clicouNoBotao && clicouFora && menu.classList.contains("ativo")) {
    menu.classList.remove("ativo");
  }
});

// CEP busca
const cepInput = document.getElementById("cep");
cepInput.addEventListener("blur", async () => {
  const cep = cepInput.value.replace(/\D/g, "");
  if (cep.length !== 8) return;
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await res.json();
  if (!data.erro) {
    document.getElementById("endereco").value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
  }
});

// Empresa checkbox
const cbEmpresa = document.getElementById("ehEmpresa");
cbEmpresa.addEventListener("change", () => {
  document.getElementById("nomeCompleto").disabled = cbEmpresa.checked;
  document.getElementById("nomeEmpresa").disabled = !cbEmpresa.checked;
});

// Autenticação e preenchimento
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const refDoc = doc(db, "users", user.uid);
  const snap = await getDoc(refDoc);
  if (snap.exists()) {
    const d = snap.data();
    form.nomeCompleto.value = d.nome || "";
    form.nomeEmpresa.value = d.nomeEmpresa || "";
    form.cpfCnpj.value = d.cpfCnpj || "";
    form.descricao.value = d.descricao || "";
    form.cep.value = d.cep || "";
    form.endereco.value = d.endereco || "";
    form.numero.value = d.numero || "";
    form.telefone.value = d.telefone || "";
    form.site.value = d.site || "";
    form.instagram.value = d.instagram || "";
    form.facebook.value = d.facebook || "";
    form.ehWhatsapp.checked = d.ehWhatsapp || false;
    form.ehEmpresa.checked = d.ehEmpresa || false;
    if (d.fotoPerfilUrl) imagem.src = d.fotoPerfilUrl;
    cbEmpresa.dispatchEvent(new Event("change"));
    setFormDisabled(true);
  } else {
    setFormDisabled(false);
  }
});

btnEditar.addEventListener("click", () => setFormDisabled(false));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const dados = {
    nome: form.nomeCompleto.value,
    nomeEmpresa: form.nomeEmpresa.value,
    cpfCnpj: form.cpfCnpj.value,
    descricao: form.descricao.value,
    cep: form.cep.value,
    endereco: form.endereco.value,
    numero: form.numero.value,
    telefone: form.telefone.value,
    site: form.site.value,
    instagram: form.instagram.value,
    facebook: form.facebook.value,
    ehWhatsapp: form.ehWhatsapp.checked,
    ehEmpresa: form.ehEmpresa.checked
  };

  await setDoc(doc(db, "users", user.uid), dados, { merge: true });
  setFormDisabled(true);
  alert("Perfil salvo com sucesso!");
  window.location.href = "index.html";
});
