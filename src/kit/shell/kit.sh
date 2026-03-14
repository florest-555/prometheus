#!/bin/bash

# caminho do diretório do script para chamar os utilitários
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Carrega utilitários comuns
if [ -f "$SCRIPT_DIR/utils.sh" ]; then
    source "$SCRIPT_DIR/utils.sh"
else
    echo "Erro: utils.sh não encontrado em $SCRIPT_DIR"
    exit 1
fi

while true; do
  clear
  header ".!. Kit de Sobrevivência Ubuntu .!."
  echo "1)  Ver processos em tempo real (htop)"
  echo "2)  Checar uso da memória (free -h)"
  echo "3)  Listar serviços ativos (systemctl)"
  echo "4)  Liberar cache de memória"
  echo "5)  Hibernar o sistema"
  echo "6)  Atualizar sistema (apt)"
  echo "7)  Uso de disco"
  echo "8)  Checar rede (ping/speedtest)"
  echo "9)  Backup de dotfiles"
  echo "10) Git helper"
  echo "11) Inicializar repositório Git"
  echo "12) Informações do sistema"
  echo "13) Docker Helper [NOVO]"
  echo "14) Gerenciar Portas (LSOF) [NOVO]"
  echo "15) Limpeza de Sistema (Cache/Temps) [NOVO]"
  echo "16) Sair"
  echo "------------------------------------------------------"
  read -p "Escolha uma opção: " opcao

  case $opcao in
    1)
      if command_exists htop; then
        htop
      else
        error "htop não está instalado. Instale com: sudo apt install htop"
        wait_key
      fi
      ;;
    2)
      if command_exists free; then
        header "Uso de Memória"
        free -h
      else
        error "free não disponível"
      fi
      wait_key ;;
    3)
      if command_exists systemctl; then
        header "Serviços em Execução"
        systemctl list-units --type=service --state=running
      else
        error "systemctl não disponível"
      fi
      wait_key ;;
    4)
      header "Limpando Cache de Memória"
      sudo sync && sudo sysctl -w vm.drop_caches=3 && info "Cache liberado!" || error "Falha ao liberar cache"
      wait_key ;;
    5)
      if command_exists systemctl; then
        warn "Hibernando o sistema..."
        systemctl hibernate
      else
        error "systemctl não disponível"
      fi
      ;;
    6)
      if [ -f "$SCRIPT_DIR/update-system.sh" ]; then
        bash "$SCRIPT_DIR/update-system.sh"
      else
        error "Script update-system.sh não encontrado"
      fi
      wait_key ;;
    7)
      if [ -f "$SCRIPT_DIR/disk-usage.sh" ]; then
        bash "$SCRIPT_DIR/disk-usage.sh"
      else
        error "Script disk-usage.sh não encontrado"
      fi
      wait_key ;;
    8)
      if [ -f "$SCRIPT_DIR/network-tools.sh" ]; then
        bash "$SCRIPT_DIR/network-tools.sh"
      else
        error "Script network-tools.sh não encontrado"
      fi
      wait_key ;;
    9)
      if [ -f "$SCRIPT_DIR/backup-dotfiles.sh" ]; then
        bash "$SCRIPT_DIR/backup-dotfiles.sh"
      else
        error "Script backup-dotfiles.sh não encontrado"
      fi
      wait_key ;;
    10)
      if [ -f "$SCRIPT_DIR/git-helper.sh" ]; then
        bash "$SCRIPT_DIR/git-helper.sh"
      else
        error "Script git-helper.sh não encontrado"
      fi
      ;;
    11)
      if [ -f "$SCRIPT_DIR/init-git-repo.sh" ]; then
        bash "$SCRIPT_DIR/init-git-repo.sh"
      else
        error "Script init-git-repo.sh não encontrado"
      fi
      wait_key ;;
    12)
      if [ -f "$SCRIPT_DIR/system-info.sh" ]; then
        bash "$SCRIPT_DIR/system-info.sh"
      else
        error "Script system-info.sh não encontrado"
      fi
      wait_key ;;
    13)
      if [ -f "$SCRIPT_DIR/docker-helper.sh" ]; then
        bash "$SCRIPT_DIR/docker-helper.sh"
      else
        error "Script docker-helper.sh não encontrado"
      fi
      ;;
    14)
      if [ -f "$SCRIPT_DIR/port-manager.sh" ]; then
        bash "$SCRIPT_DIR/port-manager.sh"
      else
        error "Script port-manager.sh não encontrado"
      fi
      ;;
    15)
      if [ -f "$SCRIPT_DIR/cleanup.sh" ]; then
        bash "$SCRIPT_DIR/cleanup.sh"
      else
        error "Script cleanup.sh não encontrado"
      fi
      ;;
    16)
      info "Saindo..."
      break
      ;;
    *)
      warn "Opção inválida!"
      sleep 1
      ;;
  esac
done
