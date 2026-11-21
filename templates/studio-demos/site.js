'use strict';
const menu=document.querySelector('.menu-toggle');
const nav=document.getElementById('site-nav');
function toggle(open){nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'}
menu.addEventListener('click',()=>toggle(!nav.classList.contains('open')));
document.addEventListener('click',event=>{if(nav.contains(event.target)||!event.target.closest('.top'))toggle(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){toggle(false);menu.focus()}});
const modal=document.querySelector('dialog');
document.querySelectorAll('.zoom').forEach(button=>button.addEventListener('click',()=>{
 const thumb=button.querySelector('img');const full=modal.querySelector('img');
 full.src=thumb.src;full.alt=thumb.alt;modal.querySelector('p').textContent=button.getAttribute('aria-label');modal.showModal();
}));
modal.querySelector('button').onclick=()=>modal.close();
modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
const form=document.querySelector('form');
form.addEventListener('submit',event=>{
 event.preventDefault();const data=new FormData(form);
 const content=[document.title,data.get('name'),data.get('email'),data.get('message')].join('\r\n');
 const url=URL.createObjectURL(new Blob(['\uFEFF',content],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='درخواست-پروژه.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 form.querySelector('output').textContent='فایل درخواست روی دستگاه شما آماده شد.';
});

