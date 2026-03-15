#!/bin/bash
# update-system.sh - Atualização e manutenção do sistema

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

if ! command_exists apt; then
  error "Este script é para Debian/Ubuntu com apt. Este sistema não tem apt."
  exit 1
fi

header() {
  echo -e "\n${BLUE}══════════════════════════════════════════════════════${NC}"
  echo -e "  ${BLUE}$1${NC}"
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
}

check_sudo() {
  if [ "$EUID" -ne 0 ]; then
    error "Este comando precisa de sudo."
    return 1
  fi
  return 0
}

do_update() {
  header "Atualizando Repositórios"
  if sudo apt update; then
    info "Repositórios atualizados"
  else
    error "Falha ao atualizar repositórios"
    return 1
  fi

  header "Atualizando Pacotes"
  if sudo apt upgrade -y; then
    info "Pacotes atualizados"
  else
    error "Falha ao atualizar pacotes"
    return 1
  fi

  wait_key
}

do_full_upgrade() {
  header "Atualização Completa (dist-upgrade)"
  warn "Isso pode instalar/remover pacotes para resolver dependências"
  read -p "Continuar? (s/N): " confirm

  if [[ "$confirm" == [sS] ]]; then
    if sudo apt dist-upgrade -y; then
      info "Atualização completa concluída"
    else
      error "Falha na atualização"
    fi
  else
    info "Cancelado"
  fi
  wait_key
}

do_autoremove() {
  header "Removendo Pacotes Desnecessários"
  if sudo apt autoremove -y; then
    info "Pacotes desnecessários removidos"
  else
    error "Falha ao remover pacotes"
  fi
  wait_key
}

do_autoclean() {
  header "Limpando Cache do APT"
  if sudo apt autoclean; then
    info "Cache limpo"
  else
    error "Falha ao limpar cache"
  fi

  if sudo apt clean; then
    info "Cache removido"
  fi
  wait_key
}

show_upgradable() {
  header "Pacotes Atualizáveis"
  apt list --upgradable 2>/dev/null | grep -v "^Listing" || echo "  Nenhum"
  wait_key
}

show_installed() {
  header "Pacotes Instalados"
  dpkg -l | grep -c '^ii'
  wait_key
}

check_reboot() {
  header "Verificando Necessidade de Reboot"
  if [ -f /var/run/reboot-required ]; then
    warn "REINICIALIZAÇÃO NECESSÁRIA!"
    cat /var/run/reboot-required.pkgs 2>/dev/null || true
  else
    info "Sistema atualizado (sem necessidade de reboot)"
  fi
  wait_key
}

while true; do
  clear
  header "Atualização do Sistema"
  echo "1)  Atualizar sistema (apt update + upgrade)"
  echo "2)  Atualização completa (dist-upgrade)"
  echo "3)  Ver pacotes atualizáveis"
  echo "4)  Remover pacotes desnecessários"
  echo "5)  Limpar cache do APT"
  echo "6)  Ver necessidade de reboot"
  echo "7)  Ver número de pacotes instalados"
  echo "8)  Sair"
  echo "------------------------------------------------------"
  read -p "Escolha: " opt

  case $opt in
    1) do_update ;;
    2) do_full_upgrade ;;
    3) show_upgradable ;;
    4) do_autoremove ;;
    5) do_autoclean ;;
    6) check_reboot ;;
    7) show_installed; wait_key ;;
    8) break ;;
    *) warn "Opção inválida!"; sleep 1 ;;
  esac
done
