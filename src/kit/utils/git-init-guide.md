# 🚀 Guia de Inicialização de Repositório Git

Este guia explica como usar o script `init-git-repo.sh` para configurar rapidamente um repositório Git com identidade e remote opcional.

## O que o script faz

1. Verifica se o diretório atual já é um repositório Git
2. Se não for, inicializa um novo repositório com `git init`
3. Configura identidade global (nome e email) se ainda não estiver definida
4. Pergunta se você deseja adicionar um remote (opcional)
5. Fornece instruções para o primeiro commit e push

## Como usar

### Via menu principal do Kit

1. Execute o menu principal:
   ```bash
   bash shell/kit.sh
   ```
2. Escolha a opção **11) Inicializar repositório Git**

### Diretamente com o script

```bash
bash shell/init-git-repo.sh
```

## Fluxo de trabalho recomendado

Após executar o script:

1. Adicione seus arquivos:
   ```bash
   git add .
   ```

2. Faça o primeiro commit:
   ```bash
   git commit -m "Initial commit"
   ```

3. Se você configurou um remote, faça o push:
   ```bash
   git push -u origin main
   ```

## Personalização

O script usa configurações globais do Git. Para configurações específicas por repositório, remova a flag `--global`:

```bash
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

## Solução de problemas

- **Erro de permissão**: Certifique-se de que o script tem permissão de execução:
  ```bash
  chmod +x shell/init-git-repo.sh
  ```

- **Já é um repositório**: O script detectará isso e não fará nada além de mostrar as configurações atuais.

- **Remote já existe**: Se você já tem um remote chamado `origin`, o script não o substituirá. Você pode alterá-lo manualmente com:
  ```bash
  git remote set-url origin <nova-url>
  ```