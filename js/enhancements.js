const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
const motionBound=new WeakSet();
window.initMotion=()=>{
 revealObserver?.disconnect();
 if(motionPreference.matches)return;
 revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revealObserver.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.card,.region,.category,.split,.feature,.application-main,.aside-card').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${Math.min(i%4,3)*65}ms`);revealObserver.observe(el)});
 if(matchMedia('(hover: hover) and (pointer: fine)').matches){
 document.querySelectorAll('.card,.category,.location-image').forEach(el=>{
 if(motionBound.has(el))return;motionBound.add(el);
 let frame;
 el.addEventListener('pointermove',e=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const b=el.getBoundingClientRect();el.style.setProperty('--rx',`${-(e.clientY-b.top-b.height/2)/b.height*5}deg`);el.style.setProperty('--ry',`${(e.clientX-b.left-b.width/2)/b.width*5}deg`)})});
 el.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
 });}
};
let scrollFrame;
addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=null;const distance=document.documentElement.scrollHeight-innerHeight;document.querySelector('#scroll-progress').style.transform=`scaleX(${distance>0?scrollY/distance:0})`;document.querySelector('header').classList.toggle('scrolled',scrollY>12);if(!motionPreference.matches){const hero=document.querySelector('.hero');if(hero)hero.style.setProperty('--hero-shift',`${Math.min(scrollY,600)*.12}px`)}})},{passive:true});
motionPreference.addEventListener('change',()=>{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('revealed'));window.initMotion()});

// UI-only completion marker. No inventory or submission behavior is modified.
let savedSlots=[];
try{const value=JSON.parse(sessionStorage.getItem('careers-preview-bookings')||'[]');if(Array.isArray(value))savedSlots=value.filter(v=>typeof v==='string')}catch{}
const completedSlots=new Set(savedSlots);
function rememberSlot(key){completedSlots.add(key);try{sessionStorage.setItem('careers-preview-bookings',JSON.stringify([...completedSlots]))}catch{}}

let pendingSlot=null;
function decorateCompletion(){
 // Upgrade photographs without changing the original templates or routes.
 document.querySelectorAll('#main img[src$=".png"]').forEach(img=>{
  if(/\/(logo|favicon)\.png$/.test(img.getAttribute('src')))return;
  img.src=img.getAttribute('src').replace(/\.png$/,'.webp');img.decoding='async';
 });
 const hash=location.hash;
 if(hash.startsWith('#apply/')){
  const [path,query='']=hash.slice(1).split('?');
  pendingSlot={slug:decodeURIComponent(path.slice(6)),location:new URLSearchParams(query).get('location')||''};
 }
 if(hash==='#application-confirmation'&&typeof submissionReceipt!=='undefined'&&submissionReceipt&&pendingSlot){
  rememberSlot(`${pendingSlot.slug}|${pendingSlot.location}`);
  const card=document.querySelector('.result-card');
  if(card&&!card.querySelector('.booked-label')){
   const badge=document.createElement('span');badge.className='booked-label';badge.textContent='✓ Booked · Preview';
   badge.title='Local preview status only; no server reservation is made.';
   card.querySelector('h1')?.after(badge);
  }
 }
 document.querySelectorAll('a.apply-now').forEach(link=>{
  const [path,query='']=link.hash.slice(1).split('?');
  const key=`${decodeURIComponent(path.slice(6))}|${new URLSearchParams(query).get('location')||''}`;
  if(completedSlots.has(key)&&!link.parentElement.querySelector('.booked-label')){
   const badge=document.createElement('span');badge.className='booked-label';badge.textContent='✓ Booked · Preview';badge.title='Local preview status only; no server reservation is made.';link.before(badge);
  }
 });
}
const pageRoot=document.querySelector('#main');
const pageObserver=new MutationObserver(()=>{pageObserver.disconnect();decorateCompletion();window.initMotion();pageObserver.observe(pageRoot,{childList:true})});
pageObserver.observe(pageRoot,{childList:true});
decorateCompletion();window.initMotion();
