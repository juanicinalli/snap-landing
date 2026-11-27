import './style.css'
import './soluciones.css'

// Sombra del nav
const hdr = document.getElementById('hdr')
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 8))

// Aparición al hacer scroll
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
}, { threshold: 0.12 })
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4 * 70) + 'ms'; io.observe(el) })

document.getElementById('burger')?.addEventListener('click', () => {
  document.getElementById('productos').scrollIntoView({ behavior: 'smooth' })
})

// Medición: mismo evento que en la home (GTM escucha "whatsapp_click")
window.dataLayer = window.dataLayer || []
document.querySelectorAll('[data-wa]').forEach((el) => {
  el.addEventListener('click', () => window.dataLayer.push({ event: 'whatsapp_click', cta_location: el.dataset.wa }))
})

// Simulaciones: se reproducen cuando la ventana entra en pantalla y se repiten en loop
document.querySelectorAll('.mk').forEach((mk) => {
  let timer = null
  const loop = +mk.dataset.loop || 10000
  const play = () => { mk.classList.remove('play'); void mk.offsetWidth; mk.classList.add('play') }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { play(); clearInterval(timer); timer = setInterval(play, loop) }
    else { clearInterval(timer); timer = null }
  }, { threshold: 0.35 }).observe(mk)
})

// Contador animado de las cifras
;(function () {
  const parse = (t) => { const m = t.match(/^([+\-]?)([\d.,]+)(.*)$/); if (!m) return null; const dec = m[2].includes(','); return { pre: m[1], n: parseFloat(m[2].replace(/\./g, '').replace(',', '.')), suf: m[3], dec } }
  const fmt = (p, v) => p.pre + (p.dec ? v.toFixed(1).replace('.', ',') : Math.round(v)) + p.suf
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    cio.unobserve(e.target)
    const el = e.target, p = parse(el.dataset.count); if (!p) return
    const t0 = performance.now(), d = 1300
    const step = (now) => { const k = Math.min(1, (now - t0) / d); el.textContent = fmt(p, p.n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); else el.textContent = el.dataset.count }
    requestAnimationFrame(step)
  }), { threshold: 0.4 })
  document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el))
})()
