#!/usr/bin/env bash
# Jednorázové nastavení a spuštění vývojového prostředí na macOS / Linuxu.
#   bash scripts/dev-setup.sh          # start + seed
#   bash scripts/dev-setup.sh --reset  # smaže databáze a začne od nuly
set -euo pipefail
cd "$(dirname "$0")/.."

command -v git >/dev/null    || { echo "CHYBÍ git"; exit 1; }
command -v docker >/dev/null || { echo "CHYBÍ Docker (Docker Desktop / Docker Engine)"; exit 1; }
docker info >/dev/null 2>&1  || { echo "Docker neběží, spusťte ho."; exit 1; }

[ -f .env ] || { cp .env.example .env; echo "Vytvořen .env z .env.example"; }

if [ "${1:-}" = "--reset" ]; then
  docker compose down -v
fi

docker compose up --build -d --wait
docker compose exec -T auth npm run seed
docker compose exec -T transactions npm run seed

cat <<'EOF'

Hotovo.
  Frontend:      http://localhost:3000   (student / heslo123, admin / heslo123)
  Auth API:      http://localhost:5000/v1/health/ping
  Transakce API: http://localhost:5001/v1/health/ping
  Logy:          docker compose logs -f auth transactions
  Zastavení:     docker compose down
EOF
