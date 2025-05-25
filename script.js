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
