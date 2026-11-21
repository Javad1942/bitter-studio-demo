// Optional visitor preferences stay on this browser. No form text is retained.
(() => {
  const consentKey='bitter.storage.v1', choicesKey='bitter.choices.v1';
  function get(key) {try{return localStorage.getItem(key)}catch{return null}}
  function put(key,value){try{localStorage.setItem(key,value)}catch{/* Storage can be disabled. */}}
  let consent=get(consentKey);
  const preferences=document.createElement('aside');
  preferences.className='preferences';
  preferences.setAttribute('aria-labelledby','prefs-title');
  preferences.hidden=true;
  preferences.innerHTML='<div class="biscuit" aria-hidden="true"><i></i></div><h2 id="prefs-title">دفعهٔ بعد از همین طرح شروع کنیم؟</h2><p>اگه دوست داری، نوع سایت و طرحی که انتخاب کردی رو توی همین مرورگر نگه می‌داریم.</p><p>اسم برند و نوشته‌هات توی این حافظه ذخیره نمی‌شن. هر وقت بخوای می‌تونی انتخابت رو از پایین صفحه عوض کنی. <a href="privacy.html">دربارهٔ حریم خصوصی</a></p><div class="pref-actions"><button value="off"><i></i>ذخیره نشود</button><button value="on"><i></i>موافقم</button></div><details><summary>انتخاب جزئیات</summary><label><input type="checkbox"> حفظ انتخاب‌های فرم پروژه</label><button class="save-preferences">ثبت تنظیمات</button></details>';
  document.body.append(preferences);
  const check=preferences.querySelector('input'), buttons=preferences.querySelector('.pref-actions');
  let opener;
  function show(focus=false){
    check.checked=consent==='on'; preferences.hidden=false;
    if(focus)preferences.querySelector('button').focus({preventScroll:true});
  }
  function remember(value){
    consent=value;put(consentKey,value);
    if(value==='off')try{localStorage.removeItem(choicesKey)}catch{}
    preferences.hidden=true;
    preferences.querySelector('details').open=false;
    opener?.focus({preventScroll:true});
  }
  buttons.addEventListener('click',e=>{const button=e.target.closest('button');if(button)remember(button.value)});
  preferences.querySelector('.save-preferences').onclick=()=>remember(check.checked?'on':'off');
  document.addEventListener('click',e=>{const b=e.target.closest('[data-preferences]');if(b){opener=b;show(true)}});
  document.addEventListener('change',e=>{
    if(consent!=='on' || !e.target.matches('#brief-form select'))return;
    const form=e.target.form;
    const values={};
    for(const select of form.querySelectorAll('select[name]'))values[select.name]=select.value;
    put(choicesKey,JSON.stringify(values));
  });
  // Explicit design and plan selections take precedence over saved defaults.
  document.addEventListener('click',e=>{
    if(consent!=='on' || !e.target.closest('[data-brief],#new-brief'))return;
    const form=document.querySelector('#brief-form');
    if(!form)return;
    let values={};try{values=JSON.parse(get(choicesKey)||'{}')}catch{return}
    for(const select of form.querySelectorAll('select[name]')){
      if([...select.options].some(o=>o.value===values[select.name])){
        select.value=values[select.name];
        select.dispatchEvent(new Event('change',{bubbles:true}));
      }
    }
    form.querySelector('select')?.dispatchEvent(new Event('input',{bubbles:true}));
  });
  if(!consent)show();
})();
