// Firebase inicialização
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.firebasestorage.app",
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
const inputFoto = document.getElementById("inputFotoPerfil");
const imagem = document.getElementById("fotoPerfil");

// Bloqueia edição por padrão
function setFormDisabled(disabled) {
  [...form.elements].forEach(el => {
    if (
      el.id !== "botaoEditar" &&
      el.id !== "botaoSalvar" &&
      el.id !== "inputFotoPerfil"
    ) {
      el.disabled = disabled;
    }
  });
  btnSalvar.style.display = disabled ? "none" : "block";
  btnEditar.style.display = disabled ? "block" : "none";
}

// Menu hambúrguer
function toggleMenuHamburguer() {
  const menu = document.getElementById("menuHamburguer");
  menu.classList.toggle("ativo");
}
window.toggleMenuHamburguer = toggleMenuHamburguer;

document.addEventListener("click", function (event) {
  const menu = document.getElementById("menuHamburguer");
  if (!menu.contains(event.target)) menu.classList.remove("ativo");
});

// CEP
document.getElementById("cep").addEventListener("blur", async () => {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  if (cep.length !== 8) return;
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await res.json();
  if (!data.erro) {
    document.getElementById("endereco").value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
  }
});

// Empresa
const cbEmpresa = document.getElementById("ehEmpresa");
cbEmpresa.addEventListener("change", () => {
  document.getElementById("nomeCompleto").disabled = cbEmpresa.checked;
  document.getElementById("nomeEmpresa").disabled = !cbEmpresa.checked;
});

// Autenticação e dados iniciais
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

    try {
      const url = d.fotoPerfilUrl || await getDownloadURL(ref(storage, `usuarios/${user.uid}/avatar.jpg`));
      imagem.src = url;
    } catch {
      imagem.src = "imagens/usuario.png";
    }

    cbEmpresa.dispatchEvent(new Event("change"));
    setFormDisabled(true);
  } else {
    imagem.src = "imagens/usuario.png";
    setFormDisabled(true);
  }
});

btnEditar.addEventListener("click", () => setFormDisabled(false));

// Salvar perfil
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
  Swal.fire("Sucesso", "Perfil salvo com sucesso!", "success");
  setFormDisabled(true);
});

// Upload com Cropper
imagem.addEventListener("click", () => inputFoto.click());

inputFoto.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const base64 = reader.result;

    Swal.fire({
      title: "Ajuste sua foto",
      html: '<div><img id="crop-image" style="max-width:100%"></div>',
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      willOpen: () => {
        const image = document.getElementById("crop-image");
        image.src = base64;

        window.cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
        });
      },
      preConfirm: async () => {
        return new Promise((resolve) => {
          window.cropper.getCroppedCanvas({ width: 300, height: 300 }).toBlob(blob => {
            resolve(blob);
          }, 'image/jpeg');
        });
      },
      didClose: () => {
        window.cropper.destroy();
        delete window.cropper;
      }
    }).then(async result => {
      if (result.isConfirmed && result.value) {
        try {
          const user = auth.currentUser;
          const caminho = `usuarios/${user.uid}/avatar.jpg`;
          const storageRef = ref(storage, caminho);

          await uploadBytes(storageRef, result.value);
          const url = await getDownloadURL(storageRef);
          imagem.src = url;

          await setDoc(doc(db, "users", user.uid), { fotoPerfilUrl: url }, { merge: true });

          Swal.fire("Sucesso", "Foto atualizada!", "success");
        } catch (err) {
          console.error(err);
          Swal.fire("Erro", "Falha ao salvar imagem: " + err.message, "error");
        }
      }
    });
  };

  reader.readAsDataURL(file);
});
