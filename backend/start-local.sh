#!/usr/bin/env bash
set -e
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Se creó .env desde .env.example. Configura tus credenciales de MySQL y vuelve a ejecutar el script."
  exit 0
fi
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
