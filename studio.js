'use strict';

const projects = ['vitalnetz','glanz','kost','hui','stempel','atem'].map(slug=>studioTemplates.find(p=>p.slug===slug));
const activeProjectIndex=()=>catalogDesigns.indexOf(projects[active]);
const stageArt = ['swatches','photos','window','launch'];
const stages = [
  ['انتخاب طرح','طرح‌ها رو ورق بزن و یکی که به سلیقه‌ات نزدیکه بردار.','رنگ‌ها، عکس‌ها و چیدمان رو کنار هم ببین. یه طرح رو باز کن و اسم برندت رو روش امتحان کن.'],
  ['ثبت درخواست','بگو چه سایتی می‌خوای و کد پیگیریت رو بگیر.','از کارت و چیزی که لازم داری برامون بنویس. راه تماست رو بذار تا دربارهٔ هزینه و زمان ساخت باهات هماهنگ کنیم.'],
  ['طراحی و ساخت','سایت رو با محتوای خودت می‌سازیم تا امتحانش کنی.','اولین نسخه رو با نوشته‌ها و عکس‌های خودت می‌بینی. صفحه‌ها رو روی گوشی و کامپیوتر امتحان می‌کنیم و تغییرها رو با هم مرور می‌کنیم.'],
  ['انتشار سایت','با تأیید تو، سایت روی دامنهٔ خودت بالا می‌آد.','وقتی جزئیات رو تأیید کردی، سایت رو برای انتشار آماده می‌کنیم. حالا وقتشه لینک سایتت رو برای اولین مشتریت بفرستی.']
];
const $ = id => document.getElementById(id);
const fa = value => value.toLocaleString('fa-IR');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let active = 0, step = 0, timer, paused = reduce.matches, heroVisible = true, caseIndex = 0;

// Positions are expressed in card widths, with the foremost card lowest in the fan.
const deck=$('deck');
const hero=document.querySelector('.hero');
const story=document.querySelector('.story');
const slots=[[.04,.20,-2],[-.28,.02,-8],[.30,-.06,7],[-.16,-.26,-4],[.22,-.32,9],[0,-.44,2]];
const order=projects.map((_,i)=>i);
const deckAccents=['#19c48e','#b8914a','#ff6a3d','#ff4fc1','#7a2bff','#3d7bf2'];
const motion=projects.map((_,i)=>({x:0,y:0,angle:i%2?3:-3,dx:0,dy:0,spin:0}));
const pointer={x:0,y:0};
let drag=null, suppressClick=null, lastFrame=0, frame=0, seconds=0, cardWidth=1;
let hoveringStory=false, focusedStory=false;

function animateDeck(now){
  frame=0;
  const dt=Math.min((now-lastFrame)/1000,1/30);
  lastFrame=now;
  seconds+=dt;
  order.forEach((index,depth)=>{
    const card=deck.children[index], state=motion[index];
    const [left,top,turn]=slots[depth];
    const moving=!reduce.matches;
    const parallax=(1-depth/order.length)*(moving?1:0);
    const held=drag?.index===index;
    const phase=index*1.7;
    const targetX=left*cardWidth+parallax*pointer.x*40;
    const targetY=top*cardWidth+parallax*pointer.y*28+(moving?5*Math.sin(seconds*.8+phase):0);
    const targetR=held?Math.max(-22,Math.min(22,drag.vx*.025)):
      turn+parallax*pointer.x*3+(moving?1.4*Math.sin(seconds*.6+phase):0);
    if(moving){
      if(!held){
        state.dx+=(120*(targetX-state.x)-13*state.dx)*dt;
        state.dy+=(120*(targetY-state.y)-13*state.dy)*dt;
        state.x+=state.dx*dt;state.y+=state.dy*dt;
      }
      state.spin+=((held?170:150)*(targetR-state.angle)-(held?12:11)*state.spin)*dt;
      state.angle+=state.spin*dt;
    }else if(!held){Object.assign(state,{x:targetX,y:targetY,angle:turn,dx:0,dy:0,spin:0});}
    card.style.transform='translate3d('+state.x.toFixed(2)+'px,'+state.y.toFixed(2)+'px,0) rotate('+state.angle.toFixed(2)+'deg)';
  });
  if(!reduce.matches && heroVisible && !document.hidden && !document.querySelector('dialog[open]'))frame=requestAnimationFrame(animateDeck);
}
function wakeDeck(){
  if(!frame && heroVisible && !document.hidden && !document.querySelector('dialog[open]')){lastFrame=performance.now();frame=requestAnimationFrame(animateDeck)}
}
function showDeck(index) {
  const current=order.indexOf(index);
  order.splice(current,1);order.unshift(index);
  active=index;
  document.documentElement.style.setProperty('--accent',deckAccents[index]);
  document.documentElement.style.setProperty('--wash',projects[index].wash);
  hero.style.setProperty('--deck-glow',deckAccents[index]);
  order.forEach((cardIndex,depth)=>{
    const card=deck.children[cardIndex];
    card.dataset.depth=depth;card.tabIndex=depth===0?0:-1;
    card.style.zIndex=String(order.length-depth);
  });
  if(!reduce.matches && current>0){
    motion[index].dy-=300;
    motion[index].spin+=motion[index].angle>0?-60:60;
  }
  wakeDeck();
}
function showStep(index) {
  step=index;
  $('step-count').textContent='قدم '+fa(step+1)+' از ۴';
  $('step-name').textContent=stages[step][0];
  $('step-copy').textContent=stages[step][1];
  const art=story.querySelector('.step-art');
  art.style.backgroundColor=['#d9efff','#ffe1f1','#ecf7c5','#ffecd1'][index];
  drawIllustration(art, stageArt[index]);
  if(!reduce.matches) story.querySelector('.story-row').animate(
    [{opacity:.1,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out'}
  );
  Array.from($('indicators').children).forEach((b,i)=>{
    b.classList.toggle('on',i<=step);
    b.setAttribute('aria-pressed',String(i===step));
  });
}
const slideDuration = 6000;
let remaining = slideDuration, startedAt = 0, progress;
function clock(restart = false) {
  clearTimeout(timer);
  if (startedAt) remaining = Math.max(0, remaining - (performance.now() - startedAt));
  startedAt = 0;
  if (restart === true) remaining = slideDuration;
  progress?.cancel();
  const bar = $('indicators').children[step].firstElementChild;
  progress = bar.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}], {duration:slideDuration,fill:'both'});
  progress.pause();
  progress.currentTime = slideDuration - remaining;
  wakeDeck();
  if (paused || !heroVisible || document.hidden || document.querySelector('dialog[open]') || hoveringStory || focusedStory) return;
  startedAt = performance.now();
  progress.play();
  timer = setTimeout(() => {
    showStep((step+1)%stages.length);
    clock(true);
  }, remaining);
}

function setPause(value) {
  paused=value;
  $('pause').textContent=paused?'▷':'Ⅱ';
  $('pause').setAttribute('aria-label',paused?'ادامهٔ ورق خوردن':'توقف ورق خوردن');
  $('pause').title=$('pause').getAttribute('aria-label');
  clock();
}

projects.forEach((p,index)=>{
  const card=document.createElement('button');
  card.className='deck-card';
  card.setAttribute('aria-label','طرح '+p.name+'، '+p.mood);
  card.innerHTML=preview(p)+foot({...p,dot:deckAccents[index]},false);
  card.onclick=()=>{
    if(suppressClick===card){suppressClick=null;return;}
    if(index===active)location.assign('design.html?name='+p.slug);
    else showDeck(index);
  };
  $('deck').append(card);
});
stages.forEach(([name,,detail],index)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label','قدم '+fa(index+1)+'، '+name);
  b.innerHTML='<i></i>';
  b.onclick=()=>{showStep(index);clock(true)};
  $('indicators').append(b);
  const article=document.createElement('article');
  article.innerHTML='<div class="stage-art" data-art="'+stageArt[index]+'"></div><small>قدم '+fa(index+1)+'</small><h3>'+name+'</h3><p>'+detail+'</p>';
  $('steps').append(article);
  drawIllustration(article.firstElementChild,stageArt[index]);
});
cardWidth=deck.children[0].offsetWidth;
showDeck(0);showStep(0);setPause(paused);
$('pause').onclick=()=>setPause(!paused);
reduce.addEventListener('change',e=>setPause(e.matches));
document.addEventListener('visibilitychange',clock);
new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;hero.classList.toggle('in-view',heroVisible);clock()}).observe(document.querySelector('.hero'));
const catalogue = mountDesignCatalogue({homepage:true,onDialogChange:clock});
$('new-brief').onclick=()=>catalogue.openBrief(activeProjectIndex());
document.querySelector('[data-brief]').onclick=()=>catalogue.openBrief(activeProjectIndex());
// A mouse pulls a card from its original slot. Touch keeps the page's native pan.
new ResizeObserver(entries=>{
  cardWidth=entries[0].borderBoxSize?.[0]?.inlineSize || deck.children[0].offsetWidth;
  wakeDeck();
}).observe(deck.children[0]);
window.addEventListener('pointermove',event=>{
  if(!heroVisible || reduce.matches || event.pointerType!=='mouse')return;
  pointer.x=event.clientX/innerWidth-.5;pointer.y=event.clientY/innerHeight-.5;
},{passive:true});
deck.addEventListener('pointerdown',event=>{
  const card=event.target.closest('.deck-card');
  if(!card || event.pointerType==='touch' || event.button!==0 || !event.isPrimary || drag)return;
  suppressClick=null;
  const index=Array.prototype.indexOf.call(deck.children,card);
  drag={id:event.pointerId,index,originX:event.clientX,originY:event.clientY,startX:motion[index].x,startY:motion[index].y,
    lastX:event.clientX,lastY:event.clientY,time:event.timeStamp,vx:0,vy:0,distance:0};
  card.setAttribute('data-grab','');
  card.style.zIndex='10';
  wakeDeck();
  card.setPointerCapture(event.pointerId);
});
window.addEventListener('pointermove',event=>{
  if(!drag || drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.originX,dy=event.clientY-drag.originY;
  drag.distance+=Math.abs(event.clientX-drag.lastX)+Math.abs(event.clientY-drag.lastY);
  const dt=Math.max(.001,(event.timeStamp-drag.time)/1000);
  drag.vx=drag.vx*.6+.4*(event.clientX-drag.lastX)/dt;
  drag.vy=drag.vy*.6+.4*(event.clientY-drag.lastY)/dt;
  drag.time=event.timeStamp;drag.lastX=event.clientX;drag.lastY=event.clientY;
  motion[drag.index].x=drag.startX+dx;motion[drag.index].y=drag.startY+dy;
  wakeDeck();
},{passive:true});
function release(event){
  if(!drag || drag.id!==event.pointerId)return;
  const {index,distance,vx,vy}=drag;
  drag=null;
  const card=deck.children[index];
  if(distance>6 && event.type==='pointerup'){
    suppressClick=card;
    setTimeout(()=>{if(suppressClick===card)suppressClick=null},0);
  }
  card.removeAttribute('data-grab');card.style.zIndex=String(order.length-order.indexOf(index));
  const carry=event.type==='pointerup' ? .6 : 0;
  motion[index].dx=vx*carry;motion[index].dy=vy*carry;
  wakeDeck();
}
window.addEventListener('pointerup',release);
window.addEventListener('pointercancel',release);
deck.addEventListener('lostpointercapture',release);
deck.addEventListener('keydown',event=>{
  if(event.key!=='ArrowLeft' && event.key!=='ArrowRight')return;
  event.preventDefault();
  showDeck((active+(event.key==='ArrowLeft'?1:-1)+projects.length)%projects.length);
  deck.children[active].focus({preventScroll:true});
});
story.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hoveringStory=true;clock()}});
story.addEventListener('pointerleave',()=>{hoveringStory=false;clock()});
story.addEventListener('focusin',()=>{focusedStory=true;clock()});
story.addEventListener('focusout',event=>{focusedStory=story.contains(event.relatedTarget);clock()});


function revealHeadline(){
  if(reduce.matches || !Element.prototype.animate)return;
  const title=$('headline'), original=title.cloneNode(true);
  const lines=title.innerHTML.split(/<br\s*\/?>/i).map(line=>line.trim());
  title.setAttribute('aria-label',lines.join(' '));
  const fragment=document.createDocumentFragment();
  let glyph=0;
  const animations=[];
  lines.forEach((line,lineIndex)=>{
    if(lineIndex)fragment.append(document.createElement('br'));
    for(const [wordIndex,word] of line.split(/\s+/).entries()){
      if(wordIndex)fragment.append(' ');
      const group=document.createElement('span');
      group.className='headline-word';group.setAttribute('aria-hidden','true');
      const measure=document.createElement('span');measure.className='word-space';measure.textContent=word;
      group.append(measure);
      // Reveal slices of the fully shaped word so joined Persian letters stay intact.
      const count=Array.from(word).filter(c=>!/[\u064b-\u065f\u200c]/.test(c)).length;
      for(let part=0;part<count;part++){
        const slice=document.createElement('span');slice.className='word-slice';slice.textContent=word;
        slice.style.clipPath='inset(-30% '+(part/count*100-.1)+'% -30% '+((count-part-1)/count*100-.1)+'%)';
        group.append(slice);
        animations.push(slice.animate([
          {opacity:0,transform:'translateY(.42em) scaleY(.68)'},
          {opacity:1,transform:'translateY(-.025em) scaleY(1.03)',offset:.68},
          {opacity:1,transform:'none'}
        ],{duration:1150,delay:120+glyph++*26,fill:'both',easing:'cubic-bezier(.2,.9,.25,1)'}));
      }
      fragment.append(group);
    }
  });
  title.replaceChildren(fragment);
  function finish(){
    title.replaceChildren(...original.childNodes);
    title.removeAttribute('aria-label');
    for(const animation of animations)animation.cancel();
  }
  animations.at(-1).addEventListener('finish',finish,{once:true});
}
revealHeadline();
