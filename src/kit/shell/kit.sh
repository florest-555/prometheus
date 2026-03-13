#!/bin/bash

# caminho do diretório do script para chamar os utilitários
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para exibir mensagem de erro
show_error() {
    echo "Erro: $1" >&2
    read -p "Pressione Enter para continuar..."
}

# Trap para capturar interrupções
trap 'echo "Interrompido. Saindo..."; exit 1' INT TERM

while true; do
  clear
  echo "--- .!. Kit de Sobrevivência Ubuntu .!. ---"
  echo "1) Ver processos em tempo real (htop)"
  echo "2) Checar uso da memória (free -h)"
  echo "3) Listar serviços ativos (systemctl)"
  echo "4) Liberar cache de memória"
  echo "5) Hibernar o sistema"
  echo "6) Atualizar sistema (apt)"
  echo "7) Uso de disco"
  echo "8) Checar rede (ping/speedtest)"
  echo "9) Backup de dotfiles"
  echo "10) Git helper"
  echo "11) Inicializar repositório Git"
  echo "12) Informações do sistema"
  echo "13) Sair"
  echo "----------------------_.!._-----------------------"
  read -p "Escolha uma opção: " opcao

  case $opcao in
    1)
      if command_exists htop; then
        htop
      else
        show_error "htop não está instalado. Instale com: sudo apt install htop"
      fi
      ;;
    2)
      if command_exists free; then
        free -h
      else
        show_error "free não disponível"
      fi
      read -p "Pressione Enter para voltar..." ;;
    3)
      if command_exists systemctl; then
        systemctl list-units --type=service --state=running
      else
        show_error "systemctl não disponível"
      fi
      read -p "Pressione Enter para voltar..." ;;
    4)
      if command_exists sync && command_exists sysctl; then
        sudo sync && sudo sysctl -w vm.drop_caches=3 && echo "Cache liberado!"
      else
        show_error "sync ou sysctl não disponíveis"
      fi
      read -p "Pressione Enter para voltar..." ;;
    5)
      if command_exists systemctl; then
        systemctl hibernate
      else
        show_error "systemctl não disponível"
      fi
      ;;
    6)
      if [ -f "$SCRIPT_DIR/update-system.sh" ]; then
        bash "$SCRIPT_DIR/update-system.sh"
      else
        show_error "Script update-system.sh não encontrado"
      fi
      read -p "Pressione Enter para voltar..." ;;
    7)
      if [ -f "$SCRIPT_DIR/disk-usage.sh" ]; then
        bash "$SCRIPT_DIR/disk-usage.sh"
      else
        show_error "Script disk-usage.sh não encontrado"
      fi
      read -p "Pressione Enter para voltar..." ;;
    8)
      if [ -f "$SCRIPT_DIR/network-tools.sh" ]; then
        bash "$SCRIPT_DIR/network-tools.sh"
      else
        show_error "Script network-tools.sh não encontrado"
      fi
      read -p "Pressione Enter para voltar..." ;;
    9)
      if [ -f "$SCRIPT_DIR/backup-dotfiles.sh" ]; then
        bash "$SCRIPT_DIR/backup-dotfiles.sh"
      else
        show_error "Script backup-dotfiles.sh não encontrado"
      fi
      read -p "Pressione Enter para voltar..." ;;
    10)
      if [ -f "$SCRIPT_DIR/git-helper.sh" ]; then
        bash "$SCRIPT_DIR/git-helper.sh"
      else
        show_error "Script git-helper.sh não encontrado"
      fi
      ;;
    11)
      if [ -f "$SCRIPT_DIR/init-git-repo.sh" ]; then
        bash "$SCRIPT_DIR/init-git-repo.sh"
      else
        show_error "Script init-git-repo.sh não encontrado"
      fi
      read -p "Pressione Enter para voltar..." ;;
    12)
      if [ -f "$SCRIPT_DIR/system-info.sh" ]; then
        bash "$SCRIPT_DIR/system-info.sh"
      else
        show_error "Script system-info.sh não encontrado"
      fi
      read -p "Pressione Enter para voltar..." ;;
    13)
      echo "Saindo..."
      break
      ;;
    *)
      echo "Opção inválida!"
      sleep 1
      ;;
  esac
done
