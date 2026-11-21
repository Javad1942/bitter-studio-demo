(() => {
  const find = (selector) => document.querySelector(selector);
  const menuButton = find('.menu-toggle');
  const navigation = find('#site-menu');
  const header = find('.site-nav');

  function setMenu(open) {
    navigation.classList.toggle('opened', open);
    menuButton.setAttribute('aria-expanded', String(open));
  }

  menuButton.addEventListener('click', () => setMenu(!navigation.classList.contains('opened')));
  navigation.addEventListener('click', () => setMenu(false));
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('opened')) {
      setMenu(false);
      menuButton.focus();
    }
  });

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('docked', !entry.isIntersecting && entry.boundingClientRect.bottom < 0);
  }).observe(find('.nav-sentinel'));

  const dialog = find('#image-view');
  const photos = [...document.querySelectorAll('.gallery-tile')];
  let currentPhoto = 0;

  function showPhoto(index) {
    currentPhoto = (index + photos.length) % photos.length;
    const tile = photos[currentPhoto];
    const art = tile.querySelector('.art, img').cloneNode(true);
    find('.dialog-art').replaceChildren(art);
    find('#image-title').textContent = tile.getAttribute('aria-label');
    if (!dialog.open) dialog.showModal();
  }

  photos.forEach((tile, index) => tile.addEventListener('click', () => showPhoto(index)));
  find('#close-view').addEventListener('click', () => dialog.close());
  find('#next-view').addEventListener('click', () => showPhoto(currentPhoto + 1));
  find('#prev-view').addEventListener('click', () => showPhoto(currentPhoto - 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto + 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto - 1);
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });

  const form = find('.contact-form');
  document.querySelectorAll('[data-pick]').forEach((button) => {
    button.addEventListener('click', () => {
      form.elements.message.value = button.dataset.pick;
      find('#contact').scrollIntoView();
      form.elements.person.focus({ preventScroll: true });
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const text = [document.title, fields.get('person'), fields.get('email'), fields.get('message')].join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', text], {type: 'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = document.body.className + '-request.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    form.querySelector('output').textContent = 'خلاصهٔ درخواست روی دستگاهت ذخیره شد.';
  });

  const mapButton = find('[data-map]');
  const route = find('.map-label');
  mapButton.addEventListener('click', () => {
    route.hidden = !route.hidden;
    mapButton.setAttribute('aria-expanded', String(!route.hidden));
    mapButton.textContent = route.hidden ? 'دیدن مسیر' : 'بستن مسیر';
  });
})();