#!/bin/bash
# Menu interativo com comandos Git básicos

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

if ! command_exists git; then
    show_error "git não está instalado"
    exit 1
fi

while true; do
  clear
  echo "--- .!. Git Helper .!. ---"
  echo "1) status"
  echo "2) add ."
  echo "3) commit"
  echo "4) push"
  echo "5) pull"
  echo "6) branch"
  echo "7) checkout"
  echo "8) log"
  echo "9) sair"
  read -p "Escolha: " opt

  case $opt in
    1)
      git status
      read -p "Enter para continuar..." ;;
    2)
      git add .
      echo "Adicionado."
      read -p "Enter para continuar..." ;;
    3)
      read -p "Mensagem de commit: " msg
      if [ -n "$msg" ]; then
        git commit -m "$msg"
      else
        echo "Mensagem de commit vazia. Operação cancelada."
      fi
      read -p "Enter..." ;;
    4)
      git push
      read -p "Enter..." ;;
    5)
      git pull
      read -p "Enter..." ;;
    6)
      git branch -a
      read -p "Enter..." ;;
    7)
      read -p "Nome da branch: " br
      if [ -n "$br" ]; then
        git checkout "$br"
      else
        echo "Nome da branch vazio. Operação cancelada."
      fi
      read -p "Enter..." ;;
    8)
      git log --oneline --graph --decorate
      read -p "Enter..." ;;
    9)
      break ;;
    *)
      echo "Opção inválida"
      sleep 1 ;;
  esac
done
