#!/bin/bash
# Updates the running mohdmt backend from GitHub.
set -e

APP=/root/mohdmt

git -C "$APP" pull --ff-only
cd "$APP/backend"
npm ci --omit=dev
pm2 restart mohdmt-backend --update-env
pm2 save
sleep 3
echo "--- local:"
curl -s "http://127.0.0.1:5013/api/health"
echo
echo "--- public:"
curl -s "https://dmtart.pro/mohdmt/api/health"
echo
