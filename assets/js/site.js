
// floating navigation
const siteHeader=document.querySelector('.site-header');
if(siteHeader){
  const syncFloatingHeader=()=>siteHeader.classList.toggle('is-scrolled',window.scrollY>28);
  syncFloatingHeader();
  window.addEventListener('scroll',syncFloatingHeader,{passive:true});
}

const burger=document.querySelector('.burger'), mobile=document.querySelector('.mobile-menu');
if(burger&&mobile){
  const setMobileMenu=(open)=>{
    mobile.classList.toggle('open',open);
    document.body.classList.toggle('menu-open',open);
    burger.setAttribute('aria-expanded',String(open));
    mobile.setAttribute('aria-hidden',String(!open));
  };
  burger.addEventListener('click',()=>setMobileMenu(!mobile.classList.contains('open')));
  mobile.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMobileMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMobileMenu(false)});
}
document.querySelectorAll('.reveal').forEach(el=>new IntersectionObserver(([e],o)=>{if(e.isIntersecting){e.target.classList.add('in');o.disconnect()}},{threshold:.08}).observe(el));
// apartment filter
const filters=document.querySelectorAll('.filter-btn');
filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');let f=b.dataset.filter;document.querySelectorAll('[data-floor]').forEach(c=>c.style.display=(f==='all'||c.dataset.floor===f)?'block':'none')}));
// gallery lightbox
const lb=document.querySelector('.lightbox'), lbimg=lb?.querySelector('img');
document.querySelectorAll('.gallery-item img').forEach(img=>img.addEventListener('click',()=>{if(lb&&lbimg){lbimg.src=img.src;lb.classList.add('open')}}));
if(lb){lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lightbox-close'))lb.classList.remove('open')})}
// apartment main image
const mainImg=document.querySelector('.detail-main img');
document.querySelectorAll('.thumb-row img').forEach(img=>img.addEventListener('click',()=>{if(mainImg)mainImg.src=img.src}));
// inquiry forms: deliberately not connected until key is supplied.
document.querySelectorAll('form[data-web3forms]').forEach(form=>form.addEventListener('submit',async e=>{
 e.preventDefault(); const status=form.querySelector('.form-status'); const key=(window.SUNNY_CONFIG?.web3formsKey||'').trim();
 if(!key){if(status)status.textContent=form.dataset.lang==='en'?'The inquiry form is ready, but Web3Forms has not been connected yet.':'Forma za upit je spremna, ali Web3Forms još nije povezan.';return}
 const data=new FormData(form);data.append('access_key',key);
 try{let r=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data});let j=await r.json();if(status)status.textContent=j.success?(form.dataset.lang==='en'?'Thank you. Your inquiry has been sent.':'Hvala. Vaš upit je poslan.'):(form.dataset.lang==='en'?'Something went wrong. Please try again.':'Došlo je do pogreške. Pokušajte ponovno.'); if(j.success)form.reset()}catch{if(status)status.textContent=form.dataset.lang==='en'?'Unable to send right now. Please contact us by phone or WhatsApp.':'Trenutno nije moguće poslati. Kontaktirajte nas telefonom ili WhatsAppom.'}
}));


// Privacy / cookie consent. No analytics or marketing scripts are loaded by default.
(()=>{
  const lang=document.documentElement.lang||'hr';
  const isEn=lang==='en';
  const path=location.pathname;
  const inNestedExperience=/\/experiences\//.test(path) || /\/izleti\//.test(path);
  let privacyHref;
  if(isEn){ privacyHref=inNestedExperience?'../privacy-policy.html':'privacy-policy.html'; }
  else { privacyHref=inNestedExperience?'../politika-privatnosti.html':'politika-privatnosti.html'; }
  const banner=document.createElement('div');
  banner.className='privacy-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label',isEn?'Privacy settings':'Postavke privatnosti');
  banner.innerHTML=isEn
    ? `<div class="privacy-copy"><strong>Your privacy</strong><p>We use necessary technologies and local storage for core website functions and to remember your privacy choice. Optional analytics or marketing technologies will not be activated without consent. <a href="${privacyHref}">Privacy Policy</a></p></div><div class="privacy-actions"><button class="privacy-necessary" type="button">${lang==='hr'?'Samo nužni':(lang==='pl'?'Tylko niezbędne':(lang==='de'?'Nur notwendige':(lang==='sk'?'Len nevyhnutné':(lang==='cs'?'Pouze nezbytné':(lang==='hu'?'Csak szükséges':'Necessary only')))))}</button><button class="privacy-accept" type="button">${lang==='hr'?'Prihvati':(lang==='pl'?'Akceptuj':(lang==='de'?'Akzeptieren':(lang==='sk'?'Prijať':(lang==='cs'?'Přijmout':(lang==='hu'?'Elfogadom':'Accept')))))}</button></div>`
    : `<div class="privacy-copy"><strong>Vaša privatnost</strong><p>Koristimo nužne tehnologije i lokalnu pohranu za osnovno funkcioniranje stranice i pamćenje vašeg odabira privatnosti. Analitika ili marketinške tehnologije neće se aktivirati bez privole. <a href="${privacyHref}">Politika privatnosti</a></p></div><div class="privacy-actions"><button class="privacy-necessary" type="button">Samo nužni</button><button class="privacy-accept" type="button">Prihvati</button></div>`;
  document.body.appendChild(banner);
  const saved=localStorage.getItem('sunny_privacy_consent');
  if(!saved) requestAnimationFrame(()=>banner.classList.add('show'));
  const save=(choice)=>{localStorage.setItem('sunny_privacy_consent',choice);banner.classList.remove('show');};
  banner.querySelector('.privacy-necessary')?.addEventListener('click',()=>save('necessary'));
  banner.querySelector('.privacy-accept')?.addEventListener('click',()=>save('accepted'));
})();


// Homepage hero video: deferred loading to preserve performance.
(()=>{
  const video=document.querySelector('.hero-video');
  const media=document.querySelector('.hero-media');
  if(!video || !media) return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=!!(navigator.connection && navigator.connection.saveData);
  if(reduced || saveData) return;
  const loadVideo=()=>{
    if(video.dataset.loaded==='true') return;
    const src=window.innerWidth<=768 ? video.dataset.mobileMp4 : video.dataset.desktopMp4;
    if(!src) return;
    video.src=src;
    video.dataset.loaded='true';
    const reveal=()=>media.classList.add('video-ready');
    video.addEventListener('canplay',reveal,{once:true});
    video.load();
    video.play().then(reveal).catch(()=>{});
  };
  if('requestIdleCallback' in window){
    window.addEventListener('load',()=>requestIdleCallback(loadVideo,{timeout:1500}),{once:true});
  } else {
    window.addEventListener('load',()=>setTimeout(loadVideo,800),{once:true});
  }
})();


// Cinematic first-entry intro for the homepage.
(()=>{
  const intro=document.querySelector('.site-intro');
  if(!intro) return;
  const root=document.documentElement;
  if(root.classList.contains('intro-skip')){
    intro.remove();
    return;
  }
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?450:2050;
  const exitDuration=reduced?300:950;
  const finish=()=>{
    root.classList.add('intro-reveal');
    intro.classList.add('is-leaving');
    try{sessionStorage.setItem('sunny_intro_seen','1')}catch(e){}
    window.setTimeout(()=>{
      root.classList.remove('intro-first');
      intro.remove();
      window.setTimeout(()=>root.classList.remove('intro-reveal'),1050);
    },exitDuration);
  };
  window.setTimeout(finish,duration);
})();

// Mobile-friendly date placeholders for availability and inquiry forms.
(()=>{
  const useTextDates = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
  if(!useTextDates) return;

  const isEn = document.documentElement.lang === 'en';
  const placeholder = isEn ? 'Choose date' : 'Izaberite datum';

  const setupDateField = (input) => {
    if(!input || input.dataset.mobileDateReady === 'true') return;
    input.dataset.mobileDateReady = 'true';
    input.setAttribute('placeholder', placeholder);

    const switchToTextIfEmpty = () => {
      if(!input.value){
        try{ input.type = 'text'; }catch(e){}
        input.setAttribute('placeholder', placeholder);
        input.classList.add('date-as-text');
      }
    };

    const switchToDate = () => {
      try{ input.type = 'date'; }catch(e){}
      input.classList.remove('date-as-text');
    };

    switchToTextIfEmpty();

    input.addEventListener('focus', switchToDate);
    input.addEventListener('click', switchToDate);
    input.addEventListener('touchstart', switchToDate, {passive:true});
    input.addEventListener('blur', switchToTextIfEmpty);
    input.addEventListener('change', () => {
      if(input.value) input.classList.remove('date-as-text');
      else switchToTextIfEmpty();
    });

    input.form?.addEventListener('reset', () => setTimeout(switchToTextIfEmpty, 0));
  };

  document.querySelectorAll('input[type="date"]').forEach(setupDateField);
})();


// Language switcher dropdowns (desktop + mobile)
(()=>{
  const languageMeta = {
    HR:{label:'Hrvatski', short:'HR', flag:`<svg viewBox="0 0 24 16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="16" rx="2.5" fill="#fff"/><rect width="24" height="5.33" rx="2.5 2.5 0 0" fill="#F0263C"/><rect y="10.67" width="24" height="5.33" rx="0 0 2.5 2.5" fill="#1F4FBF"/><g transform="translate(9.1 4.15)"><path d="M0 1.6C0 .72.72 0 1.6 0h3.6c.88 0 1.6.72 1.6 1.6v2.78c0 2-1.36 3.77-3.4 4.37C1.36 8.15 0 6.38 0 4.38Z" fill="#fff" stroke="#1F4FBF" stroke-width=".32"/><g fill="#F0263C"><rect x="0" y="1.6" width="1.13" height="1.13"/><rect x="2.27" y="1.6" width="1.13" height="1.13"/><rect x="4.54" y="1.6" width="1.13" height="1.13"/><rect x="1.13" y="2.73" width="1.13" height="1.13"/><rect x="3.4" y="2.73" width="1.13" height="1.13"/><rect x="0" y="3.86" width="1.13" height="1.13"/><rect x="2.27" y="3.86" width="1.13" height="1.13"/><rect x="4.54" y="3.86" width="1.13" height="1.13"/><rect x="1.13" y="4.99" width="1.13" height="1.13"/><rect x="3.4" y="4.99" width="1.13" height="1.13"/></g><path d="M.45 1.18c.48-.5 1.31-.79 2.14-.79s1.66.29 2.14.79c.48-.5 1.31-.79 2.14-.79v1.08c-.83 0-1.66.31-2.14.84-.48-.53-1.31-.84-2.14-.84s-1.66.31-2.14.84V1.18Z" fill="#2B5CC8"/></g></svg>`},
    EN:{label:'English', short:'EN', flag:`<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="3" fill="#244AA5"/><path d="M0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="3.5"/><path d="M0 0 24 16M24 0 0 16" stroke="#D93737" stroke-width="1.8"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5.3"/><path d="M12 0v16M0 8h24" stroke="#D93737" stroke-width="2.6"/></svg>`},
    PL:{label:'Polski', short:'PL', flag:`<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="3" fill="#fff"/><rect y="8" width="24" height="8" rx="0 0 3 3" fill="#DC3155"/></svg>`},
    DE:{label:'Deutsch', short:'DE', flag:`<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="3" fill="#111"/><rect y="5.33" width="24" height="5.33" fill="#D33535"/><rect y="10.67" width="24" height="5.33" rx="0 0 3 3" fill="#F2C94C"/></svg>`},
    SK:{label:'Slovenčina', short:'SK', flag:`<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="3" fill="#fff"/><rect y="5.33" width="24" height="5.33" fill="#244AA5"/><rect y="10.67" width="24" height="5.33" rx="0 0 3 3" fill="#D93737"/><path d="M7 4.2c1.6 0 2.9 1.2 2.9 2.7v2.3c0 1.9-1.4 3.5-3.3 4-1.9-.5-3.3-2.1-3.3-4V6.9c0-1.5 1.3-2.7 2.9-2.7Z" fill="#fff" stroke="#244AA5" stroke-width=".45"/><path d="M5.5 7.5h2.4M6.7 6.3v3.3" stroke="#D93737" stroke-width=".7"/><path d="M4.9 8.8c1.1.8 2.5.8 3.6 0" stroke="#244AA5" stroke-width=".55" fill="none"/></svg>`},
    CZ:{label:'Čeština', short:'CZ', flag:`<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="3" fill="#fff"/><rect y="8" width="24" height="8" rx="0 0 3 3" fill="#D93737"/><path d="M0 0v16l10-8Z" fill="#244AA5"/></svg>`},
    HU:{label:'Magyar', short:'HU', flag:`<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="3" fill="#D93737"/><rect y="5.33" width="24" height="5.33" fill="#fff"/><rect y="10.67" width="24" height="5.33" rx="0 0 3 3" fill="#2F8D46"/></svg>`}
  };

  const closeAllLanguageMenus = ()=>{
    document.querySelectorAll('.lang-switcher.open').forEach(sw=>{
      sw.classList.remove('open');
      const btn = sw.querySelector('.lang-switcher-toggle');
      if(btn) btn.setAttribute('aria-expanded','false');
    });
  };

  const languageMarkup = (code, mode='menu')=>{
    const cleanCode = (code || '').trim().toUpperCase();
    const meta = languageMeta[cleanCode] || {label: cleanCode, short: cleanCode, flag:''};
    const label = mode === 'toggle' ? meta.short : meta.label;
    return `<span class="lang-inline"><span class="lang-flag" aria-hidden="true">${meta.flag}</span><span class="lang-code">${label}</span></span>`;
  };

  const enhanceLanguageBlock = (container, mobile=false)=>{
    if(!container || container.dataset.langEnhanced==='true') return;
    const links = [...container.querySelectorAll('a')];
    if(!links.length) return;

    const active = links.find(link=>link.classList.contains('active')) || links[0];
    const currentLabel = (active.textContent || '').trim();

    container.dataset.langEnhanced = 'true';
    container.innerHTML = '';
    container.classList.add('lang-has-dropdown');

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher' + (mobile ? ' lang-switcher-mobile' : '');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'lang-switcher-toggle';
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label', mobile ? 'Odabir jezika' : 'Language selector');
    toggle.innerHTML = `${languageMarkup(currentLabel, 'toggle')}<svg class="lang-switcher-chevron" aria-hidden="true" viewBox="0 0 20 20"><path d="M5 7.5 10 12.5 15 7.5"></path></svg>`;

    const menu = document.createElement('div');
    menu.className = 'lang-switcher-menu';

    links.forEach(link=>{
      const clone = link.cloneNode(true);
      const code = (clone.textContent || '').trim();
      clone.classList.add('lang-option');
      clone.innerHTML = languageMarkup(code, 'menu');
      if(clone.classList.contains('active')) clone.setAttribute('aria-current','true');
      menu.appendChild(clone);
    });

    toggle.addEventListener('click',(e)=>{
      e.stopPropagation();
      const isOpen = switcher.classList.contains('open');
      closeAllLanguageMenus();
      switcher.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    menu.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>{
        closeAllLanguageMenus();
      });
    });

    switcher.appendChild(toggle);
    switcher.appendChild(menu);
    container.appendChild(switcher);
  };

  enhanceLanguageBlock(document.querySelector('.lang'), false);
  enhanceLanguageBlock(document.querySelector('.mobile-menu-languages'), true);

  document.addEventListener('click', (e)=>{
    if(!e.target.closest('.lang-switcher')) closeAllLanguageMenus();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeAllLanguageMenus();
  });
})();


// Premium excursions dropdown in desktop navigation + accordion on mobile.
(()=>{
  const lang=document.documentElement.lang||'hr';
  const data={
    hr:[['Orebić i Pelješac','orebic-peljesac',true],['Otok Korčula','korcula'],['Mljet','mljet'],['Neretva i Baćinska jezera','neretva-bacinska-jezera'],['Dubrovnik i okolica','dubrovnik'],['Hercegovina','hercegovina'],['Makarska i Biokovo','makarska-biokovo'],['Jezera kod Imotskog','imotski-jezera'],['Split, Trogir, Omiš i Cetina','split-trogir-omis']],
    en:[['Orebić & Pelješac','orebic-peljesac',true],['Korčula Island','korcula'],['Mljet National Park','mljet'],['Neretva & Baćina Lakes','neretva-bacinska-jezera'],['Dubrovnik & Surroundings','dubrovnik'],['Herzegovina','hercegovina'],['Makarska & Biokovo','makarska-biokovo'],['Imotski Lakes','imotski-jezera'],['Split, Trogir, Omiš & Cetina','split-trogir-omis']],
    pl:[['Orebić i Pelješac','orebic-peljesac',true],['Wyspa Korčula','korcula'],['Park Narodowy Mljet','mljet'],['Neretwa i Jeziora Baćina','neretva-bacinska-jezera'],['Dubrownik i okolice','dubrovnik'],['Hercegowina','hercegovina'],['Makarska i Biokovo','makarska-biokovo'],['Jeziora Imotski','imotski-jezera'],['Split, Trogir, Omiš i Cetina','split-trogir-omis']],
    de:[['Orebić & Pelješac','orebic-peljesac',true],['Insel Korčula','korcula'],['Nationalpark Mljet','mljet'],['Neretva & Baćina-Seen','neretva-bacinska-jezera'],['Dubrovnik & Umgebung','dubrovnik'],['Herzegowina','hercegovina'],['Makarska & Biokovo','makarska-biokovo'],['Imotski-Seen','imotski-jezera'],['Split, Trogir, Omiš & Cetina','split-trogir-omis']],
    sk:[['Orebić a Pelješac','orebic-peljesac',true],['Ostrov Korčula','korcula'],['Národný park Mljet','mljet'],['Neretva a Baćinské jazerá','neretva-bacinska-jezera'],['Dubrovník a okolie','dubrovnik'],['Hercegovina','hercegovina'],['Makarska a Biokovo','makarska-biokovo'],['Imotské jazerá','imotski-jezera'],['Split, Trogir, Omiš a Cetina','split-trogir-omis']],
    cs:[['Orebić a Pelješac','orebic-peljesac',true],['Ostrov Korčula','korcula'],['Národní park Mljet','mljet'],['Neretva a Baćinská jezera','neretva-bacinska-jezera'],['Dubrovník a okolí','dubrovnik'],['Hercegovina','hercegovina'],['Makarska a Biokovo','makarska-biokovo'],['Imotská jezera','imotski-jezera'],['Split, Trogir, Omiš a Cetina','split-trogir-omis']],
    hu:[['Orebić és Pelješac','orebic-peljesac',true],['Korčula-sziget','korcula'],['Mljet Nemzeti Park','mljet'],['Neretva és a Baćina-tavak','neretva-bacinska-jezera'],['Dubrovnik és környéke','dubrovnik'],['Hercegovina','hercegovina'],['Makarska és Biokovo','makarska-biokovo'],['Imotski-tavak','imotski-jezera'],['Split, Trogir, Omiš és Cetina','split-trogir-omis']]
  }[lang]||[];
  const path=location.pathname;
  const nested=/\/izleti\//.test(path)||/\/experiences\//.test(path);
  const tripHref=(slug,isRoot)=>{
    if(isRoot) return (nested?'../':'')+'orebic-peljesac.html';
    if(nested) return slug+'.html';
    return (lang==='hr'?'izleti/':'experiences/')+slug+'.html';
  };
  const menuTitle={hr:'Svi izleti',en:'All experiences',pl:'Wszystkie wycieczki',de:'Alle Ausflüge',sk:'Všetky výlety',cs:'Všechny výlety',hu:'Összes program'}[lang]||'Experiences';

  const nav=document.querySelector('.nav');
  const exp=nav?[...nav.querySelectorAll('a')].find(a=>/experiences\.html$/.test(a.getAttribute('href')||'')):null;
  if(exp && !exp.closest('.nav-trip-dropdown')){
    const wrap=document.createElement('div'); wrap.className='nav-trip-dropdown';
    exp.parentNode.insertBefore(wrap,exp); wrap.appendChild(exp);
    exp.classList.add('nav-trip-main-link');
    exp.insertAdjacentHTML('beforeend','<span class="nav-trip-chevron" aria-hidden="true">⌄</span>');
    const panel=document.createElement('div'); panel.className='nav-trip-panel';
    panel.innerHTML=`<div class="nav-trip-panel-head"><span>${menuTitle}</span><a href="${(nested?'../':'')+'experiences.html'}">↗</a></div><div class="nav-trip-panel-grid">${data.map((d,i)=>`<a href="${tripHref(d[1],d[2])}"><span>${String(i+1).padStart(2,'0')}</span><b>${d[0]}</b></a>`).join('')}</div>`;
    wrap.appendChild(panel);
  }

  const mobileLinks=document.querySelector('.mobile-menu-links');
  const mExp=mobileLinks?[...mobileLinks.querySelectorAll(':scope > a')].find(a=>/experiences\.html$/.test(a.getAttribute('href')||'')):null;
  if(mExp && !mobileLinks.querySelector('.mobile-trip-group')){
    const group=document.createElement('div'); group.className='mobile-trip-group';
    const row=document.createElement('div'); row.className='mobile-trip-row';
    mExp.parentNode.insertBefore(group,mExp); group.appendChild(row); row.appendChild(mExp);
    const btn=document.createElement('button'); btn.type='button'; btn.className='mobile-trip-toggle'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label',menuTitle); btn.innerHTML='<span></span>';
    row.appendChild(btn);
    const sub=document.createElement('div'); sub.className='mobile-trip-submenu';
    sub.innerHTML=data.map(d=>`<a href="${tripHref(d[1],d[2])}">${d[0]}</a>`).join('');
    group.appendChild(sub);
    btn.addEventListener('click',()=>{const open=group.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));});
  }
})();
