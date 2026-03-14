#!/bin/bash
# Menu interativo com comandos Git básicos e avançados

# caminho do diretório do script para chamar os utilitários
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Carrega utilitários comuns
if [ -f "$SCRIPT_DIR/utils.sh" ]; then
    source "$SCRIPT_DIR/utils.sh"
else
    echo "Erro: utils.sh não encontrado"
    exit 1
fi

if ! command_exists git; then
    error "git não está instalado"
    exit 1
fi

while true; do
  clear
  header ".!. Git Helper .!."
  echo "1)  Status (git status)"
  echo "2)  Adicionar Tudo (git add .)"
  echo "3)  Commit (git commit -m)"
  echo "4)  Push (git push)"
  echo "5)  Pull (git pull)"
  echo "6)  Listar Branches (git branch -a)"
  echo "7)  Trocar Branch (git checkout)"
  echo "8)  Log Visual (git log --graph)"
  echo "9)  Stash (Guardar alterações temporariamente)"
  echo "10) Limpar arquivos não rastreados (git clean)"
  echo "11) Ver Remotes (git remote -v)"
  echo "12) Sair"
  echo "------------------------------------------------------"
  read -p "Escolha uma opção: " opt

  case $opt in
    1)
      git status
      wait_key ;;
    2)
      git add .
      info "Todas as alterações foram adicionadas ao index."
      wait_key ;;
    3)
      read -p "Mensagem de commit: " msg
      if [ -n "$msg" ]; then
        git commit -m "$msg"
      else
        warn "Mensagem de commit vazia. Operação cancelada."
      fi
      wait_key ;;
    4)
      info "Enviando alterações..."
      git push
      wait_key ;;
    5)
      info "Buscando atualizações..."
      git pull
      wait_key ;;
    6)
      header "Branches"
      git branch -a
      wait_key ;;
    7)
      read -p "Nome da branch/commit: " br
      if [ -n "$br" ]; then
        git checkout "$br"
      else
        warn "Nome da branch vazio."
      fi
      wait_key ;;
    8)
      header "Histórico de Commits"
      git log --oneline --graph --decorate -n 15
      wait_key ;;
    9)
      header "Git Stash"
      echo "1) Stash (Save)"
      echo "2) Pop (Apply & Remove last)"
      echo "3) List"
      read -p "Escolha: " stash_opt
      case $stash_opt in
        1) read -p "Mensagem (opcional): " smsg; git stash push -m "$smsg" ;;
        2) git stash pop ;;
        3) git stash list ;;
      esac
      wait_key ;;
    10)
      warn "Isso removerá arquivos NÃO rastreados pelo Git!"
      read -p "Tem certeza? (s/N): " confirm
      if [[ $confirm == [sS] ]]; then
        git clean -fd
        info "Arquivos limpos."
      fi
      wait_key ;;
    11)
      header "Remotes"
      git remote -v
      wait_key ;;
    12)
      break ;;
    *)
      warn "Opção inválida"
      sleep 1 ;;
  esac
done
