#!/bin/bash

# ── Colors ────────────────────────────────────────────
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export RED='\033[0;31m'
export BLUE='\033[0;34m'
export NC='\033[0m' # No Color

# ── UI Helpers ───────────────────────────────────────
info()    { echo -e "${GREEN}[[OK]]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[[FALHA]]${NC} $1"; }
header()  {
  echo -e "\n${BLUE}══════════════════════════════════════════════════════${NC}"
  echo -e "  ${BLUE}$1${NC}"
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
}

# ── Utility Functions ────────────────────────────────
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

check_sudo() {
  if [ "$EUID" -ne 0 ]; then
    error "Este comando precisa de privilégios de superusuário (sudo)."
    return 1
  fi
  return 0
}

wait_key() {
  echo ""
  read -p "Pressione qualquer tecla para continuar..." -n1 -s
  echo ""
}

# ── Safety ───────────────────────────────────────────
# Trap para capturar interrupções
trap 'echo -e "\n${RED}Interrompido. Saindo...${NC}"; exit 1' INT TERM
