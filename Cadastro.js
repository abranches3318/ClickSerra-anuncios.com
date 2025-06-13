document.getElementById('formCadastro').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem.');
    return;
  }

  // Aqui você pode futuramente enviar os dados para o backend
  console.log({
    nome,
    email,
    senha
  });

  alert('Cadastro realizado com sucesso!');
  this.reset();
});
