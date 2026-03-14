#!/bin/bash
# system-info.sh - Exibe informações detalhadas do sistema

# caminho do diretório do script para chamar os utilitários
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Carrega utilitários comuns
if [ -f "$SCRIPT_DIR/utils.sh" ]; then
  source "$SCRIPT_DIR/utils.sh"
fi

header "Informações do Sistema"

echo -e "${BLUE}[LIST] Distribuição:${NC}"
if [ -f /etc/os-release ]; then
  . /etc/os-release
  echo "   Nome: $PRETTY_NAME"
  echo "   Versão: $VERSION_ID ($VERSION_CODENAME)"
else
  echo "   Não foi possível determinar a distribuição"
fi

echo -e "\n${BLUE}[KERN] Kernel:${NC}"
echo "   Versão: $(uname -r)"
echo "   Arquitetura: $(uname -m)"

echo -e "\n${BLUE}[HW] Hardware:${NC}"
echo "   CPUs: $(lscpu | grep 'Model name' | cut -d: -f2 | xargs) ($(nproc) núcleos)"
echo "   Memória: $(free -h | grep Mem | awk '{print "Total: " $2 ", Usado: " $3 ", Livre: " $4}')"

echo -e "\n${BLUE}[DISK] Disco:${NC}"
echo "   Uso raiz: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo "   Partições Principais:"
df -hT | grep -E '^/dev/(sd|nvme|mapper)' | awk '{printf "   %-12s %-6s %-6s %-6s %s\n", $1, $2, $3, $5, $7}'

echo -e "\n${BLUE}[NET] Rede:${NC}"
echo "   Hostname: $(hostname)"
echo "   IP Local: $(hostname -I | awk '{print $1}')"
if command_exists curl; then
  echo "   IP Público: $(curl -s https://ifconfig.me || echo 'Erro ao obter')"
fi

echo -e "\n${BLUE}⏰ Status:${NC}"
echo "   Uptime: $(uptime -p)"
if [ -f /var/run/reboot-required ]; then
  warn "REINICIALIZAÇÃO NECESSÁRIA!"
else
  info "Sistema atualizado (sem necessidade de reboot)"
fi

echo -e "\n${BLUE}[PKG] Pacotes (apt):${NC}"
echo "   Instalados: $(dpkg -l | grep -c '^ii')"
echo "   Atualizáveis: $(apt list --upgradable 2>/dev/null | grep -c '/' || echo '0')"

echo -e "\n${BLUE}[PORT] Portas em Escuta (Principais):${NC}"
if command_exists ss; then
  ss -tulpn | grep LISTEN | head -n 10 | awk '{print "   " $5 " -> " $1}'
else
  echo "   Comando 'ss' não encontrado."
fi

header "Fim das Informações"
