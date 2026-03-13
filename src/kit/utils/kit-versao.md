# 🔑 Guia rápido de Git (versão simplificada)

Este arquivo reúne os comandos mais usados para começar a trabalhar com Git e configurar
uma identidade. É uma versão enxuta; para um cheatsheet mais completo veja
`utils/git-cheatsheet.md`.

## Configuração de identidade

```bash
# definir usuário global
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# conferir
git config --global --list
```

## Configuração de SSH para GitHub/GitLab

```bash
# gerar chave (ed25519 recomendado)
ssh-keygen -t ed25519 -C "seu@email.com"

# adicionar ao agente
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# copiar público para plataforma
echo "Use o conteúdo de ~/.ssh/id_ed25519.pub"
```

## Reset e limpeza

```bash
# voltar um commit, mantendo alterações
git reset --soft HEAD~1

# voltar um commit, descartando alterações
git reset --hard HEAD~1

# voltar para commit específico
git reset --hard <commit_hash>
```

## Operações básicas

```bash
# iniciar repositório
git init

# adicionar e commitar
git add .
git commit -m "mensagem do commit"

# ver histórico
git log --oneline --graph --decorate
```

## Trabalhando com remotos

```bash
# adicionar remoto
git remote add origin git@github.com:usuario/repositorio.git

# alterar URL do remoto
git remote set-url origin git@github.com:usuario/repositorio.git

# primeiro push
git push -u origin main
```

## Outros comandos úteis

```bash
# listar branches
git branch -a

# criar nova branch
git checkout -b nova-branch

# trocar de branch
git checkout nome-da-branch

# stash (guardar/recuperar alterações)
git stash
git stash pop
```

---

> Para mais detalhes e comandos avançados, veja:
> - `utils/git-cheatsheet.md` (fluxos de trabalho, rebase, tags, submódulos)
> - `utils/linux-commands.md` (comandos Linux gerais)
> - scripts em `shell/`, por exemplo o menu `kit.sh`.

