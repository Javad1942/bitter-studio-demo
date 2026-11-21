'use strict';

function setupProcess() {
  const panel = document.querySelector('#process');
  const row = panel.querySelector('#steps');
  const cards = Array.from(row.children);
  cards.forEach((card,index)=>{
    const badge=card.querySelector('small');
    badge.textContent=fa(index+1);
    badge.className='step-number';
    badge.setAttribute('aria-label','قدم '+fa(index+1));
    badge.parentNode.insertBefore(badge,card.querySelector('h3'));
  });
  const pin=panel.querySelector('.process-pin');
  const stage=panel.querySelector('.process-stage');
  const trail=stage.querySelector('.process-trail');
  trail.setAttribute('viewBox','0 0 1000 400');
  trail.querySelector('path').setAttribute('d',
    'M1020 266 C908 274 829 100 704 130 S532 311 452 286 C378 263 365 110 433 113 C522 111 500 233 377 242 S189 105 69 136 Q22 149 -22 179');
  const motion=matchMedia('(min-width:900px) and (min-height:580px) and (prefers-reduced-motion:no-preference)');
  const clamp=value=>Math.max(0,Math.min(1,value));
  const stagger=.45, dealLength=1+stagger*(cards.length-1), total=dealLength+.35;
  let frame=0, previous=0, progress=0, line=0, inView=false;
  const depth=[16,24,20,28];
  const aim={x:0,y:0};
  const drift={x:0,y:0,turn:0};
  function point(event){
    if(!inView || !motion.matches || event.pointerType!=='mouse')return;
    aim.x=event.clientX/innerWidth-.5;
    aim.y=event.clientY/innerHeight-.5;
    queue();
  }
  window.addEventListener('pointermove',point,{passive:true});
  function metrics(){
    const style=getComputedStyle(panel);
    const start=panel.getBoundingClientRect().top+scrollY+parseFloat(style.paddingTop);
    return {start, distance:Math.max(1,panel.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-pin.offsetHeight)};
  }
  function update(time){
    frame=0;
    if(!motion.matches)return;
    const {start,distance}=metrics();
    const target=clamp((scrollY-start)/distance);
    const trailTarget=clamp((scrollY-start+innerHeight*.7)/(distance+innerHeight*.7));
    const dt=previous?Math.min((time-previous)/1000,.1):1/60;
    previous=time;
    const follow=(a,b,tau)=>Math.abs(a-b)<.0001?b:b+(a-b)*Math.exp(-dt/tau);
    drift.x=follow(drift.x,aim.x,.125);
    drift.y=follow(drift.y,aim.y,.125);
    drift.turn=follow(drift.turn,aim.x,.167);
    progress=follow(progress,target,.145);
    line=follow(line,trailTarget,.34);
    stage.style.setProperty('--trail',line.toFixed(4));
    cards.forEach((card,i)=>{
      const t=clamp(progress*total-i*stagger);
      const spread=t<.5?4*t**3:1-4*(1-t)**3;
      card.style.setProperty('--fan',spread.toFixed(4));
      card.style.setProperty('--pointer-x',(drift.x*depth[i]*2).toFixed(2)+'px');
      card.style.setProperty('--pointer-y',(drift.y*depth[i]*1.5).toFixed(2)+'px');
      card.style.setProperty('--pointer-turn',(drift.turn*depth[i]*.14).toFixed(2)+'deg');
    });
    if(progress!==target || line!==trailTarget || drift.x!==aim.x || drift.y!==aim.y || drift.turn!==aim.x)queue();
  }
  function queue(){
    if(inView&&motion.matches&&!frame)frame=requestAnimationFrame(update);
  }
  function layout(){
    if(!motion.matches)return;
    const center=row.clientWidth/2;
    cards.forEach((card,i)=>{
      const slot=(cards.length-1)/2-i;
      card.style.setProperty('--offset',(center-card.offsetLeft-card.offsetWidth/2)+'px');
      card.style.setProperty('--pile',[5,-4,2,-6][i]+'deg');
      card.style.setProperty('--turn',slot*4+'deg');
      card.style.setProperty('--stack-y',-6*i+'px');
      card.style.setProperty('--level',(Math.abs(slot)*26-14)+'px');
      card.style.setProperty('--z',cards.length-i);
    });
    queue();
  }
  new ResizeObserver(layout).observe(row);
  new IntersectionObserver(([entry])=>{
    inView=entry.isIntersecting;
    previous=0;
    if(inView){window.addEventListener('scroll',queue,{passive:true});queue()}
    else{window.removeEventListener('scroll',queue);cancelAnimationFrame(frame);frame=0}
  },{rootMargin:'20% 0px'}).observe(panel);
  motion.addEventListener('change',layout);
  layout();

  // A link to the process opens the settled hand, with room to scroll either way.
  function land(behavior){
    if(!motion.matches){
      const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
      const margin=parseFloat(getComputedStyle(panel).scrollMarginTop)||0;
      window.scrollTo({top:scrollY+panel.getBoundingClientRect().top-padding-margin,behavior});
      return;
    }
    const {start,distance}=metrics();
    const landing=(dealLength+.175)/total;
    const dest=Math.round(start+distance*landing);
    if(behavior==='instant'){
      progress=landing;
      line=clamp((dest-start+innerHeight*.7)/(distance+innerHeight*.7));
    }
    window.scrollTo({top:dest,behavior});queue();
  }
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href]');
    if(!motion.matches||!a||a.hash!=='#process'||a.origin!==location.origin||
       a.pathname!==location.pathname||event.defaultPrevented||event.button!==0||
       event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    if(location.hash!=='#process')history.pushState(null,'','#process');
    land('smooth');
  });
  const restoreHash=()=>{if(location.hash==='#process')land('instant')};
  window.addEventListener('hashchange',restoreHash);
  if(location.hash==='#process'){
    const listeners=new AbortController();
    const root=document.documentElement;
    root.dataset.processArrival='';
    const stop=()=>{listeners.abort();delete root.dataset.processArrival};
    const align=()=>{if(!listeners.signal.aborted)restoreHash()};
    for(const input of ['wheel','touchstart','pointerdown','keydown'])window.addEventListener(input,stop,{passive:true,signal:listeners.signal});
    window.addEventListener('pageshow',align,{signal:listeners.signal});
    requestAnimationFrame(align);
    Promise.all([document.fonts.ready,new Promise(resolve=>{
      if(document.readyState==='complete')resolve();else window.addEventListener('load',resolve,{once:true});
    })]).then(()=>requestAnimationFrame(()=>{
      align();
      requestAnimationFrame(()=>{align();stop()});
    }));
  }
}

function setupGame() {
  const arena=document.querySelector('.game-arena');
  const canvas=document.querySelector('#field-game');
  const ctx=canvas.getContext('2d');
  const play=document.querySelector('#play');
  const result=document.querySelector('#result');
  const board=document.querySelector('.playscore');
  let state='ready', basket=300, ball, caught=0, missed=0, previousTime=0, frame;
  const keys=new Set(), width=600, height=250;
  function spawnBall() {
    const weight = Math.random()<.17 ? 2 : 1;
    return {x:14+Math.random()*(width-28),y:-12,weight,color:weight===2?'#1b1933':projects[Math.floor(Math.random()*projects.length)].dot};
  }
  function paint() {
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle=ball.color;
    ctx.beginPath(); ctx.arc(ball.x,ball.y,12,0,Math.PI*2); ctx.fill();
    if (ball.weight===2) {
      ctx.fillStyle='#fff';ctx.font='bold 12px Tahoma';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('×۲',ball.x,ball.y);
    }
    ctx.fillStyle='#252433';
    ctx.beginPath();ctx.roundRect(basket-33,222,66,10,[2,2,8,8]);ctx.fill();
  }
  function scores() {
    document.querySelector('#score').textContent='امتیاز '+fa(caught);
    document.querySelector('#misses').textContent='از دست رفته '+fa(missed);
  }
  function pause() {
    if(state!=='playing')return;
    state=arena.dataset.gameState='paused';cancelAnimationFrame(frame);
    keys.clear();play.textContent='ادامهٔ بازی';
  }
  function tick(time) {
    if(state!=='playing')return;
    const dt=Math.min(.04,(time-previousTime)/1000);
    previousTime=time;
    const direction=Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft'));
    basket=Math.max(33,Math.min(width-33,basket+direction*370*dt));
    const lastY=ball.y;
    ball.y+=(126+caught*4)*dt;
    if(lastY<213 && ball.y>=213 && Math.abs(ball.x-basket)<=38) {caught=Math.min(20,caught+ball.weight);ball=spawnBall();scores();}
    if(ball.y>height+10) {missed++;ball=spawnBall();scores();}
    paint();
    if(caught===20||missed===3) {
      state=arena.dataset.gameState='finished';
      result.textContent=caught===20?'بیست امتیاز گرفتی!':'پایان بازی با '+fa(caught)+' امتیاز';
      play.textContent='یک بار دیگر';return;
    }
    frame=requestAnimationFrame(tick);
  }
  play.addEventListener('click',()=>{
    if(state==='playing'){pause();return;}
    if(state!=='paused'){caught=0;missed=0;basket=300;ball=spawnBall();scores();}
    state=arena.dataset.gameState='playing';
    board.hidden=canvas.hidden=false;
    result.textContent='';play.textContent='مکث';
    canvas.focus({preventScroll:true});keys.clear();previousTime=performance.now();
    frame=requestAnimationFrame(tick);
  });
  function point(event) {
    if(state!=='playing')return;
    const box=canvas.getBoundingClientRect();
    basket=Math.max(33,Math.min(width-33,(event.clientX-box.left)*width/box.width));
  }
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);point(event)});
  canvas.addEventListener('pointermove',point);
  canvas.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();keys.add(event.key);}
    if(event.key==='Escape'){pause();play.focus();}
  });
  canvas.addEventListener('keyup',event=>keys.delete(event.key));
  canvas.addEventListener('blur',()=>keys.clear());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
  new IntersectionObserver(([entry])=>{if(!entry.isIntersecting) pause()}).observe(arena);
}
setupProcess();
setupGame();
document.querySelectorAll('[data-service]').forEach(button=>{
  button.addEventListener('click',()=>{
    const field=document.querySelector('#brief-form [name=service]');
    field.value=button.dataset.service;
    catalogue.openBrief(activeProjectIndex());
  });
});
// Keep the current destination visible in the compact navigation.
const navLinks=[...document.querySelectorAll('#nav a[href^="#"]')];
const seen=new Set();
const navSections=new IntersectionObserver(entries=>{
  for(const entry of entries) {
    if(entry.isIntersecting)seen.add(entry.target.id);else seen.delete(entry.target.id);
  }
  for(const link of navLinks) {
    if(seen.has(link.hash.slice(1)))link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  }
},{rootMargin:'-14% 0px -60%'});
for(const link of navLinks)navSections.observe(document.getElementById(link.hash.slice(1)));

document.querySelector('[data-question-brief]').addEventListener('click',()=>catalogue.openBrief(activeProjectIndex()));

function setupPanelMotion(){
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const panels=[...document.querySelectorAll('#why,#process,#pricing,#faq,#game')];
  const titles=[...document.querySelectorAll('#main .section-head h2')];
  const visible=new Set(), headings=new Map(), orbs=new Map();
  const clamp=value=>Math.max(0,Math.min(1,value));
  for(const panel of panels)orbs.set(panel,[...panel.querySelectorAll('.panel-orb')]);
  // Each piece contains a fully shaped Persian word. Stretching individual
  // Arabic characters would replace their connected forms with isolated glyphs.
  for(const title of titles){
    const text=title.textContent.trim();
    title.setAttribute('aria-label',text);
    const words=text.split(/\s+/).map(word=>{
      const span=document.createElement('span'), ink=document.createElement('span');
      span.className='stretch-word';span.setAttribute('aria-hidden','true');
      span.textContent=word;ink.className='stretch-ink';ink.textContent=word;
      span.append(ink);return span;
    });
    title.replaceChildren();
    words.forEach((word,i)=>{if(i)title.append(' ');title.append(word)});
    headings.set(title,{words,progress:null});
  }
  let frame=0, previous=0, faqProgress=null;
  function queue(){if(!frame&&!reduced.matches)frame=requestAnimationFrame(paint)}
  function paint(time){
    frame=0;
    const height=window.innerHeight, dt=previous?Math.min((time-previous)/1000,.1):1/60;
    previous=time;
    let catchingUp=false;
    for(const element of visible){
      const box=element.getBoundingClientRect();
      const heading=headings.get(element);
      if(heading){
        const target=clamp((height*.94-box.top)/(height*.46));
        if(heading.progress===null||Math.abs(target-heading.progress)<.001)heading.progress=target;
        else{heading.progress=target+(heading.progress-target)*Math.exp(-dt/.11);catchingUp=true}
        const count=heading.words.length;
        heading.words.forEach((word,i)=>{
          const p=clamp(heading.progress*(1+.1*(count-1))-.1*i);
          const remaining=(1-p)**3;
          word.style.setProperty('--stretch-y',(1+1.4*remaining).toFixed(3));
          word.style.setProperty('--stretch-x',(1-.28*remaining).toFixed(3));
          word.style.setProperty('--stretch-weight',Math.round(430+375*remaining));
        });
      }else{
        element.style.setProperty('--dome-progress',clamp((box.top-height*.18)/(height*.82)).toFixed(4));
        if(element.id==='faq'){
          const target=clamp((height-box.top-box.height*.45)/((height+box.height)*.55));
          if(faqProgress===null || Math.abs(faqProgress-target)<.0001)faqProgress=target;
          else{faqProgress=target+(faqProgress-target)*Math.exp(-dt/.28);catchingUp=true}
          element.style.setProperty('--faq-offset',(1-faqProgress).toFixed(4));
        }
        const progress=clamp((height-box.top)/(height+box.height));
        for(const [i,orb] of orbs.get(element).entries()){
          const speed=element.id==='pricing'?[1.2,.7][i]:1;
          orb.style.setProperty('--drift',((.5-progress)*140*speed).toFixed(2)+'%');
        }
      }
    }
    if(catchingUp)queue();else previous=0;
  }
  const observe=new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries){
      if(isIntersecting)visible.add(target);
      else{
        visible.delete(target);
        const heading=headings.get(target);if(heading)heading.progress=null;
      }
    }
    queue();
  },{rootMargin:'25% 0px'});
  for(const el of [...panels,...titles])observe.observe(el);
  window.addEventListener('scroll',queue,{passive:true});
  window.addEventListener('resize',queue);
  reduced.addEventListener('change',queue);

  const mobileMotion=matchMedia('(max-width:899px) and (prefers-reduced-motion:no-preference)');
  const steps=[...document.querySelectorAll('#steps article')], flights=new Map();
  const reveal=new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries){
      if(!mobileMotion.matches || !isIntersecting)continue;
      reveal.unobserve(target);
      target.classList.remove('awaiting-flight');
      const turn=steps.indexOf(target)%2?-9:9;
      const effect=target.animate([
        {opacity:0,transform:'translateY(90px) rotate('+turn+'deg)'},
        {opacity:1,transform:'none'}
      ],{duration:1000,easing:'cubic-bezier(.165,.84,.44,1)'});
      flights.set(target,effect);
      effect.onfinish=()=>flights.delete(target);
    }
  },{rootMargin:'0px 0px -8% 0px'});
  function mode(){
    reveal.disconnect();
    for(const effect of flights.values())effect.cancel();
    flights.clear();
    for(const card of steps){
      const upcoming=mobileMotion.matches&&card.getBoundingClientRect().top>innerHeight*.92;
      card.classList.toggle('awaiting-flight',upcoming);
      if(upcoming)reveal.observe(card);
    }
  }
  mode();mobileMotion.addEventListener('change',mode);
}
setupPanelMotion();

function openLinkedBrief() {
  if(location.hash==='#start-brief' && !document.querySelector('#brief').open){
    document.querySelector('#new-brief').click();
    history.replaceState(history.state,'',location.pathname+location.search+'#main');
  }
}
window.addEventListener('hashchange',openLinkedBrief);
window.addEventListener('pageshow',openLinkedBrief);

// Reflow can move a section by thousands of pixels on rotation. Keep the
// item the visitor was reading at the same point in the resized viewport.
(() => {
  const main=document.querySelector('main');
  const targets='a.gallery-card,.why article,#steps article,#pricing article,.faq-list details,.studio-profile,.hero,.sectors,.section,footer';
  const process=document.getElementById('process'), pin=process.querySelector('.process-pin');
  const steps=[...process.querySelectorAll('#steps article')];
  function pinnedTrack(){
    if(getComputedStyle(pin).position!=='sticky')return null;
    const css=getComputedStyle(process);
    return {
      top:scrollY+process.getBoundingClientRect().top+parseFloat(css.paddingTop),
      span:process.clientHeight-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom)-pin.offsetHeight
    };
  }
  let width=document.documentElement.clientWidth, mark=null, frame=0;
  function remember(){
    if(document.documentElement.clientWidth!==width || document.querySelector('dialog[open]'))return;
    const y=innerHeight*.42;
    if(scrollY<8){mark=null;return}
    const node=document.elementFromPoint(innerWidth/2,y)?.closest(targets);
    const section=node || [...main.children].find(el=>{
      const rect=el.getBoundingClientRect();return rect.top<=y && rect.bottom>y;
    });
    if(!section)return;
    const bounds=section.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(y-bounds.top)/Math.max(bounds.height,1)));
    const track=process.contains(section)?pinnedTrack():null;
    if(track&&scrollY>=track.top&&scrollY<=track.top+track.span){
      mark={section:process,ratio:(scrollY-track.top)/track.span,wasPinned:true};
    }else mark={section,ratio};
  }
  function resize(){
    const next=document.documentElement.clientWidth;
    if(next===width)return;
    width=next;
    if(!mark || document.querySelector('dialog[open]'))return;
    let {section,ratio,wasPinned}=mark;
    if(!section.isConnected || !section.offsetHeight)return;
    const track=process.contains(section)?pinnedTrack():null;
    const stepNumber=steps.indexOf(section);
    if(track&&(wasPinned||stepNumber!==-1)){
      const progress=wasPinned?ratio:(1+stepNumber*.45)/2.7;
      window.scrollTo({top:track.top+track.span*progress,behavior:'instant'});
      return;
    }
    if(wasPinned){
      section=steps[Math.min(steps.length-1,Math.floor(ratio*steps.length))];
      ratio=.42;
    }
    const rect=section.getBoundingClientRect();
    const delta=rect.top+rect.height*ratio-innerHeight*.42;
    if(Math.abs(delta)>2)window.scrollBy({top:delta,behavior:'instant'});
  }
  window.addEventListener('scroll',()=>{
    if(!frame)frame=requestAnimationFrame(()=>{frame=0;remember()});
  },{passive:true});
  window.addEventListener('resize',resize);
  window.addEventListener('pageshow',remember);
})();
