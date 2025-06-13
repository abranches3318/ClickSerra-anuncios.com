// Validação simples de CEP com consulta à API ViaCEP
document.getElementById('cep').addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (!data.erro) {
          document.getElementById('endereco').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        } else {
          alert('CEP não encontrado.');
        }
      })
      .catch(() => alert('Erro ao buscar CEP.'));
  }
});

// Subcategorias dinâmicas por categoria
const subcategoriasPorCategoria = {
  servicos: ['Construção', 'Saúde', 'Reparos', 'Beleza', 'Consultoria'],
  comercio: ['Mercado', 'Moda', 'Restaurantes', 'Eletrônicos', 'Artesanato'],
  empregos: ['Vagas Técnicas', 'Administrativas', 'Freelancer', 'Estágio']
};

document.getElementById('categoria').addEventListener('change', function () {
  const categoriaSelecionada = this.value;
  const subcategoriaSelect = document.getElementById('subcategoria');

  subcategoriaSelect.innerHTML = '<option value="">Selecione uma subcategoria</option>';

  if (subcategoriasPorCategoria[categoriaSelecionada]) {
    subcategoriasPorCategoria[categoriaSelecionada].forEach(sub => {
      const option = document.createElement('option');
      option.value = sub.toLowerCase().replace(/\s/g, '-');
      option.textContent = sub;
      subcategoriaSelect.appendChild(option);
    });
  }
});

// Pré-visualização de imagens e vídeos (opcional)
document.getElementById('midia').addEventListener('change', function () {
  const previewContainer = document.getElementById('previewMidia');
  previewContainer.innerHTML = '';
  const files = Array.from(this.files);

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Imagem selecionada';
        img.style.maxWidth = '150px';
        img.style.marginRight = '10px';
        previewContainer.appendChild(img);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = e.target.result;
        video.controls = true;
        video.style.maxWidth = '150px';
        video.style.marginRight = '10px';
        previewContainer.appendChild(video);
      }
    };
    reader.readAsDataURL(file);
  });
});

// Máscara para telefone (simples)
const aplicarMascaraTelefone = (input) => {
  input.addEventListener('input', () => {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 10) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (valor.length > 5) {
      valor = valor.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      valor = valor.replace(/(\d*)/, '($1');
    }
    input.value = valor;
  });
};

aplicarMascaraTelefone(document.getElementById('telefone'));
aplicarMascaraTelefone(document.getElementById('telefone2'));
