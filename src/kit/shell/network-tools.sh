#!/bin/bash
# Utilitários de rede

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

if ! command_exists ping; then
    show_error "ping não disponível"
    exit 1
fi

echo "=== Ping para 8.8.8.8 ==="
ping -c 4 8.8.8.8 || true

echo
if command_exists speedtest-cli; then
  echo "=== Executando speedtest-cli ==="
  speedtest-cli || true
else
  echo "speedtest-cli não está instalado. instale com: sudo apt install speedtest-cli"
fi
