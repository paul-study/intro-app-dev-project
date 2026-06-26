#!/bin/bash

# =============================================================
# application-setup.sh
# Full local setup script for the messenger backend.
# Run once after cloning: bash application-setup.sh
# =============================================================

set -e  # Exit immediately on any error

echo "=== [1/6] Copying environment file ==="
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example"
else
  echo "  .env already exists, skipping"
fi

echo ""
echo "=== [2/6] Installing dependencies ==="
npm install

echo ""
echo "=== [3/6] Generating Prisma client ==="
npx prisma generate

echo ""
echo "=== [4/6] Running database migrations ==="
npx prisma migrate dev --name init

echo ""
echo "=== [5/6] Seeding database ==="
node ./prisma/seeding/all.js

echo ""
echo "=== [6/6] Setup complete ==="
echo ""
echo "  Start the dev server with:  npm run dev"
echo "  Default seed credentials:"
echo "    admin1 / P@ssw0rd  (ADMIN)"
echo "    user2  / P@ssw0rd  (USER)"
echo "    user3  / P@ssw0rd  (USER)"
echo ""
