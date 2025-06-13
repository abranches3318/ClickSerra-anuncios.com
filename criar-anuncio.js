document.getElementById('cep').addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('endereco').value =
          `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      } else {
        alert('CEP não encontrado.');
      }
    })
    .catch(() => {
      alert('Erro ao buscar o CEP.');
    });
});

document.getElementById('formAnuncio').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Anúncio enviado com sucesso (Simulação).');
});
