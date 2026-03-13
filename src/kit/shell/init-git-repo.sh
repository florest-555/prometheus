#!/bin/bash
# init-git-repo.sh - Guia passo a passo para iniciar um repositório Git

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

# Verificar se git está instalado
if ! command_exists git; then
    show_error "git não está instalado"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ".!. Inicializando repositório Git .!."

# Verificar se já é um repositório Git
if git rev-parse --is-inside-work-tree &>/dev/null; then
    echo "Este diretório já é um repositório Git."
else
    echo "Inicializando repositório Git..."
    if ! git init; then
        show_error "Falha ao inicializar repositório Git"
        exit 1
    fi
fi

# Configurar identidade se não estiver definida
if ! git config --global user.name &>/dev/null; then
    read -p "Digite seu nome para o Git: " GIT_USER
    if [ -z "$GIT_USER" ]; then
        show_error "Nome do Git não pode estar vazio"
        exit 1
    fi
    git config --global user.name "$GIT_USER"
fi

if ! git config --global user.email &>/dev/null; then
    read -p "Digite seu email para o Git: " GIT_EMAIL
    if [ -z "$GIT_EMAIL" ]; then
        show_error "Email do Git não pode estar vazio"
        exit 1
    fi
    git config --global user.email "$GIT_EMAIL"
fi

echo "Configurações atuais:"
git config --global --list | grep -E "user.(name|email)"

# Perguntar se quer criar remote
read -p "Deseja adicionar um remote agora? (y/n): " ADD_REMOTE
if [[ "$ADD_REMOTE" =~ ^[Yy]$ ]]; then
    read -p "URL do repositório remoto (ex: git@github.com:usuario/repo.git): " REMOTE_URL
    if [ -z "$REMOTE_URL" ]; then
        show_error "URL do remote não pode estar vazia"
        exit 1
    fi
    if git remote add origin "$REMOTE_URL"; then
        echo "Remote 'origin' adicionado."
    else
        show_error "Falha ao adicionar remote"
    fi
fi

# Sugerir primeiro commit
echo ""
echo "Agora você pode adicionar arquivos e fazer o primeiro commit:"
echo "  git add ."
echo "  git commit -m \"Initial commit\""
echo ""
echo "Para fazer push (se remote configurado):"
echo "  git push -u origin main"