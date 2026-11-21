(() => {
  const all = (query, root = document) => [...root.querySelectorAll(query)];
  const header = document.querySelector('.header');
  const menu = header.querySelector('.menub');
  const nav = header.querySelector('nav');
  const small = matchMedia('(max-width:760px)');
  function closeMenu(restoreFocus = false) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
  });
  small.addEventListener('change', () => closeMenu());
  function dock() { header.classList.toggle('docked', scrollY > 85); }
  addEventListener('scroll', dock, { passive: true });
  dock();

  const form = document.querySelector('.contact form');
  function chooseSubject(value) {
    form.elements.subject.value = value;
    document.getElementById('contact').scrollIntoView();
    form.elements.name.focus({ preventScroll: true });
  }
  all('[data-subject]').forEach(button => {
    button.addEventListener('click', () => chooseSubject(button.dataset.subject));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const note = [document.title, 'نام: ' + data.get('name'), 'موضوع: ' + data.get('subject'), data.get('message')].filter(Boolean).join('\n\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', note], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.download = document.body.classList[0] + '-request.txt';
    a.href = url;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    form.querySelector('[role="status"]').textContent = 'فایل درخواست آمادهٔ ذخیره است.';
  });

  function setActive(buttons, current) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === current)));
  }
  function filter(buttonAttr, itemAttr) {
    const buttons = all('[' + buttonAttr + ']');
    const items = all('[' + itemAttr + ']');
    for (const button of buttons) {
      button.addEventListener('click', () => {
        setActive(buttons, button);
        const value = button.getAttribute(buttonAttr);
        items.forEach(item => { item.hidden = value !== 'all' && item.getAttribute(itemAttr) !== value; });
      });
    }
  }
  filter('data-filter', 'data-category');
  filter('data-day', 'data-weekday');

  const dialog = document.querySelector('.art-dialog');
  if (dialog) {
    let selection = '';
    all('[data-art-detail]').forEach(button => {
      button.addEventListener('click', () => {
        selection = button.querySelector('strong').textContent;
        const image = button.querySelector('img');
        dialog.querySelector('img').src = image.currentSrc || image.src;
        dialog.querySelector('img').alt = image.alt;
        dialog.querySelector('small').textContent = button.querySelector('.item-meta').textContent;
        dialog.querySelector('h2').textContent = selection;
        dialog.querySelector('p').textContent = button.parentElement.querySelector('p').textContent;
        dialog.showModal();
      });
    });
    dialog.querySelector('.close').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-detail-request]').addEventListener('click', () => {
      dialog.close();
      chooseSubject(selection);
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  }

  const breath = document.querySelector('[data-breathe]');
  if (breath) {
    const section = breath.closest('section');
    const state = section.querySelector('.breath-state');
    let timer = 0;
    let inhale = false;
    const next = () => {
      inhale = !inhale;
      state.textContent = inhale ? 'دم · چهار ثانیه' : 'بازدم · چهار ثانیه';
    };
    function stop() {
      clearInterval(timer);
      timer = 0;
      inhale = false;
      section.classList.remove('running');
      breath.setAttribute('aria-pressed', 'false');
      breath.textContent = 'شروع تمرین';
      state.textContent = 'آمادهٔ شروع';
    }
    breath.addEventListener('click', () => {
      if (timer) { stop(); return; }
      section.classList.add('running');
      breath.setAttribute('aria-pressed', 'true');
      breath.textContent = 'توقف تمرین';
      next();
      timer = window.setInterval(next, 4000);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  }

  const courseButtons = all('[data-course]');
  function chooseCourse(key) {
    const button = courseButtons.find(item => item.dataset.course === key);
    if (!button) return;
    setActive(courseButtons, button);
    all('[data-course-panel]').forEach(panel => { panel.hidden = panel.dataset.coursePanel !== key; });
  }
  courseButtons.forEach(button => button.addEventListener('click', () => chooseCourse(button.dataset.course)));
  all('[data-go-course]').forEach(link => link.addEventListener('click', () => chooseCourse(link.dataset.goCourse)));

  const gallery = all('[data-gallery-index]');
  if (gallery.length) {
    let selected = gallery.findIndex(button => button.getAttribute('aria-expanded') === 'true');
    const show = index => {
      selected = (index + gallery.length) % gallery.length;
      gallery.forEach((button, i) => button.setAttribute('aria-expanded', String(i === selected)));
      all('[data-gallery-caption]').forEach((caption, i) => { caption.hidden = i !== selected; });
    };
    gallery.forEach((button, i) => button.addEventListener('click', () => show(i)));
    all('[data-gallery-step]').forEach(button => {
      button.addEventListener('click', () => show(selected + Number(button.dataset.galleryStep)));
    });
  }
})();

