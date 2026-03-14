---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
---


# 🧠 Git Cheat Sheet

Um guia rápido com comandos úteis para versionamento Git.

## Configuração Inicial

```bash
# definir identidade
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# ver configurações atuais
git config --global --list
```

## Fluxos de Trabalho Básicos

```bash
# criar repositório
git init

# adicionar arquivos e commit
git add .
git commit -m "mensagem"

# histórico
git log --oneline --graph --decorate
```

## Branches

```bash
# listar
git branch -a

# criar + mudar
git checkout -b nova-branch

# mudar
git checkout nome-da-branch
```

## Trabalhando com o remoto

```bash
# adicionar remoto
git remote add origin git@github.com:usuario/repositorio.git

# alterar url
git remote set-url origin git@github.com:usuario/repositorio.git

# push e pull
git push -u origin main
git pull
```

## Stash e Recuperação

```bash
# guardar alterações sem commitar
git stash
# restaurar
git stash pop
```

## Rebase vs Merge

```bash
# rebase
git checkout feature
git rebase main

# voltar ao estado anterior (se algo deu errado)
git rebase --abort
```

## Reset, Revert e Cherry‑pick

```bash
# soft (mantém alterações)
git reset --soft HEAD~1

# hard (descarta alterações)
git reset --hard HEAD~1

# reverter commit específico
git revert <hash>

# pegar um commit de outra branch
git cherry-pick <hash>
```

## Tags

```bash
# listar tags
git tag

# criar tag
git tag -a v1.0 -m "release 1.0"

# enviar tags
git push origin --tags
```

## Submódulos

```bash
# adicionar
git submodule add git@github.com:usuario/outro-projeto.git

# atualizar
git submodule update --remote
```

> Consulte também o arquivo `utils/kit-versao.md` para comandos básicos e configuração SSH.

