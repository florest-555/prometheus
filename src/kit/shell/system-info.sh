#!/bin/bash
# system-info.sh - Exibe informações detalhadas do sistema

echo "--- .!. Informações do Sistema .!. ---"
echo ""

echo "📋 Distribuição:"
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "   Nome: $PRETTY_NAME"
    echo "   Versão: $VERSION_ID"
    echo "   Codinome: $VERSION_CODENAME"
else
    echo "   Não foi possível determinar a distribuição"
fi

echo ""
echo "🐂 Kernel:"
echo "   Versão: $(uname -r)"
echo "   Arquitetura: $(uname -m)"

echo ""
echo "💻 Hardware:"
echo "   Modelo: $(lscpu | grep 'Model name' | cut -d: -f2 | xargs)"
echo "   Núcleos: $(nproc)"
echo "   Memória Total: $(free -h | grep Mem | awk '{print $2}')"

echo ""
echo "💾 Disco:"
echo "   Uso raiz: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo "   Partições:"
df -hT | grep -E '^/dev/' | while read line; do
    echo "   $line"
done

echo ""
echo "🌐 Rede:"
echo "   Hostname: $(hostname)"
echo "   IP Principal: $(hostname -I | awk '{print $1}')"
echo "   Interfaces:"
ip -brief address show | grep -v 'LOOPBACK' | while read line; do
    echo "   $line"
done

echo ""
echo "⏰ Uptime:"
echo "   $(uptime -p)"

echo ""
echo "📦 Pacotes (apt):"
echo "   Instalados: $(dpkg -l | grep -c '^ii')"
echo "   Atualizáveis: $(apt list --upgradable 2>/dev/null | grep -c '/' || echo '0')"

echo ""
echo "--- .!. Fim das Informações .!. ---"