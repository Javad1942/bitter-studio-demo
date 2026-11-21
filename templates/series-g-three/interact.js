(() => {
  const find = selector => document.querySelector(selector);
  const all = selector => Array.from(document.querySelectorAll(selector));
  const header = find('.site-head');
  const navigation = find('#navigation');
  const toggle = find('.menu');
  const form = find('.contact form');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function showMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    navigation.classList.toggle('open', open);
  }
  toggle.addEventListener('click', () => showMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', () => showMenu(false));
  document.addEventListener('click', e => { if (!header.contains(e.target)) showMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navigation.classList.contains('open')) { showMenu(false); toggle.focus(); }
  });
  const story = find('.ks-story');
  const words = story ? [...story.querySelectorAll('p span')] : [];
  let scheduled = false;
  function scrollState() {
    scheduled = false;
    header.classList.toggle('fixed', scrollY > Math.max(96, innerHeight * .18));
    const progress = story ? (innerHeight * .94 - story.getBoundingClientRect().top) / (innerHeight * .82) : 0;
    words.forEach((word, i) => word.classList.toggle('lit', reduceMotion.matches || i / words.length < progress));
  }
  function updateScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(scrollState); } }
  addEventListener('scroll', updateScroll, {passive:true});
  addEventListener('resize', updateScroll);
  scrollState();

  const dialog = find('.viewer');
  const pictures = all('[data-picture]');
  let current = 0;
  function updateViewer(index) {
    current = (index + pictures.length) % pictures.length;
    const picture = pictures[current];
    const image = dialog.querySelector('img');
    image.src = picture.querySelector('img').src;
    image.alt = picture.dataset.picture;
    dialog.querySelector('figcaption').textContent = image.alt;
  }
  pictures.forEach((picture, i) => picture.addEventListener('click', () => { updateViewer(i); dialog.showModal(); }));
  dialog.querySelector('.prev').addEventListener('click', () => updateViewer(current - 1));
  dialog.querySelector('.next').addEventListener('click', () => updateViewer(current + 1));
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog && (e.clientY < dialog.getBoundingClientRect().top || e.clientY > dialog.getBoundingClientRect().bottom || e.clientX < dialog.getBoundingClientRect().left || e.clientX > dialog.getBoundingClientRect().right)) dialog.close(); });
  dialog.addEventListener('keydown', e => {
    if (['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); updateViewer(current + (e.key === 'ArrowLeft' ? 1 : -1)); }
  });
  all('[data-select]').forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.target;
    const value = button.dataset.select;
    if (target === 'gallery') {
      const list = find('#gallery');
      const match = [...list.querySelectorAll('[data-picture]')].find(p => p.dataset.picture === value);
      if (match) { match.click(); return; }
    }
    if (target === 'contact' && Array.from(form.elements.choice.options).some(option => option.value === value)) form.elements.choice.value = value;
    document.getElementById(target).scrollIntoView({behavior:reduceMotion.matches ? 'instant' : 'smooth'});
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const fields = [['نام', 'name'], ['ایمیل', 'email'], ['موضوع', 'choice'], ['پیام', 'message']];
    const note = [document.title, ...fields.map(([label,key]) => label + ' — ' + values.get(key))].join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', note], {type:'text/plain;charset=utf-8'}));
    const download = Object.assign(document.createElement('a'), {href:url, download:document.body.className+'-درخواست.txt'});
    document.body.append(download); download.click(); download.remove();
    form.querySelector('[role=status]').textContent = 'فایل درخواست برای ذخیره روی دستگاه آماده شد.';
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  });
  const mapToggle = find('[data-map]');
  if (mapToggle) mapToggle.addEventListener('click', () => {
    const open = mapToggle.getAttribute('aria-expanded') === 'true';
    mapToggle.setAttribute('aria-expanded', String(!open));
    find('#map-legend').hidden = open;
    mapToggle.textContent = open ? 'راهنمای نقشه' : 'بستن راهنما';
  });
  const player = find('audio');
  if (player) {
    const panel = find('.player-wrap');
    const episodes = all('.episode');
    let selected;
    function buttonState() {
      episodes.forEach((button,i) => {
        const playing = i === selected && !player.paused && !player.ended;
        button.classList.toggle('active', selected === i);
        button.setAttribute('aria-pressed', String(playing));
        button.querySelector('i').textContent = playing ? 'Ⅱ' : '▷';
      });
    }
    episodes.forEach((button,i) => button.addEventListener('click', async () => {
      panel.hidden = false;
      if (selected === i && !player.paused) { player.pause(); return; }
      if (i !== selected) {
        selected = i;
        player.src = 'chapter-' + i + '.mp3';
        panel.querySelector('b').textContent = button.querySelector('strong').textContent;
      }
      try { await player.play(); } catch { player.controls = true; }
      buttonState();
    }));
    for (const name of ['play','pause','ended']) player.addEventListener(name, buttonState);
  }
})();