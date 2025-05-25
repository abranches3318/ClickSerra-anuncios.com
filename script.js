const lupa = document.querySelector('.icone-lupa');
const campoBusca = document.querySelector('.campo-busca');

lupa.addEventListener('click', () => {
    if (campoBusca.style.display === 'block') {
        campoBusca.style.display = 'none';
    } else {
        campoBusca.style.display = 'block';
        campoBusca.focus();
    }
});

campoBusca.addEventListener('focus', () => {
    campoBusca.placeholder = '';
});

campoBusca.addEventListener('blur', () => {
    campoBusca.placeholder = 'Buscar';
});

const esquerda = document.querySelector('.seta.esquerda');
const direita = document.querySelector('.seta.direita');
const cards = document.querySelector('.cards');

esquerda.addEventListener('click', () => {
    cards.scrollBy({ left: -300, behavior: 'smooth' });
});

direita.addEventListener('click', () => {
    cards.scrollBy({ left: 300, behavior: 'smooth' });
});
