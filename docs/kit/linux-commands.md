---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
---


# 🖥️ Comandos Linux Úteis

Pequeno manual com tarefas comuns no dia a dia de um usuário Debian/Ubuntu.

## Atualização de Pacotes

```bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y  # limpar pacotes não usados
```

O script `shell/update-system.sh` encapsula esses passos.

## Monitoramento de Recursos

```bash
htop               # processos em tempo real
top                # alternativa básica
free -h            # uso de memória
df -h              # uso de disco
du -h --max-depth=1 | sort -hr | head    # maiores diretórios
```

Várias opções estão disponíveis no menu principal (`shell/kit.sh`).

## Rede

```bash
ping -c 4 8.8.8.8          # verificar conectividade básica
traceroute example.com     # rastrear rota
telnet host port          # testar conexão TCP
```

O script `shell/network-tools.sh` roda um ping e um `speedtest-cli` quando presente.

## Cache e Memória

```bash
sudo sync && sudo sysctl -w vm.drop_caches=3  # liberar cache de páginas
```

## Disco e Arquivos

```bash
ls -lah           # listar incluindo arquivos ocultos
find . -name "*.log" -mtime +7   # buscar logs antigos
```

## Usuários e Permissões

```bash
sudo adduser nome
usermod -aG sudo nome   # adicionar a grupo sudo
du -sh /home/*          # ver espaço usado por usuário
```

## Sistema

```bash
systemctl list-units --type=service --state=running
systemctl reboot
systemctl hibernate
```

## Backups Rápidos

```bash
# arquivar configurações pessoais
tar czf ~/dotfiles.tar.gz ~/.bashrc ~/.profile ~/.ssh/config
```

O script `shell/backup-dotfiles.sh` automatiza esse backup com timestamp.

> Este guia é complementar ao `README.md` do projeto.

