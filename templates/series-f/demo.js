'use strict';

const nav = document.getElementById('site-nav');
const toggle = document.querySelector('.nav-toggle');
const small = matchMedia('(max-width:700px)');
function setMenu(open) {
  nav.classList.toggle('open', open);
  nav.inert = small.matches && !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
}
setMenu(false);
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', () => setMenu(false));
small.addEventListener('change', () => setMenu(false));
document.addEventListener('pointerdown', event => {
  if (nav.classList.contains('open') && !event.target.closest('.site-header')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    toggle.focus();
  }
});

const form = document.querySelector('.contact form');
function selectSubject(subject) {
  form.elements.subject.value = subject;
  form.elements.subject.dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById('contact').scrollIntoView({ block: 'start' });
  form.elements.name.focus({ preventScroll: true });
}
document.querySelectorAll('[data-pick]').forEach(button => {
  button.addEventListener('click', () => selectSubject(button.dataset.pick));
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  const message = [document.title, 'نام: ' + fields.get('name'), 'موضوع: ' + fields.get('subject'), 'توضیحات: ' + (fields.get('message') || '—')].join('\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', message], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = document.body.className + '-request.txt';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  form.querySelector('[role=status]').textContent = 'فایل درخواست آمادهٔ دانلود است.';
});

function selectButton(button, selector) {
  for (const option of button.parentElement.querySelectorAll(selector)) {
    option.setAttribute('aria-pressed', String(option === button));
  }
}
function filterCollection(button) {
  selectButton(button, '[data-filter]');
  for (const item of button.closest('section').querySelectorAll('.filter-grid [data-group]')) {
    item.hidden = button.dataset.filter !== 'all' && item.dataset.group !== button.dataset.filter;
  }
}
for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => filterCollection(button));
}
for (const link of document.querySelectorAll('[data-course-jump]')) {
  link.addEventListener('click', () => filterCollection(document.querySelector('[data-filter="' + link.dataset.courseJump + '"]')));
}

const gallery = document.querySelector('.gallery-dialog');
let selected = 0, collection = [];
function displayArt(index) {
  selected = (index + collection.length) % collection.length;
  const item = collection[selected];
  gallery.querySelector('img').src = item.dataset.art;
  gallery.querySelector('img').alt = item.dataset.name;
  gallery.querySelector('[data-dialog-title]').textContent = item.dataset.name;
}
for (const item of document.querySelectorAll('[data-art]')) {
  item.addEventListener('click', () => {
    collection = [...item.parentElement.querySelectorAll('[data-art]:not([hidden])')];
    displayArt(collection.indexOf(item));
    gallery.showModal();
  });
}
gallery.querySelector('[data-prev]').onclick = () => displayArt(selected - 1);
gallery.querySelector('[data-next]').onclick = () => displayArt(selected + 1);
gallery.addEventListener('keydown', event => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  event.preventDefault();
  displayArt(selected + (event.key === 'ArrowLeft' ? 1 : -1));
});
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}

const reel = document.querySelector('dialog.reel');
if (reel) {
  const film = reel.querySelector('.film');
  const pause = reel.querySelector('[data-reel-pause]');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const frames = [...document.querySelectorAll('.stage-works [data-art]')];
  let current = 0, timer = 0, playing = false;
  function showFrame(index) {
    current = index % frames.length;
    const face = frames[current];
    film.firstElementChild.src = face.dataset.art;
    film.firstElementChild.alt = face.dataset.name;
    reel.querySelector('.dlg-top b').textContent = face.dataset.name;
  }
  function play(on) {
    clearInterval(timer);
    playing = on;
    film.classList.toggle('paused', !on);
    pause.textContent = on ? 'مکث' : 'پخش';
    if (on) timer = setInterval(() => showFrame(current + 1), 2300);
  }
  document.querySelector('[data-reel]').onclick = () => {
    showFrame(0);
    reel.showModal();
    play(!reduced.matches);
  };
  pause.onclick = () => play(!playing);
  reel.querySelector('[data-reel-next]').onclick = () => showFrame(current + 1);
  reel.addEventListener('close', () => play(false));
  document.addEventListener('visibilitychange', () => { if (document.hidden) play(false); });
  reduced.addEventListener('change', () => { if (reduced.matches) play(false); });
}

// Keep art-directed mobile covers editable in the brief preview.
for (const cover of document.querySelectorAll('picture img[data-template-cover]')) {
  const mobileCover = cover.parentElement.querySelector('source');
  const original = cover.getAttribute('src'), alternate = mobileCover.getAttribute('srcset');
  new MutationObserver(() => {
    if (cover.getAttribute('src') === original) mobileCover.setAttribute('srcset', alternate);
    else mobileCover.removeAttribute('srcset');
  }).observe(cover, { attributes: true, attributeFilter: ['src'] });
}

const paint = document.querySelector('.paints');
if (paint) {
  let choice = paint.querySelector('[aria-pressed=true]');
  for (const button of paint.querySelectorAll('button')) {
    button.addEventListener('click', () => {
      choice = button;
      selectButton(button, '[data-paint]');
      document.querySelector('.car-sample').style.filter = 'hue-rotate(' + button.dataset.paint + 'deg)';
    });
  }
  document.querySelector('[data-test-car]').onclick = () => selectSubject('تست رانندگی کوپه، رنگ ' + choice.textContent);
}
const prints = document.querySelector('.prints');
if (prints) {
  let design = prints.querySelector('[aria-pressed=true]');
  const preview = document.querySelector('[data-print-preview]');
  for (const button of prints.querySelectorAll('button')) {
    button.addEventListener('click', () => {
      design = button;
      selectButton(button, '[data-print]');
      preview.src = 'print-' + button.dataset.print + '.svg';
      preview.alt = 'پیش‌نمایش طرح ' + button.textContent;
      document.querySelector('[data-print-name]').textContent = button.textContent;
    });
  }
  document.querySelector('[data-pick-print]').onclick = () => selectSubject('طرح ' + design.textContent + '، اندازهٔ ' + document.querySelector('[name=size]').value);
}
