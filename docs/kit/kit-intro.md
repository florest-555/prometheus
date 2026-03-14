---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
---


# Kit de Sobrevivência

Este é o Kit de Sobrevivência do Prometheus - uma coleção de scripts e guias para tarefas comuns no dia a dia de um desenvolvedor.

## O que é o Kit?

O Kit é um conjunto de ferramentas utilities que ajuda em tarefas rotineiras de sistema, Git, rede e manutenção do ambiente de desenvolvimento.

## Como Usar

### Listar todos os scripts disponíveis

```bash
prometheus kit list
```

### Executar um script específico

```bash
prometheus kit run <script> [args...]
```

### Ver um guia

```bash
prometheus kit docs <guia>
```

### Menu interativo

```bash
prometheus kit
```

## Scripts Disponíveis

| Script | Descrição |
| ------ | ---------- |
| `kit` | Menu interativo principal |
| `update-system` | Atualiza e limpa pacotes do sistema |
| `disk-usage` | Mostra uso de disco e maiores diretórios |
| `network-tools` | Ferramentas de rede (ping, speedtest) |
| `backup-dotfiles` | Backup simples de dotfiles |
| `git-helper` | Menu interativo de comandos Git |
| `init-git-repo` | Assistente para iniciar repositório Git |
| `setup-github-ssh` | Configura SSH para GitHub |
| `system-info` | Informações detalhadas do sistema |
| `cleanup` | Limpeza de logs e cache do sistema |
| `docker-helper` | Gerenciamento de containers e imagens Docker |
| `port-manager` | Gerencia processos em portas (lsof) |

## Guias Disponíveis

| Guia | Descrição |
| ---- | ---------- |
| `kit-versao` | Guia rápido de Git (versão simplificada) |
| `git-cheatsheet` | Comandos Git avançados e fluxos |
| `linux-commands` | Comandos úteis do Linux |
| `git-init-guide` | Guia detalhado de inicialização de repositório Git |
| `system-info-guide` | Guia de informações do sistema |

## Requisitos

- Linux (Debian/Ubuntu)
- Bash 4+
- Git
- Pacotes comuns: `curl`, `wget`, `ssh`, `git`

## Executando Scripts Manualmente

Os scripts também podem ser executados diretamente:

```bash
bash dist/kit/shell/system-info.sh
bash dist/kit/shell/git-helper.sh
```

## Segurança

Por padrão, os scripts são executados em modo seguro. Para permitir execução de comandos:

```bash
export PROMETHEUS_ALLOW_EXEC=1
prometheus kit run system-info
```

---

Para mais detalhes, veja os guias individuais em `utils/` ou use `prometheus kit docs <guia>`.

