document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  // Futuramente aqui irá uma chamada para o backend (ex: fetch/login)
  console.log({ email, senha });

  alert('Login realizado com sucesso!');
  this.reset();
});
