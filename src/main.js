import './style.css'

// Sombra del nav al hacer scroll
const hdr = document.getElementById('hdr')
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 8))

// Animaciones de aparición al hacer scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in')
      io.unobserve(e.target)
    }
  })
}, { threshold: 0.12 })

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4 * 70) + 'ms'
  io.observe(el)
})

// Menú mobile (scroll simple a servicios)
document.getElementById('burger').addEventListener('click', () => {
  document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })
})

/* ===================== MEDICIÓN =====================
   Cada botón de WhatsApp tiene un atributo data-wa que dice desde
   dónde se hizo clic (nav, hero, banner, footer, float).
   Acá empujamos el evento al dataLayer para que GTM lo escuche y
   dispare las etiquetas de GA4 y del Pixel de Meta.
   No hace falta tocar este archivo para agregar nuevas etiquetas:
   todo se configura desde la interfaz de GTM.
==================================================== */
window.dataLayer = window.dataLayer || []

document.querySelectorAll('[data-wa]').forEach((el) => {
  el.addEventListener('click', () => {
    window.dataLayer.push({
      event: 'whatsapp_click',              // nombre del evento que se usa en GTM
      cta_location: el.dataset.wa           // nav | hero | banner | footer | float
    })
  })
})

// ==== CASOS V2 + TECNOFRIG (generado) ====
;
// Tecnofrig: animación controlada por el scroll
(function(){
  const sec=document.querySelector('.tf-scroll'); if(!sec) return;
  const $=s=>sec.querySelector(s), $$=s=>[...sec.querySelectorAll(s)];
  const slides=$$('.tf-slide'), caps=$$('.tf-cap'), dots=$$('.tf-dot'), chips=$$('.tf-chip');
  const frame=$('.tf-frame'), bar=$('.tf-bar i'), glow=$('.tf-glow'), hint=$('.tf-hint'), copy=$('.tf-copy');
  const plan=$('.tf-plan'), pzoom=$('.tf-plan-zoom'), scan=$('.tf-scan'), mks=$$('.tf-mk').map(m=>({el:m,x:+m.dataset.x,on:false})), cEq=$('.tf-cnt-eq'), cZ=$('.tf-cnt-z'), done=$('.tf-done');
  const ZX=[0.044,0.181,0.456,0.5625,0.6625];
  const N=slides.length, M=N+1; let cur=0, target=0, cEnter=0, tEnter=0, running=false, lastIdx=-1;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const easeOut=x=>1-Math.pow(1-x,3);
  const mobile=()=>innerWidth<900;
  function measure(){ const r=sec.getBoundingClientRect(); const total=r.height-innerHeight; target=clamp(-r.top/Math.max(1,total),0,1); tEnter=r.top<=0?1:clamp((innerHeight-r.top)/(innerHeight*0.85),0,1); }
  function paint(p,e){
    const intro=easeOut(e);                                // entrada mientras la sección sube
    const sp=clamp((p-0.02)/0.94,0,1);                      // recorrido total
    const SCAN=0.30;                                        // primer tramo: escaneo del plano
    const scanP=clamp(sp/SCAN,0,1);
    const t=sp<SCAN?0:((sp-SCAN)/(1-SCAN))*(M-1);          // 0 = plano, 1..N = pantallas
    // plano: zoom lento + línea de escaneo + equipos detectados
    const sx=scanP*1.04-0.02; scan.style.left=(sx*100)+'%'; scan.style.opacity=(scanP>0.01&&scanP<0.995)?1:0;
    pzoom.style.transform=`scale(${1+scanP*.12})`;
    let hits=0; mks.forEach(m=>{ const h=m.x<=sx; if(h!==m.on){ m.el.classList.toggle('hit',h); m.on=h; } if(h) hits++; });
    cEq.textContent=hits; cZ.textContent=Math.min(7, ZX.filter(z=>z<=sx).length + (sx>=0.181?1:0) + (sx>=0.5625?1:0));
    done.classList.toggle('on',scanP>=0.995);
    const pd=clamp(t,0,1); plan.style.opacity=1-pd; plan.style.transform=`translateY(${-pd*46}px) scale(${1-pd*.045})`;
    slides.forEach((s,i)=>{ const off=(i+1)-t, d=Math.abs(off); const a=1-clamp(d,0,1);
      s.style.opacity=a; s.style.transform=`translateY(${off*46}px) scale(${1-clamp(d,0,1)*.045})`; s.style.zIndex=10-Math.round(d*5); });
    const idx=Math.round(t);
    if(idx!==lastIdx){ caps.forEach((c,i)=>c.classList.toggle('on',i===idx)); dots.forEach((d,i)=>d.classList.toggle('on',i<=idx)); lastIdx=idx; }
    bar.style.transform=`scaleX(${sp})`;
    const tilt=mobile()?0:(1-intro)*16;
    frame.style.transform=`perspective(1500px) rotateX(${tilt}deg) translateY(${(1-intro)*90}px) scale(${.9+intro*.1})`;
    frame.style.opacity=intro;
    copy.style.transform=`translateY(${(1-intro)*40}px)`; copy.style.opacity=intro;
    chips.forEach((c,i)=>{ const k=[0.9,-0.6,0.7,-1][i]||0.5; c.style.transform=`translateY(${(0.5-p)*80*k}px)`; c.style.opacity=intro; });
    glow.style.transform=`translate3d(${(p-.5)*-60}px,${(p-.5)*120}px,0) rotate(${p*18}deg)`;
    hint.style.opacity=p<0.04?1:0;
  }
  function loop(){ cur+=(target-cur)*0.14; cEnter+=(tEnter-cEnter)*0.16; if(Math.abs(target-cur)<0.0004) cur=target; if(Math.abs(tEnter-cEnter)<0.001) cEnter=tEnter; paint(cur,cEnter); if(running) requestAnimationFrame(loop); }
  const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting&&!running){ running=true; measure(); requestAnimationFrame(loop);} else if(!e.isIntersecting){ running=false; } }); },{rootMargin:'300px 0px'});
  io.observe(sec);
  addEventListener('scroll',measure,{passive:true}); addEventListener('resize',measure);
  measure(); paint(cur,cEnter);
})();

;
// Contador animado de las cifras de los casos
(function(){
  const els=[...document.querySelectorAll('[data-count]')];
  const parse=t=>{const m=t.match(/^([+\-]?)([\d.,]+)(.*)$/);if(!m)return null;const dec=m[2].includes(',');const n=parseFloat(m[2].replace(/\./g,'').replace(',','.'));return{pre:m[1],n,suf:m[3],dec,thou:m[2].includes('.')}};
  const fmt=(p,v)=>p.pre+(p.dec?v.toFixed(1).replace('.',','):(p.thou?Math.round(v).toLocaleString('es-AR'):Math.round(v)))+p.suf;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,p=parse(el.dataset.count);if(!p)return;const t0=performance.now(),d=1300;
    const step=now=>{const k=Math.min(1,(now-t0)/d),ease=1-Math.pow(1-k,3);el.textContent=fmt(p,p.n*ease);if(k<1)requestAnimationFrame(step);else el.textContent=el.dataset.count};requestAnimationFrame(step)}),{threshold:.4});
  els.forEach(el=>io.observe(el));
})();
