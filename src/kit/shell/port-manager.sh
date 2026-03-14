#!/bin/bash
# port-manager.sh - Identifica e encerra processos em portas específicas

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

if ! command_exists lsof; then
    error "lsof não está instalado. Instale com: sudo apt install lsof"
    exit 1
fi

header "Gerenciador de Portas"

read -p "Digite a porta para investigar (EX: 8080): " PORT

if [ -z "$PORT" ]; then
    error "Porta não informada."
    exit 1
fi

PID=$(lsof -t -i:$PORT)

if [ -z "$PID" ]; then
    info "Nenhum processo escutando na porta $PORT."
else
    header "Processo Encontrado na Porta $PORT"
    lsof -i:$PORT
    
    echo ""
    warn "Deseja encerrar este processo (PID: $PID)? [s/N]"
    read -p "> " kill_opt
    
    if [[ $kill_opt == [sS] ]]; then
        kill -9 $PID && info "Processo $PID encerrado." || error "Falha ao encerrar processo."
    fi
fi

wait_key
