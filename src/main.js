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
