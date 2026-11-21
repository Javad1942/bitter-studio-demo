'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#menu-links');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'بستن فهرست' : 'باز کردن فهرست');
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.head')) setMenu(false);
});
matchMedia('(min-width:751px)').addEventListener('change', () => setMenu(false));

const form = document.querySelector('#contact form');
document.addEventListener('click', event => {
  const choice = event.target.closest('[data-topic]');
  if (!choice) return;
  form.elements.topic.value = choice.dataset.topic;
  document.querySelector('#contact').scrollIntoView({block: 'start'});
  form.elements.user.focus({preventScroll: true});
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const message = [document.title, 'نام: ' + fields.get('user'), 'ایمیل: ' + fields.get('email'),
    'موضوع: ' + fields.get('topic'), String(fields.get('note') || '')].join('\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', message], {type:'text/plain;charset=utf-8'}));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = document.body.className + '-request.txt';
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  form.querySelector('output').textContent = 'فایل درخواست آمادهٔ دریافت شد.';
});

const viewer = document.querySelector('.viewer');
document.querySelectorAll('.gallery-item').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    viewer.querySelector('img').src = image.currentSrc || image.src;
    viewer.querySelector('img').alt = image.alt;
    viewer.querySelector('p').textContent = button.querySelector('span').textContent;
    viewer.showModal();
  });
});
viewer.querySelector('.close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const bounds = viewer.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
});

function selectButton(button) {
  for (const other of button.parentElement.querySelectorAll('button')) {
    other.setAttribute('aria-pressed', String(button === other));
  }
}
const courses = {
  putt: ['تمرین روی گرین', 'مسیر کوتاه برای تمرکز روی سرعت توپ و دقت ضربه.'],
  tee: ['نقطهٔ شروع', 'تمرین هدف‌گیری و ضربهٔ اول از جایگاه شروع.'],
  ridge: ['مسیر تپه', 'فاصله و جهت ضربه را روی شیب‌های آرام تمرین کن.']
};
const frames = {
  round: ['فریم گرد عسلی', 'لبه‌های نرم و پل قوسی برای یک انتخاب روزمره.'],
  square: ['فریم چهارگوش زغالی', 'خطوط مشخص و عدسی‌های پهن‌تر برای یک قاب پررنگ.'],
  light: ['فریم سبک طلایی', 'حلقه‌های باریک فلزی و پل ظریف برای استفادهٔ طولانی.']
};
for (const [kind, attr, options] of [['course', 'hole', courses], ['frame', 'frame', frames]]) {
  const picker = document.querySelector('.' + kind + '-picker');
  if (!picker) continue;
  picker.addEventListener('click', event => {
    const button = event.target.closest('[data-' + attr + ']');
    if (!button) return;
    const key = button.dataset[attr], [title, text] = options[key];
    selectButton(button);
    picker.querySelector('img').src = key + '.svg';
    picker.querySelector('img').alt = title;
    picker.querySelector('#' + kind + '-name').textContent = title;
    picker.querySelector('#' + kind + '-info').textContent = text;
    picker.querySelector('[data-topic]').dataset.topic = title;
  });
}
for (const button of document.querySelectorAll('[data-flavour]')) {
  button.addEventListener('click', () => {
    selectButton(button);
    document.querySelectorAll('[data-kind]').forEach(card => {
      card.hidden = button.dataset.flavour !== 'all' && card.dataset.kind !== button.dataset.flavour;
    });
  });
}
const ledger = document.querySelector('.ledger-demo');
if (ledger) {
  let filter = 'all';
  const items = [...ledger.querySelectorAll('.receipt')];
  const render = () => {
    for (const item of items) item.hidden = filter !== 'all' && item.dataset.state !== filter;
    const pending = items.filter(item => item.dataset.state === 'open').length;
    ledger.querySelector('output').textContent = new Intl.NumberFormat('fa').format(pending) + ' رسید در انتظار بررسی';
  };
  ledger.addEventListener('click', event => {
    const tab = event.target.closest('[data-ledger]');
    const approval = event.target.closest('[data-approve]');
    if (tab) {filter = tab.dataset.ledger; selectButton(tab);}
    if (approval) {
      const item = approval.closest('.receipt');
      item.dataset.state = item.dataset.state === 'open' ? 'done' : 'open';
      approval.textContent = item.dataset.state === 'open' ? 'تأیید رسید' : 'بازگشت به انتظار';
      if (filter !== 'all') ledger.querySelector('[aria-pressed=true]').focus({preventScroll: true});
    }
    if (tab || approval) render();
  });
  render();
}
for (const control of document.querySelectorAll('.wipe')) {
  const scene = control.closest('.thermal-scene');
  if (scene.closest('.hero') && matchMedia('(max-width:750px)').matches) control.value = '20';
  const paint = () => {
    scene.style.setProperty('--split', control.value + '%');
    control.setAttribute('aria-valuetext', new Intl.NumberFormat('fa').format(control.value) + ' درصد نمای سرد');
  };
  control.addEventListener('input', paint);
  paint();
}
const thermalCover = document.querySelector('.thermal-base[data-template-cover]');
if (thermalCover) {
  // The brief editor can replace this cover after loading the preview iframe.
  const original = thermalCover.getAttribute('src');
  const overlay = thermalCover.parentElement.querySelector('.thermal-hot');
  new MutationObserver(() => {
    overlay.hidden = thermalCover.getAttribute('src') !== original;
  }).observe(thermalCover, {attributes: true, attributeFilter: ['src']});
}
