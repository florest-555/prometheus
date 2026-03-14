#!/bin/bash
# cleanup.sh - Limpeza de sistema e busca por arquivos grandes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

while true; do
    clear
    header "Limpeza e Otimização"
    echo "1)  Localizar 10 maiores arquivos no diretório atual"
    echo "2)  Limpar cache do APT (sudo apt clean)"
    echo "3)  Remover pacotes não mais necessários (sudo apt autoremove)"
    echo "4)  Limpar logs antigos do Journal (manter apenas 100M)"
    echo "5)  Listar arquivos maiores que 100MB em /home"
    echo "6)  Limpar lixeira"
    echo "7)  Sair"
    echo "------------------------------------------------------"
    read -p "Escolha: " opt

    case $opt in
        1) 
            header "10 Maiores Arquivos (.)"
            du -ah . 2>/dev/null | sort -rh | head -n 10
            wait_key ;;
        2) 
            check_sudo && sudo apt clean && info "Cache do APT limpo."
            wait_key ;;
        3) 
            check_sudo && sudo apt autoremove -y && info "Pacotes desnecessários removidos."
            wait_key ;;
        4) 
            if command_exists journalctl; then
                check_sudo && sudo journalctl --vacuum-size=100M && info "Logs reduzidos."
            else
                error "journalctl não disponível."
            fi
            wait_key ;;
        5) 
            header "Arquivos > 100MB em $HOME"
            find "$HOME" -type f -size +100M -exec ls -lh {} + 2>/dev/null | awk '{ print $5, $9 }' | sort -rh
            wait_key ;;
        6) 
            warn "Limpando lixeira..."
            rm -rf "$HOME/.local/share/Trash/*" && info "Lixeira limpa."
            wait_key ;;
        7) break ;;
        *) warn "Opção inválida!"; sleep 1 ;;
    esac
done
