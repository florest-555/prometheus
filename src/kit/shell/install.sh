#!/bin/bash
# install.sh - Instalação e configuração do Kit de Sobrevivência

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SCRIPT_NAME="kit"
export BIN_DIR="$HOME/.local/bin"
export DESKTOP_FILE="$HOME/.local/share/applications/kit.desktop"

export BLUE='\033[0;34m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export RED='\033[0;31m'
export NC='\033[0m'

header() {
  echo -e "\n${BLUE}══════════════════════════════════════════════════════${NC}"
  echo -e "  ${BLUE}$1${NC}"
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
}

info()    { echo -e "${GREEN}[[OK]]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[[FALHA]]${NC} $1"; }

show_help() {
  echo "Uso: $0 [opção]"
  echo ""
  echo "Opções:"
  echo "  install     - Instalar o kit (marcar executáveis e criar links)"
  echo "  uninstall   - Desinstalar o kit"
  echo "  status      - Verificar status da instalação"
  echo "  update      - Atualizar scripts (chmod +x)"
  echo "  deps        - Verificar dependências do sistema"
  echo "  --help      - Mostrar esta ajuda"
  echo ""
}

check_deps() {
  header "Verificando Dependências"

  local missing=()
  local deps=("bash" "git" "curl" "tar" "grep" "awk" "sed")

  for cmd in "${deps[@]}"; do
    if command -v "$cmd" >/dev/null 2>&1; then
      info "$cmd instalado: $(command -v $cmd)"
    else
      warn "$cmd não encontrado"
      missing+=("$cmd")
    fi
  done

  echo ""
  if [ ${#missing[@]} -eq 0 ]; then
    info "Todas dependências essenciais estão disponíveis"
  else
    warn "Faltam: ${missing[*]}"
    echo "  Instale com: sudo apt install ${missing[*]}"
  fi

  echo ""
  echo "Dependências opcionais (para funcionalidades extras):"
  echo "  • htop, bpytop - Processos interativos"
  echo "  • lsof - Gerenciador de portas"
  echo "  • docker - Gerenciamento Docker"
  echo "  • speedtest-cli - Teste de velocidade"
  echo "  • fzf - Busca interativa"
}

do_install() {
  header "Instalando Kit de Sobrevivência"

  # 1. Marcar executáveis
  echo "1/4 - Marcando scripts como executáveis..."
  chmod +x "$SCRIPT_DIR"/*.sh
  info "Scripts marcados"

  # 2. Criar diretório bin local se não existir
  echo "2/4 - Criando diretório bin local..."
  mkdir -p "$BIN_DIR"

  # 3. Criar link simbólico
  if [ -L "$BIN_DIR/$SCRIPT_NAME" ]; then
    warn "Link já existe em $BIN_DIR/$SCRIPT_NAME"
  else
    ln -sf "$SCRIPT_DIR/kit.sh" "$BIN_DIR/$SCRIPT_NAME"
    info "Link criado em $BIN_DIR/$SCRIPT_NAME"
  fi

  # 4. Adicionar ao PATH se necessário
  if ! echo "$PATH" | grep -q "$BIN_DIR"; then
    echo "3/4 - Adicionando ao PATH..."
    if ! grep -q "$BIN_DIR" "$HOME/.bashrc" 2>/dev/null; then
      echo "" >> "$HOME/.bashrc"
      echo "# Kit de Sobrevivência" >> "$HOME/.bashrc"
      echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$HOME/.bashrc"
      info "PATH atualizado no ~/.bashrc"
      echo "  Execute: source ~/.bashrc"
    else
      info "PATH já configurado"
    fi
  else
    info "PATH já contém $BIN_DIR"
  fi

  echo "4/4 - Verificando instalação..."
  if [ -x "$SCRIPT_DIR/kit.sh" ] && [ -L "$BIN_DIR/$SCRIPT_NAME" ]; then
    info "Instalação concluída!"
    echo ""
    echo "  Execute:  kit"
    echo "  Ou:       source ~/.bashrc && kit"
  else
    error "Problema na instalação"
    exit 1
  fi
}

do_uninstall() {
  header "Desinstalando Kit de Sobrevivência"

  echo "Removendo link simbólico..."
  if [ -L "$BIN_DIR/$SCRIPT_NAME" ]; then
    rm "$BIN_DIR/$SCRIPT_NAME"
    info "Link removido"
  else
    warn "Link não encontrado"
  fi

  echo ""
  echo "Remover linhas do PATH do ~/.bashrc? (s/N)"
  read -p "> " confirm
  if [[ "$confirm" == [sS] ]]; then
    sed -i '/# Kit de Sobrevivência/,/export PATH/d' "$HOME/.bashrc"
    info "Linhas removidas do ~/.bashrc"
    echo "  Execute: source ~/.bashrc"
  fi

  info "Desinstalação concluída"
}

do_status() {
  header "Status da Instalação"

  echo -e "  ${BLUE}Diretório do Kit:${NC} $SCRIPT_DIR"
  echo -e "  ${BLUE}Link simbólico:${NC} $BIN_DIR/$SCRIPT_NAME"

  if [ -L "$BIN_DIR/$SCRIPT_NAME" ]; then
    info "Link ok"
  else
    warn "Link não existe"
  fi

  if [ -x "$SCRIPT_DIR/kit.sh" ]; then
    info "Scripts executáveis"
  else
    warn "Scripts não executáveis (execute: $0 update)"
  fi

  if grep -q "$BIN_DIR" "$HOME/.bashrc" 2>/dev/null; then
    info "PATH configurado no ~/.bashrc"
  else
    warn "PATH não configurado no ~/.bashrc"
  fi

  echo ""
  echo "Scripts disponíveis:"
  ls -1 "$SCRIPT_DIR"/*.sh | xargs -I {} basename {} | sed 's/.sh$//' | column
}

do_update_perms() {
  header "Atualizando Permissões"
  chmod +x "$SCRIPT_DIR"/*.sh
  info "Permissões atualizadas em todos os scripts"
  ls -la "$SCRIPT_DIR"/*.sh | awk '{print "  " $1, $9}'
}

case "${1:-install}" in
  install)
  do_install
  ;;
  uninstall|remove)
  do_uninstall
  ;;
  status)
  do_status
  ;;
  update)
  do_update_perms
  ;;
  deps|dependencies)
  check_deps
  ;;
  --help|-h)
  show_help
  ;;
  *)
  error "Opção desconhecida: $1"
  show_help
  exit 1
  ;;
esac
