# Guía de SEO y Medición — Snap Solutions

Guía práctica de los tres puntos que te pidieron revisar: **SEO**, **Pixel + API de Meta** y **GA4 + GTM + Search Console**. Primero el mapa general, después qué es cada cosa, y al final el checklist de implementación en orden.

---

## 0. El mapa: cómo se conectan las piezas

Los tres puntos no son cosas separadas. Son **un solo sistema de medición** con esta lógica:

```
                    ┌─────────────────────────┐
   TU LANDING  ───► │  Google Tag Manager      │  (el "enchufe" central)
   (snapsolutions.io)│  = GTM                   │
                    └───────────┬─────────────┘
                                │  desde acá se disparan:
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
            ┌─────────┐   ┌──────────┐   ┌──────────────┐
            │  GA4    │   │  Pixel   │   │  (futuras    │
            │ (mide   │   │  de Meta │   │   etiquetas) │
            │  gente) │   │ (mide    │   └──────────────┘
            └────┬────┘   │ anuncios)│
                 │        └──────────┘
                 │ se vincula con
                 ▼
        ┌──────────────────┐
        │ Search Console    │  (mide búsquedas orgánicas en Google)
        └──────────────────┘
```

**La idea clave:** en el sitio se instala **solo GTM**. Después, GA4, el Pixel de Meta y cualquier otra etiqueta se agregan y modifican **desde la interfaz de GTM**, sin tocar el código ni volver a desplegar. Eso es exactamente lo que dice el protocolo de procesos de Snap: "GTM centraliza la medición y permite trabajar con mayor agilidad técnica".

**Ya está implementado en el código:** el contenedor de GTM y un evento `whatsapp_click` que se dispara cada vez que alguien hace clic en un botón de WhatsApp (indicando desde dónde: nav, hero, banner, footer o botón flotante). Con eso, GTM puede escuchar ese evento y avisarle a GA4 y a Meta.

---

## 1. SEO

### ¿Qué es?

SEO (*Search Engine Optimization*) es el conjunto de acciones para que Google entienda tu sitio y lo muestre cuando alguien busca lo que vos ofrecés. Se divide en tres patas:

- **SEO técnico:** que Google pueda rastrear, entender e indexar el sitio (velocidad, etiquetas, sitemap, estructura).
- **SEO de contenido:** que el sitio hable de lo que la gente busca ("agencia de marketing en Rosario", "automatizar procesos con IA").
- **SEO off-page:** que otros sitios te enlacen y te mencionen (autoridad).

Para una landing nueva, el SEO técnico es lo que se hace ya; el de contenido y el off-page son de mediano plazo.

### Qué ya quedó implementado ✅

| Elemento | Para qué sirve |
|---|---|
| `<title>` y `<meta description>` | El título y el texto azul/gris que se ven en el resultado de Google. |
| `<link rel="canonical">` | Le dice a Google cuál es la URL "oficial", evita contenido duplicado. |
| Open Graph + Twitter Card | Cómo se ve la miniatura cuando compartís el link en WhatsApp, Instagram, LinkedIn. |
| **Datos estructurados (JSON-LD)** | Un bloque en formato `schema.org` que le explica a Google, en su idioma, que Snap es un `ProfessionalService`, dónde opera (Rosario/Santa Fe/Córdoba), su teléfono y sus 4 servicios. Es lo que habilita los resultados enriquecidos. |
| `robots.txt` | Le da permiso a los buscadores de rastrear todo y les indica dónde está el sitemap. |
| `sitemap.xml` | La lista de URLs del sitio, para que Google las encuentre rápido. |
| HTML semántico (un solo `<h1>`, `<h2>` por sección) | Jerarquía de contenido clara. |
| Sitio liviano y rápido (~8 KB gzip) | La velocidad es factor de ranking. |
| `alt` en las imágenes | Accesibilidad + SEO de imágenes. |

### Qué falta (tu tarea, no del código)

1. **Verificar el sitio en Search Console** y enviar el sitemap (ver sección 3).
2. **Contenido:** una landing sola rankea poco. Para atraer búsquedas orgánicas hace falta sumar páginas: `/servicios/marketing-digital`, `/servicios/automatizaciones`, casos de éxito y, eventualmente, un blog. Cada página apunta a una búsqueda concreta.
3. **Google Business Profile:** dar de alta la ficha de empresa (clave para "agencia de marketing en Rosario").
4. **Perfiles y menciones:** enlazar Instagram y LinkedIn desde el footer (hoy están en `#`, hay que poner las URLs reales) y sumar el `sameAs` en el JSON-LD.

> ⚠️ **Pendiente rápido:** en el footer, los links de Instagram y LinkedIn apuntan a `#`. Cuando tengas las URLs, hay que cargarlas.

### Cómo verificar el SEO

- **Datos estructurados:** [Rich Results Test](https://search.google.com/test/rich-results) — pegás la URL y valida el JSON-LD.
- **Velocidad y buenas prácticas:** [PageSpeed Insights](https://pagespeed.web.dev/).
- **Cómo se ve al compartir:** [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

---

## 2. Meta: Pixel + Conversions API (CAPI)

### ¿Qué es el Pixel?

El **Pixel de Meta** es un fragmento de código que se instala en el sitio y le avisa a Meta qué hace la gente que llega desde tus anuncios (o que después va a ver tus anuncios). Sirve para tres cosas:

1. **Medir conversiones:** saber qué anuncio generó un contacto real, no solo un clic.
2. **Optimizar campañas:** Meta aprende a quién mostrarle los anuncios para conseguir más conversiones. Sin Pixel, el algoritmo trabaja a ciegas.
3. **Remarketing:** crear públicos de gente que visitó la landing pero no escribió, para volver a impactarlos. (Tu plan de marketing destina ~$300.000 ARS/mes a esto — sin Pixel, no se puede hacer.)

> **Ojo con el vocabulario nuevo:** Meta renombró las cosas. Hoy en Events Manager se habla de **"conjunto de datos" (dataset)**. El **ID del dataset es el mismo que el ID del Pixel** — son la misma cosa con nombre nuevo. Un dataset recibe eventos de varias fuentes: del Pixel (navegador), de la Conversions API (servidor), de la app, etc.

### ¿Qué es la Conversions API (CAPI)?

El Pixel manda los eventos **desde el navegador del visitante**. El problema: los bloqueadores de anuncios, el modo incógnito, iOS y la muerte de las cookies hacen que **se pierda un porcentaje grande de eventos**.

La **Conversions API** manda los mismos eventos **desde un servidor**, directo a Meta, sin pasar por el navegador. Nadie la puede bloquear. Por eso Meta recomienda usar **las dos juntas**: el Pixel + CAPI, en el mismo dataset.

Cuando usás las dos, un mismo evento llega dos veces (una del navegador, otra del servidor). Para que no se cuente doble, se manda un **`event_id` idéntico** en ambos: Meta detecta que es el mismo evento y lo **deduplica** (los junta). La deduplicación funciona si los eventos llegan dentro de las 48 hs.

### ¿Qué eventos importan en TU landing?

Tu landing no tiene carrito ni formulario: la conversión es **el clic a WhatsApp**. Entonces:

| Evento de Meta | Cuándo se dispara |
|---|---|
| `PageView` | Automático, al cargar la página. |
| `Lead` (o `Contact`) | Cuando alguien hace clic en cualquier botón de WhatsApp. ← **esta es tu conversión** |

Ese es el evento que después vas a usar como objetivo de optimización en las campañas de Meta Ads.

### Cómo implementarlo (vía GTM, sin tocar código)

1. Entrá a **Meta Business Manager → Events Manager (Administrador de eventos)**.
2. **Crear conjunto de datos / Pixel** → copiá el **ID** (un número largo).
3. En **GTM**, creá una etiqueta:
   - Tipo: usá la plantilla de la comunidad **"Facebook Pixel"** (Galería de plantillas) o una etiqueta HTML personalizada con el código base del Pixel.
   - Pegá el ID del Pixel.
   - Activador: **All Pages** (todas las páginas). → Esto cubre el `PageView`.
4. Creá una **segunda etiqueta** para la conversión:
   - Mismo tipo de etiqueta, evento: **`Lead`**.
   - Activador: **Evento personalizado** → nombre del evento: **`whatsapp_click`** ← este es el que ya dispara la landing.
5. **Publicá** el contenedor en GTM.

### ¿Y la CAPI? (importante, leé esto)

La CAPI necesita **un servidor que envíe los eventos**. Tu landing es un sitio estático: no tiene backend. Tenés tres caminos:

- **Opción A — Empezar solo con el Pixel.** Es 100% válido para arrancar. El Pixel solo ya te permite medir, optimizar y hacer remarketing. **Recomendado para el lanzamiento.**
- **Opción B — Conversions API Gateway.** Meta ofrece un servicio que levanta la infraestructura por vos (se paga aparte). Es la opción sin código.
- **Opción C — Server-Side GTM.** Levantás un contenedor de GTM del lado del servidor (se puede hostear en tu propio VPS con EasyPanel) que recibe los eventos y los reenvía a Meta con CAPI. Es la solución más profesional y **es un servicio que Snap le puede vender a sus clientes**.

> **Recomendación:** salí con el Pixel (Opción A). Cuando la pauta esté corriendo y haya volumen, sumá CAPI con la Opción C — y de paso te sirve como caso propio para ofrecerlo.

**Documentación oficial:** [Conversions API - Meta for Developers](https://developers.facebook.com/docs/marketing-api/conversions-api/)

---

## 3. GA4 + GTM + Search Console

### GTM (Google Tag Manager) — el "enchufe"

**Qué es:** un contenedor de etiquetas. En vez de pegar el código de GA4, del Pixel, de LinkedIn, de TikTok, etc. uno por uno en el sitio (y tener que redesplegar cada vez), pegás **una sola vez** el código de GTM y después administrás todas las etiquetas desde su interfaz web.

**Los 3 conceptos de GTM:**
- **Etiqueta (Tag):** el código que querés disparar (ej: "mandar un evento a GA4").
- **Activador (Trigger):** cuándo se dispara (ej: "cuando ocurra el evento `whatsapp_click`").
- **Variable:** un dato que se usa (ej: `cta_location`, que dice si el clic fue en el hero o en el footer).

**Cómo implementarlo:**
1. Andá a [tagmanager.google.com](https://tagmanager.google.com) → crear cuenta → crear contenedor tipo **Web** para `snapsolutions.io`.
2. Copiá el **ID del contenedor** (formato `GTM-XXXXXXX`).
3. En el código, abrí `index.html` y **reemplazá todas las apariciones de `GTM-XXXXXXX`** por tu ID real (buscar y reemplazar). Aparece en el script del `<head>` y en el `<noscript>` del `<body>`.
4. Desplegá el sitio.

### GA4 (Google Analytics 4) — mide personas

**Qué es:** la herramienta que te dice **qué hace la gente en tu sitio**: cuántos entran, de dónde vienen (Google, Instagram, un anuncio, directo), cuánto se quedan, qué secciones ven y **cuántos hacen clic en WhatsApp**.

Es distinto del Pixel: el **Pixel le habla a Meta** (para optimizar anuncios); **GA4 te habla a vos** (para entender el negocio).

**Cómo implementarlo (desde GTM, no en el código):**
1. Andá a [analytics.google.com](https://analytics.google.com) → crear propiedad **GA4** para `snapsolutions.io`.
2. Copiá el **Measurement ID** (formato `G-XXXXXXXXXX`).
3. En **GTM** → Nueva etiqueta → tipo **"Google Tag"** → pegá el `G-XXXXXXXXXX` → Activador: **Initialization - All Pages**.
4. Segunda etiqueta → tipo **"Evento de GA4"** → nombre del evento: `whatsapp_click` → Activador: **Evento personalizado** `whatsapp_click`.
   - Agregá un parámetro: `cta_location` con el valor de la variable del dataLayer, así sabés qué botón convierte más.
5. En **GA4 → Administrar → Eventos**, marcá `whatsapp_click` como **evento clave (conversión)**.
6. **Publicá** el contenedor de GTM.

### Search Console — mide búsquedas en Google

**Qué es:** la consola de Google que te muestra **cómo te ve el buscador**: qué búsquedas mostraron tu sitio, cuántos clics tuviste, qué posición ocupás, si hay errores de indexación y si Google pudo leer tu sitemap. Es la herramienta de SEO por excelencia — y es **gratis y obligatoria**.

**Cómo implementarlo:**
1. Andá a [search.google.com/search-console](https://search.google.com/search-console) → **Agregar propiedad**.
2. Elegí el tipo **"Dominio"** (cubre todo: con y sin `www`, http y https).
3. Google te va a dar un **registro TXT** para verificar que el dominio es tuyo.
4. Ese TXT lo cargás en **Squarespace** (donde está el DNS de `snapsolutions.io`), en *Custom Records*.
   > ⚠️ Es un registro **TXT nuevo**, se suma a los que ya están. **No borres los TXT de Google Workspace** (SPF/DKIM) ni los MX.
5. Verificá en Search Console.
6. Andá a **Sitemaps** y enviá: `sitemap.xml`.

### Vincular GA4 ↔ Search Console

Esto hace que los datos de búsqueda orgánica aparezcan **dentro** de GA4, así ves todo en un solo lugar.

1. En **GA4 → Administrar → Vinculaciones de productos → Search Console**.
2. **Vincular** → elegí la propiedad de Search Console → confirmá.
3. Después, en GA4 → Informes → Biblioteca, hay que **publicar** la colección "Search Console" para que se vea en el menú (por defecto viene oculta).

---

## 4. Checklist de implementación (en orden)

Hacelo en este orden, porque cada paso depende del anterior:

- [ ] **1.** Crear contenedor en **GTM** → obtener `GTM-XXXXXXX`.
- [ ] **2.** Reemplazar todas las apariciones de `GTM-XXXXXXX` en `index.html` → desplegar el sitio.
- [ ] **3.** Crear propiedad **GA4** → obtener `G-XXXXXXXXXX`.
- [ ] **4.** En GTM: etiqueta Google Tag (GA4) en *All Pages*.
- [ ] **5.** En GTM: etiqueta de evento GA4 `whatsapp_click` con activador de evento personalizado.
- [ ] **6.** Crear **Pixel/dataset** en Meta Events Manager → obtener el ID.
- [ ] **7.** En GTM: etiqueta del Pixel (PageView, All Pages) + etiqueta de evento `Lead` con activador `whatsapp_click`.
- [ ] **8.** **Publicar** el contenedor de GTM (¡sin publicar, nada funciona!).
- [ ] **9.** Verificar el dominio en **Search Console** (TXT en Squarespace) + enviar `sitemap.xml`.
- [ ] **10.** Vincular **GA4 ↔ Search Console**.
- [ ] **11.** Marcar `whatsapp_click` como **evento clave** en GA4.
- [ ] **12.** Cargar los links reales de Instagram y LinkedIn en el footer.

---

## 5. Cómo verificar que todo anda

| Qué | Con qué herramienta |
|---|---|
| Que GTM dispare bien las etiquetas | **Modo Vista previa (Preview)** de GTM: navegás el sitio y ves en vivo qué etiquetas se activan. Hacé clic en un botón de WhatsApp y verificá que aparezca `whatsapp_click`. |
| Que GA4 reciba los eventos | **GA4 → Administrar → DebugView** (en tiempo real, con el Preview de GTM activo). |
| Que Meta reciba los eventos | **Events Manager → Test Events (Eventos de prueba)**: te da un código, navegás el sitio y ves llegar los eventos en vivo. |
| Que el Pixel esté instalado | Extensión de Chrome **Meta Pixel Helper**. |
| Que el SEO técnico esté OK | **Rich Results Test** (JSON-LD) + **PageSpeed Insights** (velocidad) + Search Console (indexación). |

---

## Resumen en una frase

**GTM** es el enchufe único en el sitio; desde ahí se disparan **GA4** (para entender a tu público) y el **Pixel de Meta** (para que tus anuncios optimicen y puedas hacer remarketing); **Search Console** te dice cómo te ve Google; y el **SEO técnico** ya está resuelto en el código — lo que falta es contenido y autoridad, que se construyen con el tiempo.
