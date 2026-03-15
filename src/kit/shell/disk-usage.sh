#!/bin/bash
# disk-usage.sh - Análise de uso de disco

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

header() {
  echo -e "\n${BLUE}══════════════════════════════════════════════════════${NC}"
  echo -e "  ${BLUE}$1${NC}"
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
}

show_partitions() {
  header "Partições e Uso de Disco"
  df -hT | grep -E '^/dev/|tmpfs|loop'
  wait_key
}

show_big_dirs() {
  read -p "Diretório [padrão: $HOME]: " target
  target="${target:-$HOME}"

  if [ ! -d "$target" ]; then
    error "Diretório não existe: $target"
    return
  fi

  header "Maiores diretórios em: $target"
  du -h "$target" 2>/dev/null | sort -hr | head -n 20
  wait_key
}

show_big_files() {
  read -p "Diretório [padrão: $HOME]: " target
  target="${target:-$HOME}"

  read -p "Número de arquivos [padrão: 15]: " count
  count="${count:-15}"

  if [ ! -d "$target" ]; then
    error "Diretório não existe: $target"
    return
  fi

  header "Maiores arquivos em: $target"
  find "$target" -type f -exec du -h {} + 2>/dev/null | sort -hr | head -n "$count"
  wait_key
}

show_file_types() {
  read -p "Diretório [padrão: $HOME]: " target
  target="${target:-$HOME}"

  if [ ! -d "$target" ]; then
    error "Diretório não existe: $target"
    return
  fi

  header "Tipos de arquivo em: $target"
  find "$target" -type f 2>/dev/null | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -15
  wait_key
}

show_disk_by_inode() {
  header "Uso de Inodes"
  df -i
  wait_key
}

show_dir_depth() {
  read -p "Diretório [padrão: .]: " target
  target="${target:-.}"

  read -p "Profundidade [padrão: 2]: " depth
  depth="${depth:-2}"

  if [ ! -d "$target" ]; then
    error "Diretório não existe: $target"
    return
  fi

  header "Estrutura até profundidade $depth"
  du -h --max-depth="$depth" "$target" 2>/dev/null | sort -hr
  wait_key
}

show_hidden_dirs() {
  read -p "Diretório [padrão: $HOME]: " target
  target="${target:-$HOME}"

  if [ ! -d "$target" ]; then
    error "Diretório não existe: $target"
    return
  fi

  header "Dirs ocultos (.dotfiles) em: $target"
  find "$target" -maxdepth 2 -name ".*" -type d 2>/dev/null | head -20 | while read -r d; do
  size=$(du -sh "$d" 2>/dev/null | cut -f1)
  echo "  $size  $d"
done
wait_key
}

while true; do
  clear
  header "Análise de Uso de Disco"
  echo "1)  Ver partições (df -h)"
  echo "2)  Maiores diretórios"
  echo "3)  Maiores arquivos"
  echo "4)  Tipos de arquivo (extensão)"
  echo "5)  Uso de inodes"
  echo "6)  Estrutura por profundidade"
  echo "7)  Diretórios ocultos (.dotfiles)"
  echo "8)  Sair"
  echo "------------------------------------------------------"
  read -p "Escolha: " opt

  case $opt in
    1) show_partitions ;;
    2) show_big_dirs ;;
    3) show_big_files ;;
    4) show_file_types ;;
    5) show_disk_by_inode ;;
    6) show_dir_depth ;;
    7) show_hidden_dirs ;;
    8) break ;;
    *) warn "Opção inválida!"; sleep 1 ;;
  esac
done
