'use strict';

(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const number = new Intl.NumberFormat('fa-IR');
  const menu = $('.menu');
  const nav = $('#navigation');
  function showMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  menu.addEventListener('click', () => showMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', () => showMenu(false));
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.header')) showMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { showMenu(false); menu.focus(); }
  });
  matchMedia('(max-width:740px)').addEventListener('change', () => showMenu(false));

  const dialog = $('.info');
  const content = $('.dialog-body');
  const node = (tag, text) => {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  };
  function showDialog(children) {
    content.replaceChildren(...children);
    if (!dialog.open) dialog.showModal();
  }
  $('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  function download(text, name) {
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], {type:'text/plain;charset=utf-8'}));
    const link = Object.assign(document.createElement('a'), {href:url,download:name+'.txt'});
    document.body.append(link);
    link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  $('.form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    download([document.title, data.get('user'), data.get('email'), data.get('message')].join('\n\n'), document.body.className+'-brief');
    form.querySelector('output').textContent = 'فایل درخواست برای دانلود آماده شد.';
  });

  for (const button of $$('[data-filter]')) button.addEventListener('click', () => {
    for (const item of $$('[data-filter]')) item.setAttribute('aria-pressed', String(button === item));
    for (const item of $$('[data-category]')) item.hidden = button.dataset.filter !== '*' && item.dataset.category !== button.dataset.filter;
  });
  for (const button of $$('[data-project]')) button.addEventListener('click', () => {
    const image = Object.assign(document.createElement('img'), {src:button.dataset.image,alt:button.dataset.project});
    showDialog([node('h2', button.dataset.project), image, node('p', button.dataset.copy)]);
  });

  const cart = $('[data-cart]');
  if (cart) {
    const products = $$('[data-price]').map(button => ({name:button.dataset.name, price:Number(button.dataset.price),count:0}));
    const updateCart = () => { cart.querySelector('b').textContent = number.format(products.reduce((sum,p) => sum+p.count,0)); };
    function openCart() {
      let total = 0;
      const rows = [node('h2', 'سبد خرید')];
      for (const product of products.filter(p => p.count > 0)) {
        total += product.count * product.price;
        const row = node('div','');
        row.className = 'bag-row';
        row.append(node('strong',product.name));
        for (const delta of [-1, 1]) {
          if (delta === 1) row.append(node('span',number.format(product.count)));
          const btn = node('button',delta === 1 ? '+' : '−');
          btn.setAttribute('aria-label',(delta === 1 ? 'افزایش ' : 'کاهش ')+product.name);
          btn.onclick = () => { product.count += delta; updateCart(); openCart(); };
          row.append(btn);
        }
        rows.push(row);
      }
      rows.push(node('p',total ? 'جمع سبد '+number.format(total)+' هزار تومان' : 'سبد شما خالی است.'));
      if (total) {
        const save=node('button','دریافت فهرست خرید');save.className='btn';
        save.onclick=()=>download(products.filter(p=>p.count).map(p=>p.name+' × '+number.format(p.count)).concat('جمع '+number.format(total)+' هزار تومان').join('\n'),'malve-bag');
        rows.push(save);
      }
      showDialog(rows);
    }
    for (const button of $$('[data-add]')) button.addEventListener('click', () => {
      const item = products[Number(button.dataset.add)];
      item.count++;
      updateCart();
      $('.shop-status').textContent = item.name+' به سبد افزوده شد.';
      if (button.classList.contains('feature-buy')) openCart();
    });
    cart.onclick = openCart;
  }

  const lab = $('.tool-lab');
  if (lab) {
    const buttons = $$('[data-tool]');
    const input = $('#lab-value');
    let selected = 0;
    const placeholders = ['یک موضوع بنویس','موضوع مکالمه را بنویس','مثلاً ۱۲، ۱۸، ۴۲','نام محصول را بنویس','متن کوتاهی وارد کن'];
    for (const [i,button] of buttons.entries()) button.onclick = () => {
      selected=i;
      buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      lab.querySelector('label').textContent='آزمایش '+button.querySelector('b').textContent;
      input.value=''; input.placeholder=placeholders[i];
      lab.querySelector('output').textContent='';
      input.focus();
    };
    lab.onsubmit = e => {
      e.preventDefault();
      const text=input.value.trim();
      if (!text) return;
      let result;
      switch(selected) {
        case 0: result='موضوع: '+text+'\nمقدمه: دربارهٔ '+text+' چه می‌دانیم؟\nبدنه: یک مثال مشخص بیاور.\nپایان: یک اقدام عملی پیشنهاد کن.'; break;
        case 1: result='شروع: سلام، دربارهٔ '+text+' چه کمکی از من ساخته است؟\nادامه: لطفاً یک مثال بزنید.\nپایان: قدم بعدی را با هم مشخص کنیم.'; break;
        case 2: {
          const raw=text.replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replaceAll('٫','.');
          const values=raw.split(/[\s،,؛;]+/).filter(Boolean).map(Number);
          result=values.length && values.every(Number.isFinite) ? 'تعداد '+number.format(values.length)+' · میانگین '+number.format(values.reduce((a,b)=>a+b,0)/values.length) : 'عددها را با فاصله یا ویرگول جدا کن.';
          break;
        }
        case 3: result='قاب اول: نمای کامل '+text+' روی زمینهٔ خنثی.\nقاب دوم: جزئیات بافت و نور از کنار.\nقاب سوم: '+text+' در مقیاس استفادهٔ روزمره.'; break;
        default: {
          const words=text.match(/[\p{L}\p{N}\u200c]+/gu)||[];
          const counts=new Map();
          words.forEach(word=>counts.set(word,(counts.get(word)||0)+1));
          result=Array.from(counts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([w,n])=>w+' × '+number.format(n)).join('، ') || 'واژه‌ای برای نمایه‌سازی وارد کن.';
        }
      }
      lab.querySelector('output').textContent=result;
    };
  }

  const scene = $('.scene-cycle');
  if (scene) {
    const header = $('.header');
    const dockHeader = () => header.toggleAttribute('data-docked',window.scrollY>40);
    dockHeader();
    window.addEventListener('scroll',dockHeader,{passive:true});
    const cases = [['cover','معماری پایدار'],['studio','طراحی کارگاه'],['courtyard','مرمت خانه']];
    const photo = $('.house>.art');
    let index=0;
    scene.onclick=()=>{
      index=(index+1)%cases.length;
      photo.src=cases[index][0]+'.svg';photo.alt=cases[index][1];
      scene.textContent=cases[index][1]+'　'+number.format(index+1)+' / ۳';
    };
  }
  const flower=$('.flower-button');
  if (flower) {
    let turns=0;
    flower.onclick=()=>{flower.firstElementChild.style.transform='rotate('+(++turns*90)+'deg)';};
  }
  const light=$('.lighting');
  if (light) light.onclick=()=>{
    const on=light.getAttribute('aria-pressed')!=='true';
    light.setAttribute('aria-pressed',String(on));
    light.setAttribute('aria-label',on?'خاموش کردن چراغ':'روشن کردن چراغ');
  };
  const inspect=$('[data-inspect]');
  if (inspect) inspect.onclick=()=>{
    const chosen=$$('.inspection input:checked').map(i=>i.parentElement.textContent);
    const message=$('.form textarea');
    if (chosen.length) message.value='درخواست بررسی '+chosen.join('، ');
    message.focus();
  };
})();