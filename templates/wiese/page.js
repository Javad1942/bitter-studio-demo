(() => {
  const bar=document.querySelector('.bar'), menu=bar.querySelector('.menu');
  function setMenu(open){bar.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open))}
  menu.onclick=()=>setMenu(!bar.classList.contains('open'));
  bar.querySelector('nav').onclick=()=>setMenu(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&bar.classList.contains('open')){setMenu(false);menu.focus()}});
  document.addEventListener('pointerdown',e=>{if(!bar.contains(e.target))setMenu(false)});
  const compact=()=>bar.classList.toggle('stuck',window.scrollY>85);
  window.addEventListener('scroll',compact,{passive:true});compact();
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('seen');observer.unobserve(entry.target)}},{threshold:.15});
  document.querySelectorAll('.stagger').forEach(e=>observer.observe(e));
  const form=document.querySelector('#request');
  for(const button of document.querySelectorAll('[data-choice]'))button.addEventListener('click',()=>{form.querySelector('select').value=button.dataset.choice});
  form.onsubmit=e=>{e.preventDefault();const data=new FormData(form);const title=document.querySelector('.brand').textContent.trim();const text=[title,data.get('type'),data.get('name'),data.get('email'),data.get('message')].join('\r\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.download='خلاصه-درخواست.txt';a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);form.querySelector('output').textContent='فایل درخواست آمادهٔ دریافت شد.'};
})();

