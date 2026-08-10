# Snap Solutions — Landing

Landing page de Snap Solutions. Proyecto **Vite** (estático): se desarrolla con recarga en vivo y se compila a HTML/CSS/JS optimizado en `dist/`, listo para servir con Nginx en un VPS.

## Estructura

```
snap-landing/
├── index.html          # Página principal (markup)
├── src/
│   ├── main.js         # JS (scroll, animaciones) + importa el CSS
│   └── style.css       # Todos los estilos
├── public/
│   └── assets/         # Logo y estáticos (se copian tal cual a la raíz)
├── deploy/
│   ├── nginx.conf      # Config de Nginx para el VPS
│   └── deploy.sh       # Script para subir el build al VPS
├── vite.config.js
└── package.json
```

Para agregar páginas más adelante (ej. `/servicios`, `/blog`), se crean nuevos `.html` y se registran en `vite.config.js` (Vite soporta multi-página).

## Desarrollo local

Necesitás [Node.js](https://nodejs.org) 18+.

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173 con recarga en vivo
```

Para editar textos, imágenes o colores: `index.html` (contenido), `src/style.css` (diseño; los colores están en las variables `:root` arriba de todo).

## Build de producción

```bash
npm run build    # genera la carpeta dist/
npm run preview  # (opcional) prueba el build localmente
```

---

## Despliegue en EasyPanel (recomendado)

El VPS corre **EasyPanel**, que usa Traefik y ya ocupa los puertos 80/443. No se usa Nginx del sistema ni certbot manual: EasyPanel construye el proyecto en un contenedor (con el `Dockerfile` incluido) y maneja dominio + HTTPS automáticamente.

**1. Subir el proyecto a GitHub** (una vez):

```bash
cd snap-landing
git init
git add .
git commit -m "Landing Snap Solutions"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/snap-landing.git
git push -u origin main
```

**2. Crear la app en EasyPanel:**
- EasyPanel → **New → App**.
- En **Source**, conectá el repo de GitHub (`snap-landing`). Si es privado, seguí las instrucciones de SSH key que muestra.
- **Build:** EasyPanel detecta el `Dockerfile` del repo y lo usa automáticamente (si no, elegí "Dockerfile" como método).
- Clic en **Deploy**. La primera build tarda 1-2 min.

**3. Dominio + HTTPS:**
- En la app → **Domains** → agregá `snapsolutions.io` (y `www.snapsolutions.io`), con **Port = 80**.
- Activá **SSL / Let's Encrypt** (un clic). EasyPanel emite y renueva el certificado solo.

**4. DNS en Squarespace:** registros A `@` y `www` → **72.60.156.211** (la IP del VPS). No toques los MX/TXT de Workspace.

**5. Auto-deploy (opcional):** activá el webhook en la app para que cada `git push` redepliegue solo.

---

## Despliegue manual con Nginx (alternativa, sin EasyPanel)

> Solo si NO usás EasyPanel. Requiere un **VPS** con los puertos 80/443 libres.

### 1. Apuntar el dominio al VPS (DNS en hPanel)

En el panel de Hostinger → tu VPS → copiá la **IP pública**. Después, en **Dominios → snapsolutions.io → DNS / Nameservers**, creá/editá:

| Tipo | Nombre | Valor          |
|------|--------|----------------|
| A    | `@`    | IP de tu VPS   |
| A    | `www`  | IP de tu VPS   |

> ⚠️ **Importante (Google Workspace):** NO toques los registros **MX**. El sitio web usa registros **A**; el mail de Workspace usa **MX**. Conviven sin problema en el mismo dominio. Ver sección "Dominio + Workspace" abajo.

### 2. Preparar el VPS (una sola vez)

Conectate por SSH (`ssh root@TU_IP`) e instalá lo necesario:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx
# Node (solo si vas a compilar en el server; también podés compilar en tu compu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

sudo mkdir -p /var/www/snapsolutions/current
```

Copiá la config de Nginx:

```bash
# subí deploy/nginx.conf al server, luego:
sudo cp nginx.conf /etc/nginx/sites-available/snapsolutions.io
sudo ln -s /etc/nginx/sites-available/snapsolutions.io /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Subir el sitio

**Opción A — compilás en tu compu y subís (recomendada):**
Editá las variables al inicio de `deploy/deploy.sh` (IP del VPS) y ejecutá:

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

Esto hace `npm run build` y copia `dist/` al VPS con `rsync`.

**Opción B — manual:** subí el contenido de `dist/` a `/var/www/snapsolutions/current/` (con SCP, FileZilla o el File Manager de Hostinger).

### 4. Activar HTTPS (gratis, Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d snapsolutions.io -d www.snapsolutions.io
```

Certbot configura el certificado y la redirección a HTTPS automáticamente. Se renueva solo.

Listo → **https://snapsolutions.io** 🚀

---

## Dominio + Google Workspace (¿se puede usar el mismo?)

**Sí.** Un dominio hace varias cosas a la vez mediante registros DNS distintos:

- **Sitio web** → registros **A** (y `www`) apuntando a la IP de tu VPS.
- **Mail de Workspace** (`vos@snapsolutions.io`) → registros **MX** apuntando a los servidores de Google.

Son independientes. Publicar la web NO afecta el correo, siempre que no borres los **MX** de Google que ya configuraste. El único cuidado: al agregar los registros A, dejá intactos los MX/TXT (SPF, DKIM) de Workspace.

## Actualizar el sitio

Cambiás lo que quieras, y volvés a correr `./deploy/deploy.sh` (o `npm run build` + subir `dist/`). Nginx sirve la nueva versión al recargar.
