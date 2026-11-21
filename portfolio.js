(() => {
  const cases = {
    flora: { title:'فلورا', image:'concept-1.webp', alt:'تصویر مفهومی محصول مراقبت پوست در میان برگ‌های سبز', description:'فلورا یک برند فرضی مراقبت پوست است. برای این ایده، فضایی آرام با رنگ‌های طبیعی و ترکیب‌بندی خلوت طراحی کردیم تا حس مراقبت و نزدیکی به طبیعت در نگاه اول منتقل شود.', chips:['هویت بصری','طراحی وب','محصولات مراقبتی'] },
    soor: { title:'سور', image:'concept-2.webp', alt:'فنجان قهوه و شیرینی روی رومیزی زرشکی', description:'سور یک کافه فرضی است که دور لحظه‌های خوب و جمع‌های کوچک شکل گرفته. رنگ‌های گرم، تایپوگرافی شخصیت‌دار و عکاسی نزدیک، تجربه‌ای صمیمی و اشتهابرانگیز می‌سازند.', chips:['جهت هنری','طراحی وب','کافه و خوراک'] },
    avand: { title:'آوند', image:'concept-3.webp', alt:'حیاط معماری مفهومی با بافت روشن و درخت زیتون', description:'آوند یک استودیوی معماری فرضی است. در این طرح، تصویر معماری نقش اصلی را دارد و تایپوگرافی کم‌حرف و چیدمان منظم، به فضا و نور اجازه می‌دهند داستان را تعریف کنند.', chips:['جهت هنری','معرفی پروژه','معماری'] },
    roz: { title:'روز', image:'concept-4.webp', alt:'اشیای سرامیکی در یک چیدمان مینیمال', description:'روز یک برند فرضی اشیای خانه است. این ایده با بافت‌های طبیعی، فضای سفید و جزئیات ظریف، تجربه‌ای شبیه ورق‌زدن یک مجله طراحی خلق می‌کند.', chips:['طراحی وب','محصولات','سبک زندگی'] }
  };
  const dialog=document.getElementById('project-detail');
  const title=document.getElementById('detail-title');
  const description=document.getElementById('detail-description');
  const image=document.getElementById('detail-image');
  const chips=document.getElementById('detail-chips');
  let previousFocus=null;
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{
    const item=cases[button.dataset.open]; if(!item || !dialog || typeof dialog.showModal!=='function')return;
    previousFocus=button;title.textContent=item.title;description.textContent=item.description;image.src=item.image;image.alt=item.alt;chips.replaceChildren(...item.chips.map(text=>{const tag=document.createElement('span');tag.textContent=text;return tag}));dialog.showModal();
  }));
  dialog?.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog?.addEventListener('close',()=>previousFocus?.focus());
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(!reduced.matches && 'IntersectionObserver' in window){
    const elements=[...document.querySelectorAll('.section-head,.portfolio-card,.services,.step,.contact')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -20px 0px'});
    elements.forEach(el=>{const rect=el.getBoundingClientRect();if(rect.top<innerHeight && rect.bottom>0)return;el.classList.add('motion-ready');observer.observe(el)});
    document.documentElement.classList.add('js-motion');
  }
  if(!reduced.matches && matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.portfolio-card .project-visual').forEach(visual=>{
      const shot=visual.querySelector('.browser-shot');let raf=0, x=0,y=0;
      visual.addEventListener('pointermove',event=>{const rect=visual.getBoundingClientRect();x=(event.clientX-rect.left)/rect.width-.5;y=(event.clientY-rect.top)/rect.height-.5;if(!raf)raf=requestAnimationFrame(()=>{shot.style.setProperty('--rx',(-y*3).toFixed(2)+'deg');shot.style.setProperty('--ry',(x*4).toFixed(2)+'deg');raf=0})});
      visual.addEventListener('pointerleave',()=>{if(raf)cancelAnimationFrame(raf);raf=0;shot.style.setProperty('--rx','0deg');shot.style.setProperty('--ry','0deg')});
    });
  }
})();
