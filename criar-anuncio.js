import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Config Firebase
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

// Categorias e subcategorias
const subcategorias = {
  alimentacao: ["Restaurante", "Padaria", "Cafeteria", "Açougue"],
  servicos: ["Construção", "Reparos", "Saúde", "Beleza"],
  comercio: ["Mercado", "Moda", "Eletro", "Artesanato"],
  empregos: ["Técnico", "Administração", "Estágio", "Freelancer"],
  eventos: ["Festas", "Shows", "Cursos", "Feiras"]
};

// Popular subcategorias
document.getElementById("categoria").addEventListener("change", (e) => {
  const cat = e.target.value;
  const subcatSelect = document.getElementById("subcategoria");
  subcatSelect.innerHTML = "<option value=''>Selecione uma subcategoria</option>";

  if (subcategorias[cat]) {
    subcategorias[cat].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub.toLowerCase().replace(/\s/g, "-");
      opt.textContent = sub;
      subcatSelect.appendChild(opt);
    });
  }
});

// Máscara telefone
function aplicarMascaraTelefone(input) {
  input.addEventListener("input", () => {
    let valor = input.value.replace(/\D/g, "");
    if (valor.length > 10) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 5) {
      valor = valor.replace(/(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      valor = valor.replace(/(\d*)/, "($1");
    }
    input.value = valor;
  });
}
aplicarMascaraTelefone(document.getElementById("telefone"));
aplicarMascaraTelefone(document.getElementById("telefoneSecundario"));

// CEP => Endereço
document.getElementById("cep").addEventListener("blur", async () => {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  if (cep.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        document.getElementById("endereco").value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      } else {
        alert("CEP não encontrado.");
      }
    } catch {
      alert("Erro ao buscar CEP.");
    }
  }
});

// Dica ao clicar na foto de capa
document.getElementById("fotoCapa").addEventListener("click", () => {
  alert("Insira a foto principal do seu produto ou o logo da empresa.");
});

// Publicar anúncio
document.getElementById("formAnuncio").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("É necessário estar logado para publicar.");
    return;
  }

  const form = e.target;
  const tipo = form.tipoAnuncio.value;
  const titulo = form.titulo.value;
  const categoria = form.categoria.value;
  const subcategoria = form.subcategoria.value;
  const descricao = form.descricao.value;
  const telefone = form.telefone.value;
  const telefone2 = form.telefoneSecundario.value;
  const isWhatsapp = form.whatsapp.checked;
  const cep = form.cep.value;
  const endereco = form.endereco.value;
  const horario = form.horario.value;
  const redes = form.redesSociais.value;
  const pacote = form.pacote.value;
  const gratis = document.getElementById("anuncioGratis")?.checked;

  // Upload da foto capa
  const capaFile = document.getElementById("fotoCapa").files[0];
  let capaPath = "";
  if (capaFile) {
    const path = `anuncios/${user.uid}/${Date.now()}_${capaFile.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, capaFile);
    capaPath = path;
  }

  const anuncio = {
    tipo,
    titulo,
    categoria,
    subcategoria,
    descricao,
    telefone,
    telefoneSecundario: telefone2,
    isWhatsapp,
    cep,
    endereco,
    horario,
    redes,
    pacote,
    gratis: tipo === "comercio" ? !!gratis : false,
    fotoCapa: capaPath,
    userId: user.uid,
    data: serverTimestamp(),
    status: "ativo"
  };

  try {
    await addDoc(collection(db, "anuncios"), anuncio);
    alert("Anúncio publicado com sucesso!");
    window.location.href = "meus-anuncios.html";
  } catch (err) {
    console.error(err);
    alert("Erro ao publicar anúncio.");
  }
});

// Menu hambúrguer
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menuHamburguer");
  const botao = menu?.querySelector(".botao-menu");

  if (botao?.contains(e.target)) {
    menu.classList.toggle("ativo");
  } else if (!menu?.contains(e.target)) {
    menu?.classList.remove("ativo");
  }
});
