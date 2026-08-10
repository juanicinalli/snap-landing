#!/usr/bin/env bash
# Despliegue de la landing a tu VPS de Hostinger.
# Uso (desde tu compu, en la carpeta del proyecto):
#   ./deploy/deploy.sh
#
# Editá estas 3 variables con los datos de tu VPS:
VPS_USER="root"
VPS_HOST="TU_IP_DEL_VPS"          # ej: 145.79.xx.xx
REMOTE_DIR="/var/www/snapsolutions/current"

set -e

echo "==> Build de producción..."
npm run build

echo "==> Subiendo dist/ a $VPS_HOST ..."
rsync -avz --delete dist/ "$VPS_USER@$VPS_HOST:$REMOTE_DIR/"

echo "==> Listo. Recargando Nginx..."
ssh "$VPS_USER@$VPS_HOST" "sudo systemctl reload nginx"

echo "✅ Deploy completo → https://snapsolutions.io"
