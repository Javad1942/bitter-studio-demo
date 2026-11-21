const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function toggleMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'بستن فهرست' : 'باز کردن فهرست');
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', () => toggleMenu(false));
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.nav-inner') && nav.classList.contains('open')) toggleMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    toggleMenu(false);
    menu.focus();
  }
});
const menuSize = matchMedia('(max-width:760px)');
menuSize.addEventListener('change', () => toggleMenu(false));
const gallery = document.querySelector('.gallery-dialog');
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const original = item.querySelector('img');
    const large = gallery.querySelector('img');
    large.src = original.currentSrc || original.src;
    large.alt = original.alt;
    gallery.querySelector('p').textContent = original.alt;
    gallery.showModal();
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
const contact = document.querySelector('.contact-dialog');
const form = contact.querySelector('form');
document.querySelector('.contact-open').addEventListener('click', () => contact.showModal());
document.querySelectorAll('.plan-link').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    form.elements.message.value = 'موضوع درخواست من «' + link.dataset.topic + '» است.';
    contact.showModal();
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const brand = document.querySelector('[data-template-brand]').textContent;
  const message = [brand, form.elements.name.value.trim(), form.elements.message.value.trim()].join('\n\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', message], {type:'text/plain;charset=utf-8'}));
  const download = document.createElement('a');
  download.href = url;
  download.download = 'درخواست-' + brand + '.txt';
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  contact.close();
});
const widthControl = document.querySelector('#width-range');
if (widthControl) {
  const sample = document.querySelector('.typeface');
  const weightControl = document.querySelector('#weight-range');
  const format = new Intl.NumberFormat('fa-IR');
  function setType() {
    sample.style.setProperty('--type-width', Number(widthControl.value) / 100);
    sample.style.fontWeight = weightControl.value;
    sample.style.webkitTextStrokeWidth = Math.max(0, (Number(weightControl.value) - 550) / 175) + 'px';
    document.querySelector('#width-out').value = format.format(widthControl.value);
    document.querySelector('#weight-out').value = format.format(weightControl.value);
  }
  widthControl.addEventListener('input', setType);
  weightControl.addEventListener('input', setType);
  document.querySelector('#reset-type').addEventListener('click', () => {
    widthControl.value = '100';
    weightControl.value = '550';
    setType();
  });
}
