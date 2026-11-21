'use strict';

(() => {
  const params = new URLSearchParams(location.search);
  const index = catalogDesigns.findIndex(project => project.slug === params.get('name'));
  const project = catalogDesigns[index];
  const byId = id => document.getElementById(id);
  const main = document.querySelector('main');
  if (!project) {
    main.className = 'shell missing-design';
    main.innerHTML = '<h1>طرح پیدا نشد</h1><a class="pill primary" href="designs.html">بازگشت به طرح‌ها</a>';
    return;
  }
  const sampleURL = project.template ? templatePath(project) : 'design-preview.html?name=' + encodeURIComponent(project.slug);
  const pageURL = 'design.html?name=' + encodeURIComponent(project.slug);
  if (document.body.classList.contains('sample-site')) {
    if(project.template){location.replace(sampleURL);return}
    document.title = project.name + ' | پیش‌نمایش طرح';
    document.documentElement.style.setProperty('--sample-bg', project.bg);
    document.documentElement.style.setProperty('--sample-ink', project.ink);
    document.documentElement.style.setProperty('--sample-dot', project.dot);
    main.innerHTML = preview(project) + pageStrip(project) +
      '<section id="concept-story" class="sample-story"><span>دربارهٔ '+project.name+'</span><h2>'+project.section+'</h2><p>'+project.desc+'</p></section>'+
      '<footer class="sample-footer"><strong>'+project.name+'</strong><a href="'+pageURL+'" target="_top">مشخصات این طرح در Bitter</a></footer>';
    const face = main.querySelector('.face');
    face.removeAttribute('aria-hidden');
    const title = face.querySelector('.face-title');
    const heading = document.createElement('h1');
    heading.className=title.className; heading.innerHTML=title.innerHTML; title.replaceWith(heading);
    const strip=main.querySelector('.sample-strip');
    strip.id='collection'; strip.removeAttribute('aria-hidden');
    const action=face.querySelector('.face-action'),link=document.createElement('a');
    link.className=action.className;link.textContent=action.textContent;link.href='#collection';action.replaceWith(link);
    const nav=face.querySelector('.microbar small');
    const labels=project.sub.split('　').map(x=>x.trim());
    nav.innerHTML='<a href="#collection">'+labels[0]+'</a><a href="#concept-story">'+labels[1]+'</a>';
    return;
  }

  document.title='طرح '+project.name+' برای '+project.field+' | Bitter Studio';
  const color=project.dot;
  const channels=color.match(/[0-9a-f]{2}/gi).map(pair=>parseInt(pair,16)/255)
    .map(channel=>channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4);
  const luminance=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
  document.documentElement.style.setProperty('--case-accent',color);
  document.documentElement.style.setProperty('--case-accent-ink',luminance>.2?'#15152c':'#fff');
  document.documentElement.style.setProperty('--accent',color);
  byId('case-industry').textContent='طراحی وب‌سایت برای '+project.field;
  const name=byId('case-title');
  const length=Math.max(1,[...project.name].filter(letter=>letter.trim()&&letter!=='‌').length);
  name.style.setProperty('--title-wide',(44/(length*.56))+'cqw');
  name.style.setProperty('--title-narrow',(96/(length*.56))+'cqw');
  project.name.split(/\s+/).forEach((word,index)=>{
    const part=document.createElement('span');
    part.className='case-word';part.textContent=word;part.style.setProperty('--word-index',index);
    if(index)name.append(' ');
    name.append(part);
  });

  const fieldsURL='designs.html?field='+encodeURIComponent(project.field);
  const list=new Intl.ListFormat('fa',{style:'long',type:'conjunction'});
  const descriptions=project.entries.map(entry=>'«'+entry+'»');
  byId('case-copy').textContent=project.desc+' در صفحهٔ اصلی '+list.format(descriptions)+' را می‌بینید.';
  byId('case-facts').innerHTML='<a class="case-field" href="'+fieldsURL+'">'+project.field+
    '</a><span class="fact-link">'+project.layout+'</span><span class="fact-link"><i style="background:'+color+'"></i>'+project.mood+'</span>';
  byId('view-full').href=sampleURL;
  byId('view-address').href=sampleURL;
  if(project.template){
    const source=byId('case-source');
    source.hidden=false;
    source.querySelector('a').href='https://app.moodo.studio/seite/'+project.slug;
    if(project.comparison){
      const compare=document.createElement('a');
      compare.href='compare/'+project.comparison+'/index.html#name='+encodeURIComponent(project.slug);
      compare.textContent='مقایسهٔ موبایل و دسکتاپ با مودو';
      source.append(compare);
    }
  }
  const filters=new URLSearchParams();
  for(const key of ['search','mood','field']) if(params.get(key))filters.set(key,params.get(key));
  const back=byId('case-back');
  back.href='designs.html'+(filters.size?'?'+filters:'')+'#template-'+encodeURIComponent(project.slug);
  // Browser Back restores the precise scroll position and the in-place filters.
  if(document.referrer && history.length>1){
    const previous=new URL(document.referrer);
    if(previous.origin===location.origin && !previous.pathname.includes('/templates/')){
      back.textContent='بازگشت';
      back.addEventListener('click',event=>{
        if(event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
        event.preventDefault();history.back();
      });
    }
  }
  byId('offer-copy').textContent='«'+project.name+'» رو برای '+project.field+' طراحی کردیم.';
  byId('case-start').textContent='امتحان کردن '+project.name;
  byId('case-direct-order').href='order.html?design='+encodeURIComponent(project.slug);
  const openBrief=mountProjectBrief();
  byId('case-start').addEventListener('click',()=>openBrief(index));
  if(location.hash==='#brief'){
    openBrief(index);
    history.replaceState(history.state,'',location.pathname+location.search);
  }
  const styleText={
    'مدرن':'تیترهای روشن و فاصلهٔ منظم میان بخش‌ها مسیر نگاه را مشخص می‌کنند.',
    'شبکهٔ بنتو':'تصویر و متن در کارت‌هایی با اندازه‌های متفاوت کنار هم می‌نشینند.',
    'سیال':'موج‌ها و حباب‌های شناور بین قسمت‌های صفحه حرکت می‌کنند.',
    'ارگانیک':'لبه‌های منحنی و شکل‌های نامنظم از فرم‌های طبیعی الهام می‌گیرند.',
    'مجله‌ای':'تیترهای درشت، قاب‌های تصویری و ستون‌های متن مانند صفحه‌آرایی یک مجله کنار هم می‌نشینند.',
    'گرد':'گوشه‌های گرد و فضاهای باز، تصویرها و دکمه‌ها را از زمینه جدا می‌کنند.',
    'مینیمال':'فضای خالی و ترکیب‌بندی خلوت، جزئیات محصول را در مرکز توجه می‌گذارد.',
    'هندسی':'تکرار فرم‌های هندسی، بخش‌های صفحه را از هم جدا می‌کند.',
    'پوستری':'تیتر درشت و کنتراست رنگی، صفحه را شبیه جلد یک پوستر می‌سازد.',
    'عکاسانه':'تصویرهای بزرگ در کنار متن‌های کوتاه، روایت هر بخش را پیش می‌برند.',
    'تحریریه‌ای':'شبکهٔ منظم و فاصلهٔ متن‌ها، ریتم خواندن را مشخص می‌کند.',
    'تصویری':'رنگ و تصویرسازی، راه پیدا کردن میان بخش‌های صفحه است.',
    'دیجیتال':'بلوک‌های کوچک و شفاف، اطلاعات و ابزار را کنار هم قرار می‌دهند.'
  };
  byId('look').textContent=[project.layout,styleText[project.layout]].filter(Boolean).join(' · ');
  byId('entries').innerHTML=project.entries.map(entry=>'<li>'+entry+'</li>').join('');
  byId('audience').innerHTML='<li>'+project.field+'</li>';
  byId('example-title').textContent=project.title.replace(/<[^>]*>/g,' ');
  byId('sector').href=fieldsURL;
  byId('sector').textContent='همهٔ طرح‌های '+project.field;
  const rank=p=>Number(p.field===project.field)*4+Number(p.mood===project.mood)*2+Number(p.layout===project.layout);
  const nearby=catalogDesigns.filter(p=>p.slug!==project.slug).sort((a,b)=>rank(b)-rank(a)).slice(0,3);
  nearby.forEach(p=>byId('related').append(designTile(p)));

  const stage=byId('stage');
  const screen=stage.querySelector('.device-screen');
  const poster=byId('case-poster');
  const frame=byId('live-preview');
  const modeButton=byId('preview-mode');
  const deviceButtons=[...document.querySelectorAll('.switch-view button')];
  const narrow=matchMedia('(max-width:700px)');
  const coarse=matchMedia('(pointer:coarse)');
  const failedPosters=new Set();
  let device=narrow.matches?'mobile':'desktop';
  let pickedDevice=false,requestedLive=false;

  function sizeFrame(){
    if(frame.hidden || !screen.clientWidth)return;
    const logicalWidth=device==='desktop'?Math.max(screen.clientWidth,1280):390;
    const scale=screen.clientWidth/logicalWidth;
    frame.style.width=logicalWidth+'px';
    frame.style.height=Math.ceil(screen.clientHeight/scale)+'px';
    frame.style.transform='scale('+scale+')';
  }

  function showView(){
    const live=requestedLive || failedPosters.has(device);
    stage.dataset.device=device;
    stage.dataset.mode=live?'live':'poster';
    poster.hidden=live;
    frame.hidden=!live;
    stage.tabIndex=live || coarse.matches?-1:0;
    const deviceLabel=device==='mobile'?'موبایل':'دسکتاپ';
    stage.setAttribute('aria-label','پیش‌نمایش '+deviceLabel+' طرح '+project.name);
    deviceButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===device)));
    modeButton.setAttribute('aria-pressed',String(live));
    modeButton.hidden=failedPosters.has(device);
    modeButton.textContent=live?'نمای تصویری':'تعامل با طرح';
    if(live){
      sizeFrame();
      if(!frame.getAttribute('src'))frame.src=sampleURL;
      else frame.contentDocument?.defaultView?.scrollTo({top:0,behavior:'instant'});
    }else{
      const src='previews/'+project.slug+'-'+device+'.webp';
      poster.alt='صفحهٔ کامل طرح '+project.name+' در نمای '+deviceLabel;
      if(poster.getAttribute('src')!==src)poster.src=src;
    }
    stage.scrollTop=0;
  }
  poster.addEventListener('error',()=>{
    failedPosters.add(device);
    showView();
  });
  modeButton.addEventListener('click',()=>{
    requestedLive=!requestedLive;
    showView();
  });
  deviceButtons.forEach(button=>button.addEventListener('click',()=>{
    pickedDevice=true;device=button.dataset.view;showView();
  }));
  narrow.addEventListener('change',()=>{
    if(!pickedDevice){device=narrow.matches?'mobile':'desktop';showView()}
  });
  coarse.addEventListener('change',()=>{stage.tabIndex=frame.hidden&&!coarse.matches?0:-1});
  new ResizeObserver(sizeFrame).observe(screen);
  showView();
})();
