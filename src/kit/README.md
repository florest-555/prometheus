# Kit de Sobrevivência

Coleção de utilitários e dicas para facilitar o dia a dia em um sistema Ubuntu/Linux, com foco em comandos rápidos e automações via shell.

## Estrutura do repositório

```
├── shell/                 # scripts de utilitários interativos
│   ├── kit.sh             # menu principal
│   ├── setup-github-ssh.sh# migrador para SSH no GitHub
│   ├── update-system.sh   # atualiza e limpa pacotes
│   ├── disk-usage.sh      # mostra espaço em disco
│   ├── network-tools.sh   # ping + speedtest
│   ├── backup-dotfiles.sh # backup simples de dotfiles
│   ├── git-helper.sh      # menu de comandos Git
│   ├── init-git-repo.sh   # assistente para inicializar repositório Git
│   └── system-info.sh     # exibe informações detalhadas do sistema
└── utils/                 # documentação em Markdown
    ├── kit-versao.md      # guia rápido de Git (versão inicial)
    ├── git-cheatsheet.md  # comandos Git avançados e fluxos
    ├── linux-commands.md  # comandos úteis do Linux
    └── git-init-guide.md  # guia detalhado de inicialização de repositório Git
```

## Como usar

1. Dê permissão de execução aos scripts (apenas uma vez). Alternativamente execute o instalador:
   ```bash
   bash shell/install.sh
   ```
2. Execute o menu principal:
   ```bash
   bash shell/kit.sh
   ```
3. Siga as instruções na tela.

Alguns scripts podem exigir `sudo` dependendo da ação.

## Documentação

Consulte os arquivos em `utils/` para ter exemplos e explicações de comandos de Git e Linux. Eles podem servir como base para copiar e colar em um terminal ou para referência rápida.

### Guias Disponíveis

- **kit-versao.md** - Guia rápido de Git (versão inicial)
- **git-cheatsheet.md** - Comandos Git avançados e fluxos
- **linux-commands.md** - Comandos úteis do Linux
- **git-init-guide.md** - Guia detalhado de inicialização de repositório Git
- **system-info-guide.md** - Guia de informações do sistema

## Contribuições

Adicione novos utilitários, aprimore os existentes ou expanda a documentação. Sinta‑se à vontade para abrir issues ou pull requests.

### Versionando seu próprio kit

1. Inicialize um repositório ou use o existente:
   ```bash
   git init
   git add .
   git commit -m "kit inicial"
   git remote add origin git@github.com:usuario/kit-sobrevivencia.git
   git push -u origin main
   ```
2. Use o `setup-github-ssh.sh` para migrar outros repositórios para SSH e evitar digitar senhas.

Você pode também criar tags, criar branches para experimentos ou copiar este repositório como um template.

