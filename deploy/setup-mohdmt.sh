#!/bin/bash
# Deploys the mohdmt (DMT Art Designer) backend from GitHub on port 5013, runs it with PM2, and exposes it at https://dmtart.pro/mohdmt/.
# Port 5003 is already used by mimorent, so 5013 is the next free port after chakir (5012).
set -e

NAME=mohdmt
APP=/root/mohdmt
BACKEND=$APP/backend
REPO=https://github.com/hamza-tricking/mohdmt.git
PORT=5013
CONF=/etc/nginx/sites-enabled/dmtart.pro
BACKUP_DIR=/root/nginx-backups

# 1) Fetch the code from GitHub (clone once, then pull).
if [ -d "$APP/.git" ]; then
  git -C "$APP" pull --ff-only
else
  git clone "$REPO" "$APP"
fi
cd "$BACKEND"

# 2) Dependencies from the lockfile, production only.
npm ci --omit=dev

# 3) Environment file, created once. Secrets are generated here and never printed.
#    CLIENT_URL must be changed to the Vercel URL after the frontend is deployed.
if [ ! -f .env ]; then
  JWT=$(openssl rand -hex 32)
  cat > .env <<EOT
PORT=$PORT
MONGO_URI=mongodb://127.0.0.1:27017/lmohDmt
JWT_SECRET=$JWT
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4317
API_URL=https://dmtart.pro/mohdmt
ADMIN_EMAIL=admin@dmt.local
ADMIN_PASSWORD=admin123
NODE_ENV=production
EOT
  chmod 600 .env
  echo "created .env (JWT secret generated, not shown)"
fi
mkdir -p uploads

# 4) PM2: start or restart the app, save the list, and make sure it starts on reboot.
if pm2 describe $NAME-backend >/dev/null 2>&1; then
  pm2 restart $NAME-backend --update-env
else
  pm2 start src/server.js --name $NAME-backend --cwd "$BACKEND"
fi
pm2 save
pm2 startup systemd -u root --hp /root || true

# 5) nginx: add the /mohdmt/ location once, inside the dmtart.pro server block, before the SSE block.
mkdir -p "$BACKUP_DIR"
BAK="$BACKUP_DIR/dmtart.pro.$(date +%Y%m%d%H%M%S).bak"
cp "$CONF" "$BAK"
if ! grep -q "location /mohdmt/" "$CONF"; then
  sed -i '/# SSE notifications/i\
    location /mohdmt/ {\
        proxy_pass http://127.0.0.1:5013/;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
    }\
' "$CONF"
fi
if nginx -t; then
  systemctl reload nginx
  echo "nginx reloaded"
else
  cp "$BAK" "$CONF"
  nginx -t
  echo "nginx config was invalid; restored backup from $BAK"
  exit 1
fi

# 6) Checks.
sleep 3
echo "--- local:"
curl -s "http://127.0.0.1:$PORT/api/health"
echo
echo "--- public:"
curl -s "https://dmtart.pro/mohdmt/api/health"
echo
