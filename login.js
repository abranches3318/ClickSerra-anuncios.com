document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  // Aqui futuramente vai a requisição para o backend (ex: fetch/login)
  console.log({ email, senha });

  // Simula login bem-sucedido
  localStorage.setItem('usuarioLogado', 'true');

  alert('Login realizado com sucesso!');
  this.reset();

  // Redirecionamento inteligente
  const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
  localStorage.removeItem('destinoAposLogin');
  window.location.href = destino;
});

function irParaAnuncio() {
  const logado = localStorage.getItem('usuarioLogado');

  if (logado) {
    window.location.href = 'criar-anuncio.html';
  } else {
    localStorage.setItem('destinoAposLogin', 'criar-anuncio.html');
    window.location.href = 'login.html';
  }
}
