#!/bin/bash
# Mostra informações de uso de disco e tamanho de diretórios

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

if ! command_exists df; then
    show_error "df não disponível"
    exit 1
fi

echo ".!. Uso de disco (df -h) .!."
df -h

echo
echo ".!. Maiores diretórios no diretório atual (du -h) .!."
if command_exists du && command_exists sort && command_exists head; then
    du -h --max-depth=1 2>/dev/null | sort -hr | head -n 20
else
    show_error "Algum dos comandos necessários (du, sort, head) não está disponível"
fi
