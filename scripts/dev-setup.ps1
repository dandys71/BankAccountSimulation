# Jednorázové nastavení a spuštění vývojového prostředí na Windows.
# Spuštění z kořene repozitáře v PowerShellu:
#   powershell -ExecutionPolicy Bypass -File scripts\dev-setup.ps1
# Volitelně: -Reset smaže databáze a začne od nuly.

param([switch]$Reset)

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Need($cmd, $hint) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Host "CHYBI: $cmd. $hint" -ForegroundColor Red
        exit 1
    }
}

Need git    "Nainstalujte: winget install Git.Git"
Need docker "Nainstalujte Docker Desktop: winget install Docker.DockerDesktop (pak restart PC)"

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Desktop nebezi. Spustte ho a pockejte, az ikona velryby prestane blikat." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Vytvoren .env z .env.example"
}

if ($Reset) {
    Write-Host "Mazu kontejnery a databaze..."
    docker compose down -v
}

Write-Host "Sestavuji a spoustim kontejnery (poprve to trva nekolik minut)..."
docker compose up --build -d --wait
if ($LASTEXITCODE -ne 0) {
    Write-Host "Start selhal. Logy: docker compose logs auth transactions" -ForegroundColor Red
    exit 1
}

Write-Host "Nahravam demo data..."
docker compose exec -T auth npm run seed
docker compose exec -T transactions npm run seed

Write-Host ""
Write-Host "Hotovo." -ForegroundColor Green
Write-Host "  Frontend:     http://localhost:3000   (student / heslo123, admin / heslo123)"
Write-Host "  Auth API:     http://localhost:5000/v1/health/ping"
Write-Host "  Transakce API: http://localhost:5001/v1/health/ping"
Write-Host "  Logy:         docker compose logs -f auth transactions"
Write-Host "  Zastaveni:    docker compose down"
