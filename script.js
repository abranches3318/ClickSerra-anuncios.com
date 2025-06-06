// Toggle busca
const lupa = document.querySelector('.icone-lupa');
const campoBusca = document.querySelector('.campo-busca');

lupa.addEventListener('click', () => {
    campoBusca.style.display = campoBusca.style.display === 'block' ? 'none' : 'block';
});

// Dark Mode
const darkButton = document.createElement('button');
darkButton.textContent = '🌙';
darkButton.style.background = 'none';
darkButton.style.border = 'none';
darkButton.style.color = 'white';
darkButton.style.cursor = 'pointer';
darkButton.style.fontSize = '20px';
document.querySelector('.barra-navegacao').appendChild(darkButton);

darkButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Voltar ao topo
const btnTopo = document.getElementById('btnTopo');

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnTopo.style.display = "block";
    } else {
        btnTopo.style.display = "none";
    }
};

btnTopo.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

//Rolagem automatica
const cardsContainer = document.querySelector('.cards');
const cards = Array.from(cardsContainer.children);

// Setas do carrossel
const container = document.querySelector('.cards');
const btnEsquerda = document.querySelector('.seta.esquerda');
const btnDireita = document.querySelector('.seta.direita');

btnEsquerda.addEventListener('click', () => {
    container.scrollBy({
        left: -220,
        behavior: 'smooth'
    });
});

btnDireita.addEventListener('click', () => {
    container.scrollBy({
        left: 220,
        behavior: 'smooth'
    });
});
