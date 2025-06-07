function toggleMenu() {
  const menu = document.getElementById("menu-mobile");
  menu.classList.toggle("oculto-mobile");
}

function toggleBusca() {
  const campo = document.getElementById("campoBusca");
  campo.classList.toggle("oculto");
  campo.focus();
}

function scrollCarrossel(id, direction) {
  const container = document.getElementById(id);
  const scrollAmount = direction * 300;
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

function buscar() {
  const termo = document.getElementById("campoBusca").value.toLowerCase();
  alert("Busca ainda não implementada. Você digitou: " + termo);
}
