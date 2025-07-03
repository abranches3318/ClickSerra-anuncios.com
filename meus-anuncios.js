import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",
  authDomain: "clickserra-anuncios.firebaseapp.com",
  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",
  projectId: "clickserra-anuncios",
  storageBucket: "clickserra-anuncios.appspot.com",
  messagingSenderId: "251868045964",
  appId: "1:251868045964:web:34f527f3d7c380746211a9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const listaAnuncios = document.getElementById("listaAnuncios");
const filtroData = document.getElementById("filtroData");
const filtroStatus = document.getElementById("filtroStatus");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    Swal.fire("Erro", "Você precisa estar logado.", "error");
    return;
  }

  let anuncios = await carregarAnuncios(user.uid);

  exibirAnuncios(anuncios);

  filtroData.addEventListener("change", () => {
    const ordenado = [...anuncios].sort((a, b) => {
      return filtroData.value === "antigo"
        ? a.data.seconds - b.data.seconds
        : b.data.seconds - a.data.seconds;
    });
    exibirAnuncios(ordenado);
  });

  filtroStatus.addEventListener("change", () => {
    const filtrado = filtroStatus.value === "todos"
      ? anuncios
      : anuncios.filter(a => a.status === filtroStatus.value);
    exibirAnuncios(filtrado);
  });
});

async function carregarAnuncios(uid) {
  const ref = collection(db, "anuncios");
  const q = query(ref, where("userId", "==", uid), orderBy("data", "desc"));
  const snapshot = await getDocs(q);

  const lista = [];
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    data.id = docSnap.id;

    try {
      if (data.fotoCapa) {
        const url = await getDownloadURL(refStorage(data.fotoCapa));
        data.urlCapa = url;
      }
    } catch (e) {
      data.urlCapa = "";
    }

    lista.push(data);
  }

  return lista;
}

function exibirAnuncios(anuncios) {
  listaAnuncios.innerHTML = "";

  if (anuncios.length === 0) {
    listaAnuncios.innerHTML = "<p>Nenhum anúncio encontrado.</p>";
    return;
  }

  anuncios.forEach(anuncio => {
    const card = document.createElement("div");
    card.className = "anuncio-card";

    card.innerHTML = `
      <img src="${anuncio.urlCapa || 'placeholder.jpg'}" alt="Foto do anúncio">
      <div class="info">
        <p><strong>Status:</strong> ${anuncio.status}</p>
        <p><strong>Data:</strong> ${new Date(anuncio.data.seconds * 1000).toLocaleDateString()}</p>
      </div>
      <div class="acoes">
        <button class="btn-editar" data-id="${anuncio.id}"><i class="fas fa-edit"></i></button>
        <button class="btn-status" data-id="${anuncio.id}" data-status="${anuncio.status}">
          <i class="fas fa-${anuncio.status === 'ativo' ? 'pause' : 'play'}"></i>
        </button>
        <button class="btn-excluir" data-id="${anuncio.id}"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    listaAnuncios.appendChild(card);
  });

  document.querySelectorAll(".btn-editar").forEach(btn =>
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      window.location.href = `editar-anuncio.html?id=${id}`;
    })
  );

  document.querySelectorAll(".btn-status").forEach(btn =>
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const statusAtual = e.currentTarget.dataset.status;
      const novoStatus = statusAtual === "ativo" ? "suspenso" : "ativo";

      await updateDoc(doc(db, "anuncios", id), { status: novoStatus });
      location.reload();
    })
  );

  document.querySelectorAll(".btn-excluir").forEach(btn =>
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const confirm = await Swal.fire({
        title: "Excluir anúncio?",
        text: "Essa ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
      });

      if (confirm.isConfirmed) {
        await deleteDoc(doc(db, "anuncios", id));
        location.reload();
      }
    })
  );
}

function refStorage(path) {
  return ref(storage, path);
}

document.addEventListener("click", (e) => {
  const menu = document.getElementById("menuHamburguer");
  const botao = menu?.querySelector(".botao-menu");

  if (botao?.contains(e.target)) {
    menu.classList.toggle("ativo");
  } else if (!menu?.contains(e.target)) {
    menu?.classList.remove("ativo");
  }
});
});
  }
});

  // Fecha o menu se clicar fora
  document.addEventListener("click", (e) => {
    if (!menuOpcoes.contains(e.target) && !botaoMenu.contains(e.target)) {
      menuOpcoes.classList.remove("ativo");
    }
  });
});
