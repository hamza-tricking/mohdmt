#!/bin/bash
# Applies /root/delivery-rates.json to the mohdmt API through the admin endpoint (uses the admin credentials from the server .env).
set -e
ENVF=/root/mohdmt/backend/.env
EMAIL=$(grep '^ADMIN_EMAIL=' "$ENVF" | cut -d= -f2-)
PASS=$(grep '^ADMIN_PASSWORD=' "$ENVF" | cut -d= -f2-)
TOKEN=$(curl -s -X POST http://127.0.0.1:5013/api/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" | node -pe "JSON.parse(require('fs').readFileSync(0)).token")
curl -s -X PUT http://127.0.0.1:5013/api/admin/delivery-rates -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' --data-binary @/root/delivery-rates.json
echo
curl -s http://127.0.0.1:5013/api/delivery-rates | node -pe "const r=JSON.parse(require('fs').readFileSync(0));'rates: '+r.length+', with prices: '+r.filter(x=>x.home!==null).length"
