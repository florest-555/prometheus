#!/bin/bash
#  Migração completa para SSH no GitHub
#  Uso: ./setup-github-ssh.sh [--user SEU_USER] [--email SEU_EMAIL]
#  Configura chave SSH, atualiza repositórios locais e limpa credenciais HTTPS

set -e

# ── Cores ────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}[✔]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✘]${NC} $1"; exit 1; }
section() { echo -e "\n${YELLOW}══════════════════════════════════════${NC}"; echo -e "  $1"; echo -e "${YELLOW}══════════════════════════════════════${NC}"; }

# ── Parse argumentos ─────────────────────────────────
GITHUB_USER=""
GITHUB_EMAIL=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --user)  GITHUB_USER="$2"; shift 2 ;;
    --email) GITHUB_EMAIL="$2"; shift 2 ;;
    --help|-h)
    echo "Uso: $0 [--user SEU_USER] [--email SEU_EMAIL]"
    echo ""
    echo "Configura SSH para GitHub, migrando repositórios de HTTPS para SSH."
    echo "Se --user e --email não forem informados, serão solicitados interativamente."
    exit 0
    ;;
    *) error "Argumento desconhecido: $1. Use --help para ver opções." ;;
  esac
done

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

KEY_NAME="github_${GITHUB_USER//[^a-zA-Z0-9_-]/_}"
KEY_FILE="$HOME/.ssh/$KEY_NAME"
SSH_CONFIG="$HOME/.ssh/config"

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
BASHRC="$HOME/.bashrc"
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
REPOS=$(find "$HOME" -name ".git" -type d -maxdepth 4 2>/dev/null | sed 's|/.git||')

MIGRATED=0
SKIPPED=0

for REPO in $REPOS; do
  CURRENT_URL=$(git -C "$REPO" remote get-url origin 2>/dev/null || echo "")

  if [[ "$CURRENT_URL" == https://github.com/* ]]; then
    SSH_URL=$(echo "$CURRENT_URL" | sed 's|https://github.com/|git@github.com:|')
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
