#!/bin/bash
# docker-helper.sh - Gerenciamento rápido de Docker

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

if ! command_exists docker; then
  error "Docker não está instalado."
  exit 1
fi

while true; do
  clear
  header "Docker Helper"
  echo "1)  Listar Containers Ativos"
  echo "2)  Listar Todos os Containers"
  echo "3)  Listar Imagens"
  echo "4)  Remover Containers Parados"
  echo "5)  Remover Imagens 'Dangling' (Não usadas)"
  echo "6)  Docker System Prune (Limpeza Profunda)"
  echo "7)  Ver Uso de Recursos (Stats)"
  echo "8)  Sair"
  echo "------------------------------------------------------"
  read -p "Escolha: " opt

  case $opt in
    1) docker ps; wait_key ;;
    2) docker ps -a; wait_key ;;
    3) docker images; wait_key ;;
    4)
    warn "Removendo containers parados..."
    docker container prune -f
    info "Concluído."
    wait_key ;;
    5)
    warn "Removendo imagens não utilizadas..."
    docker image prune -f
    info "Concluído."
    wait_key ;;
    6)
    header "CUIDADO: Isso removerá TUDO que não estiver em uso!"
    read -p "Tem certeza? (s/N): " confirm
    if [[ $confirm == [sS] ]]; then
      docker system prune -a --volumes -f
      info "Limpeza concluída."
    fi
    wait_key ;;
    7) docker stats --no-stream; wait_key ;;
    8) break ;;
    *) warn "Opção inválida!"; sleep 1 ;;
  esac
done
