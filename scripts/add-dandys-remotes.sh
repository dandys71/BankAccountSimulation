#!/usr/bin/env bash
# Přidá GitHub remotes ze školních dandys71 repozitářů.
set -euo pipefail

add_remote() {
  local name="$1"
  local url="$2"
  if git remote get-url "$name" >/dev/null 2>&1; then
    git remote set-url "$name" "$url"
    echo "Updated remote: $name -> $url"
  else
    git remote add "$name" "$url"
    echo "Added remote: $name -> $url"
  fi
}

add_remote dandys https://github.com/dandys71/BankAccountSimulation.git
add_remote transaction-manager https://github.com/dandys71/TransactionManager.git
add_remote auth-manager https://github.com/dandys71/AuthManager.git

echo
git remote -v
echo
echo "Fetch příklady:"
echo "  git fetch dandys main"
echo "  git fetch transaction-manager master"
echo "  git fetch auth-manager main"
