#!/bin/bash
# Atualiza e limpa o sistema (Debian/Ubuntu)

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

# Verificar se estamos em um sistema Debian/Ubuntu
if ! command_exists apt; then
  show_error "Este script é intended for Debian/Ubuntu systems with apt. Este sistema não tem apt."
  exit 1
fi

echo "Executando atualização do apt..."
if sudo apt update && sudo apt upgrade -y; then
  echo
  echo "Removendo pacotes desnecessários..."
  if sudo apt autoremove -y; then
    echo "Sistema atualizado e pacotes desnecessários removidos."
  else
    show_error "Falha ao remover pacotes desnecessários"
  fi
else
  show_error "Falha ao atualizar o sistema"
fi
