'use strict';
const one=selector=>document.querySelector(selector);
const all=selector=>Array.from(document.querySelectorAll(selector));
const pixels=one('.pixels');
for(let y=0;y<8;y++){
  for(let x=0;x<20;x++){
    const cell=document.createElement('i');
    const noise=Math.sin((x+1)*71.41+(y+1)*21.93)*4658.31;
    const value=noise-Math.floor(noise);
    const fill=[.86,.6,.44,.23,.14,.07,.04,.02][y];
    if(value<fill)cell.className='red';
    else if(y>1&&value>1-fill*.47)cell.className='dark';
    pixels.append(cell);
  }
}
const sticky=one('.sticky');
new IntersectionObserver(([entry])=>{
  const show=!entry.isIntersecting&&entry.boundingClientRect.bottom<=0;
  sticky.classList.toggle('show',show);
  sticky.inert=!show;
}).observe(one('.top'));
const title=one('[data-template-title]'),defaultTitle=title.textContent;
new MutationObserver(()=>title.classList.toggle('custom',title.textContent!==defaultTitle)).observe(title,{subtree:true,childList:true,characterData:true});
const menu=one('#menu');
all('.burger').forEach(button=>button.onclick=()=>{
  menu.showModal();button.setAttribute('aria-expanded','true');
});
function closeMenu(){menu.close();}
menu.addEventListener('close',()=>all('.burger').forEach(btn=>btn.setAttribute('aria-expanded','false')));
all('#menu a').forEach(link=>link.addEventListener('click',closeMenu));
all('[data-close]').forEach(button=>button.onclick=()=>button.closest('dialog').close());
all('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}}));
all('.filters button').forEach(button=>button.onclick=()=>{
  all('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  all('.slot').forEach(slot=>slot.hidden=button.textContent!=='ط¸â€،ط¸â€¦ط¸â€،'&&slot.dataset.day!==button.textContent);
});
const form=one('#contact form');
all('[data-book]').forEach(button=>button.onclick=()=>{
  form.message.value='ط·آ¨ط·آ±ط·آ§ط؛إ’ ط¢آ«'+button.dataset.book+'ط¢آ» ط·آ§ط·آ·ط¸â€‍ط·آ§ط·آ¹ط·آ§ط·ع¾ ط·آ¨ط؛إ’ط·آ´ط·ع¾ط·آ±ط؛إ’ ط¸â€¦ط؛إ’أ¢â‚¬إ’ط·آ®ط¸ث†ط·آ§ط¸â€¦.';
  location.hash='contact';form.visitor.focus({preventScroll:true});
});
const pictures=all('[data-photo]'),lightbox=one('#lightbox');
let shown=0;
function showPhoto(index){
  shown=(index+pictures.length)%pictures.length;
  const src=pictures[shown].querySelector('img');
  const large=lightbox.querySelector('img');large.src=src.src;large.alt=src.alt;
  lightbox.querySelector('[aria-live]').textContent=src.alt;
}
pictures.forEach((button,index)=>button.onclick=()=>{showPhoto(index);lightbox.showModal()});
lightbox.querySelector('[data-prev]').onclick=()=>showPhoto(shown-1);
lightbox.querySelector('[data-next]').onclick=()=>showPhoto(shown+1);
lightbox.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();showPhoto(shown+(event.key==='ArrowLeft'?1:-1));}
});
form.addEventListener('submit',event=>{
  event.preventDefault();
  const text=['ط·آ¯ط·آ±ط·آ®ط¸ث†ط·آ§ط·آ³ط·ع¾ ط·آ¬ط·آ´ط¸â€ ط¸ث†ط·آ§ط·آ±ط¸â€،ط¸â€‌ ط¹آ©ط¸ث†ط·آ³ط·ع¾','ط¸â€ ط·آ§ط¸â€¦: '+form.visitor.value,'ط·آ§ط؛إ’ط¸â€¦ط؛إ’ط¸â€‍: '+form.email.value,form.message.value].join('\n');
  const file=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=file;a.download='ط·آ¯ط·آ±ط·آ®ط¸ث†ط·آ§ط·آ³ط·ع¾-ط¹آ©ط¸ث†ط·آ³ط·ع¾.txt';a.click();
  form.querySelector('output').textContent='ط¸ظ¾ط·آ§ط؛إ’ط¸â€‍ ط·آ¯ط·آ±ط·آ®ط¸ث†ط·آ§ط·آ³ط·ع¾ط·ع¾ ط·آ¢ط¸â€¦ط·آ§ط·آ¯ط¸â€،ط¸â€‌ ط·آ¯ط·آ§ط¸â€ ط¸â€‍ط¸ث†ط·آ¯ط¸â€،.';
  setTimeout(()=>URL.revokeObjectURL(file),10000);
});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const reveal=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      entry.target.classList.add('entering');
      reveal.unobserve(entry.target);
    }
  },{threshold:.02});
  all('.slots,.mosaic img,.passes,.gallery,details,.contact,.map').forEach(el=>reveal.observe(el));
}
