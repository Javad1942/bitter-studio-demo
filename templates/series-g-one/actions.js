(() => {
  const lockup = document.querySelector('.title-lockup');
  if (lockup) {
    const heroTitle = lockup.querySelector('h1');
    const portrait = lockup.querySelector('.editable-portrait');
    function alignPortrait() {
      const slot = heroTitle.querySelector('.inline-portrait');
      lockup.classList.toggle('custom-headline', !slot);
      if (!slot) {
        portrait.removeAttribute('style');
        return;
      }
      const box = lockup.getBoundingClientRect();
      const target = slot.getBoundingClientRect();
      Object.assign(portrait.style, {
        left: (target.left-box.left)+'px', top: (target.top-box.top)+'px',
        width: target.width+'px', height: target.height+'px'
      });
    }
    new ResizeObserver(alignPortrait).observe(heroTitle);
    new MutationObserver(alignPortrait).observe(heroTitle, {childList:true,subtree:true,characterData:true});
    document.fonts.ready.then(alignPortrait);
    alignPortrait();
  }
  const bar = document.querySelector('.nav');
  const menu = document.querySelector('#page-menu');
  const trigger = bar.querySelector('.menu-btn');
  function toggleMenu(open) {
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
  }
  trigger.addEventListener('click', () => toggleMenu(menu.hidden));
  document.addEventListener('click', event => {
    if (!menu.hidden && (event.target.closest('.open-menu a') || !menu.contains(event.target) && !trigger.contains(event.target))) toggleMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      toggleMenu(false);
      trigger.focus();
    }
  });
  function pinHeader() {
    bar.classList.toggle('is-fixed', window.scrollY > 110);
  }
  window.addEventListener('scroll', pinHeader, {passive:true});
  pinHeader();
  document.querySelector('[data-scroll]')?.addEventListener('click', event => {
    document.getElementById(event.currentTarget.dataset.scroll)?.scrollIntoView({block:'start'});
  });

  function switchRow(buttons, picked, mayClose, onChange) {
    const open = !mayClose || picked.getAttribute('aria-expanded') !== 'true';
    for (const item of buttons) {
      const active = item === picked && open;
      item.setAttribute('aria-expanded',String(active));
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      item.parentElement.classList.toggle('active',active);
    }
    if (open && onChange) onChange(picked);
  }
  for (const group of document.querySelectorAll('.rows')) {
    const buttons = [...group.querySelectorAll('.row-btn')];
    buttons.forEach(button => button.addEventListener('click', () => switchRow(buttons,button,true)));
  }
  const phases = [...document.querySelectorAll('.phase-btn')];
  phases.forEach(button => button.addEventListener('click', () => switchRow(phases,button,true,picked => {
    const image = document.querySelector('.phase-img');
    image.src = picked.dataset.figure;
    image.alt = picked.innerText.replace(/[۰-۹＋()]/g,'').trim();
  })));
  const projects = [...document.querySelectorAll('[data-project]')];
  projects.forEach(button => button.addEventListener('click', () => {
    for (const other of projects) other.setAttribute('aria-pressed',String(other===button));
    const image = document.querySelector('.look-main img');
    image.src = button.dataset.project;
    image.alt = button.querySelector('b').textContent;
  }));

  const gallery = document.querySelector('#viewer');
  let group = [], position = 0, player = 0;
  const play = gallery.querySelector('[data-play]');
  function stop() {
    clearInterval(player);
    player = 0;
    play.setAttribute('aria-pressed','false');
    play.textContent = 'پخش خودکار';
  }
  function showArt(step = 0) {
    position = (position + step + group.length) % group.length;
    const tile = group[position];
    const title = tile.querySelector('span').textContent;
    const img = gallery.querySelector('.view-img img');
    img.src = tile.dataset.art;
    img.alt = title;
    gallery.querySelector('h2').textContent = title;
    gallery.querySelector('.view-copy p').textContent = tile.dataset.caption;
  }
  for (const tile of document.querySelectorAll('[data-art]')) {
    tile.addEventListener('click', () => {
      group = [...tile.parentElement.querySelectorAll('[data-art]')];
      position = group.indexOf(tile);
      showArt();
      gallery.showModal();
    });
  }
  gallery.querySelector('.close').addEventListener('click',() => gallery.close());
  gallery.addEventListener('click',event => {
    if (event.target !== gallery) return;
    const r=gallery.getBoundingClientRect();
    if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) gallery.close();
  });
  gallery.addEventListener('close',stop);
  for (const button of gallery.querySelectorAll('[data-step]')) button.addEventListener('click',() => {stop();showArt(Number(button.dataset.step));});
  gallery.addEventListener('keydown',event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); stop(); showArt(event.key==='ArrowLeft'?1:-1);
  });
  play.addEventListener('click',() => {
    if(player){stop();return;}
    player=setInterval(() => showArt(1),2200);
    play.setAttribute('aria-pressed','true');
    play.textContent='مکث';
  });

  document.querySelector('.map-btn')?.addEventListener('click',event => {
    const button = event.currentTarget;
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded',String(open));
    button.closest('.route').classList.toggle('on',open);
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    button.textContent = open ? 'بستن مسیر' : 'نمایش مسیر';
  });

  const form = document.querySelector('[data-order]');
  form.addEventListener('submit',event => {
    event.preventDefault();
    const lines=[form.dataset.order,'',...[...new FormData(form)].map(([label,value]) => label+' — '+value)];
    const url=URL.createObjectURL(new Blob(['\uFEFF',lines.join('\r\n')],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');
    link.href=url;
    link.download=form.dataset.order+'-درخواست.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url),3000);
    form.querySelector('output').textContent='فایل درخواست برای دانلود آماده شد.';
  });
})();