// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyDhjUescYhrZ1e12M6nv5mnWxDovNcGxw0",

  authDomain: "clickserra-anuncios.firebaseapp.com",

  databaseURL: "https://clickserra-anuncios-default-rtdb.firebaseio.com",

  projectId: "clickserra-anuncios",

  storageBucket: "clickserra-anuncios.firebasestorage.app",

  messagingSenderId: "251868045964",

  appId: "1:251868045964:web:34f527f3d7c380746211a9",

  measurementId: "G-5VS0S34GGN"

};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
