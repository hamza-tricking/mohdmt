#!/bin/bash
# Sets the color that each product opens with on the mohdmt store (uses the admin credentials from the server .env).
set -e
ENVF=/root/mohdmt/backend/.env
API=http://127.0.0.1:5013/api
EMAIL=$(grep '^ADMIN_EMAIL=' "$ENVF" | cut -d= -f2-)
PASS=$(grep '^ADMIN_PASSWORD=' "$ENVF" | cut -d= -f2-)
TOKEN=$(curl -s -X POST $API/auth/login -H 'Content-Type: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" | node -pe "JSON.parse(require('fs').readFileSync(0)).token")
H="Authorization: Bearer $TOKEN"
PRODUCTS=$(curl -s $API/admin/products -H "$H")
for pair in "bella-face|وردي" "bella-girl|أخضر"; do
  SLUG=${pair%%|*}
  COLOR=${pair#*|}
  ID=$(echo "$PRODUCTS" | node -pe "JSON.parse(require('fs').readFileSync(0)).find(p=>p.slug==='$SLUG')._id")
  curl -s -X PUT $API/admin/products/$ID -H "$H" -H 'Content-Type: application/json' -d "{\"defaultColor\":\"$COLOR\"}" | node -pe "const p=JSON.parse(require('fs').readFileSync(0));p.slug+' -> '+p.defaultColor"
done
