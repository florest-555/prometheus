#!/bin/bash
# Cria um backup de arquivos de configurações (dotfiles) comuns

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

if ! command_exists tar; then
    show_error "tar não está instalado"
    exit 1
fi

# Lista de arquivos/diretórios para backup (adicione conforme necessário)
FILES=(
    "$HOME/.bashrc"
    "$HOME/.profile"
    "$HOME/.gitconfig"
    "$HOME/.ssh/config"
    "$HOME/.vimrc"
    "$HOME/.tmux.conf"
    "$HOME/.inputrc"
    "$HOME/.alias"
    "$HOME/.functions"
)

# Filtrar apenas os que existem
EXISTING_FILES=()
for f in "${FILES[@]}"; do
    if [ -e "$f" ] || [ -L "$f" ]; then
        EXISTING_FILES+=("$f")
    fi
done

if [ ${#EXISTING_FILES[@]} -eq 0 ]; then
    show_error "Nenhum arquivo de dotfile encontrado para backup"
    exit 1
fi

DEST="$HOME/dotfiles-backup-$(date +%Y%m%d%H%M%S).tar.gz"

echo "Criando backup dos seguintes arquivos:"
printf '  %s\n' "${EXISTING_FILES[@]}"
echo "Destino: $DEST"

if tar czf "$DEST" "${EXISTING_FILES[@]}" 2>/dev/null; then
    echo "Backup concluído com sucesso em: $DEST"
    echo "Tamanho: $(du -h "$DEST" | cut -f1)"
else
    show_error "Falha ao criar o backup"
    exit 1
fi
