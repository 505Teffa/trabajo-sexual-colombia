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

// Podcast: el archivo publicado se reconoce automáticamente; la prueba local nunca se sube.
(() => {
  const player = document.getElementById('podcast-audio');
  const status = document.getElementById('podcast-status');
  const picker = document.getElementById('podcast-file');
  if (!player || !status || !picker) return;
  let localUrl = null;
  let localSelected = false;
  const published = 'assets/audio/podcast.mp3';
  const display = (url, message) => { player.src = url; player.hidden = false; status.textContent = message; };
  picker.addEventListener('change', () => {
    const file = picker.files?.[0];
    if (!file) return;
    if (localUrl) URL.revokeObjectURL(localUrl);
    localSelected = true;
    localUrl = URL.createObjectURL(file);
    display(localUrl, 'Vista previa local: ' + file.name);
  });
  player.addEventListener('error', () => { status.textContent = 'No se pudo reproducir este archivo. Comprueba que sea un audio compatible.'; });
  if (location.protocol === 'file:') return;
  fetch(published, {method:'HEAD', cache:'no-store'}).then(response => {
    if (!localSelected && response.ok && !((response.headers.get('content-type') || '').includes('text/html'))) {
      display(published, 'Episodio disponible para escuchar.');
    }
  }).catch(() => {});
})();
