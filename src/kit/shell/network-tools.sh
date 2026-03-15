#!/bin/bash
# network-tools.sh - Utilitários de rede

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/utils.sh" ] && source "$SCRIPT_DIR/utils.sh"

if ! command_exists ping; then
  error "ping não disponível. Instale: sudo apt install iputils-ping"
  exit 1
fi

header() {
  echo -e "\n${BLUE}══════════════════════════════════════════════════════${NC}"
  echo -e "  ${BLUE}$1${NC}"
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
}

while true; do
  clear
  header "Ferramentas de Rede"
  echo "1)  Testar conectividade (ping 8.8.8.8)"
  echo "2)  Testar DNS (ping google.com)"
  echo "3)  Ver interfaces de rede"
  echo "4)  Ver portas abertas (ss -tuln)"
  echo "5)  Ver conexões ativas (netstat/ss)"
  echo "6)  Teste de velocidade (speedtest)"
  echo "7)  traceroute para um host"
  echo "8)  Ver hostname e IPs"
  echo "9)  Testar porta específica (nc)"
  echo "10) Whois em domínio"
  echo "11) Sair"
  echo "------------------------------------------------------"
  read -p "Escolha: " opt

  case $opt in
    1)
    header "Testando conectividade"
    ping -c 4 8.8.8.8
    wait_key
    ;;
    2)
    header "Testando DNS"
    ping -c 4 google.com
    wait_key
    ;;
    3)
    header "Interfaces de Rede"
    if command_exists ip; then
      ip addr show
    elif command_exists ifconfig; then
      ifconfig -a
    else
      error "ip ou ifconfig não disponível"
    fi
    wait_key
    ;;
    4)
    header "Portas Abertas"
    if command_exists ss; then
      ss -tuln | head -20
    elif command_exists netstat; then
      netstat -tuln | head -20
    else
      error "ss ou netstat não disponível"
    fi
    wait_key
    ;;
    5)
    header "Conexões Ativas"
    if command_exists ss; then
      ss -tan | head -20
    elif command_exists netstat; then
      netstat -tan | head -20
    fi
    wait_key
    ;;
    6)
    header "Teste de Velocidade"
    if command_exists speedtest-cli; then
      speedtest-cli --simple
    elif command_exists curl; then
      echo "Instalando speedtest-cli temporariamente..."
      pip install speedtest-cli 2>/dev/null || sudo apt install -y speedtest-cli 2>/dev/null
      if command_exists speedtest-cli; then
        speedtest-cli --simple
      else
        error "Não foi possível instalar speedtest-cli"
      fi
    else
      error "curl não disponível para instalar speedtest"
    fi
    wait_key
    ;;
    7)
    read -p "Host para traceroute: " host
    if [ -n "$host" ]; then
      header "Traceroute para $host"
      if command_exists traceroute; then
        traceroute -m 15 "$host"
      elif command_exists tracepath; then
        tracepath "$host"
      else
        error "traceroute não disponível"
      fi
    fi
    wait_key
    ;;
    8)
    header "Hostname e IPs"
    echo -e "  ${BLUE}Hostname:${NC} $(hostname)"
    echo -e "  ${BLUE}IP Local:${NC} $(hostname -I | awk '{print $1}')"
    if command_exists curl; then
      echo -e "  ${BLUE}IP Público:${NC} $(curl -s ifconfig.me 2>/dev/null || echo 'indisponível')"
    fi
    echo -e "  ${BLUE}Gateway:${NC} $(ip route | grep default | awk '{print $3}' 2>/dev/null || echo 'N/A')"
    wait_key
    ;;
    9)
    read -p "Host: " host
    read -p "Porta: " port
    if [ -n "$host" ] && [ -n "$port" ]; then
      header "Testando $host:$port"
      if command_exists nc; then
        nc -zv -w 5 "$host" "$port" 2>&1
      elif command_exists timeout; then
        timeout 3 bash -c "echo > /dev/tcp/$host/$port" 2>&1 && info "Porta aberta" || error "Porta fechada/timeout"
      else
        error "nc não disponível"
      fi
    fi
    wait_key
    ;;
    10)
    read -p "Domínio para Whois: " domain
    if [ -n "$domain" ]; then
      header "Whois $domain"
      if command_exists whois; then
        whois "$domain" | head -30
      else
        error "whois não disponível. Instale: sudo apt install whois"
      fi
    fi
    wait_key
    ;;
    11)
    info "Saindo..."
    break
    ;;
    *)
    warn "Opção inválida"
    sleep 1
    ;;
  esac
done
