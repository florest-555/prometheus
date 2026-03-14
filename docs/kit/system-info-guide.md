---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
---


# [STATS] Guia de Informações do Sistema

Este guia explica como usar o script `system-info.sh` para obter informações detalhadas sobre seu sistema Linux.

## O que o script exibe

O script `system-info.sh` fornece uma visão abrangente do seu sistema, incluindo:

1. **Distribuição** - Nome, versão e codinome do Linux
2. **Kernel** - Versão e arquitetura
3. **Hardware** - Modelo da CPU, número de núcleos e memória total
4. **Disco** - Uso da partição raiz e lista de todas as partições
5. **Rede** - Hostname, IP principal e interfaces de rede ativas
6. **Uptime** - Tempo desde a última inicialização
7. **Pacotes** - Número de pacotes instalados e atualizáveis (apt)

## Como usar

### Via menu principal do Kit

1. Execute o menu principal:
   ```bash
   bash shell/kit.sh
   ```
2. Escolha a opção **12) Informações do sistema**

### Diretamente com o script

```bash
bash shell/system-info.sh
```

## Exemplos de uso

### Verificar apenas a memória

```bash
free -h
```

### Verificar uso de disco detalhado

```bash
df -hT
```

### Verificar interfaces de rede

```bash
ip -brief address show
```

### Verificar processos em tempo real

```bash
htop
```

## Personalização

Você pode adaptar o script para suas necessidades específicas:

### Adicionar informações de temperatura

```bash
# Adicione esta seção após a seção de hardware
echo ""
echo "️ Temperatura:"
if command -v sensors &>/dev/null; then
    sensors | grep -E 'Core|temp' | head -5
else
    echo "   Instale lm-sensors para ver temperaturas: sudo apt install lm-sensors"
fi
```

### Adicionar informações de bateria (para laptops)

```bash
# Adicione esta seção após a seção de uptime
echo ""
echo " Bateria:"
if [ -d /sys/class/power_supply/BAT0 ]; then
    cat /sys/class/power_supply/BAT0/capacity
    echo "%"
else
    echo "   Não é um sistema portátil ou bateria não detectada"
fi
```

## Solução de problemas

- **Comando não encontrado**: Certifique-se de que os comandos utilizados estejam instalados (htop, lscpu, etc.)
- **Permissões negadas**: Alguns comandos podem requerer sudo para informações completas
- **Saída vazia**: Verifique se o hardware suporta a consulta (por exemplo, sensores de temperatura)

## Integração com outros scripts do Kit

As informações obtidas pelo `system-info.sh` podem ser úteis para:
- Decidir quando atualizar o sistema (ver pacotes atualizáveis)
- Identificar problemas de desempenho (ver uso de memória/CPU)
- Planejar upgrades de hardware (ver capacidade atual)
- Solucionar problemas de rede (ver interfaces e IPs)

