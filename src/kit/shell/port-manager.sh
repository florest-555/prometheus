#!/bin/bash
# port-manager.sh - Gerenciador de portas e processos

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

if ! command_exists lsof; then
  error "lsof não está instalado. Instale com: sudo apt install lsof"
  exit 1
fi

list_all_ports() {
  header "Todas as Portas em Escuta"
  echo -e "${BLUE}PID   PORTA   PROCESSO${NC}"
  lsof -i -P -n 2>/dev/null | grep LISTEN | awk '{print $2, $9}' | sort -u | while read -r pid port; do
  local proc=$(ps -p "$pid" -o comm= 2>/dev/null || echo "desconhecido")
  echo -e "  $pid  $port  $proc"
done
echo ""
lsof -i -P -n 2>/dev/null | grep LISTEN | awk '{print $9}' | cut -d: -f2 | sort -n | uniq | head -20
wait_key
}

kill_by_port() {
  read -rp "Digite a porta para encerrar: " PORT

  if [ -z "$PORT" ]; then
    error "Porta não informada."
    return
  fi

  local PID=$(lsof -t -i:$PORT 2>/dev/null)

  if [ -z "$PID" ]; then
    warn "Nenhum processo escutando na porta $PORT."
    return
  fi

  header "Processo na Porta $PORT"
  lsof -i:$PORT

  echo ""
  warn "Encerrar processo (PID: $PID)? [s/N]"
  read -p "> " confirm

  if [[ "$confirm" == [sS] ]]; then
    if kill -9 $PID 2>/dev/null; then
      info "Processo $PID encerrado."
    else
      error "Falha ao encerrar processo. Tente com sudo."
    fi
  else
    info "Cancelado."
  fi
  wait_key
}

kill_by_name() {
  read -rp "Nome do processo: " proc_name

  if [ -z "$proc_name" ]; then
    error "Nome do processo não informado."
    return
  fi

  local PIDS=$(pgrep -f "$proc_name" 2>/dev/null)

  if [ -z "$PIDS" ]; then
    warn "Nenhum processo encontrado com '$proc_name'."
    return
  fi

  header "Processos encontrados: $proc_name"
  ps -p "$PIDS" -o pid,ppid,comm,etime 2>/dev/null

  echo ""
  warn "Encerrar todos esses processos? [s/N]"
  read -p "> " confirm

  if [[ "$confirm" == [sS] ]]; then
    for pid in $PIDS; do
      kill -9 $pid 2>/dev/null && info "Encerrado: $pid" || warn "Falha: $pid"
    done
  fi
  wait_key
}

show_port_info() {
  read -rp "Digite a porta para investigar: " PORT

  if [ -z "$PORT" ]; then
    error "Porta não informada."
    return
  fi

  header "Detalhes da Porta $PORT"

  local CONN=$(lsof -i:$PORT 2>/dev/null)
  if [ -n "$CONN" ]; then
    echo "$CONN"
    echo ""

    local PID=$(echo "$CONN" | grep LISTEN | awk '{print $2}' | head -1)
    if [ -n "$PID" ]; then
      echo -e "${BLUE}Informações do processo:${NC}"
      ps -p "$PID" -o pid,user,comm,etime,args 2>/dev/null
      echo ""

      echo -e "${BLUE}Ficheiros abertos:${NC}"
      lsof -p "$PID" 2>/dev/null | tail -n +2 | head -10
    fi
  else
    warn "Nenhum processo escutando na porta $PORT."
  fi
  wait_key
}

show_listening_ports() {
  header "Resumo de Portas em Escuta (Python)"
  python3 -c "
  import socket
  for port in range(1, 1024):
    try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.1)
    if s.connect_ex(('localhost', port)) == 0:
      s.close()
      print(f'  {port}')
      except:
      pass
      " 2>/dev/null || error "Python3 não disponível"
      wait_key
    }

    while true; do
      clear
      header "Gerenciador de Portas e Processos"
      echo "1)  Listar todas as portas em escuta"
      echo "2)  Investigar uma porta específica"
      echo "3)  Encerrar processo por porta"
      echo "4)  Encerrar processo por nome"
      echo "5)  Resumo de portas (1-1023)"
      echo "6)  Ver processos por usuário"
      echo "7)  Sair"
      echo "------------------------------------------------------"
      read -p "Escolha: " opt

      case $opt in
        1) list_all_ports ;;
        2) show_port_info ;;
        3) kill_by_port ;;
        4) kill_by_name ;;
        5) show_listening_ports ;;
        6)
        header "Processos por Usuário"
        ps -eo user,comm,pid --no-headers | sort | uniq -c | sort -rn | head -15
        wait_key
        ;;
        7) break ;;
        *) warn "Opção inválida!"; sleep 1 ;;
      esac
    done
