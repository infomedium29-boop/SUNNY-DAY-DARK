
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
  const isEn=document.documentElement.lang==='en';
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
    ? `<div class="privacy-copy"><strong>Your privacy</strong><p>We use necessary technologies and local storage for core website functions and to remember your privacy choice. Optional analytics or marketing technologies will not be activated without consent. <a href="${privacyHref}">Privacy Policy</a></p></div><div class="privacy-actions"><button class="privacy-necessary" type="button">Necessary only</button><button class="privacy-accept" type="button">Accept</button></div>`
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


// Premium first-entry intro for the homepage.
(()=>{
  const intro=document.querySelector('.site-intro');
  if(!intro) return;
  const root=document.documentElement;
  if(root.classList.contains('intro-skip')){
    intro.remove();
    return;
  }
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?550:2350;
  const exitDuration=reduced?280:1050;
  const finish=()=>{
    root.classList.add('intro-reveal');
    intro.classList.add('is-leaving');
    try{sessionStorage.setItem('sunny_intro_seen','1')}catch(e){}
    window.setTimeout(()=>{
      root.classList.remove('intro-first');
      intro.remove();
      window.setTimeout(()=>root.classList.remove('intro-reveal'),1200);
    },exitDuration);
  };
  window.setTimeout(finish,duration);
})();
