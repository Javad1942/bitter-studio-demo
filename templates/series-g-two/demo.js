const one = (selector, scope = document) => scope.querySelector(selector);
const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fa = new Intl.NumberFormat('fa-IR');
const dialog = one('dialog');
const content = one('.dialog-body');
const contact = one('#contact');
const message = one('textarea', contact);
const page = document.body.className;

function make(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function control(label, callback, className = 'btn') {
  const button = make('button', label, className);
  button.type = 'button';
  button.addEventListener('click', callback);
  return button;
}
function openDialog(title, description, image) {
  content.replaceChildren();
  if (image) {
    const picture = make('img');
    picture.src = image;
    picture.alt = title;
    content.append(picture);
  }
  const heading = make('h2', title);
  heading.id = 'dialog-title';
  content.append(heading);
  if (description) content.append(make('p', description));
  if (!dialog.open) dialog.showModal();
}
one('.dismiss').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
function prepareRequest(subject) {
  if (dialog.open) dialog.close();
  message.value = subject;
  contact.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth' });
  one('input',contact).focus({preventScroll:true});
}
function closeMenus(except = null) {
  all('[aria-controls].burger, .aura-menu').forEach(button => {
    if (button === except) return;
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
  });
}
all('[aria-controls].burger, .aura-menu').forEach(button => {
  const menu = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', () => {
    closeMenus(button);
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
  });
});
document.addEventListener('click', event => {
  if (!event.target.closest('.mobile-links, .burger, .aura-menu') || event.target.closest('.mobile-links a, .mobile-links button')) closeMenus();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !dialog.open) {
    const active = one('[aria-expanded=true].burger,.aura-menu[aria-expanded=true]');
    closeMenus();
    active?.focus();
  }
});
const header = one('.mast.float');
const hero = one('.hero');
if (page === 'trubel') {
  const poster = one('.poster-bg');
  const narrow = matchMedia('(max-width:767px)');
  function fitPoster() {
    if (!['lake.webp','lake-portrait.webp'].includes(poster.getAttribute('src'))) return;
    poster.src = narrow.matches ? 'lake-portrait.webp' : 'lake.webp';
  }
  fitPoster();
  narrow.addEventListener('change', fitPoster);
}
function updateHeader() {
  const visible = scrollY > Math.min(320, hero.offsetHeight * .48);
  if (visible !== header.classList.contains('shown')) {
    header.classList.toggle('shown',visible);
    closeMenus();
  }
}
addEventListener('scroll',updateHeader,{passive:true});
updateHeader();
document.body.classList.add('reveal-on');

all('[data-detail]').forEach(button => button.addEventListener('click', () => {
  const {detail, text, img} = button.dataset;
  openDialog(detail, text, img + '.webp');
  content.append(control(page === 'trubel' ? 'انتخاب برنامه' : 'پرسش دربارهٔ گیاه', () => prepareRequest('درخواست اطلاعات دربارهٔ ' + detail)));
}));
const tiles = all('.gallery-tile');
let selected = 0;
function showImage(index) {
  selected = (index + tiles.length) % tiles.length;
  const picture = one('img',tiles[selected]);
  openDialog(picture.alt, '', picture.getAttribute('src'));
  const bar = make('div','','modal-controls');
  bar.append(control('قبلی',() => showImage(selected-1)), make('span', fa.format(selected+1)+' از '+fa.format(tiles.length)), control('بعدی',() => showImage(selected+1)));
  content.append(bar);
}
tiles.forEach((tile,index) => {
  if (page === 'trubel') {
    const activate = () => tiles.forEach(item => item.setAttribute('aria-pressed',String(item===tile)));
    tile.addEventListener('pointerenter',event => {if (event.pointerType === 'mouse') activate();});
    tile.addEventListener('focus',activate);
    tile.addEventListener('click',() => {activate();showImage(index);});
  } else {
    tile.removeAttribute('aria-pressed');
    tile.addEventListener('click', () => showImage(index));
  }
});
dialog.addEventListener('keydown',event => {
  if (!one('.modal-controls',content)) return;
  if (event.key==='ArrowLeft' || event.key==='ArrowRight') {
    event.preventDefault();
    showImage(selected + (event.key==='ArrowLeft' ? 1 : -1));
  }
});
one('[data-route]')?.addEventListener('click',event => {
  const directions = one('.directions');
  directions.hidden=!directions.hidden;
  event.currentTarget.setAttribute('aria-expanded',String(!directions.hidden));
  event.currentTarget.textContent=directions.hidden ? 'دیدن مسیر' : 'بستن راهنما';
});

if (page === 'kalma') {
  const shop = [
    {title:'ترکیب تمرکز',flavour:'رزماری و مرکبات، با رایحه‌ای روشن برای صبح.',image:'focus',price:290},
    {title:'ترکیب هماهنگی',flavour:'بادرنجبویه و گیاهان باغ، برای یک مکث عصرانه.',image:'harmony',price:320},
    {title:'ترکیب شب',flavour:'گل‌های ملایم و دانه‌های معطر، برای آیین پایان روز.',image:'night',price:320}
  ];
  const quantities = shop.map(() => 0);
  function showBag() {
    const total = quantities.reduce((sum,n) => sum+n,0);
    openDialog('سبد انتخاب‌ها',total ? '' : 'هنوز ترکیبی انتخاب نکرده‌ای.');
    shop.forEach((item,i) => {
      if (!quantities[i]) return;
      const row = make('div');
      row.append(make('span',item.title+' · '+fa.format(quantities[i])+' عدد '),control('کم کردن',() => {
        quantities[i]--;updateCount();showBag();
      },'mini'));
      content.append(row);
    });
    if (total) {
      const price = shop.reduce((sum,item,i) => sum+item.price*quantities[i],0);
      content.append(make('p','جمع انتخاب‌ها '+fa.format(price)+' هزار تومان'),control('نوشتن درخواست',() => prepareRequest(shop.flatMap((item,i) => quantities[i] ? [item.title+' × '+fa.format(quantities[i])] : []).join('، '))));
    }
  }
  function updateCount() {one('.quantity').textContent=fa.format(quantities.reduce((a,b)=>a+b,0));}
  all('[data-bag]').forEach(button=>button.addEventListener('click',showBag));
  all('[data-product]').forEach(button=>button.addEventListener('click',()=>{
    const i=Number(button.dataset.product),item=shop[i];
    openDialog(item.title,item.flavour+' '+fa.format(item.price)+' هزار تومان.',item.image+'.webp');
    content.append(control('افزودن به سبد انتخاب‌ها',()=>{quantities[i]++;updateCount();showBag();}));
  }));
  const rail=one('.product-rail');
  all('[data-rail]').forEach(button=>button.addEventListener('click',()=>{
    const products=all('article',rail);
    const visible=rail.clientWidth;
    if (rail.scrollWidth<=visible+2) {
      const last=products.at(-1);
      if (button.dataset.rail==='prev') rail.prepend(last);else rail.append(products[0]);
      return;
    }
    const step=products[0].offsetWidth+13;
    const edge=rail.scrollWidth-visible;
    let left=rail.scrollLeft+(button.dataset.rail==='next'?step:-step);
    if (button.dataset.rail==='next' && rail.scrollLeft>=edge-2) left=0;
    if (button.dataset.rail==='prev' && rail.scrollLeft<=2) left=edge;
    rail.scrollTo({left,behavior:reduced.matches?'instant':'smooth'});
  }));
  all('.faq details').forEach(row=>row.addEventListener('toggle',()=>{
    if(row.open) all('.faq details').forEach(other=>{if(other!==row)other.open=false;});
  }));
  const ritual=one('#ritual'), timer=one('time',ritual),start=one('[data-timer]');
  let remaining=180,deadline=0,tick=0;
  function renderTime(){
    if(deadline)remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    timer.textContent=[Math.floor(remaining/60),remaining%60].map(value=>value.toLocaleString('fa-IR',{minimumIntegerDigits:2,useGrouping:false})).join(':');
    if(!remaining){clearInterval(tick);deadline=0;start.textContent='از نو';}
  }
  start.addEventListener('click',()=>{
    if(deadline){renderTime();clearInterval(tick);deadline=0;start.textContent='ادامه';}
    else{if(!remaining)remaining=180;deadline=Date.now()+remaining*1000;start.textContent='مکث';renderTime();tick=setInterval(renderTime,250);}
  });
  one('.timer-close').addEventListener('click',()=>{ritual.hidden=true;one('.aura-dot').focus({preventScroll:true});});
  one('.aura-dot').addEventListener('click',()=>{ritual.hidden=!ritual.hidden;if(!ritual.hidden)start.focus({preventScroll:true});});
  addEventListener('pagehide',()=>clearInterval(tick));
}
one('form',contact).addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget, data=new FormData(form);
  const text='درخواست '+one('title').textContent.split('|')[0].trim()+'\n\nنام: '+data.get('name')+'\nایمیل: '+data.get('email')+'\n\n'+data.get('note');
  const url=URL.createObjectURL(new Blob(['\uFEFF',text],{type:'text/plain;charset=utf-8'})),link=make('a');
  link.href=url;link.download=page+'-request.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  one('output',form).textContent='فایل درخواست برای دریافت آماده شد.';
});