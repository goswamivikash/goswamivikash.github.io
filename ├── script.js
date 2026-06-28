(function(){
'use strict';

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
addEventListener('resize', resize);
function mkPt(){
  return {
    x: Math.random()*W, y: Math.random()*H,
    vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
    r: Math.random()*1.5+.5,
    a: Math.random()
  };
}
for(let i=0;i<100;i++) pts.push(mkPt());
function drawPts(){
  ctx.clearRect(0,0,W,H);
  pts.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,92,26,${p.a*.4})`;
    ctx.fill();
  });
  pts.forEach((a,i)=>{
    pts.slice(i+1).forEach(b=>{
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<100){
        ctx.beginPath();
        ctx.strokeStyle=`rgba(255,92,26,${(1-d/100)*.1})`;
        ctx.lineWidth=.5;
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawPts);
}
drawPts();

/* ── CUSTOM CURSOR ── */
const cur = document.getElementById('cursor');
const fol = document.getElementById('cursorFollower');
let mx=0,my=0,fx=0,fy=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function animCursor(){
  fx+=(mx-fx)*.12; fy+=(my-fy)*.12;
  fol.style.left=fx+'px'; fol.style.top=fy+'px';
  requestAnimationFrame(animCursor);
})();

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const dx=e.clientX-r.left-r.width/2;
    const dy=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${dx*.2}px,${dy*.2}px) scale(1.03)`;
  });
  el.addEventListener('mouseleave',()=>{el.style.transform='';});
});

/* ── NAV SCROLL ── */
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>40));

/* ── MOBILE MENU ── */
const menu=document.getElementById('mobileMenu');
const burger=document.getElementById('burger');
const close=document.getElementById('mobileClose');
burger.onclick=()=>{
  menu.classList.add('open');
  menu.querySelectorAll('.mobile-link').forEach((l,i)=>l.style.setProperty('--d',i*.07+'s'));
};
close.onclick=()=>menu.classList.remove('open');
menu.querySelectorAll('.mobile-link').forEach(l=>l.addEventListener('click',()=>menu.classList.remove('open')));

/* ── 3D CARD TILT ── */
const card=document.getElementById('heroCard');
if(card){
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.querySelector('.hc-inner').style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.querySelector('.hc-inner').style.transform='rotateY(0) rotateX(0) scale(1)';
  });
}

/* ── SCROLL REVEAL ── */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('in'), e.target.dataset.delay||0);
      revObs.unobserve(e.target);
    }
  });
},{threshold:.1,rootMargin:'0px 0px -60px 0px'});

document.querySelectorAll('.reveal-up,.word-reveal,.reveal-fade').forEach((el,i)=>{
  const siblings=[...el.parentElement.children];
  const idx=siblings.indexOf(el);
  el.style.transitionDelay=(idx*60)+'ms';
  revObs.observe(el);
});

/* ── COUNT-UP ANIMATION ── */
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target;
    const card=el.closest('[data-val]');
    if(!card) return;
    const target=+card.dataset.val;
    const dur=1800;
    const t0=performance.now();
    (function tick(now){
      const p=Math.min((now-t0)/dur,1);
      const ease=1-Math.pow(1-p,4);
      el.textContent=Math.round(ease*target).toLocaleString('en-IN');
      if(p<1) requestAnimationFrame(tick);
    })(t0);
    countObs.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('.count-up').forEach(el=>countObs.observe(el));

/* ── LANGUAGE BARS ── */
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.width=e.target.dataset.w+'%';
      barObs.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('.lang-fill').forEach(f=>barObs.observe(f));

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+scrollY-70,behavior:'smooth'});}
  });
});

/* ── PARALLAX HERO ── */
const heroBefore=document.querySelector('.hero::before');
addEventListener('scroll',()=>{
  const orbs=document.querySelectorAll('.hero-orb');
  orbs.forEach((o,i)=>o.style.transform=`translateY(${scrollY*(i?.08:.05)}px)`);
});

})();
