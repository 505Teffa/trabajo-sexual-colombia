const menuButton = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');

menuButton?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const searchInput = document.querySelector('#blog-search');
const searchables = [...document.querySelectorAll('.searchable')];
const status = document.querySelector('#search-status');

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

searchInput?.addEventListener('input', (event) => {
  const query = normalize(event.target.value.trim());
  let visible = 0;

  searchables.forEach(item => {
    const haystack = normalize(`${item.textContent} ${item.dataset.search || ''}`);
    const match = !query || haystack.includes(query);
    item.classList.toggle('hidden-by-search', !match);
    if (match) visible += 1;
  });

  if (!query) {
    status.textContent = '';
  } else {
    status.textContent = `${visible} contenido${visible === 1 ? '' : 's'} relacionado${visible === 1 ? '' : 's'} con “${event.target.value.trim()}”.`;
  }
});
