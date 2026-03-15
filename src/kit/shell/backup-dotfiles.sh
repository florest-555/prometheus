#!/bin/bash
# backup-dotfiles.sh - Backup e restauração de dotfiles

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

export BACKUP_DIR="$HOME"
export PATTERN="dotfiles-backup-*.tar.gz"

header() {
  echo -e "\n${BLUE}══════════════════════════════════════════════════════${NC}"
  echo -e "  ${BLUE}$1${NC}"
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
}

list_backups() {
  header "Backups Disponíveis"
  local count=0
  for f in $BACKUP_DIR/$PATTERN; do
    if [ -f "$f" ]; then
      local size=$(du -h "$f" | cut -f1)
      local date=$(stat -c %y "$f" 2>/dev/null | cut -d' ' -f1 || echo "desconhecido")
      echo "  [$((count+1))] $(basename "$f") - $size - $date"
      count=$((count+1))
    fi
  done

  if (( count == 0 )); then
    warn "Nenhum backup encontrado"
  fi
  echo ""
  echo "Total: $count backup(s)"
  wait_key
}

do_backup() {
  local FILES=(
  "$HOME/.bashrc"
  "$HOME/.profile"
  "$HOME/.gitconfig"
  "$HOME/.ssh/config"
  "$HOME/.vimrc"
  "$HOME/.tmux.conf"
  "$HOME/.inputrc"
  "$HOME/.alias"
  "$HOME/.functions"
  "$HOME/.config/fish"
  "$HOME/.config/starship.toml"
  )

  local EXISTING_FILES=()
  for f in "${FILES[@]}"; do
    if [ -e "$f" ] || [ -L "$f" ]; then
      EXISTING_FILES+=("$f")
    fi
  done

  if [ ${#EXISTING_FILES[@]} -eq 0 ]; then
    error "Nenhum arquivo de dotfile encontrado para backup"
    return
  fi

  local DEST="$HOME/dotfiles-backup-$(date +%Y%m%d%H%M%S).tar.gz"

  header "Criando Backup"
  echo "Arquivos que serão incluídos:"
  printf '  %s\n' "${EXISTING_FILES[@]}"
  echo ""
  echo "Destino: $DEST"

  if tar czf "$DEST" "${EXISTING_FILES[@]}" 2>/dev/null; then
    info "Backup concluído!"
    echo "Tamanho: $(du -h "$DEST" | cut -f1)"
  else
    error "Falha ao criar backup"
  fi
  wait_key
}

do_restore() {
  list_backups

  read -p "Número do backup para restaurar: " choice

  local count=0
  local selected=""
  for f in $BACKUP_DIR/$PATTERN; do
    if [ -f "$f" ]; then
      ((count++))
      if (( count == choice )); then
        selected="$f"
        break
      fi
    fi
  done

  if [ -z "$selected" ]; then
    error "Backup inválido"
    return
  fi

  header "Restaurando: $(basename "$selected")"
  warn "Isso irá sobrescrever os arquivos existentes!"
  echo "Arquivos no backup:"
  tar tzf "$selected" | head -15
  echo ""
  read -p "Continuar? (s/N): " confirm

  if [[ "$confirm" == [sS] ]]; then
    local TEMP_DIR=$(mktemp -d)
    tar xzf "$selected" -C "$TEMP_DIR"

    for f in "$TEMP_DIR"/*; do
      if [ -e "$f" ]; then
        local dest="$HOME/$(basename "$f")"
        cp -n "$dest" "$dest.bak.$(date +%s)" 2>/dev/null || true
        cp -r "$f" "$dest" 2>/dev/null && info "Restaurado: $dest" || warn "Falha: $dest"
      fi
    done

    rm -rf "$TEMP_DIR"
    info "Restauração concluída!"
  else
    info "Cancelado"
  fi
  wait_key
}

show_backup_content() {
  list_backups

  read -p "Número do backup para ver conteúdo: " choice

  local count=0
  local selected=""
  for f in $BACKUP_DIR/$PATTERN; do
    if [ -f "$f" ]; then
      ((count++))
      if (( count == choice )); then
        selected="$f"
        break
      fi
    fi
  done

  if [ -z "$selected" ]; then
    error "Backup inválido"
    return
  fi

  header "Conteúdo: $(basename "$selected")"
  tar tzf "$selected"
  wait_key
}

delete_backup() {
  list_backups

  read -p "Número do backup para excluir: " choice

  local count=0
  local selected=""
  for f in $BACKUP_DIR/$PATTERN; do
    if [ -f "$f" ]; then
      ((count++))
      if (( count == choice )); then
        selected="$f"
        break
      fi
    fi
  done

  if [ -z "$selected" ]; then
    error "Backup inválido"
    return
  fi

  warn "Excluir $(basename "$selected")? (s/N)"
  read -p "> " confirm

  if [[ "$confirm" == [sS] ]]; then
    rm "$selected" && info "Backup removido" || error "Falha ao remover"
  fi
  wait_key
}

while true; do
  clear
  header "Backup de Dotfiles"
  echo "1)  Criar backup"
  echo "2)  Listar backups"
  echo "3)  Ver conteúdo de backup"
  echo "4)  Restaurar backup"
  echo "5)  Excluir backup"
  echo "6)  Sair"
  echo "------------------------------------------------------"
  read -p "Escolha: " opt

  case $opt in
    1) do_backup ;;
    2) list_backups ;;
    3) show_backup_content ;;
    4) do_restore ;;
    5) delete_backup ;;
    6) break ;;
    *) warn "Opção inválida!"; sleep 1 ;;
  esac
done
