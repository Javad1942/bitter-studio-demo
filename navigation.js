'use strict';

(() => {
  const mast=document.querySelector('.mast');
  const menu=document.getElementById('menub');
  const nav=document.getElementById('nav');
  if(!mast || !menu || !nav)return;
  const action=mast.querySelector('.nav-action');
  const desktop=matchMedia('(min-width:961px)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const menuText=document.createElement('span');
  for(const node of [...menu.childNodes])if(node.nodeType===Node.TEXT_NODE)node.remove();
  menuText.textContent='منو';
  menu.append(menuText);
  const mobileAction=action.cloneNode(true);
  mobileAction.className='mobile-action';
  nav.append(mobileAction);
  const clip=document.createElement('div');
  const sheet=document.createElement('div');
  clip.className='menu-clip';
  sheet.className='menu-sheet';
  sheet.append(...nav.children);
  clip.append(sheet);
  nav.append(clip);
  const dismiss=document.createElement('div');
  dismiss.className='menu-dismiss';
  dismiss.setAttribute('aria-hidden','true');
  mast.prepend(dismiss);
  const tones=['#dceaff','#ebe4ff','#ffc19c','#f1ffc9','#fff1c2','#dbf4e6'];
  [...nav.querySelectorAll('a')].forEach((link,i)=>{
    link.draggable=false;
    link.style.setProperty('--row',i);
    if(tones[i])link.style.setProperty('--menu-tone',tones[i]);
  });

  function toggle(open,returnFocus=false) {
    const wasOpen=nav.classList.contains('open');
    nav.classList.toggle('open',open);
    mast.classList.toggle('menu-open',open);
    document.documentElement.classList.toggle('mobile-nav-open',open);
    nav.inert=!desktop.matches && !open;
    menu.setAttribute('aria-expanded',String(open));
    menuText.textContent=open?'بستن':'منو';
    if(open && !wasOpen)sheet.scrollTop=0;
    if(!open && wasOpen && returnFocus)menu.focus({preventScroll:true});
  }
  menu.addEventListener('click',()=>toggle(menu.getAttribute('aria-expanded')!=='true'));
  mast.addEventListener('click',event=>{
    if(event.target.closest('a') && nav.classList.contains('open'))toggle(false);
  });
  dismiss.addEventListener('click',()=>toggle(false,true));
  mast.addEventListener('focusout',event=>{
    if(event.relatedTarget && !mast.contains(event.relatedTarget) && nav.classList.contains('open'))toggle(false);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && nav.classList.contains('open')){
      event.preventDefault();
      toggle(false,true);
    }
  });
  desktop.addEventListener('change',()=>{
    const focusedLink=nav.contains(document.activeElement);
    const focusedToggle=document.activeElement===menu;
    toggle(false);
    if(focusedLink && !desktop.matches)menu.focus({preventScroll:true});
    if(focusedToggle && desktop.matches)nav.querySelector('a').focus({preventScroll:true});
  });
  window.addEventListener('pagehide',()=>toggle(false));
  toggle(false);

  // The menu stays centered. Its measured width sets both edges of the dock.
  const bar=mast.querySelector('.bar');
  function measureDock() {
    if(!desktop.matches)return;
    mast.style.setProperty('--bar-half',(bar.clientWidth/2)+'px');
    mast.style.setProperty('--menu-width',nav.offsetWidth+'px');
    if(nav.classList.contains('highlight'))placeHighlight(hovered || focused);
  }
  const dockObserver=new ResizeObserver(measureDock);
  dockObserver.observe(nav);
  dockObserver.observe(bar);
  desktop.addEventListener('change',measureDock);
  function compact(){mast.classList.toggle('compact',scrollY>24)}
  window.addEventListener('scroll',compact,{passive:true});
  compact();

  // Move only the reflected highlight. The actual buttons retain their hit areas.
  const hasFinePointer=matchMedia('(hover:hover) and (pointer:fine)');
  let shineFrame=0, shineX=0;
  bar.addEventListener('pointermove',event=>{
    if(!hasFinePointer.matches || reduced.matches)return;
    shineX=event.clientX;
    if(!shineFrame)shineFrame=requestAnimationFrame(()=>{
      shineFrame=0;
      const rect=bar.getBoundingClientRect();
      const glass=getComputedStyle(bar,'::after');
      const left=parseFloat(glass.left)||0;
      const right=parseFloat(glass.right)||0;
      const fraction=Math.max(0,Math.min(1,(shineX-rect.left-left)/Math.max(1,rect.width-left-right)));
      mast.style.setProperty('--shine-x',(fraction*100).toFixed(1)+'%');
    });
  },{passive:true});
  bar.addEventListener('pointerleave',()=>{
    cancelAnimationFrame(shineFrame);shineFrame=0;mast.style.removeProperty('--shine-x');
  });

  const links=[...sheet.querySelectorAll('a:not(.mobile-action)')];
  const thumb=document.createElement('span');
  thumb.className='nav-thumb';
  thumb.setAttribute('aria-hidden','true');
  nav.prepend(thumb);
  let hovered=null, focused=null, scrub=null, skipClick=false;
  function placeHighlight(link) {
    if(!desktop.matches || !link){
      nav.classList.remove('highlight');
      return;
    }
    thumb.style.translate=link.offsetLeft+'px';
    thumb.style.width=link.offsetWidth+'px';
    if(!nav.classList.contains('highlight')){
      // Position the first highlight before revealing it at that link.
      thumb.getBoundingClientRect();
      nav.classList.add('highlight');
    }
  }
  function nearestLink(center){
    return links.reduce((best,link)=>
      Math.abs(link.offsetLeft+link.offsetWidth/2-center)<Math.abs(best.offsetLeft+best.offsetWidth/2-center)?link:best
    );
  }
  function clearDrag(){
    delete nav.dataset.scrubbing;
    thumb.style.removeProperty('scale');
    scrub=null;
    placeHighlight(hovered || focused);
  }
  nav.addEventListener('pointerover',event=>{
    const link=event.target.closest('a');
    if(!desktop.matches || scrub?.dragging || event.pointerType==='touch' || !link)return;
    hovered=link;
    placeHighlight(link);
  });
  nav.addEventListener('pointerleave',()=>{
    hovered=null;
    if(!scrub?.dragging)placeHighlight(focused);
  });
  nav.addEventListener('focusin',event=>{
    const link=event.target.closest('a:focus-visible');
    if(!desktop.matches || !link)return;
    focused=link;
    placeHighlight(link);
  });
  nav.addEventListener('focusout',()=>{
    focused=null;
    if(!scrub?.dragging)placeHighlight(hovered);
  });
  nav.addEventListener('pointerdown',event=>{
    const link=event.target.closest('a');
    if(!desktop.matches || !event.isPrimary || event.button!==0 || !link)return;
    placeHighlight(link);
    const left=Math.min(...links.map(item=>item.offsetLeft));
    const right=Math.max(...links.map(item=>item.offsetLeft+item.offsetWidth));
    scrub={id:event.pointerId,start:event.clientX,origin:link.offsetLeft,width:link.offsetWidth,left,right,
      y:event.clientY,lastX:event.clientX,time:event.timeStamp,target:link,dragging:false};
  });
  nav.addEventListener('pointermove',event=>{
    if(scrub?.id!==event.pointerId)return;
    const delta=event.clientX-scrub.start;
    if(!scrub.dragging){
      if(Math.abs(delta)<4 || Math.abs(delta)<Math.abs(event.clientY-scrub.y))return;
      nav.setPointerCapture(event.pointerId);
      nav.dataset.scrubbing='';
      scrub.dragging=true;
    }
    const x=Math.max(scrub.left,Math.min(scrub.right-scrub.width,scrub.origin+delta));
    scrub.target=nearestLink(x+scrub.width/2);
    const width=scrub.target.offsetWidth;
    thumb.style.translate=Math.min(x,scrub.right-width)+'px';
    thumb.style.width=width+'px';
    if(!reduced.matches){
      const speed=Math.abs(event.clientX-scrub.lastX)/Math.max(1,event.timeStamp-scrub.time);
      const stretch=Math.min(.14,speed*.08);
      thumb.style.scale=(1+stretch)+' '+(1-stretch/2);
    }
    scrub.lastX=event.clientX;
    scrub.time=event.timeStamp;
  });
  window.addEventListener('pointerup',event=>{
    if(scrub?.id!==event.pointerId)return;
    const link=scrub.dragging?scrub.target:null;
    if(link)hovered=event.pointerType==='mouse'?link:null;
    clearDrag();
    if(!link)return;
    link.click();
    skipClick=true;
    setTimeout(()=>{skipClick=false},0);
  });
  window.addEventListener('pointercancel',event=>{if(scrub?.id===event.pointerId)clearDrag()});
  desktop.addEventListener('change',()=>{hovered=null;focused=null;clearDrag()});
  nav.addEventListener('click',event=>{if(skipClick){event.preventDefault();event.stopImmediatePropagation()}},true);
  measureDock();
  if(!reduced.matches) menu.animate([{opacity:0},{opacity:1}],{duration:250});
})();
