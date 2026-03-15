#!/bin/bash
#  Migração completa para SSH no GitHub
#  Uso: ./setup-github-ssh.sh [--user SEU_USER] [--email SEU_EMAIL] [--reset]
#  Configura chave SSH, atualiza repositórios locais e limpa credenciais HTTPS

set -e

# ── Cores ────────────────────────────────────────────
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export RED='\033[0;31m'
export BLUE='\033[0;34m'
export NC='\033[0m'

info()    { echo -e "${GREEN}[[OK]]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[[FALHA]]${NC} $1"; exit 1; }
section() { echo -e "\n${YELLOW}══════════════════════════════════════${NC}"; echo -e "  $1"; echo -e "${YELLOW}══════════════════════════════════════${NC}"; }

# ── Funções de informação do ambiente ─────────────────
show_current_config() {
  echo ""
  section "Ambiente Atual — Git Config"
  echo -e "  ${BLUE}user.name:${NC}  $(git config --global user.name 2>/dev/null || echo 'não configurado')"
  echo -e "  ${BLUE}user.email:${NC} $(git config --global user.email 2>/dev/null || echo 'não configurado')"

  section "Ambiente Atual — SSH"

  # Encontrar chaves SSH
  if [ -d "$HOME/.ssh" ]; then
    echo -e "  ${BLUE}Diretório ~/.ssh:${NC}"
    for key in "$HOME/.ssh"/id_*; do
      if [ -f "$key" ]; then
        local key_name=$(basename "$key")
        echo -e "    └── Chave: ~/.ssh/${key_name}"
        if [ -f "${key}.pub" ]; then
          echo -e "        └── Pública: ~/.ssh/${key_name}.pub"
        fi
      fi
    done

    # Mostrar config
    if [ -f "$HOME/.ssh/config" ]; then
      echo -e "\n  ${BLUE}Arquivo ~/.ssh/config:${NC}"
      grep -A5 "Host github.com" "$HOME/.ssh/config" 2>/dev/null | head -10 | sed 's/^/    /'
    fi

    # Mostrarbashrc
    if grep -q "ssh-agent" "$HOME/.bashrc" 2>/dev/null; then
      echo -e "\n  ${BLUE}Agent no ~/.bashrc:${NC} ✓ configurado"
      grep -n "ssh-agent\|ssh-add" "$HOME/.bashrc" 2>/dev/null | sed 's/^/    /'
    else
      echo -e "\n  ${BLUE}Agent no ~/.bashrc:${NC} não encontrado"
    fi
  else
    echo "  Diretório ~/.ssh não existe"
  fi
  echo ""
}

confirm_reset() {
  echo ""
  warn "Isso irá:"
  echo "  • Remover apenas chaves SSH do GitHub em ~/.ssh (outras serão mantidas)"
  echo "  • Remover configuração do GitHub no ~/.ssh/config"
  echo "  • Remover linhas do ssh-agent do GitHub no ~/.bashrc"
  echo "  • Manter user.name e user.email do git config"
  echo ""
  read -rp "  Deseja continuar? [s/N] " confirm
  local confirm
  if [[ "$confirm" != "s" && "$confirm" != "S" ]]; then
    echo "  Cancelado."
    exit 0
  fi
}

do_reset() {
  confirm_reset

  section "Resetando ambiente SSH (apenas GitHub)"

  # Remover apenas chaves do GitHub
  if [ -d "$HOME/.ssh" ]; then
    for key in "$HOME/.ssh"/id_*; do
      if [ -f "$key" ]; then
        local key_name=$(basename "$key")
        if [[ "$key_name" == *"github"* ]]; then
          rm -f "$key" "${key}.pub" && info "Removido: $key"
        else
          info "Mantido (não-GitHub): $key"
        fi
      fi
    done
  fi

  # Limpar config do GitHub
  if [ -f "$HOME/.ssh/config" ]; then
    # Backup
    cp "$HOME/.ssh/config" "$HOME/.ssh/config.bak.$(date +%s)"
    # Remove blocos do GitHub
    sed -i '/^# GitHub — /,/^$/d' "$HOME/.ssh/config"
    sed -i '/^# GitHub$/,/^$/d' "$HOME/.ssh/config"
    # Remove linhas de configuração do GitHub
    sed -i '/^Host github\.com$/,/^$/d' "$HOME/.ssh/config"
    # Limpa linhas vazias extras
    sed -i '/^$/N;/^\n$/d' "$HOME/.ssh/config"
    info "Configuração do GitHub removida do ~/.ssh/config"
  fi

  # Remover linhas do bashrc
  if [ -f "$HOME/.bashrc" ]; then
    cp "$HOME/.bashrc" "$HOME/.bashrc.bak.$(date +%s)"
    sed -i '/# GitHub SSH Agent/d' "$HOME/.bashrc"
    sed -i '/eval "$(ssh-agent/d' "$HOME/.bashrc"
    sed -i '/ssh-add .*github/d' "$HOME/.bashrc"
    info "Linhas do ssh-agent removidas do ~/.bashrc"
  fi

  echo ""
  info "Reset concluído! Execute novamente para configurar do zero."
  echo ""
  exit 0
}

# ── Parse argumentos ─────────────────────────────────
export GITHUB_USER=""
export GITHUB_EMAIL=""
export RESET_MODE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --user)  GITHUB_USER="$2"; shift 2 ;;
    --email) GITHUB_EMAIL="$2"; shift 2 ;;
    --reset) RESET_MODE=true ;;
    --help|-h)
    echo "Uso: $0 [--user SEU_USER] [--email SEU_EMAIL] [--reset]"
    echo ""
    echo "  --user SEU_USER    Username do GitHub"
    echo "  --email SEU_EMAIL  Email associado ao GitHub"
    echo "  --reset            Resetar configuração existente e começar do zero"
    echo ""
    echo "Se --user e --email não forem informados, serão solicitados interativamente."
    exit 0
    ;;
    *) error "Argumento desconhecido: $1. Use --help para ver opções." ;;
  esac
done

# ── Verificar configuração existente ─────────────────
export EXISTING_KEY=false
if [ -d "$HOME/.ssh" ]; then
  for key in "$HOME/.ssh"/id_*; do
    [ -f "$key" ] && EXISTING_KEY=true && break
  done
fi

export EXISTING_CONFIG=false
if [ -f "$HOME/.ssh/config" ] && grep -q "Host github.com" "$HOME/.ssh/config" 2>/dev/null; then
  EXISTING_CONFIG=true
fi

if [ "$EXISTING_KEY" = true ] || [ "$EXISTING_CONFIG" = true ]; then
  show_current_config

  if [ "$RESET_MODE" = true ]; then
    do_reset
  else
    echo -e "${YELLOW}Ambiente SSH já está configurado!${NC}"
    echo ""
    echo "  Para reconfigurar do zero, execute com: --reset"
    echo "  Para apenas ver a configuração atual, é isso que tem acima."
    echo ""
    read -rp "  Deseja continuar e sobrescrever a configuração? [s/N] " confirm
    if [[ "$confirm" != "s" && "$confirm" != "S" ]]; then
      echo "  Cancelado. Use --reset para reconfigurar completamente."
      exit 0
    fi
  fi
fi

# ── Solicitar dados se não fornecidos ────────────────
if [ -z "$GITHUB_USER" ]; then
  read -rp "  GitHub username: " GITHUB_USER
  [ -z "$GITHUB_USER" ] && error "Username é obrigatório."
fi

if [ -z "$GITHUB_EMAIL" ]; then
  DEFAULT_EMAIL="${GITHUB_USER}@users.noreply.github.com"
  read -rp "  GitHub email [${DEFAULT_EMAIL}]: " GITHUB_EMAIL
  GITHUB_EMAIL="${GITHUB_EMAIL:-$DEFAULT_EMAIL}"
fi

# Configurar git user se não existir
local CURRENT_NAME=$(git config --global user.name 2>/dev/null || echo "")
local CURRENT_EMAIL=$(git config --global user.email 2>/dev/null || echo "")
if [ -z "$CURRENT_NAME" ]; then
  git config --global user.name "$GITHUB_USER"
  info "user.name configurado: $GITHUB_USER"
else
  warn "user.name já configurado: $CURRENT_NAME"
fi
if [ -z "$CURRENT_EMAIL" ]; then
  git config --global user.email "$GITHUB_EMAIL"
  info "user.email configurado: $GITHUB_EMAIL"
else
  warn "user.email já configurado: $CURRENT_EMAIL"
fi

export KEY_NAME="github_${GITHUB_USER//[^a-zA-Z0-9_-]/_}"
export KEY_FILE="$HOME/.ssh/$KEY_NAME"
export SSH_CONFIG="$HOME/.ssh/config"

echo ""
info "Configurando SSH para: ${GITHUB_USER} <${GITHUB_EMAIL}>"
info "Chave: ${KEY_FILE}"

# -------------------------------------------------------------
section "1/6 — Gerando chave SSH"
# -------------------------------------------------------------
if [ -f "$KEY_FILE" ]; then
  warn "Chave já existe em $KEY_FILE — pulando geração."
else
  ssh-keygen -t ed25519 -C "$GITHUB_EMAIL" -f "$KEY_FILE" -N ""
  info "Chave gerada em $KEY_FILE"
fi

# -------------------------------------------------------------
section "2/6 — Iniciando SSH Agent e adicionando chave"
# -------------------------------------------------------------
eval "$(ssh-agent -s)" > /dev/null
ssh-add "$KEY_FILE"
info "Chave adicionada ao agent"

# Persistir no .bashrc (evita duplicatas)
local BASHRC="$HOME/.bashrc"
if ! grep -q "$KEY_NAME" "$BASHRC" 2>/dev/null; then
  echo "" >> "$BASHRC"
  echo "# GitHub SSH Agent — $GITHUB_USER (adicionado por setup-github-ssh.sh)" >> "$BASHRC"
  echo 'eval "$(ssh-agent -s)" > /dev/null 2>&1' >> "$BASHRC"
  echo "ssh-add $KEY_FILE 2>/dev/null" >> "$BASHRC"
  info "Agent configurado no .bashrc"
else
  warn "Agent já estava no .bashrc — pulando."
fi

# -------------------------------------------------------------
section "3/6 — Configurando ~/.ssh/config"
# -------------------------------------------------------------
if grep -q "$KEY_NAME" "$SSH_CONFIG" 2>/dev/null; then
  warn "Entrada do GitHub já existe em $SSH_CONFIG — pulando."
else
  mkdir -p "$HOME/.ssh"
  cat >> "$SSH_CONFIG" <<EOF

  # GitHub — $GITHUB_USER
  Host github.com
  HostName github.com
  User git
  IdentityFile $KEY_FILE
  IdentitiesOnly yes
  EOF
  chmod 600 "$SSH_CONFIG"
  info "~/.ssh/config atualizado"
fi

# -------------------------------------------------------------
section "4/6 — Limpando credenciais HTTPS antigas"
# -------------------------------------------------------------
git config --global --unset credential.helper 2>/dev/null && \
info "credential.helper removido" || \
warn "credential.helper não estava definido globalmente"

git credential-cache exit 2>/dev/null || true
info "Cache de credenciais limpo"

# -------------------------------------------------------------
section "5/6 — Migrando repositórios locais de HTTPS para SSH"
# -------------------------------------------------------------
warn "Buscando repositórios git em $HOME ..."
local REPOS=$(find "$HOME" -name ".git" -type d -maxdepth 4 2>/dev/null | sed 's|/.git||')

local MIGRATED=0
local SKIPPED=0

for REPO in $REPOS; do
  local CURRENT_URL=$(git -C "$REPO" remote get-url origin 2>/dev/null || echo "")

  if [[ "$CURRENT_URL" == https://github.com/* ]]; then
    local SSH_URL=$(echo "$CURRENT_URL" | sed 's|https://github.com/|git@github.com:|')
    git -C "$REPO" remote set-url origin "$SSH_URL"
    info "[$REPO]\n    $CURRENT_URL\n    → $SSH_URL"
    MIGRATED=$((MIGRATED + 1))
  else
    SKIPPED=$((SKIPPED + 1))
  fi
done

info "$MIGRATED repositório(s) migrado(s), $SKIPPED ignorado(s)"

# -------------------------------------------------------------
section "6/6 — Testando conexão com GitHub"
# -------------------------------------------------------------
echo ""
warn "Pressione ENTER após adicionar a chave pública abaixo no GitHub:"
echo ""
echo -e "${GREEN}━━━━━━━━━━━  CHAVE PÚBLICA  ━━━━━━━━━━━${NC}"
cat "$KEY_FILE.pub"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Acesse: https://github.com/settings/ssh/new"
echo "  Cole a chave acima e salve."
echo ""
read -rp "  Pressione ENTER quando estiver pronto... "

echo ""
info "Testando SSH..."
if ssh -T git@github.com 2>&1 | grep -q "$GITHUB_USER"; then
  info "Conexão autenticada com sucesso como $GITHUB_USER!"
else
  warn "Não foi possível confirmar automaticamente. Saída do teste:"
  ssh -T git@github.com 2>&1 || true
fi

# -------------------------------------------------------------
echo ""
echo -e "${GREEN}══════════════════════════════════════${NC}"
echo -e "  Migração concluída!"
echo -e "${GREEN}══════════════════════════════════════${NC}"
echo ""
echo "  Recarregue o terminal com:  source ~/.bashrc"
echo ""
