document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  if (email && senha) {
    // Simula login bem-sucedido
    localStorage.setItem('usuarioLogado', 'true');

    // Recupera o destino salvo ou usa index
    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';
    localStorage.removeItem('destinoAposLogin');

    alert('Login realizado com sucesso!');
    window.location.href = destino;
  } else {
    alert('Preencha e-mail e senha corretamente.');
  }
});
