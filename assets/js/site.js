
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
