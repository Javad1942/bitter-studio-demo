'use strict';

const extraDesigns = [
  {name:'مدار',slug:'madar',style:'orbit',mood:'جسور',field:'فناوری',bg:'#19182e',ink:'#e1d5ff',dot:'#834af5',title:'مدارِ کار<br>در دست تو.',action:'دیدن محصول',sub:'محصول　 امکانات',desc:'داشبوردی برای تیم‌های محصول. مدارهای رنگی جریان تیم را نشان می‌دهند و اطلاعات کاربردی به شکل بلوک‌های کوچک گروه‌بندی شده‌اند.'},
  {name:'رد',slug:'rad',style:'track',mood:'تازه',field:'ورزش',bg:'#acf298',ink:'#113d2c',dot:'#1cac85',title:'با هم<br>می‌دویم.',action:'برنامهٔ دویدن',sub:'باشگاه　 تمرین',desc:'برای باشگاه دویدن شهری. مسیرهای منحنی زمین دو و تایپوگرافی فشرده، جلسه‌های تمرین و ثبت‌نام را در اولویت می‌گذارند.'},
  {name:'سطر',slug:'satr',style:'folio',mood:'ظریف',field:'انتشارات',bg:'#ece9dc',ink:'#30332e',dot:'#bc9761',title:'از سطری<br>به سطر دیگر.',action:'فهرست کتاب‌ها',sub:'تازه‌ها　 نویسندگان',desc:'ویترینی تحریریه‌ای برای نشر مستقل. جلدهای فارسی روی محور مورب چیده شده‌اند تا تازه‌های نشر و دسته‌بندی کتاب‌ها سریع پیدا شوند.'},
  {name:'کادر',slug:'kadr',style:'frame',mood:'آرام',field:'عکاسی',bg:'#262925',ink:'#fbf6e8',dot:'#669cf2',img:3,title:'نورِ<br>ماندگار.',action:'نمایش مجموعه',sub:'مجموعه‌ها　 عکاس',desc:'برای عکاس معماری. یک نگاتیو افقی از حیاط ایرانی، مرز میان تصویر، فضای خالی و حروف را مشخص می‌کند.'},
  {name:'چین',slug:'chin',style:'weave',mood:'گرم',field:'نساجی',bg:'#f4bb8b',ink:'#641f2d',dot:'#e47745',title:'رنگ در<br>تار و پود.',action:'دیدن بافته‌ها',sub:'پارچه‌ها　 کارگاه',desc:'برای کارگاه پارچه‌بافی. نقش‌های شطرنجی خرد و درشت با رنگ طبیعی نخ‌ها، مجموعهٔ بافته‌ها را از هم جدا می‌کنند.'},
  {name:'طوق',slug:'togh',style:'loop',mood:'ظریف',field:'زیورآلات',bg:'#e3dfee',ink:'#312538',dot:'#ad9163',title:'یک حلقه،<br>هزار روایت.',action:'کشف قطعات',sub:'مجموعه　 مواد',desc:'ویترینی خلوت برای طراح زیورآلات. دو حلقهٔ پرداخت‌شده زیر نور استودیویی، نقره و آبکاری طلایی مجموعه را کنار هم نشان می‌دهند.'},
  {name:'چفت',slug:'cheft',style:'join',mood:'جسور',field:'طراحی محصول',bg:'#e3422e',ink:'#fff2de',dot:'#834af5',title:'بردار.<br>کنار هم بچین.',action:'کشف قطعات',sub:'سیستم　 سفارش',desc:'برای سیستم قفسه‌های مدولار. شبکه‌ای از اتصالات چوبی با کنتراست تند، نحوهٔ کنار هم قرار گرفتن قطعه‌ها را نمایش می‌دهد.'},
  {name:'تال',slug:'tal',style:'tilework',mood:'بازیگوش',field:'کودک',bg:'#fff0c8',ink:'#29395a',dot:'#ec66aa',title:'بازی را<br>تو بساز.',action:'دیدن جعبه‌ها',sub:'جعبه‌ها　 روش بازی',desc:'برای جعبه‌های بازی فکری. چهار شکل هندسی رنگی، ریتم یک بازی چیدنی را از صفحهٔ اول به انتخاب جعبه منتقل می‌کنند.'},
  {name:'بخار',slug:'bokhar',style:'mist',mood:'گرم',field:'کافه',bg:'#623524',ink:'#fff3cd',dot:'#e47745',img:2,title:'صبح،<br>یک فنجان.',action:'منوی امروز',sub:'منو　 کافه',desc:'برای کافهٔ صبحانه. عکسی با قاب قوسی کنار فهرست کوتاه منو، مراجعهٔ حضوری و سفارش را به هم وصل می‌کند.'}
];

const designDetails = [
  ['پوستری','تازه‌های نشر','تک‌آهنگ‌ها','اجرای زنده','آرشیو ضرب'],
  ['مینیمال','روتین روزانه','پاک‌کننده','سرم گیاهی','کرم سبک'],
  ['تصویری','کارگاه این هفته','بازی گروهی','نقاشی','بازی با فرم'],
  ['عکاسانه','روی میز امروز','اسپرسو','قهوهٔ دمی','کیک روز'],
  ['مینیمال','مجموعهٔ خانه','کاسه‌ها','فنجان‌ها','گلدان‌ها'],
  ['عکاسانه','پروژه‌های منتخب','خانهٔ حیاط‌دار','خانهٔ باغ','بازسازی'],
  ['دیجیتال','فضای تیم','داشبورد','کارها','گزارش‌ها'],
  ['هندسی','قرار بعدی باشگاه','دویدن شهری','تمرین سرعت','مسیر پارک'],
  ['تحریریه‌ای','پیشخوان سطر','شعر امروز','جستارها','داستان'],
  ['عکاسانه','مجموعه‌های اخیر','انعکاس','حیاط‌ها','سایه‌روشن'],
  ['هندسی','بافته‌های کارگاه','چهارخانه','راه‌راه','کتیبه'],
  ['مینیمال','قطعه‌های منتخب','حلقه','گوشواره','گردنبند'],
  ['هندسی','سیستم چفت','قطعهٔ پایه','اتصال','قفسه'],
  ['تصویری','جعبه‌های بازی','رنگ و ریتم','چیدن','روایت'],
  ['عکاسانه','صبحانهٔ بخار','تخم مرغ','قهوهٔ روز','نان تازه']
];

const featuredDeck = [
  { name:'ضرب', mood:'جسور', field:'موسیقی', style:'poster', ink:'#1c1920', bg:'#cefa43', dot:'#813df4', wash:'#e6def8', title:'صدای تازه،<br>ضرب تازه.', action:'شنیدن مجموعه', sub:'آثار　 هنرمندان', desc:'برای یک نشر موسیقی مستقل. جلدهای هندسی و کنتراست زیاد، تازه‌ترین انتشار را در مرکز صفحه قرار می‌دهند.' },
  { name:'فلورا', mood:'تازه', field:'زیبایی', style:'flora', ink:'#243c2b', bg:'#edf3e2', dot:'#16b89b', wash:'#daefea', img:1, title:'از دل<br>طبیعت.', action:'کشف مجموعه', sub:'محصولات　 داستان ما', desc:'برای مراقبت گیاهی پوست. برگ و شیشهٔ مات کنار فضای سفید قرار گرفته‌اند تا جنس محصول دیده شود.' },
  { name:'هلو', mood:'بازیگوش', field:'کودک', style:'playful', ink:'#26492e', bg:'#a8d4a0', dot:'#eb62a7', wash:'#f2e0f1', title:'یه دنیا<br>بازی کن!', action:'دیدن بازی‌ها', sub:'بازی‌ها　 کارگاه', desc:'برای یک کارگاه خلاقیت کودک. تصویرسازی رنگی و شکل‌های گرد، انتخاب بازی و کارگاه را برای خانواده‌ها ساده می‌کند.' },
  { name:'سور', mood:'گرم', field:'کافه', style:'soor', ink:'#fff1dc', bg:'#722331', dot:'#f4824f', wash:'#f4e5da', img:2, title:'قهوه و<br>قرار عصر.', action:'دیدن منو', sub:'منو　 نشانی', desc:'برای کافه‌ای محلی. عکس نزدیک میز عصرانه به منو و اطلاعات بازدید می‌رسد.' },
  { name:'روز', mood:'ظریف', field:'طراحی محصول', style:'roz', ink:'#4c4033', bg:'#f7f2e8', dot:'#ad9262', wash:'#eee9da', img:4, title:'اشیای<br>روزمره.', action:'دیدن اشیا', sub:'مجموعه‌ها　 درباره', desc:'برای اشیای دست‌ساز خانه. قاب‌های خلوت و نور طبیعی اجازه می‌دهند بافت سفال دیده شود.' },
  { name:'آوند', mood:'آرام', field:'معماری', style:'avand', ink:'#fcf9ee', bg:'#666752', dot:'#5a99ee', wash:'#e1ebf7', img:3, title:'فضایی<br>برای زیستن.', action:'دیدن پروژه', sub:'پروژه‌ها　 دفتر', desc:'برای یک دفتر معماری. عکس سرتاسری حیاط و نوشته‌های کوتاه، بازدیدکننده را مستقیم به پروژه می‌رسانند.' }
];
const featuredSlugs = ['zarb','flora','holu','soor','rooz','avand'];
const catalogDesigns = [...featuredDeck, ...extraDesigns].map((project, index) => ({
  ...project,
  slug: featuredSlugs[index] || project.slug,
  layout: designDetails[index][0],
  section: designDetails[index][1],
  entries: designDetails[index].slice(2)
}));

// Source-order is retained for briefs saved in older browsers; display order is independent.
const studioTemplates = [
  ['raster','راستر','عکاسی','جسور','شبکهٔ بنتو','#dfd7ff','#19182b','#763ff5','پرتره، به سبک خودت','نمونه‌عکس‌ها','تعرفهٔ عکاسی','روند عکاسی','دربارهٔ عکاس'],
  ['vitalnetz','ویتال‌نتس','سلامت','تازه','مدرن','#66adf1','#112e63','#bce92a','برنامه‌ای هم‌مسیر با تو','برنامه‌ها','خدمات','همراهان','پرسش‌ها'],
  ['neutral','نوترال','طراحی و مشاوره','ظریف','مینیمال','#3d3e3d','#ffffff','#90918f','کار ما شفافیت است','خدمات استودیو','هویت بصری','طراحی دیجیتال','دربارهٔ استودیو'],
  ['gefuege','گفوگه','معماری','تازه','مدرن','#efeade','#303c30','#93a67a','هر جزء، در جای خودش','ساخت با چوب','پروژه‌ها','روند ساخت','همکاران'],
  ['wiese','ویزه','معماری منظر','تازه','مدرن','#eff3dd','#293c2b','#81ac67','فضای سبز برای فردا','پروژه‌های منظر','خدمات','پروژه‌ها','دربارهٔ دفتر'],
  ['zugabe','تسوگابه','هنر و اجرا','جسور','مدرن','#f8f5f7','#17141c','#8b29cf','از صحنه به دست تو','پیام‌های هنرمندان','مناسبت‌ها','گروه‌ها','درخواست پیام'],
  ['korb','کورب','ورزش','جسور','مدرن','#663cf1','#ffffff','#ff8d36','بازی از اینجا شروع می‌شود','بسکتبال خیابانی','مسابقات','ثبت‌نام','پرسش‌ها'],
  ['versal','ورزال','طراحی گرافیک','جسور','تایپوگرافیک','#f6f5f0','#191919','#a699ec','نظم، حروف و فضای سفید','پروژه‌های گرافیک','فهرست پروژه‌ها','دربارهٔ دفتر','روند کار'],
  ['hocker','هوکر','طراحی مبلمان','ظریف','مدرن','#f1eadf','#342d27','#b49576','نشستن، از نگاهی تازه','مجموعهٔ مبلمان','کالکشن','متریال','کارگاه'],
  ['prisma','پریزما','نرم‌افزار','ظریف','شیشه‌ای','#101020','#f5f5fb','#8496ff','داده‌ها در یک نگاه','فضای کاری ابری','داشبورد','امکانات','آغاز همکاری']
].map(([slug,name,field,mood,layout,bg,ink,dot,title,section,...entries])=>({
  slug,name,field,mood,layout,bg,ink,dot,title,section,entries,template:true,
  wash:'color-mix(in srgb,'+dot+' 14%,#f1f2f6)', desc:({
    raster:'چیدمان موزاییکی یک استودیو عکاسی؛ پرتره‌ها، ابزار کار و نمونه‌عکس‌ها در قاب‌هایی با اندازه‌های متفاوت کنار هم می‌نشینند.',
    vitalnetz:'یک سایت تندرستی با آسمان آبی و تصویرسازی چهره. برنامه‌ها و خدمات از صفحهٔ اصلی در دسترس‌اند.',
    neutral:'استودیوی طراحی در طیف خاکستری؛ عنوان درشت و ترکیب‌های معماری مسیر را به خدمات و معرفی دفتر می‌رسانند.',
    gefuege:'دفتر طراحی ساختمان چوبی. تصویر تفکیک‌شدهٔ خانه، رابطهٔ طبقه‌ها و اجزای سازه را همان ابتدا نشان می‌دهد.',
    wiese:'دفتر معماری منظر با تپه‌های سبز و قاب‌های عریض؛ از منظرهٔ نخست به خدمات و پروژه‌های فضای باز برسید.',
    zugabe:'یک سایت اجرای هنری با تصویر صحنه روی گوشی‌ها؛ از انتخاب مناسبت تا نوشتن درخواست پیام.',
    korb:'بسکتبال خیابانی با حروف بزرگ، زمین بنفش و توپ نارنجی؛ تقویم مسابقات و فرم شرکت در بازی در یک صفحه.',
    versal:'پورتفولیوی تایپوگرافی با فضای سفید و نام استودیو در مقیاس بزرگ؛ پروژه‌ها را به شکل تصویر یا فهرست ببینید.',
    hocker:'کاتالوگ مبلمان چوبی با تمرکز روی فرم و جنس محصول؛ متریال را انتخاب کنید و مجموعه را ببینید.',
    prisma:'معرفی یک نرم‌افزار ابری با زمینهٔ تیره، کارت‌های شیشه‌ای و پیش‌نمایش داده‌ها در همان نمای نخست.'
  })[slug]
}));
studioTemplates.push(...[
  ["elan","اِلان","ورزش و تناسب‌اندام","جسور","مدرن","#bfc1ca","#21222a","#bad342","تمرین با یک هدف روشن","برنامه‌های تمرینی","دوره‌ها","تیم مربیان","برنامهٔ کلاس‌ها","صفحهٔ باشگاه با تایپ درشت و نمای پیشرفت تمرین. از معرفی برنامه‌ها به دوره و مربی برسید."],
  ["samt","سامت","دندان‌پزشکی","آرام","نرم","#eaf4f6","#16383c","#2597a6","یک لبخند آسوده","مراقبت دندان","خدمات","مطب","درخواست نوبت","طراحی آرام یک مطب با زمینهٔ نعنایی، گوشه‌های گرد و اولویت دادن به مسیر پیدا کردن خدمات و نوبت."],
  ["matz","ماتس","نوشیدنی","بازیگوش","مدرن","#b2c797","#193d2c","#638447","ماچا با حال‌وهوای تازه","نوشیدنی‌ها","طعم‌ها","ترکیبات","داستان برند","معرفی نوشیدنی ماچا با تصویر بسته‌بندی و ترکیب رنگ سبز؛ برای برندی که خود محصول باید مرکز صفحه باشد."],
  ["norm","نورم","طراحی صنعتی","ظریف","مدرن","#e2e3df","#202a2b","#44ac9e","فرم از عملکرد آغاز می‌شود","طراحی محصول","محصولات","فرایند طراحی","جزئیات فنی","پورتفولیوی صنعتی با خطوط شبکه، ترسیم چراغ و حاشیه‌نویسی‌هایی شبیه نقشهٔ فنی محصول."],
  ["grotesk","گروتسک","هویت بصری و حروف","جسور","تایپوگرافیک","#f3f0e9","#141413","#cc2979","حروفی که هویت می‌سازند","آزمایشگاه حروف","حروف‌نگاری","پروژه‌ها","تماس با استودیو","یک استودیوی حروف با نمونهٔ تایپ قابل‌تغییر؛ بازدیدکننده فرم حروف را در خود صفحه امتحان می‌کند."],
  ["klarblick","کلاربلیک","مشاوره","آرام","کلاسیک","#f0f1fc","#122345","#3d5cf4","فضایی برای روشن‌تر دیدن","جلسه‌های مشاوره","رویکرد","معرفی مشاور","شروع گفت‌وگو","قاب پرتره و حلقه‌های آبی مسیر معرفی مشاور، روش کار و درخواست جلسه را به هم وصل می‌کنند."],
  ["polster","پولستر","آموزش مالی","جسور","مدرن","#f7f5ee","#1e2025","#ec7856","نگاه تازه به پول","مسیر یادگیری","جلسات","داستان‌ها","درخواست مشاوره","چیدمان زندهٔ کارت‌های تصویری برای یک مربی مالی، با خواندن مسیر هر جلسه از همان صفحهٔ اصلی."],
  ["klangwelle","کلانگ‌وله","موسیقی و جشنواره","جسور","مدرن","#261b40","#fff5f3","#ef4b8f","نبض جشنواره","روی صحنه","هنرمندان","زمان اجرا","برنامهٔ جشنواره","سایت یک رویداد موسیقی با نور صحنه، کنتراست زیاد و دسترسی مستقیم به اجراها."],
  ["atem","آتِم","یوگا","آرام","مدرن","#dfdcd6","#30302d","#aca69a","نفس بکش و حرکت کن","تمرین یوگا","کلاس‌ها","مربیان","برنامهٔ استودیو","فضای خلوت یک استودیوی یوگا با ترکیب‌بندی مجله‌ای و امکان مرور کلاس‌ها و زمان تمرین."],
  ["kapitel","کاپیتل","مشاورهٔ سازمانی","جسور","مدرن","#16141b","#f9f7ff","#9168fb","فصل بعدی سازمان شما","کارگاه راهبردی","خدمات","کارگاه‌ها","تماس","رنگ بنفش و تصویر یک کارگاه، معرفی فرایند تصمیم‌گیری و همکاری را برای یک دفتر مشاوره شکل می‌دهند."],
  ["mosaik","موزاییک","استودیو و فریلنسر","تازه","شبکهٔ بنتو","#e0f3e8","#162922","#3ab982","استودیو در چند قاب","پروژه‌های منتخب","نمونه‌کار","خدمات","دربارهٔ استودیو","قاب‌های موزاییکی برای معرفی استودیو، خدمات و کارهای گرافیکی، با اولویت دادن به تصویر پروژه‌ها."],
  ["sonnseite","زون‌زایته","انرژی خورشیدی","تازه","مدرن","#eef6e7","#21381d","#67b744","انرژی از آفتاب","شبکهٔ خورشیدی","انرژی محلی","مشارکت","تماس","یک شبکهٔ انرژی خورشیدی با توضیح تصویری تولید برق و مسیر پیوستن به طرح محلی."],
  ["bleibe","بلایبه","اقامتگاه","تازه","مدرن","#d0d9ce","#29322c","#b26b36","جایی برای ماندن","اقامتگاه‌ها","فضاها","امکانات","درخواست اقامت","معرفی اقامتگاه برای مسافری که می‌خواهد پیش از انتخاب، فضاها و امکانات را ببیند."],
  ["radlwerk","رادل‌وِرک","دوچرخه","جسور","مدرن","#f0efea","#241c18","#f34b16","حرکت برقی","دوچرخه‌های برقی","مدل‌ها","رنگ‌ها","مشخصات","ویترین دوچرخهٔ برقی با امکان مرور مدل و رنگ و بررسی جزئیات محصول."],
  ["doppel","دوپل","پدل","جسور","مدرن","#274f9f","#ffffff","#ff893a","وقت رفتن به زمین است","برنامهٔ باشگاه","زمین‌ها","جلسات","درخواست بازی","زمین پدل و برنامهٔ باشگاه در یک صفحه؛ از پیدا کردن جلسه تا انتخاب بازی."],
  ["bogen","بوگن","نمایشگاه خودرو","ظریف","گرد","#e7e7ed","#292a35","#e8553b","خودرو در نمای نزدیک","نمایشگاه خودرو","مدل‌ها","جزئیات","بازدید","نمایشگاه خودرو با کارت‌های گرد و فضای کافی برای دیدن شمایل خودرو و مقایسهٔ مدل‌ها."],
  ["groschen","گروشن","نرم‌افزار مالی","تازه","مدرن","#e7f3ec","#143228","#19a468","پس‌انداز در یک نگاه","نمای برنامه","هدف‌ها","امکانات","شروع","معرفی یک برنامهٔ پس‌انداز با زبان تصویری ساده برای نمایش هدف‌ها و پیشرفت."],
  ["zack","زاک","خدمات تأسیسات","جسور","مدرن","#f2f3ef","#12251d","#148d5a","کمک فنی برای خانه","خدمات فنی","تعمیرات","روند کار","درخواست سرویس","صفحهٔ خدمات تأسیساتی که پیدا کردن نوع تعمیر و نوشتن درخواست سرویس را کوتاه می‌کند."],
  ["lot","لوت","معماری","ظریف","مدرن","#dedbd1","#26251e","#afa077","خط، فضا، معماری","پروژه‌های دفتر","ساختمان‌ها","رویکرد","دفتر","پورتفولیوی معماری با قاب‌های باز و نظم هندسی برای مرور طرح‌ها و آشنایی با دفتر."],
  ["blende","بلِنده","عکاسی و فیلم","جسور","مجله‌ای","#15120f","#fbf6f3","#c88850","قاب ثابت، تصویر متحرک","عکس و فیلم","گالری عکس","فیلم‌ها","تماس","گالری مجله‌ای یک استودیوی عکاسی و فیلم با مسیر جداگانه برای دیدن قاب ثابت و آثار متحرک."],
  ["malve","مالوه","فروشگاه آرایشی گیاهی","آرام","مدرن","#e8e1f2","#271b33","#3d7bf2","مراقبت از پوست با نیروی گیاهان","محصولات گیاهی","فروشگاه","راهنمای مراقبت","مشاوره","فروشگاه مراقبت از پوست با ویترین محصولات، تصویرسازی گیاهی و راهنمای انتخاب."],
  ["neugier","نوی‌گیر","هوش مصنوعی","جسور","مدرن","#10110b","#edfa62","#7a2bff","محصولات دیجیتال با ذهنی مستقل","محصولات و ابزارها","ابزارهای هوش مصنوعی","پروژه‌ها","معرفی تیم","معرفی یک استودیوی محصول دیجیتال با زمینهٔ تیره، تایپ نئونی و ویترین ابزارهای هوش مصنوعی."],
  ["lehm","لِهم","معماری پایدار","آرام","مدرن","#e7e8db","#1e241b","#3d7bf2","زندگی پایدار، ساختن طبیعی","معماری و مصالح","خدمات معماری","پروژه‌ها","پرسش‌ها","دفتر معماری پایدار با تصویر خانه‌ای میان کوه و علفزار، نمونه‌پروژه‌ها و معرفی مصالح."],
  ["funke","فونکه","استودیوی خلاق","تازه","مجله‌ای","#5142ec","#f0ffc0","#19c48e","ایده‌هایی که جرقه می‌زنند","آثار استودیو","هویت بصری","طراحی وب","کمپین‌ها","استودیوی خلاق با حروف درشت، ترکیب آبی و لیمویی و مجموعه‌ای از پروژه‌های هویت و وب."],
  ["phase","فاز","برق ساختمان","آرام","مدرن","#f3f0ea","#191919","#3d7bf2","برق‌کشی دقیق، از طرح تا اجرا","خدمات برق","خدمات و بازرسی","مراحل اجرا","ساعت کار","معرفی خدمات برق ساختمان با تصویر تعاملی روشنایی، روند اجرا و اطلاعات تماس."],
  ["papierarchiv","پاپیرآرشیو","کاغذ و اشیای قدیمی","بازیگوش","مدرن","#161512","#fff4dc","#ff4fc1","آرشیو کاغذ و یادگاری","یافته‌های آرشیو","یافته‌ها","داستان اشیا","تماس","آرشیو کاغذ و اشیای قدیمی با کلاژی از پاکت، بلیت، گل و یادگاری‌های چاپی."],
  ["mohn","مون","تنفس و ذهن‌آگاهی","آرام","مدرن","#21382d","#ffe4cc","#3d7bf2","آرامش از یک نفس شروع می‌شود","جلسات ذهن‌آگاهی","تمرین تنفس","برنامهٔ هفتگی","شیوهٔ همراهی","تمرین تنفس و انتخاب جلسهٔ ذهن‌آگاهی در فضایی با تصویر گل‌های شقایق."],
  ["pulver","پولور","باشگاه اسکی","تازه","مدرن","#dfe8f4","#1a2a3c","#19c48e","کوه تو، رد تو","دوره‌های باشگاه","دوره‌های اسکی","باشگاه","شرکت در دوره","معرفی یک باشگاه اسکی با منظرهٔ کوهستان، بررسی دوره‌ها و انتخاب سطح تمرین."],
  ["kachel","کاخِل","کافه و برشته‌کاری","گرم","شبکهٔ بنتو","#fff4e7","#2b1b13","#ff6a3d","قهوهٔ خوب عجله ندارد","قهوه‌های کافه","منو","رُست‌های قهوه","کافه","کافه و برشته‌کاری با ویترینی از کارت‌های آجری، منوی نوشیدنی و معرفی رُست‌های قهوه."],
  ["klotz","کلوتس","استودیوی تاتو","جسور","نئوبروتالیسم","#ffdf39","#131110","#7a2bff","جوهر با شخصیت","آثار استودیو","سبک‌های تاتو","هنرمندان","درخواست مشاوره","استودیوی تاتو با رنگ‌های تخت، قاب‌های ضخیم و گالری سبک‌ها و هنرمندان."],
  ["nordlicht","نوردلیشت","نرم‌افزار حسابداری","ظریف","مدرن","#f1f1e9","#1c2530","#b8914a","حسابداری با دید روشن","محصولات و پلن‌ها","پردازش رسید","امکانات نرم‌افزار","انتخاب پلن","معرفی یک نرم‌افزار حسابداری با ابزارهای هوشمند، دموی رسید و مقایسهٔ پلن‌ها."],
  ["abschlag","آبشلاگ","باشگاه گلف","تازه","مدرن","#e1edd2","#243425","#19c48e","از اولین ضربه تا آخرین حفره","باشگاه و زمین","معرفی زمین","دوره‌های آموزش","عضویت","باشگاه گلف با نمای زمین، دوره‌های تمرین و مسیر درخواست عضویت."],
  ["weitsicht","وایت‌زیخت","عینک‌سازی و سنجش بینایی","آرام","مدرن","#e6ebe6","#262726","#3d7bf2","دیدی تازه برای هر روز","عینک و بینایی","فریم‌ها","خدمات بینایی","درخواست نوبت","فروشگاه عینک با معرفی فریم‌ها، خدمات بینایی‌سنجی و امکان انتخاب خدمت."],
  ["klecks","کلِکس","بستنی‌فروشی","بازیگوش","ارگانیک","#fce4dc","#322332","#ff4fc1","بستنی به طعم امروز","طعم‌ها و سفارش","منوی بستنی","کیک و دسر","سفارش مهمانی","بستنی‌فروشی با رنگ‌های شاد و فرم‌های نرم، منوی طعم‌ها و سفارش مهمانی."],
  ["vorlauf","فورلاوف","تأسیسات و گرمایش","گرم","مدرن","#e8e2d6","#1d2925","#ff6a3d","گرمای خانه از اینجا شروع می‌شود","گرمایش ساختمان","پمپ حرارتی","خدمات نصب","مقایسهٔ اجرا","معرفی پمپ‌های حرارتی، گرمایش و تأسیسات با مقایسهٔ تصویری پیش و پس از اجرا."],
  ["glanz","گلانْتس","استودیوی طراحی با هوش مصنوعی","ظریف","مدرن","#f5f0e8","#181817","#b8914a","طراحی دیجیتال با نگاهی تازه","پروژه‌های استودیو","هویت بصری","تصویرسازی دیجیتال","پروژه‌ها","استودیوی طراحی با هوش مصنوعی و گالری پروژه‌های هویت بصری و تصویرسازی."],
  ["stapel","اشتَپل","موشن‌دیزاین و تصویرسازی","بازیگوش","مدرن","#f2e9d3","#212020","#ff4fc1","تصویرهایی در حرکت","آثار موشن و تصویرسازی","پوسترها","موشن‌دیزاین","آثار منتخب","استودیوی موشن و تصویرسازی با پوسترهای رنگارنگ و آثار قابل مرور."],
  ["kern","کِرن","استودیوی پیلاتس","تازه","شبکهٔ بنتو","#eeeade","#1c271b","#19c48e","از مرکز بدن حرکت کن","کلاس‌های پیلاتس","دوره‌ها","جلسات","استودیو","معرفی استودیوی پیلاتس با شبکه‌ای از کارت‌های تصویری، کلاس‌ها و برنامهٔ جلسات."],
  ["kehre","کِره","نمایشگاه خودرو و تعمیرگاه","ظریف","مدرن","#e4e6e6","#182124","#b8914a","همراه هر پیچ جاده","خودرو و خدمات","نمایشگاه","تعمیرگاه","درخواست بازدید","معرفی نمایشگاه خودرو و تعمیرگاه با نمایش خودروها، خدمات و امکان ثبت درخواست."],
  ["stempel","اشتِمپل","فروشگاه پوشاک خیابانی","جسور","نئوبروتالیسم","#ff654d","#181712","#7a2bff","خیابان به سبک خودت","مجموعهٔ پوشاک","لباس‌ها","کالکشن‌ها","سفارش","فروشگاه پوشاک خیابانی با قاب‌های ضخیم و پوسترهای گرافیکی و امکان انتخاب محصول."],
  ["wirbel","ویربل","استودیوی خلاق","بازیگوش","مدرن","#f1edff","#1b1340","#ff4fc1","ما برندهایی می‌سازیم که از یاد نمی‌روند","کارهای منتخب","هویت بصری","طراحی وب","موشن","استودیوی طراحی با تایپ درشت و رنگ‌های شاد که از پروژه‌های منتخب به خدمات و درخواست همکاری می‌رسد.","51-60"],
  ["fink","فینک","کافه و قهوه‌خانه","بازیگوش","مدرن","#e0643b","#4a2a1a","#ff4fc1","خوشمزه‌ترین طعم در دل محله","منوی کافه","صبحانه","شیرینی","رزرو میز","کافه‌ای با رنگ سفالی و منوی مصور برای انتخاب صبحانه، دیدن فضای کافه و رزرو میز.","51-60"],
  ["schnitt","اشنیت","معماری و مهندسی ساختمان","آرام","مدرن","#0f2238","#eaf1f8","#3d7bf2","از درون به بیرون طراحی می‌کنیم","مراحل طراحی","برداشت بنا","طراحی نقشه","نظارت بر اجرا","دفتر معماری با مقطع فنی ساختمان، پنج مرحلهٔ طراحی و پرسش‌های کارفرما.","51-60"],
  ["flussbett","فلوس‌بِت","گلخانه و طراحی باغ","تازه","ارگانیک","#f4f1e6","#233021","#19c48e","گیاهانی که در خانه‌ات ریشه می‌دوانند","خدمات گلخانه","گیاهان چندساله","درختان میوه","طراحی باغ","گلخانه‌ای با قاب‌های سبز و ارگانیک برای مرور گیاهان، خدمات باغ و بازدید از گلخانه.","51-60"],
  ["trubel","تروبِل","جشنوارهٔ موسیقی و رویداد","بازیگوش","مجله‌ای","#fff4e0","#1c1633","#ff4fc1","سه روز موسیقی کنار دریاچه","برنامهٔ جشنواره","اجراها","کمپ","برنامهٔ خانواده","جشنواره‌ای با پوسترهای رنگی، معرفی اجراها و راهنمای اقامت کنار دریاچه.","51-60"],
  ["kalma","کالما","نوشیدنی گیاهی و مکمل غذایی","آرام","مدرن","#f6f7f4","#1d221f","#3d7bf2","آرامشی که می‌شود نوشید","ترکیب‌های گیاهی","محصولات","مواد اولیه","پرسش‌ها","ویترین ترکیب‌های گیاهی با معرفی محصول، منشأ مواد و راهنمای انتخاب نوشیدنی.","51-60"],
  ["stimmen","اشتیمِن","پادکست و روایت صوتی","گرم","مدرن","#1e1a44","#ffffff","#ff6a3d","نزدیکی","فصل‌های روایت","نزدیکی","خداحافظی","شروع دوباره","پروژهٔ روایت صوتی با چهره‌های رنگی و فصل‌هایی دربارهٔ نزدیکی، جدایی و شروع دوباره.","51-60"],
  ["quelle","کوئله","آب معدنی و نوشیدنی","تازه","سیال","#f0fbf6","#0d2a20","#19c48e","زلال، مثل کوهستان","آب‌های چشمه","بدون گاز","کم‌گاز","نوشیدنی میوه‌ای","برند آب معدنی با موج و حباب‌های سبز، معرفی نوشیدنی‌ها و داستان چشمه.","51-60"],
  ["karst","کارست","اقامتگاه کپسولی در طبیعت","ظریف","مدرن","#16120f","#f3ece3","#b8914a","نزدیک‌تر به طبیعت. نزدیک‌تر به خودت","کپسول‌های اقامتی","اقامتگاه‌ها","امکانات","رزرو اقامت","اقامتگاه کوهستانی با نمای شب، معرفی کپسول‌ها و راهنمای انتخاب اقامت.","51-60"],
  ["villa","ویلا","املاک و مشاور مسکن","آرام","مجله‌ای","#f3f0ea","#1e1d1b","#3d7bf2","زندگی با چشم‌انداز باز","خدمات املاک","خرید خانه","فروش ملک","ارزیابی ملک","دفتر املاک با تصاویر معماری، خدمات خرید و فروش و درخواست ارزیابی ملک.","51-60"],
  ["kost","کوست","جشنوارهٔ غذا","گرم","مدرن","#e05a43","#2b1913","#ff6a3d","جشنوارهٔ خوراک و موسیقی","برنامهٔ جشنواره","برنامه‌ها","بلیت‌ها","پرسش‌ها","یک جشنوارهٔ غذا و موسیقی با نمای ساحلی پیکسلی، برنامهٔ اجراها و انتخاب بلیت."],
  ["hui","هویی","نوشیدنی ماته","بازیگوش","مدرن","#afd58a","#1c5b22","#ff4fc1","طالبی و نعنا","طعم‌های هویی","طعم‌ها","ترکیبات","اشتراک نوشیدنی","معرفی نوشیدنی ماته با قوطی‌های رنگی و تصویرسازی میوه‌ها. طعم‌ها و ترکیبات را ببین و بستهٔ اشتراک را انتخاب کن."],
  ["lava","لاوا","کافه و موسیقی زنده","جسور","سیال","#1a0f14","#ffefe6","#ff5a3c","شب‌های گرم، نوشیدنی‌های خنک.","شب‌های لاوا","منوی نوشیدنی‌ها","فضای کافه","رزرو میز","کافه‌ای با رنگ‌های گرم، منوی نوشیدنی و انتخاب میز برای یک شب موسیقی.","61-70"],
  ["atelier","آتلیه","معماری و طراحی داخلی","ظریف","کلاسیک","#f3f2ee","#0e2e28","#0e6b58","فضاهایی که می‌مانند.","کارهای آتلیه","طراحی ساختمان","بازسازی","پروژه‌ها","دفتر طراحی داخلی با عکس‌های معماری و معرفی پروژه‌ها و خدمات.","61-70"],
  ["tonart","تون‌آرت","کارگاه سفال","گرم","مدرن","#f1e4d3","#2b1e16","#c65a33","ساخته از خاک.","در کارگاه","کلاس‌های سفال","فروشگاه","مراحل ساخت","کارگاه سفال با کلاس‌های حضوری و مجموعهٔ ظرف‌های دست‌ساز.","61-70"],
  ["flausch","فلاوش","مامایی و کلاس والدین","بازیگوش","نرم","#fff3f6","#34202a","#ea84aa","همراهت در شروعی تازه","کنار خانواده","دوره‌ها","همراهی ماما","تماس","فضایی آرام برای آشنایی با ماما و انتخاب کلاس والدین.","61-70"],
  ["kumo","کومو","رستوران ژاپنی","جسور","مدرن","#1c2543","#fff3f6","#f1a4ba","کومو در بازار شهر","از آشپزخانه","منوی غذا","میز گروهی","رزرو","رستوران ژاپنی با منوی غذا و انتخاب میز برای دورهمی.","61-70"],
  ["kreisel","کرایزل","اجارهٔ قایق","آرام","گرد","#d5eee7","#112c29","#f28c40","به اسکلهٔ آبی خوش آمدی","کنار آب","قایق‌ها","تعرفه‌ها","ساعت کاری","اسکله‌ای برای مقایسهٔ قایق‌ها و پیدا کردن زمان مناسب گشت.","61-70"],
  ["sichtbar","زیشت‌بار","مربیگری شبکه‌های اجتماعی","بازیگوش","مدرن","#ffffff","#151515","#ff604b","دیده شو. قصه‌ات رو تعریف کن.","مسیر یادگیری","جلسه‌ها","دربارهٔ مربی","درخواست مشاوره","معرفی مربی و برنامه‌های تولید محتوا برای شبکه‌های اجتماعی.","61-70"],
  ["achse","آکسه","دفتر معماری","جسور","مجله‌ای","#eeeee8","#181917","#e55d37","معماری با زاویه‌ای تازه.","معماری آکسه","پروژه‌ها","خدمات دفتر","تماس","دفتر معماری با چیدمان مجله‌ای و گالری پروژه‌ها.","61-70"],
  ["orbit","اوربیت","نرم‌افزار و خودکارسازی","گرم","مدرن","#ffffff","#151515","#ff9528","کارهایی که خودشان پیش می‌روند.","همراه اوربیت","امکانات","راهکارها","مشاوره","معرفی ابزار خودکارسازی برای کارهای تکراری تیم‌ها.","61-70"],
  ["rundlauf","روندلاوف","سینما","جسور","گرد","#151521","#f7f7ff","#ffcf3e","به سینما نور خوش آمدی","روی پرده","فیلم‌ها","سانس‌ها","انتخاب بلیت","سینمایی برای مرور فیلم‌ها و انتخاب سانس نمایش.","61-70"]
].map(([slug,name,field,mood,layout,bg,ink,dot,title,section,first,second,third,desc,comparison])=>({
  slug,name,field,mood,layout,bg,ink,dot,title,section,entries:[first,second,third],desc,comparison,
  template:true,wash:'color-mix(in srgb,'+dot+' 14%,#f1f2f6)'
})));
catalogDesigns.push(...studioTemplates);
const galleryDesigns=[...studioTemplates,...catalogDesigns.filter(p=>!p.template)];
function templatePath(p){return 'templates/'+p.slug+'/index.html'}
function templateShot(p){return 'templates/'+p.slug+'/card.webp'}

function preview(p) {
  if(p.template)return '<div class="face template-face" aria-hidden="true"><img draggable="false" src="'+templateShot(p)+'" alt=""></div>';
  const artwork = p.img ? '<img src="concept-' + p.img + '.webp" alt="" draggable="false">' :
    '<span class="' + (p.style === 'poster' ? 'poster-art' : p.style === 'playful' ? 'playful-art' : 'sample-art') + '"></span>';
  return '<div aria-hidden="true" class="face ' + p.style + '" style="--face-ink:' + p.ink + ';--face-bg:' + p.bg + '">' + artwork +
    '<div class="microbar"><b>' + p.name + '</b><small>' + p.sub + '</small></div><div class="face-title">' + p.title + '</div><span class="face-action">' + p.action + '</span></div>';
}

function foot(project, gallery) {
  const field = gallery ? '<small>'+project.field+'</small>' : '';
  const styleTag = gallery ? '<span class="layout-tag">'+project.layout+'</span>' : '';
  return '<div class="card-foot"><span class="card-name"><strong>'+project.name+'</strong>'+field+
    '</span><span class="card-tags">'+styleTag+'<span class="mood-label" style="--dot:'+project.dot+
    '"><i></i>'+project.mood+'</span></span></div>';
}

function pageStrip(project) {
  const cards = project.entries.map((entry,i)=>'<div><i class="strip-thumb t'+i+'"></i><b>'+entry+'</b></div>').join('');
  return '<div aria-hidden="true" class="sample-strip strip-'+project.style+'" style="--strip-bg:'+project.bg+
    ';--strip-ink:'+project.ink+';--strip-dot:'+project.dot+'"><b>'+project.section+
    '</b><div class="strip-grid">'+cards+'</div></div>';
}

const phoneCards = matchMedia('(max-width:700px), (pointer:coarse)');
let currentStrip;
function stopPhoneStrip() {
  if (!currentStrip) return;
  const {button, animation} = currentStrip;
  currentStrip = null;
  const card=button.closest('.gallery-card,.deck-card');
  card?.classList.remove('is-live');
  card?.querySelector('.live-card-window')?.remove();
  animation?.cancel();
  delete button.dataset.playback;
}
phoneCards.addEventListener('change', stopPhoneStrip);
const reduceStripMotion=matchMedia('(prefers-reduced-motion:reduce)');
reduceStripMotion.addEventListener('change',stopPhoneStrip);
let stripWidth = innerWidth;
window.addEventListener('resize', () => {
  if (innerWidth !== stripWidth) stopPhoneStrip();
  stripWidth = innerWidth;
});
function openLiveCard(state, project) {
  if(currentStrip!==state || !state.button.isConnected)return;
  const card=state.button.closest('.gallery-card,.deck-card');
  const panel=document.createElement('div');
  panel.className='live-card-window';
  panel.dataset.opening='';
  panel.style.backgroundImage='url(previews/'+project.slug+'-mobile.webp)';
  const bar=document.createElement('div');
  bar.className='live-card-bar';
  const status=document.createElement('span');
  status.textContent='در حال باز شدن قالب…';
  status.setAttribute('role','status');
  const close=document.createElement('button');
  close.type='button';close.textContent='بستن پیش‌نمایش';
  const frame=document.createElement('iframe');
  frame.title='قالب تعاملی '+project.name;
  frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-modals allow-downloads');
  close.onclick=()=>{
    stopPhoneStrip();
    (card.querySelector('.deck-trigger') || state.button).focus({preventScroll:true});
  };
  bar.append(status,close);panel.append(bar,frame);
  let initial=true;
  frame.addEventListener('load',async()=>{
    if(currentStrip!==state)return;
    const doc=frame.contentDocument;
    if(!doc || !doc.body){delete panel.dataset.opening;status.textContent=project.name;return;}
    doc.documentElement.style.overscrollBehaviorY='contain';
    if(initial){
      initial=false;
      await doc.fonts.ready;
      if(currentStrip!==state || frame.contentDocument!==doc)return;
      frame.contentWindow.scrollTo({top:doc.documentElement.scrollHeight,behavior:'instant'});
    }
    delete panel.dataset.opening;
    panel.style.removeProperty('background-image');
    status.textContent='پیش‌نمایش تعاملی '+project.name;
  });
  frame.src=project.template ? templatePath(project) : 'design-preview.html?name='+encodeURIComponent(project.slug);
  card.prepend(panel);
  card.classList.add('is-live');
  state.button.dataset.playback='live';
}

async function playPhoneStrip(button, viewport, image, project) {
  if (currentStrip?.button === button && currentStrip.animation) {
    const animation = currentStrip.animation;
    if (animation.playState === 'running' || animation.playState === 'paused') {
      if (animation.playState === 'paused') animation.play(); else animation.pause();
      button.dataset.playback = animation.playState;
      return;
    }
  }
  stopPhoneStrip();
  const state = currentStrip = {button, animation:null};
  button.dataset.playback = 'loading';
  image.loading = 'eager';
  try { await image.decode(); } catch {
    if (currentStrip === state) stopPhoneStrip();
    return;
  }
  if (currentStrip !== state || !button.isConnected) return;
  const distance = Math.max(0, image.offsetHeight - viewport.clientHeight);
  const duration = reduceStripMotion.matches ? 0 : Math.min(18000, Math.max(3000, distance * 4));
  const animation = state.animation = image.animate(
    [{transform:'translateY(0)'},{transform:'translateY(-'+distance+'px)'}],
    {duration, easing:'linear', fill:'forwards'}
  );
  button.dataset.playback = 'running';
  animation.onfinish = () => openLiveCard(state, project);
}

function loadCardPreview(event) {
  const card=event.target.closest('.gallery-card');
  if(!card || phoneCards.matches || matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  if(event.type==='pointerover' && (event.pointerType!=='mouse'||card.contains(event.relatedTarget)))return;
  if(event.type==='focusin' && !event.target.matches(':focus-visible'))return;
  const placeholder=card.querySelector('[data-preview]');
  if(!placeholder)return;
  const image=new Image();
  image.className='card-scrollshot';image.alt='';image.decoding='async';image.setAttribute('aria-hidden','true');
  // Paint the top of a cached image before starting its travel through the frame.
  image.onload=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>image.classList.add('ready')));
  image.onerror=()=>image.replaceWith(placeholder);
  placeholder.replaceWith(image);
  image.src=placeholder.dataset.preview;
}
document.addEventListener('pointerover',loadCardPreview,{passive:true});
document.addEventListener('focusin',loadCardPreview);

function designTile(project) {
  const tile=document.createElement('article');
  const link=document.createElement('a');
  const url=new URL('design.html',location.href);
  url.searchParams.set('name',project.slug);
  const query=new URLSearchParams(location.search);
  for(const field of ['search','mood','field']) if(query.get(field)) url.searchParams.set(field,query.get(field));
  link.href=url.href;
  link.className='tile-link';
  tile.className='gallery-card';
  link.setAttribute('aria-label','مشاهدهٔ طرح '+project.name+'، '+project.field);
  const surface=project.template ? '<img class="template-shot" src="'+templateShot(project)+'" loading="lazy" decoding="async" alt="">' : preview(project)+pageStrip(project);
  link.innerHTML='<div class="gallery-shot"><div class="sample-page">'+surface+
    '</div><span class="card-scrollshot" data-preview="previews/'+project.slug+'-desktop.webp" aria-hidden="true"></span>'+
    '<span class="sample-cta" aria-hidden="true"><i style="background:'+project.dot+'"></i>دیدن طرح<span class="card-chevron"></span></span></div>'+foot(project,true);
  const button=document.createElement('button');
  button.type='button';
  button.className='tile-play';
  button.setAttribute('aria-label','پیش‌نمایش موبایل '+project.name+'، پخش یا مکث');
  button.innerHTML='<picture><source media="(max-width:700px), (pointer:coarse)" srcset="previews/'+project.slug+'-mobile.webp"><img class="phone-strip" loading="lazy" decoding="async" alt=""></picture><span class="play-caption"><span>پیش‌نمایش</span></span>';
  button.onclick=()=>playPhoneStrip(button,button,button.querySelector('img'),project);
  link.querySelector('.card-name').insertAdjacentHTML('beforeend','<span class="tile-open-label">دیدن صفحهٔ طرح ←</span>');
  link.addEventListener('click',event=>{
    if(!phoneCards.matches || event.detail===0 || event.target.closest('.tile-open-label') ||
       event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)return;
    event.preventDefault();
    if(tile.classList.contains('is-live'))tile.querySelector('iframe').focus();
    else button.click();
  });
  tile.append(link,button);
  return tile;
}

function mountProjectBrief(onDialogChange=()=>{}) {
  const byId=id=>document.getElementById(id);
  const brief=byId('brief');
  brief.innerHTML=`
    <form id="brief-form">
      <header class="brief-head">
        <div><h2 id="brief-heading" tabindex="-1" autofocus>طرحت رو امتحان کن</h2>
        <p>اسم برند و تیترت رو بنویس تا ببینی روی طرح چه شکلی می‌شن.</p></div>
        <button class="close brief-close" type="button" aria-label="بستن پیش‌نمایش">×</button>
      </header>
      <div class="brief-body">
        <div class="brief-layout">
          <figure class="brief-sample">
            <figcaption><span>پیش‌نمایش زنده</span><span class="brief-preview-indicator" aria-hidden="true"></span></figcaption>
            <div class="brief-face"></div>
            <div class="brief-caption"><strong data-brief-name></strong><span data-brief-field></span></div>
          </figure>
          <div class="brief-fields">
            <div class="brief-pair">
              <div><label for="brief-service">نوع سایت</label><select id="brief-service" name="service"><option value="معرفی">سایت معرفی</option><option value="صفحهٔ فرود">صفحهٔ فرود</option><option value="فروشگاه">فروشگاه</option><option value="نگهداری">نگهداری سایت</option><option value="سایر">پروژهٔ سفارشی</option></select></div>
              <div><label for="brief-design">طرح دلخواه</label><select name="design" id="brief-design"></select></div>
            </div>
            <label>اسم برندت<input name="brand" maxlength="100" placeholder="مثلاً کافه آبان" required></label>
            <label>تیتر صفحهٔ اول<input name="headline" maxlength="85" placeholder="مثلاً یه گوشهٔ دنج برای قهوه"></label>
            <label>چه سایتی توی ذهنت داری؟<textarea name="goal" rows="2" maxlength="3500" required placeholder="از کارت بگو و اینکه دوست داری بازدیدکننده توی سایتت چه کاری انجام بده."></textarea></label>
            <label class="brief-cover"><span class="brief-file-button">انتخاب عکس جلد</span><span class="brief-file-text"><strong data-cover-file>عکس دلخواهت</strong><small>فقط برای پیش‌نمایش روی دستگاهت</small></span><input type="file" aria-label="انتخاب عکس جلد برای پیش‌نمایش" accept="image/png,image/jpeg,image/webp" name="cover"></label>
          </div>
        </div>
      </div>
      <div class="brief-actions">
        <button type="submit" class="pill primary" value="order" formnovalidate>ادامهٔ ثبت سفارش <span aria-hidden="true">←</span></button>
        <button type="submit" class="brief-download" value="download">دانلود خلاصه</button>
      </div>
      <p role="status" id="saved"></p>
    </form>`;
  const form=byId('brief-form');
  const design=form.elements.design;
  catalogDesigns.forEach((project,index)=>{
    const option=new Option(project.name,index);
    option.dataset.detail=project.field;
    option.dataset.search=project.slug;
    option.dataset.color=project.dot;
    design.add(option);
  });
  const pickers=[
    window.BitterSelect?.enhance(form.elements.service,{label:'نوع سایت'}),
    window.BitterSelect?.enhance(design,{searchable:true,label:'طرح دلخواه',placeholder:'اسم یا زمینهٔ طرح رو جست‌وجو کن…'})
  ];
  const refreshPickers=()=>pickers.forEach(picker=>picker?.refresh());
  brief.addEventListener('close',()=>pickers.forEach(picker=>picker?.close()));
  brief.addEventListener('click',event=>{if(event.target===brief)brief.close()});
  const sample=form.querySelector('.brief-face');
  let lastDesign, coverUrl='';
  let templateEditor;
  const phonePreview=matchMedia('(max-width:700px)');
  function scaleFrame(){
    const width=phonePreview.matches ? 390 : 1280;
    sample.style.setProperty('--brief-viewport',width+'px');
    sample.style.setProperty('--brief-scale',sample.clientWidth/width);
  }
  phonePreview.addEventListener('change',scaleFrame);
  new ResizeObserver(scaleFrame).observe(sample);
  function mountTemplate(project){
    sample.replaceChildren();sample.classList.add('live-template');
    const frame=document.createElement('iframe');
    frame.inert=true;frame.tabIndex=-1;frame.title='پیش‌نمایش زندهٔ '+project.name;
    frame.addEventListener('load',()=>{
      if(!frame.isConnected)return;
      const page=frame.contentDocument;
      // The editor is a fixed, inert thumbnail. Keep decorative overflow
      // inside its viewport, including wide moving strips in RTL templates.
      page.documentElement.style.overflow='clip';
      page.body.style.overflowX='clip';
      const title=page.querySelector('[data-template-title]') || page.querySelector('h1');
      const brands=[...page.querySelectorAll(project.template?'[data-template-brand]':'.microbar b')];
      const concept=project.template?null:page.querySelector('.face');
      const cover=page.querySelector('[data-template-cover]') || concept?.querySelector('img');
      form.elements.cover.closest('label').hidden=!(cover||concept);
      const textFields=[[title,form.elements.headline],...brands.map(node=>[node,form.elements.brand])].filter(([node])=>node);
      const originals=textFields.map(([node])=>node.innerHTML);
      const photo=page.createElement('img');
      photo.alt='';photo.style.cssText='width:100%;height:100%;object-fit:cover;display:block';
      const originalSrc=cover?.getAttribute('src');
      const coverChildren=cover && cover.tagName!=='IMG' ? [...cover.childNodes] : [];
      templateEditor=()=>{
        textFields.forEach(([node,input],i)=>{
          if(input.value.trim())node.textContent=input.value.trim();
          else if(node.innerHTML!==originals[i])node.innerHTML=originals[i];
        });
        if(concept){
          concept.classList.toggle('custom-cover',Boolean(coverUrl));
          if(!cover && coverUrl){
            photo.src=coverUrl;
            if(photo.parentNode!==concept)concept.prepend(photo);
          }else photo.remove();
        }
        if(!cover)return;
        if(cover.tagName==='IMG'){
          if(coverUrl)cover.src=coverUrl;else if(originalSrc)cover.src=originalSrc;
        }else if(coverUrl){
          photo.src=coverUrl;if(photo.parentNode!==cover)cover.replaceChildren(photo);
        }else if(photo.parentNode===cover){cover.replaceChildren(...coverChildren)}
      };
      templateEditor();scaleFrame();
    });
    frame.src=project.template ? templatePath(project) : 'design-preview.html?name='+encodeURIComponent(project.slug);
    sample.append(frame);scaleFrame();
  }
  function updatePreview(){
    const project=catalogDesigns[Number(byId('brief-design').value)];
    if(!project)return;
    if(project!==lastDesign){
      templateEditor=null;lastDesign=project;
      form.querySelector('[data-brief-name]').textContent=project.name;
      form.querySelector('[data-brief-field]').textContent=project.field;
      form.querySelector('.brief-sample').style.setProperty('--sample-tone',project.wash);
      form.elements.cover.closest('label').hidden=false;
      mountTemplate(project);
    }
    templateEditor?.();
  }
  form.elements.cover.addEventListener('change',()=>{
    if(coverUrl)URL.revokeObjectURL(coverUrl);
    const file=form.elements.cover.files[0];
    form.querySelector('[data-cover-file]').textContent=file?.name || 'عکس دلخواهت';
    coverUrl=file?URL.createObjectURL(file):'';
    updatePreview();
  });
  form.addEventListener('input',updatePreview);
  form.addEventListener('change',updatePreview);
  brief.querySelector('.close').onclick=()=>brief.close();
  brief.addEventListener('close',onDialogChange);
  byId('brief-form').onsubmit=event=>{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const p = catalogDesigns[Number(data.get('design'))];
    if (event.submitter?.value !== 'download') {
      const service = data.get('service');
      const plan = ({'معرفی':'business','صفحهٔ فرود':'landing','فروشگاه':'shop'})[service] || 'custom';
      const url = new URL('order.html', location.href);
      url.searchParams.set('design', p.slug);
      url.searchParams.set('plan', plan);
      window.name = 'bitter.order.prefill:' + JSON.stringify({
        brand: data.get('brand'), headline: data.get('headline'), description: data.get('goal'),
        design: p.slug, plan
      });
      location.assign(url.href);
      return;
    }
    const lines=['خلاصهٔ پروژه بیتر','نام برند: '+data.get('brand'),'طرح و حال‌وهوا: '+p.name+'، '+p.mood];
    if(data.get('service')) lines.push('نوع پروژه: '+data.get('service'));
    if(data.get('headline'))lines.push('تیتر انتخابی: '+data.get('headline'));
    if(data.get('cover')?.name)lines.push('تصویر جلد: '+data.get('cover').name);
    lines.push(String(data.get('goal')));
    const url=URL.createObjectURL(new Blob(['\uFEFF',lines.join('\r\n')],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');
    a.href=url;
    a.download='خلاصه-پروژه-بیتر.txt';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
    byId('saved').textContent='خلاصهٔ پروژه‌ات آمادهٔ دانلوده.';
  };
  return index=>{
    design.value=String(index);
    refreshPickers();
    updatePreview();
    byId('saved').textContent='';
    if(!brief.open){
      brief.showModal();
      brief.querySelector('.brief-body').scrollTop=0;
    }
    onDialogChange();
  };
}
const moodInks={'آرام':'#3d7bf2','بازیگوش':'#ff4fc1','تازه':'#19c48e','گرم':'#ff6a3d','ظریف':'#b8914a','جسور':'#7a2bff'};
const fieldsByGroup={
  'زیبایی و مراقبت':'malve klotz kalma flora',
  'غذا و کافه':'lava kumo kost hui matz kachel klecks fink quelle soor bokhar',
  'فنی و ساختمان':'sonnseite bogen zack phase vorlauf kehre flussbett',
  'معماری و دکوراسیون':'atelier achse gefuege wiese hocker lot lehm schnitt avand cheft rooz',
  'مشاوره و خدمات':'sichtbar orbit neutral prisma klarblick polster kapitel groschen neugier mohn nordlicht madar',
  'سلامت و درمان':'flausch vitalnetz samt mohn weitsicht kalma',
  'ورزش و تناسب اندام':'korb elan atem doppel mohn pulver abschlag kern rad',
  'هنر و استودیوهای خلاق':'tonart rundlauf raster neutral zugabe versal norm grotesk mosaik blende funke glanz stapel wirbel stimmen zarb satr kadr chin togh',
  'گردشگری و رویداد':'kreisel rundlauf kost zugabe klangwelle bleibe trubel stimmen karst zarb',
  'فروشگاه آنلاین':'tonart hui hocker matz radlwerk malve papierarchiv stempel kalma quelle flora holu satr chin togh cheft tal rooz',
  'املاک و مسکن':'villa',
  'سایر کسب‌وکارها':'radlwerk papierarchiv stempel holu tal'
};
const sectorGroups=Object.entries(fieldsByGroup).map(([name,members])=>({name,value:'group:'+name,members:new Set(members.split(' '))}));
function matchesField(project,value){
  if(!value)return true;
  return value.startsWith('group:')?sectorGroups.find(group=>group.value===value)?.members.has(project.slug):project.field===value;
}
function normalizeSearch(value){
  return value.normalize('NFKC').toLowerCase().replace(/[يى]/g,'ی').replace(/ك/g,'ک')
    .replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[\u200c\u200d]/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
}
const vocabulary=[
  ['قهوه','کافه','کافی شاپ','کافی‌شاپ','coffee','cafe'],
  ['ورزش','باشگاه','fitness'],['معماری','معمار','architecture'],['وب','سایت','وبسایت'],
  ['عکاسی','عکاس','عکس','photography'],['خودرو','ماشین','اتومبیل'],['تاتو','تتو','خالکوبی'],
  ['آنلاین','اینترنتی'],['پزشکی','درمان','کلینیک'],['آرایشی','زیبایی'],['تکنولوژی','فناوری'],
  ['نرم افزار','نرم‌افزار','software'],['شیرینی','دسر'],['پوشاک','لباس'],['موبایل','گوشی'],
  ['لوکس','ظریف','شیک'],['جسورانه','جسور'],['شاد','بازیگوش'],['مینیمالیستی','مینیمال']
].map(group=>group.map(normalizeSearch));
function searchCatalogue(query){
  const text=normalizeSearch(query);
  if(!text)return {items:galleryDesigns,note:''};
  const terms=[...new Set(text.split(' '))];
  const rows=galleryDesigns.map(project=>{
    const name=normalizeSearch(project.name+' '+project.slug);
    const header=normalizeSearch([project.field,project.mood,project.layout,project.title].join(' '));
    const body=normalizeSearch([project.desc,...project.entries].join(' '));
    const scores=terms.map(term=>{
      const aliases=vocabulary.find(group=>group.includes(term))||[];
      if(name.includes(term))return 8;
      if(header.includes(term))return 5;
      if(body.includes(term))return 2;
      return aliases.some(alias=>header.includes(alias)||body.includes(alias))?1:0;
    });
    return {project,scores,score:scores.reduce((sum,n)=>sum+n,0)};
  });
  const known=terms.map((_,i)=>rows.some(row=>row.scores[i]>0));
  const positive=rows.filter(row=>row.score>0);
  const all=positive.filter(row=>known.every((exists,i)=>!exists||row.scores[i]>0));
  const matches=all.length?all:positive;
  const missing=terms.filter((_,i)=>!known[i]).map(word=>'«'+word+'»').join('، ');
  const note=[missing && positive.length?'برای '+missing+' طرحی پیدا نشد.':'',positive.length&&!all.length?'نتیجه‌ها با بخشی از عبارت شما هم‌خوانی دارند.':''].filter(Boolean).join(' ');
  return {items:matches.sort((a,b)=>b.score-a.score).map(row=>row.project),note};
}

function cataloguePicker(select){
  const label=select.options[0].textContent;
  const wrap=document.createElement('div'),trigger=document.createElement('button'),list=document.createElement('div');
  const group=select.closest('.filter-group'),choices=[...select.options];
  select.hidden=true;wrap.className='catalog-picker';select.after(wrap);
  trigger.type='button';trigger.setAttribute('aria-haspopup','listbox');
  trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',select.id+'-choices');
  list.id=select.id+'-choices';list.className='picker-list';list.tabIndex=-1;list.hidden=true;
  list.setAttribute('role','listbox');list.setAttribute('aria-label',label);
  wrap.append(trigger);group.append(list);
  let active=0,typed='',lastKey=0;
  const entries=choices.map((option,i)=>{
    const item=document.createElement('button');item.type='button';item.tabIndex=-1;item.id=select.id+'-item-'+i;
    item.setAttribute('role','option');
    const mark=document.createElement('i'),name=document.createElement('span'),count=document.createElement('small');
    mark.setAttribute('aria-hidden','true');
    const color=select.id==='mood' && moodInks[option.value];
    if(color){
      mark.style.setProperty('--swatch',color);
      if(option.value!=='جسور')mark.style.setProperty('--check-ink','#18162b');
    }
    name.textContent=option.dataset.label||option.value||('همهٔ '+(select.id==='mood'?'حال‌وهواها':'زمینه‌ها'));
    item.append(mark,name,count);list.append(item);
    item.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')markActive(i,false)});
    item.addEventListener('mousedown',e=>e.preventDefault());
    item.onclick=()=>{select.selectedIndex=i;close(true);select.dispatchEvent(new Event('change',{bubbles:true}))};
    return {item,count,name:name.textContent};
  });
  function refresh(counts){
    const selected=Math.max(0,select.selectedIndex);
    trigger.textContent=select.value?entries[selected].name:label;
    trigger.setAttribute('aria-label',label+'، '+entries[selected].name);trigger.classList.toggle('picked',Boolean(select.value));
    if(select.id==='mood')trigger.style.setProperty('--mood-fill',moodInks[select.value]||'var(--mood-wheel)');
    entries.forEach(({item,count},i)=>{
      item.hidden=choices[i].hidden && selected!==i;
      item.setAttribute('aria-selected',String(i===selected));
      const n=counts.get(choices[i].value)||0;count.textContent=n.toLocaleString('fa-IR');item.classList.toggle('zero',n===0);
    });
  }
  function place(reveal=false){
    if(list.hidden)return;
    const viewport=window.visualViewport;
    const left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0;
    const width=viewport?.width||document.documentElement.clientWidth,height=viewport?.height||innerHeight;
    const gutter=12,gap=8;
    let btn=trigger.getBoundingClientRect();
    list.style.maxWidth=Math.max(0,width-2*gutter)+'px';
    list.style.minWidth=Math.min(width-2*gutter,Math.max(248,btn.width))+'px';
    const naturalHeight=Math.min(list.scrollHeight,640,height*.72);
    if(reveal){
      // Use layout dimensions: the opening animation scales the painted bounds.
      const missing=btn.bottom+gap+naturalHeight+gutter-(top+height);
      const shift=Math.min(missing,btn.top-top-96);
      if(shift>0){
        window.scrollBy({top:shift,behavior:'instant'});
        btn=trigger.getBoundingClientRect();
      }
    }
    const rail=trigger.closest('.filter-rail').getBoundingClientRect();
    if(btn.bottom<=top||btn.top>=top+height||btn.right<=rail.left||btn.left>=rail.right){
      close();
      return;
    }
    const below=top+height-gutter-btn.bottom-gap;
    const above=btn.top-top-gutter-gap;
    const opensUp=below+1<naturalHeight && above>below;
    list.dataset.side=opensUp?'above':'below';
    list.style.maxHeight=Math.max(0,Math.min(naturalHeight,opensUp?above:below))+'px';
    const host=group.getBoundingClientRect();
    const x=Math.max(left+gutter,Math.min(left+width-list.offsetWidth-gutter,btn.right-list.offsetWidth));
    list.style.left=(x-host.left)+'px';
    list.style.top=((opensUp?btn.top-gap-list.offsetHeight:btn.bottom+gap)-host.top)+'px';
  }
  function markActive(i,scroll=true){
    active=i;list.setAttribute('aria-activedescendant',entries[i].item.id);
    entries.forEach((entry,n)=>entry.item.classList.toggle('current',n===i));
    const item=entries[i].item;
    if(scroll){if(item.offsetTop<list.scrollTop)list.scrollTop=item.offsetTop-8;else if(item.offsetTop+item.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=item.offsetTop+item.offsetHeight-list.clientHeight+8}
  }
  function close(returnFocus=false){
    list.hidden=true;typed='';trigger.setAttribute('aria-expanded','false');
    if(returnFocus)trigger.focus({preventScroll:true});
  }
  function open(){
    list.hidden=false;trigger.setAttribute('aria-expanded','true');place(true);
    if(list.hidden)return;
    markActive(Math.max(0,select.selectedIndex));list.focus({preventScroll:true});
  }
  trigger.onclick=()=>list.hidden?open():close();
  trigger.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open()}};
  list.onkeydown=e=>{
    const visible=entries.map((v,i)=>v.item.hidden?-1:i).filter(i=>i>=0),at=visible.indexOf(active);
    if(e.key==='Escape'||e.key==='Tab'){close(true);if(e.key==='Escape')e.preventDefault();return}
    if(e.key==='Enter'||e.key===' '){e.preventDefault();entries[active].item.click();return}
    const next={ArrowDown:Math.min(at+1,visible.length-1),ArrowUp:Math.max(at-1,0),Home:0,End:visible.length-1,PageUp:0,PageDown:visible.length-1}[e.key];
    if(next!==undefined){e.preventDefault();markActive(visible[next]);return}
    if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
      const now=performance.now(),letter=normalizeSearch(e.key);
      if(!letter)return;
      e.preventDefault();
      typed=now-lastKey<700&&typed!==letter?typed+letter:letter;lastKey=now;
      const start=typed.length===1?at+1:at;
      for(let step=0;step<visible.length;step++){
        const i=visible[(start+step)%visible.length];
        if(normalizeSearch(entries[i].name).startsWith(typed)){markActive(i);break}
      }
    }
  };
  document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target)&&!list.contains(e.target))close()});
  list.onfocusout=e=>{if(!list.contains(e.relatedTarget)&&e.relatedTarget!==trigger)close()};
  let frame=0;
  function schedulePlace(){
    if(list.hidden||frame)return;
    frame=requestAnimationFrame(()=>{frame=0;place()});
  }
  window.addEventListener('resize',schedulePlace);
  window.addEventListener('scroll',schedulePlace,{passive:true});
  window.visualViewport?.addEventListener('resize',schedulePlace);
  window.visualViewport?.addEventListener('scroll',schedulePlace,{passive:true});
  group.querySelector('.filter-rail').addEventListener('scroll',schedulePlace,{passive:true});
  return refresh;
}

function mountDesignCatalogue({homepage=false,onDialogChange=()=>{}} = {}) {
  const byId = id=>document.getElementById(id);
  const num = n=>n.toLocaleString('fa-IR');
  const gallery = byId('gallery');
  const detail = byId('detail');

  const filters = ['search','mood','field'];
  let selected = 0;

  const cardElements=new Map(galleryDesigns.map(project=>{
    const tile=designTile(project);tile.id='template-'+project.slug;gallery.append(tile);
    return [project,tile];
  }));
  const openBrief=mountProjectBrief(onDialogChange);
  const moodSelect=byId('mood'),fieldSelect=byId('field'),search=byId('search');
  if(homepage){
    const group=document.createElement('div'),rail=document.createElement('div');
    group.className='filter-group';rail.className='filter-rail';
    byId('reset').before(group);
    group.append(rail);rail.append(byId('reset'),moodSelect,fieldSelect);
  }
  const fields=[...new Set(catalogDesigns.map(p=>p.field))];
  Object.keys(moodInks).forEach(name=>moodSelect.add(new Option(name,name)));
  sectorGroups.forEach(({name,value})=>{
    const opt=new Option(name,value);opt.dataset.label=name;fieldSelect.add(opt);
  });
  fields.forEach(name=>{
    const opt=new Option(name,name);
    // Direct industry links saved in earlier versions still select that exact industry.
    opt.hidden=true;fieldSelect.add(opt);
    if(homepage){
      const sector=document.createElement('a');sector.href='designs.html?field='+encodeURIComponent(name);
      sector.textContent=name;byId('sector-links').append(sector);
    }
  });
  const refreshMood=cataloguePicker(moodSelect),refreshFields=cataloguePicker(fieldSelect);
  const empty=byId('empty'),emptyReset=byId('empty-reset'),clear=byId('clear-search');
  let lastOrder='',recovery='all';
  const linkToAll=document.querySelector('.catalog-more a');
  function filterCards(){
    const query=search.value.trim(),mood=moodSelect.value,field=fieldSelect.value;
    const {items,note}=searchCatalogue(query);
    const fitsMood=p=>!mood||p.mood===mood, fitsField=p=>matchesField(p,field);
    const shown=items.filter(p=>fitsMood(p)&&fitsField(p));
    const availableMood=items.filter(fitsField),availableFields=items.filter(fitsMood);
    refreshMood(new Map([...moodSelect.options].map(o=>[o.value,o.value?availableMood.filter(p=>p.mood===o.value).length:availableMood.length])));
    refreshFields(new Map([...fieldSelect.options].map(o=>[o.value,availableFields.filter(p=>matchesField(p,o.value)).length])));
    const visible=new Set(homepage&&!query&&!mood&&!field?shown.slice(0,12):shown);
    for(const [project,card] of cardElements){
      card.hidden=!visible.has(project);
      if(card.hidden && currentStrip && card.contains(currentStrip.button))stopPhoneStrip();
      if(!card.hidden){
        const link=card.querySelector('.tile-link');
        const url=new URL(link.href);
        for(const key of filters){const value=byId(key).value;if(value)url.searchParams.set(key,value);else url.searchParams.delete(key)}
        if(link.href!==url.href)link.href=url.href;
      }
    }
    const order=items.map(p=>p.slug).join('|');
    if(order!==lastOrder){
      // Moving only visible cards avoids recreating focus targets or fetching their images again.
      let position=gallery.firstElementChild;
      for(const p of items){
        const node=cardElements.get(p);
        if(node!==position)gallery.insertBefore(node,position);
        position=node.nextElementSibling;
      }
      lastOrder=order;
    }
    byId('reset').setAttribute('aria-pressed',String(!mood&&!field));
    byId('reset').querySelector('span').textContent=num(items.length);
    empty.hidden=shown.length>0;
    if(clear){
      clear.hidden=!search.value;
      byId('search-note').textContent=note;byId('search-note').hidden=!note;
      const status=[num(shown.length)+' طرح',mood,fieldSelect.value?fieldSelect.selectedOptions[0]?.textContent:''].filter(Boolean);
      byId('found').textContent=status.join('، ');
      if(!shown.length){
        recovery=mood&&field&&availableFields.length?'field':(mood||field)&&items.length?'filters':'all';
        empty.querySelector('h2').textContent=query?'طرحی برای «'+query+'» با این انتخاب پیدا نشد':'طرحی با این انتخاب پیدا نشد';
        empty.querySelector('p').textContent=recovery==='field'?num(availableFields.length)+' طرح با همین حال‌وهوا در زمینه‌های دیگر هست.':recovery==='filters'?num(items.length)+' طرح برای این جست‌وجو در کل گالری هست.':'عبارت دیگری بنویسید یا از یکی از این جست‌وجوها شروع کنید.';
        emptyReset.textContent={field:'نمایش همهٔ زمینه‌ها',filters:'جست‌وجو در همهٔ طرح‌ها',all:'نمایش همهٔ طرح‌ها'}[recovery];
        empty.querySelector('.empty-suggestions').hidden=recovery!=='all';
      }
    }
    if(linkToAll)linkToAll.href='designs.html'+location.search;
  }
  function readFilters(){
    const params=new URLSearchParams(location.search);
    for(const key of filters)byId(key).value=params.get(key)||'';
    filterCards();
  }
  function filterURL(base){
    const url=new URL(base,location.href);
    for(const key of filters){const value=byId(key).value;if(value)url.searchParams.set(key,value);else url.searchParams.delete(key)}
    return url;
  }
  function saveFilters(){
    const url=filterURL(location.href);
    if(url.hash.startsWith('#template-'))url.hash='';
    history.replaceState(history.state,'',url);filterCards();
  }
  search.oninput=saveFilters;
  search.addEventListener('keydown',event=>{if(homepage&&event.key==='Enter'){event.preventDefault();location.assign(filterURL('designs.html'))}});
  moodSelect.onchange=fieldSelect.onchange=()=>{if(homepage)location.assign(filterURL('designs.html'));else saveFilters()};
  byId('reset').onclick=()=>{moodSelect.value='';fieldSelect.value='';if(homepage)search.value='';saveFilters()};
  if(clear){
    clear.onclick=()=>{search.value='';saveFilters();search.focus()};
    emptyReset.onclick=()=>{
      fieldSelect.value='';
      if(recovery!=='field')moodSelect.value='';
      if(recovery==='all')search.value='';
      saveFilters();search.focus({preventScroll:true});
    };
    empty.querySelector('.empty-suggestions').onclick=e=>{
      const button=e.target.closest('button');if(!button)return;
      moodSelect.value='';fieldSelect.value='';search.value=button.textContent;saveFilters();search.focus({preventScroll:true});
    };
  }
  readFilters();
  window.addEventListener('popstate',readFilters);
  if(!homepage){
    gallery.addEventListener('click',event=>{
      const card=event.target.closest('.gallery-card');
      if(event.defaultPrevented||!event.target.closest('.tile-link')||!card||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const spot={id:card.id,top:card.getBoundingClientRect().top,query:location.search};
      history.replaceState({...history.state,bitterGallerySpot:spot},'');
    });
    window.addEventListener('pageshow',event=>{
      const spot=history.state?.bitterGallerySpot;
      if(event.persisted||performance.getEntriesByType('navigation')[0]?.type!=='back_forward'||!spot||spot.query!==location.search)return;
      const previous=byId(spot.id);
      if(previous&&!previous.hidden)document.fonts.ready.then(()=>{
        const delta=previous.getBoundingClientRect().top-spot.top;
        if(Math.abs(delta)>2)scrollBy({top:delta,behavior:'instant'});
      });
    });
  }
  const rail=document.querySelector('.filter-rail');
  if(rail){
    let start=null,swallow=false;
    rail.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'||e.button!==0||rail.scrollWidth<=rail.clientWidth)return;
      start={x:e.clientX,left:rail.scrollLeft,id:e.pointerId,moved:false};
    });
    window.addEventListener('pointermove',e=>{
      if(start?.id!==e.pointerId)return;
      const dx=e.clientX-start.x;
      if(Math.abs(dx)>5)start.moved=true;
      if(start.moved){rail.setPointerCapture(e.pointerId);rail.scrollLeft=start.left-dx}
    });
    function release(e){if(start?.id===e.pointerId){swallow=start.moved;start=null;setTimeout(()=>swallow=false,0)}}
    window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
    rail.addEventListener('click',e=>{if(swallow){e.preventDefault();e.stopImmediatePropagation()}},true);
  }

  function syncCase() {
    const index=catalogDesigns.findIndex(project=>location.hash==='#design-'+project.slug);
    if(index<0) {
      if(detail.open) detail.close();
      return;
    }
    selected=index;
    const p=catalogDesigns[index];
    byId('detail-view').innerHTML=preview(p)+pageStrip(p);
    byId('detail-view').scrollTop=0;
    byId('case-name').textContent=p.name;
    byId('case-tag').textContent='طرح مفهومی · '+p.field+' · '+p.layout+' · '+p.mood;
    byId('case-desc').textContent=p.desc;
    const palette=byId('case-palette');
    palette.textContent='رنگ‌های طرح';
    for(const color of [p.bg,p.ink,p.dot]) {
      const chip=document.createElement('i');
      chip.style.backgroundColor=color;
      palette.append(chip);
    }
    if(!detail.open) detail.showModal();
    onDialogChange();
  }
  window.addEventListener('hashchange',syncCase);
  byId('choose').onclick=()=>{detail.close();openBrief(selected)};
  detail.querySelector('.close').onclick=()=>detail.close();
  detail.addEventListener('close',()=>{
    if(location.hash.startsWith('#design-')) history.replaceState(history.state,'',location.pathname+location.search+(homepage?'#work':''));
    onDialogChange();
  });
  syncCase();
  return {openBrief};
}


if (document.body.classList.contains('design-catalogue')) mountDesignCatalogue();
