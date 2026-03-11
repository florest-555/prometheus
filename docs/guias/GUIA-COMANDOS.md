# Guia Completo de Comandos do Prometheus

> Proveniencia e Autoria: Este Documento integra o projeto Prometheus (licenca MIT-0).
> Ultima atualizacao: 28 de fevereiro de 2026

## Visao Geral

O Prometheus oferece diversos comandos para análise, diagnóstico e manutenção de projetos. Este guia detalha cada comando, suas opções e casos de uso.

**Requisitos:** Node.js >=24.12.0

## Indice de Comandos

1. [diagnosticar](#diagnosticar) - Analise completa do projeto
2. [guardian](#guardian) - Verificacao de integridade
3. [podar](#podar) - Remocao de arquivos orfaos
4. [reestruturar](#reestruturar) - Reorganizacao de estrutura
5. [formatar](#formatar) - Formatacao de codigo
6. [fix-types](#fix-types) - Correcao de tipos inseguros
7. [metricas](#metricas) - Visualizacao de metricas
8. [perf](#perf) - Analise de performance
9. [analistas](#analistas) - Catalogo de analistas
10. [otimizar-svg](#otimizar-svg) - Otimizacao de SVGs
11. [atualizar](#atualizar) - Atualizacao segura
12. [reverter](#reverter) - Reversion de mudancas
13. [licencas](#licencas) - Ferramentas de licenca
14. [names](#names) - Extracao de nomes
15. [rename](#rename) - Renomeacao em massa

---

## diagnosticar

Comando principal para análise completa do projeto.

### Uso Básico

```bash
prometheus diagnosticar
```

Durante a execução, o Prometheus exibe um indicador visual “🔎 Diagnóstico em execução...” para sinalizar processamento.

### Opções Principais

#### Modos de Execução

```bash
# Modo detalhado (mais informações)
prometheus diagnosticar --full

# Modo compacto (padrão): consolida progresso e mostra o essencial
prometheus diagnosticar --compact

# Modo executivo: apenas problemas críticos/alta prioridade
prometheus diagnosticar --executive

# Apenas varredura (não prepara AST, sem análise completa)
prometheus diagnosticar --scan-only
```

#### Formatos de Saída

```bash
# Saída JSON para ferramentas/automação
prometheus diagnosticar --json

# Exportar resumo/manifest
prometheus diagnosticar --export

# Exportar dump completo (fragmentado em shards)
prometheus diagnosticar --export-full

# JSON ASCII (compat legada)
prometheus diagnosticar --json-ascii
```

#### Filtros

```bash
# Incluir padrões
prometheus diagnosticar --include "src/**" --include "scripts/**"

# Excluir padrões
prometheus diagnosticar --exclude "**/*.test.*" --exclude "**/__tests__/**"

# Excluir testes rapidamente
prometheus diagnosticar --exclude-tests
```

#### Auto-Fix

```bash
# Ativar auto-fix
prometheus diagnosticar --auto-fix

# Modo conservador / agressivo / equilibrado
prometheus diagnosticar --auto-fix-mode conservative
prometheus diagnosticar --auto-fix-mode aggressive
prometheus diagnosticar --auto-fix-mode balanced

# Atalhos
prometheus diagnosticar --fix            # alias de --auto-fix
prometheus diagnosticar --fix-safe       # alias de --auto-fix --auto-fix-mode conservative

# Dry-run (preview sem modificar)
PROMETHEUS_ALLOW_MUTATE_FS=1 prometheus diagnosticar --auto-fix --dry-run
```

#### Timeout e Performance

```bash
# Modo rápido (menos checks)
prometheus diagnosticar --fast

# Confiar no compilador (reduz falsos positivos comuns)
prometheus diagnosticar --trust-compiler

# Verificar ciclos com heurística extra
prometheus diagnosticar --verify-cycles

# Ajustes de timeout via ambiente (por analista)
PROMETHEUS_ANALISE_TIMEOUT_POR_ANALISTA_MS=60000 prometheus diagnosticar
```

### Exemplos de Uso

```bash
# Padrão compacto com resumo útil
prometheus diagnosticar --compact

# Detalhado (inclui amostra maior e blocos completos)
prometheus diagnosticar --full

# Para CI/CD estruturado
prometheus diagnosticar --json --export

# Correção automática segura
PROMETHEUS_ALLOW_MUTATE_FS=1 prometheus diagnosticar --fix-safe --dry-run
```

---

## guardian

Verificação de integridade dos arquivos via hashes.

### Uso Básico

```bash
# Criar baseline inicial
prometheus guardian

# Verificar alterações
prometheus guardian --diff
```

### Opções

```bash
# Saída JSON
prometheus guardian --json

# Modo verbose
prometheus guardian --verbose

# Aceitar alterações como novo baseline
prometheus guardian --accept

# Forçar recriação do baseline
prometheus guardian --force
```

### Status de Retorno

- `ok` - Nenhuma alteração detectada
- `baseline-criado` - Baseline criado pela primeira vez
- `baseline-aceito` - Alterações aceitas como novo baseline
- `alteracoes-detectadas` - Arquivos modificados detectados
- `erro` - Erro durante verificação

### Exemplos

```bash
# Verificação rápida no CI
prometheus guardian --diff --json

# Criar baseline após mudanças válidas
prometheus guardian --accept

# Debug detalhado
prometheus guardian --diff --verbose
```

---

## podar

Remoção segura de arquivos órfãos (não referenciados).

### Uso Básico

```bash
# Dry-run (preview sem remover)
prometheus podar --dry-run

# Remoção efetiva
prometheus podar
```

### Opções

```bash
# Modo interativo (confirma cada arquivo)
prometheus podar --interactive

# Saída JSON
prometheus podar --json

# Verbose (mostrar análise detalhada)
prometheus podar --verbose
```

### Exemplos

```bash
# Análise de arquivos órfãos
prometheus podar --dry-run --verbose

# Limpeza automática
prometheus podar --json

# Limpeza com confirmação
prometheus podar --interactive
```

---

## metricas

Visualização de métricas e histórico agregado.

### Uso Básico

```bash
# Exibir métricas atuais
prometheus metricas

# Formato JSON
prometheus metricas --json
```

### Opções

```bash
# Exibir histórico
prometheus metricas --history

# Comparar com período anterior
prometheus metricas --compare

# Exportar para arquivo
prometheus metricas --export metricas.json
```

### Exemplos

```bash
# Dashboard de métricas
prometheus metricas --verbose

# Análise de tendências
prometheus metricas --history --json

# Comparação temporal
prometheus metricas --compare --full
```

---

## perf

Análise de performance e comparação de snapshots.

### Uso Básico

```bash
# Criar snapshot de performance
prometheus perf snapshot

# Comparar snapshots
prometheus perf compare
```

### Opções

```bash
# Comparar com baseline
prometheus perf compare --baseline

# Saída JSON
prometheus perf --json

# Limites personalizados
prometheus perf compare --threshold 10
```

### Exemplos

```bash
# Benchmark antes de mudanças
prometheus perf snapshot --name "antes-refactor"

# Benchmark depois e comparar
prometheus perf snapshot --name "depois-refactor"
prometheus perf compare antes-refactor depois-refactor

# Análise de regressão no CI
prometheus perf compare --baseline --json
```

---

## analistas

Listar e documentar analistas disponíveis.

### Uso Básico

```bash
# Listar todos os analistas
prometheus analistas

# Formato JSON
prometheus analistas --json
```

### Opções

```bash
# Gerar documentação
prometheus analistas --doc docs/ANALISTAS.md

# Mostrar apenas ativos
prometheus analistas --active-only

# Incluir metadados
prometheus analistas --full
```

### Exemplos

```bash
# Catálogo completo
prometheus analistas --full --json

# Documentação automática
prometheus analistas --doc docs/ANALISTAS-GERADO.md

# Debug de analistas
prometheus diagnosticar --listar-analistas
```

---

## fix-types

Correção interativa de tipos inseguros (any/unknown).

### Uso Básico

```bash
# Modo interativo
prometheus fix-types --interactive

# Auto-fix conservador
prometheus fix-types --auto-fix --auto-fix-mode conservative
```

### Opções

```bash
# Mostrar diff antes de aplicar
prometheus fix-types --show-diff

# Dry-run
prometheus fix-types --dry-run

# Validar sintaxe após correção
prometheus fix-types --validate-only

# Focar em tipo específico
prometheus fix-types --tipo any
prometheus fix-types --tipo unknown
```

### Exemplos

```bash
# Correção segura e interativa
prometheus fix-types --interactive --show-diff

# Correção automática de 'any'
prometheus fix-types --tipo any --auto-fix --dry-run

# Validação pós-correção
prometheus fix-types --validate-only
```

---

## reestruturar

Reorganização de estrutura do projeto com plano de moves.

### Uso Básico

```bash
# Ver plano sem aplicar
prometheus reestruturar --somente-plano

# Aplicar reestruturação
prometheus reestruturar --auto
```

### Opções

```bash
# Organização por domains
prometheus reestruturar --domains

# Organização flat
prometheus reestruturar --flat

# Usar preset específico
prometheus reestruturar --preset prometheus
prometheus reestruturar --preset node-community
prometheus reestruturar --preset ts-lib

# Override de categoria
prometheus reestruturar --categoria controller=handlers

# Filtros
prometheus reestruturar --include "src/**" --exclude "**/*.test.*"
```

### Exemplos

```bash
# Preview de reestruturação
prometheus reestruturar --somente-plano --verbose

# Aplicar com preset
prometheus reestruturar --preset prometheus --auto

# Reestruturar apenas uma pasta
prometheus reestruturar --include "src/old-module/**" --auto
```

---

## formatar

Aplica formatação de código com Prettier ou motor interno.

### Uso Básico

```bash
# Verificar formatação
prometheus formatar --check

# Aplicar formatação
prometheus formatar --write
```

### Opções

```bash
# Escolher motor
prometheus formatar --engine auto      # padrão (tenta Prettier, fallback interno)
prometheus formatar --engine prettier  # força Prettier
prometheus formatar --engine interno   # usa motor interno

# Filtros de arquivos
prometheus formatar --include "src/**/*.ts"
prometheus formatar --exclude "**/*.generated.*"
```

### Arquivos Suportados

- JavaScript/TypeScript: `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
- Markup: `.html`, `.xml`
- Estilos: `.css`
- Dados: `.json`, `.yaml`, `.yml`
- Documentação: `.md`, `.markdown`
- Outros: `.py`, `.php`

### Exemplos

```bash
# Verificar tudo antes de commit
prometheus formatar --check

# Formatar apenas arquivos TypeScript
prometheus formatar --write --include "**/*.ts"

# CI: verificar formatação
prometheus formatar --check || exit 1
```

---

## otimizar-svg

Otimiza arquivos SVG usando otimizador interno (compatível com svgo).

### Uso Básico

```bash
# Preview sem modificar
prometheus otimizar-svg --dry

# Aplicar otimizações
prometheus otimizar-svg --write
```

### Opções

```bash
# Diretório específico
prometheus otimizar-svg --dir assets/icons

# Filtros
prometheus otimizar-svg --include "**/*.svg"
prometheus otimizar-svg --exclude "**/node_modules/**"
```

### Exemplos

```bash
# Analisar potencial de otimização
prometheus otimizar-svg --dry --verbose

# Otimizar pasta de ícones
prometheus otimizar-svg --dir src/assets/icons --write

# Otimizar SVGs específicos
prometheus otimizar-svg --include "public/**/*.svg" --write
```

---

## atualizar

Atualiza o Prometheus com verificação de integridade prévia via Guardian.

### Uso Básico

```bash
# Atualização local
prometheus atualizar

# Atualização global
prometheus atualizar --global
```

### Fluxo de Execução

1. Executa análise do projeto
2. Verifica integridade via Guardian
3. Se OK, executa `npm install prometheus@latest`
4. Reporta sucesso/falha

### Exemplos

```bash
# Atualização segura
prometheus atualizar

# Se Guardian detectar alterações, primeiro aceite:
prometheus guardian --diff
prometheus guardian --accept-baseline
prometheus atualizar
```

---

## reverter

Gerencia o mapa de reversão para operações de reestruturação.

### Subcomandos

```bash
# Listar todos os moves registrados
prometheus reverter listar

# Reverter arquivo específico
prometheus reverter arquivo <caminho>

# Reverter move por ID
prometheus reverter move <id>

# Limpar histórico de reversão
prometheus reverter limpar
prometheus reverter limpar --force
```

### Exemplos

```bash
# Ver histórico de moves
prometheus reverter listar

# Reverter um arquivo movido
prometheus reverter arquivo src/new-location/file.ts

# Reverter move específico
prometheus reverter move abc123def

# Limpar tudo (cuidado!)
prometheus reverter limpar --force
```

---

## licencas

Ferramentas para gerenciamento de licencas e disclaimers.

### Uso Basico

```bash
# Escaneamento de licencas de dependencias
prometheus licencas scan

# Gerar arquivo de avisos de terceiros
prometheus licencas notices generate

# Adicionar disclaimer a arquivos markdown
prometheus licencas disclaimer add

# Verificar se todos os arquivos tem disclaimer
prometheus licencas disclaimer verify
```

### Opcoes

```bash
# Scan
prometheus licencas scan --root ./meu-projeto

# Notices
prometheus licencas notices generate --output THIRD-PARTY-NOTICES.md

# Disclaimer
prometheus licencas disclaimer add --dry-run
prometheus licencas disclaimer add --disclaimer-path docs/meu-aviso.md
```

### Exemplos

```bash
# Verificar licencas do projeto
prometheus licencas scan --json

# Gerar avisos de terceiros
prometheus licencas notices generate --root .

# Verificar disclaimers
prometheus licencas disclaimer verify
```

---

## names

Extrai nomes de variaveis e funcoes para mapeamento de traducao.

### Uso Basico

```bash
# Extrair todos os nomes
prometheus names
```

### Opcoes

```bash
# Formato JSON
prometheus names --json

# Include padrao
prometheus names --include "src/**/*.ts"

# Modo legado (gera names/name.txt tambem)
prometheus names --legacy
```

### Exemplos

```bash
# Gerar mapeamento de nomes
prometheus names --json > names.json

# Extrair de pasta especifica
prometheus names --include "src/utils/**/*.ts"
```

---

## rename

Aplica renomeacoes em massa baseadas em arquivos de mapeamento.

### Uso Basico

```bash
# Aplicar renomeacoes do names/
prometheus rename

# Renomear de arquivo especifico
prometheus rename --file meu-mapeamento.txt
```

### Opcoes

```bash
# Modo dry-run
prometheus rename --dry-run

# Forcar sobrescrita
prometheus rename --force
```

### Exemplos

```bash
# Preview de renomeacoes
prometheus rename --dry-run

# Aplicar renomeacoes
prometheus rename
```

---

## historico

Utilitarios globais para gerenciar o historico de interacoes do Prometheus.

### Flags

```bash
prometheus --historico         # Exibe resumo do historico
prometheus --limpar-historico  # Limpa o historico persistido
```

O historico e persistido em `~/.prometheus/history.json`. Cada execucao do CLI registra os argumentos usados.

## Variaveis de Ambiente Globais

Aplicam-se a todos os comandos:

```bash
# Performance
export WORKER_POOL_MAX_WORKERS=4
export WORKER_POOL_BATCH_SIZE=10
export WORKER_POOL_TIMEOUT_MS=30000

# Logs
export LOG_ESTRUTURADO=true
export REPORT_SILENCE_LOGS=true
export LOG_LEVEL=info

# Segurança
export SAFE_MODE=true
export ALLOW_PLUGINS=false
export ALLOW_EXEC=false

# Pontuação
export PONTUACAO_MODO=conservador
export PONTUACAO_FATOR_ESCALA=2.0
```

---

## Workflows Comuns

### Workflow de Desenvolvimento

```bash
# 1. Análise inicial
prometheus diagnosticar --verbose

# 2. Correção de tipos
prometheus fix-types --interactive

# 3. Verificação de integridade
prometheus guardian --diff

# 4. Limpeza de órfãos
prometheus podar --dry-run
prometheus podar

# 5. Análise final
prometheus diagnosticar --full --export relatorio-final.md
```

### Workflow de CI/CD

```bash
# 1. Build e análise
npm run build
prometheus diagnosticar --json --silence > diagnostico.json

# 2. Verificação de integridade
prometheus guardian --diff --json > guardian.json

# 3. Métricas
prometheus metricas --json > metricas.json

# 4. Análise de performance
prometheus perf compare --baseline --json > perf.json
```

### Workflow de Refatoração

```bash
# 1. Snapshot antes
prometheus perf snapshot --name "antes-refactor"
prometheus guardian

# 2. Fazer mudanças...

# 3. Análise após mudanças
prometheus diagnosticar --full
prometheus guardian --diff

# 4. Performance comparison
prometheus perf compare antes-refactor --json

# 5. Aceitar se OK
prometheus guardian --accept
```

---

## Troubleshooting

### Erro: "Comando nao encontrado"

```bash
# Recompilar
npm run build

# Usar caminho completo
node dist/bin/index.js diagnosticar

# Instalar globalmente
npm install -g .
```

### Erro: "Timeout de análise"

```bash
# Aumentar timeout
prometheus diagnosticar --timeout 120

# Via variável
export PROMETHEUS_ANALISE_TIMEOUT_POR_ANALISTA_MS=120000
prometheus diagnosticar
```

### Performance Lenta

```bash
# Reduzir workers
export WORKER_POOL_MAX_WORKERS=1
prometheus diagnosticar

# Restringir escopo
prometheus diagnosticar --include "src/**" --exclude "**/*.test.*"
```

---

## Referencias

- [README Principal](../README.md)
- [Sistema de Type Safety](TYPE-SAFETY-SYSTEM.md)
- [Filtros Include/Exclude](GUIA_FILTROS_PROMETHEUS.md)
- [Configuracao Local](CONFIGURAR-PROMETHEUS-LOCAL.md)

---

**Ultima atualizacao:** 28 de fevereiro de 2026
**Versao:** 0.4.0
