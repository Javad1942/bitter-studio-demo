'use strict';
const one=(s,root=document)=>root.querySelector(s);
const all=(s,root=document)=>[...root.querySelectorAll(s)];
const names=['طالبی و نعنا','لیمو و زنجبیل','توت و چای ترش','بستهٔ ترکیبی','اشتراک ماهانه','اشتراک دوهفته‌ای'];
const prices=[870000,870000,870000,910000,780000,750000];
const descriptions=['طالبی، نعنای تازه و یه جرعه ماته.','ترشی لیمو با تندی ملایم زنجبیل.','طعم ترش و شیرین توت با چای ترش.','از هر طعم چهار قوطی توی یه جعبه.','هر ماه یک بستهٔ دوازده‌تایی.','هر دو هفته یک بستهٔ دوازده‌تایی.'];
const fa=n=>n.toLocaleString('fa-IR');
const price=n=>fa(n)+' تومان';
const art=(id,badge='')=>'<span class="art art'+id+'"><img src="can.svg" alt="">'+(badge?'<small>'+badge+'</small>':'')+'</span>';
const rail=one('.rail');
let offset=0, selected=0;
const cart=Array(names.length).fill(0);
function paintProducts(){
  rail.replaceChildren();
  for(let i=0;i<4;i++){
    const id=(i+offset)%4, card=document.createElement('button');
    card.className='product';
    card.innerHTML=art(id,['پرطرفدار','','جدید',''][id])+'<h3>'+names[id]+'</h3><span class="chips"><small>۱۲ قوطی</small><small>۳۵۵ میلی‌لیتر</small></span><span class="product-bottom">'+price(prices[id])+'<i aria-hidden="true">↖</i></span>';
    card.onclick=()=>showProduct(id);
    rail.append(card);
  }
}
paintProducts();
all('[data-move]').forEach(b=>b.onclick=()=>{
  const step=Number(b.dataset.move),w=rail.firstElementChild.offsetWidth+parseFloat(getComputedStyle(rail).columnGap);
  if(rail.scrollWidth>rail.clientWidth+1){
    const end=Math.ceil(Math.abs(rail.scrollLeft)+rail.clientWidth)>=rail.scrollWidth;
    const left=step>0&&end?0:step<0&&Math.abs(rail.scrollLeft)<1?-rail.scrollWidth:rail.scrollLeft-step*w;
    rail.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  }else{offset=(offset+step+4)%4;paintProducts()}
});
function showProduct(id){
  selected=id;
  const dialog=one('#product');one('h2',dialog).textContent=names[id];one('p',dialog).textContent=descriptions[id];one('.product-art',dialog).innerHTML=art(id%4);one('.price',dialog).textContent=price(prices[id]);dialog.showModal();
}
function showCart(){
  const wrap=one('.cart-lines');
  wrap.replaceChildren();
  cart.forEach((n,id)=>{
    if(!n)return;
    const row=document.createElement('article');
    row.innerHTML='<span>'+names[id]+'<br><small>'+price(prices[id]*n)+'</small></span><button aria-label="کم کردن '+names[id]+'">−</button><b>'+fa(n)+'</b><button aria-label="بیشتر کردن '+names[id]+'">+</button>';
    all('button',row).forEach((button,i)=>button.onclick=()=>{cart[id]+=i===0?-1:1;showCart();const next=all('.cart-lines button')[Math.min(i,all('.cart-lines button').length-1)];(next||one('#cart .close')).focus()});
    wrap.append(row);
  });
  const total=cart.reduce((sum,n,id)=>sum+n*prices[id],0);
  if(!total)wrap.textContent='سبدت هنوز خالیه.';
  one('.total').textContent=total?'جمع سبد · '+price(total):'';
  const count=cart.reduce((sum,n)=>sum+n,0);
  all('.count').forEach(el=>el.textContent=count?fa(count):'');
  if(!one('#cart').open)one('#cart').showModal();
}
one('[data-hero-product]').onclick=()=>showProduct(0);
all('[data-pack]').forEach(b=>b.onclick=()=>showProduct(Number(b.dataset.pack)));
all('[data-cart]').forEach(b=>b.onclick=showCart);
one('.add').onclick=()=>{cart[selected]++;one('#product').close();showCart()};
all('dialog').forEach(d=>{one('.close',d).onclick=()=>d.close();d.onclick=e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}});
const menus=all('.dropdown').map(el=>[one('button',el),one('.sub',el)]).concat([[one('header .burger'),one('#mobile-menu')],[one('.dock .burger'),one('#dock-mobile')]]);
function closeMenus(){menus.forEach(([b,p])=>{b.setAttribute('aria-expanded','false');p.hidden=true})}
menus.forEach(([b,p])=>b.onclick=()=>{const open=p.hidden;closeMenus();p.hidden=!open;b.setAttribute('aria-expanded',String(open))});
document.addEventListener('click',e=>{if(!e.target.closest('.dropdown,.burger,#mobile-menu,#dock-mobile')||e.target.closest('.sub a'))closeMenus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=menus.find(([,p])=>!p.hidden);closeMenus();menu?.[0].focus()}});
one('.notice button').onclick=()=>{one('.notice').hidden=true;one('.stage header .word').setAttribute('tabindex','-1');one('.stage header .word').focus()};
new IntersectionObserver(([entry])=>{const dock=one('.dock');dock.inert=entry.isIntersecting;dock.classList.toggle('show',!entry.isIntersecting)}).observe(one('header'));
const pics=one('.pictures');[...names.slice(0,4),'ماتهٔ هویی'].forEach((name,i)=>{const item=document.createElement('figure');item.className='polaroid';item.innerHTML=art(i)+'<figcaption>'+name+'</figcaption>';pics.append(item)});
all('.photo-pair .art').forEach(el=>el.innerHTML='<img alt="" src="can.svg">');
one('form').onsubmit=e=>{e.preventDefault();one('output').textContent='پیامت آماده‌ست. در این پیش‌نمایش پیامی برای فروشگاه فرستاده نمی‌شه.'};
const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('arrive');observer.unobserve(target)}}),{threshold:.06});
all('.block,#contact').forEach(el=>observer.observe(el));
