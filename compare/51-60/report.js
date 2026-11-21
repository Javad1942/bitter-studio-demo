const picker = document.getElementById('slug');
const film = document.getElementById('film');
const image = document.getElementById('frame');
const controls = document.querySelector('.controls');
const requested = new URLSearchParams(location.hash.slice(1));
const defaultDevice = matchMedia('(max-width: 620px)').matches ? 'mobile' : 'desktop';
let device = ['mobile', 'desktop'].includes(requested.get('view')) ? requested.get('view') : defaultDevice;
let frame = 'video';

if ([...picker.options].some(option => option.value === requested.get('name'))) {
  picker.value = requested.get('name');
}

function updateComparison() {
  const slug = picker.value;
  const prefix = 'media/' + slug + '-' + device;
  const showMovie = frame === 'video';
  if (location.protocol !== 'file:') {
    const selection = new URLSearchParams({ name: slug, view: device });
    history.replaceState(null, '', '#' + selection);
  }

  film.pause();
  document.getElementById('motion').hidden = !showMovie;
  document.getElementById('still').hidden = showMovie;
  if (showMovie) {
    film.setAttribute('aria-label', 'فیلم اسکرول ' + picker.selectedOptions[0].text + '، مودو در چپ و بیتر در راست');
    film.poster = prefix + '-top.webp';
    film.src = prefix + '.mp4';
  } else {
    image.src = prefix + '-' + frame + '.webp';
    image.alt = picker.selectedOptions[0].text + '، مودو در چپ و بیتر در راست';
  }

  const site = location.protocol === 'file:'
    ? 'https://bitter-studio-concept.blackeel23.chatgpt.site/'
    : '../../';
  document.getElementById('bitter').href = site + 'templates/' + slug + '/index.html';
  document.getElementById('original').href = 'https://app.moodo.studio/seite/' + slug;
  for (const button of controls.querySelectorAll('button')) {
    const selected = button.dataset.device === device || button.dataset.frame === frame;
    button.setAttribute('aria-pressed', String(selected));
  }
}

picker.addEventListener('change', updateComparison);
controls.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.device) {
    device = button.dataset.device;
  } else {
    frame = button.dataset.frame;
  }
  updateComparison();
});

updateComparison();