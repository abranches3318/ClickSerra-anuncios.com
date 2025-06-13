document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  // Simulação de verificação (em um projeto real, aqui entraria o fetch pro backend)
  if (email && senha) {
    // Marca como logado no localStorage
    localStorage.setItem('usuarioLogado', 'true');

    // Verifica se o usuário tentou acessar uma página antes de logar
    const destino = localStorage.getItem('destinoAposLogin') || 'index.html';

    // Limpa o redirecionamento salvo
    localStorage.removeItem('destinoAposLogin');

    alert('Login realizado com sucesso!');

    // Redireciona para a página de destino
    window.location.href = destino;
  } else {
    alert('Preencha e-mail e senha corretamente.');
  }
});
