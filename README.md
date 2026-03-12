<!--
> Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
> Nada aqui implica cessão de direitos morais/autorais.
> Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
> Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
-->

<img src="./img/prometheus.png" width="100%"/>

---

<div align="center">

# Prometheus CLI 🔥

</div>

---

## Status do Projeto

![Clones](https://kitsune-free.vercel.app/api/clones/florest-555/prometheus/badge.svg)
![Unique Clones](https://kitsune-free.vercel.app/api/unique-clones/florest-555/prometheus/badge.svg)
![Forks](https://kitsune-free.vercel.app/api/forks/florest-555/prometheus/badge.svg)
![Watchers](https://kitsune-free.vercel.app/api/watchers/florest-555/prometheus/badge.svg)

![analitico](https://kitsune-free.vercel.app/api/svg/badges/decorativos/badge-analitico.svg)
![colaborador](https://kitsune-free.vercel.app/api/svg/badges/decorativos/badge-colaborador.svg)

**Versao Atual:** 0.4.0 | **Node.js:** >=24.12.0 | **Licenca:** MIT-0

[![Stars](https://img.shields.io/github/stars/florest-555/prometheus?style=social)](https://github.com/florest-555/prometheus/stargazers)
[![Forks](https://img.shields.io/github/forks/florest-555/prometheus?style=social)](https://github.com/florest-555/prometheus/network/members)
[![Issues](https://img.shields.io/github/issues/florest-555/prometheus)](https://github.com/florest-555/prometheus/issues)
[![Contributors](https://img.shields.io/github/contributors/florest-555/prometheus)](https://github.com/florest-555/prometheus/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/florest-555/prometheus/blob/main/CONTRIBUTING.md)

## Demo Rapido

```bash
# Teste em 30 segundos sem instalar (requer Node.js 24+)
npx github:florest-555/prometheus diagnosticar --help
```

## Por que usar o Prometheus?

- [PERFORMANCE] **Performance**: Pool de workers para analise paralela de projetos grandes
- [SEGURANCA] **Seguranca**: Guardian verifica integridade de arquivos via hashing
- [METRICAS] **Metricas Inteligentes**: Pontuacao adaptativa baseada no tamanho do projeto
- [MULTI] **Multi-linguagem**: Suporte completo a JS/TS + suporte heuristico para tailwind/css/html/xml
- [I18N] **Internacionalizacao**: Suporte nativo a Portugues e Ingles para mensagens, logs e relatorios
- [MODULAR] **Modular**: Sistema de analistas extensivel com deteccao automatica de padroes
- [CI] **CI/CD Ready**: Outputs JSON estruturados e Workflows GitHub Actions integrados

---

Prometheus é uma CLI modular para analisar, diagnosticar e manter projetos (JS/TS e multi-stack leve). Entrega diagnósticos estruturais, verificação de integridade (Guardian), sugestão de reorganização e métricas — tudo com contratos JSON para CI.

---

> Nota de cobertura: Gate local transitório configurado em **70%** (por métrica) em `prometheus.config.json` para acelerar a adição incremental de testes. No **CI Principal** o gate é forçado para **90%** via variáveis de ambiente (`COVERAGE_GATE_*`). Arquivos listados em `scripts/coverage-exclude.json` serão reintegrados gradualmente.

## Instalacao e Primeiros Passos

### Instalacao Rapida

```bash
# Clone o repositório
git clone https://github.com/florest-555/prometheus.git
cd prometheus

# Instale dependências e compile
npm install
npm run build

# Primeiro teste - diagnóstico completo
node dist/bin/index.js diagnosticar --json
```

**Windows (PowerShell):**

```powershell
git clone https://github.com/florest-555/prometheus.git; cd prometheus; npm install; npm run build; node dist/bin/index.js diagnosticar --json
```

### Instalação Global (Opcional)

```bash
# Instala globalmente para usar em qualquer projeto
npm install -g .

# Agora você pode usar apenas 'prometheus' ao invés de 'node dist/bin/index.js'
prometheus diagnosticar --json
```

### Primeiro Uso - Comandos Essenciais

```bash
# Diagnóstico completo do projeto atual
prometheus diagnosticar

# Ver apenas problemas críticos (modo executivo)
prometheus diagnosticar --executive

# Análise rápida (apenas varredura, sem correções)
prometheus diagnosticar --scan-only

# Saída estruturada para CI/CD
prometheus diagnosticar --json

# Verificar integridade dos arquivos
prometheus guardian --diff
```

## Capacidades

- Diagnostico de padroes & estrutura (`diagnosticar`)
- Verificacao de integridade via hashes (`guardian`)
- Sugestao de reorganizacao segura (plano de reorganizacao)
- Poda de arquivos orfaos (`podar`)
- Relatorios & metricas agregadas (`metricas`)
- Pool de Workers (paralelizacao por arquivo)
- Internacionalizacao Completa (PT-BR/EN)
- Integracao GitHub (CI, CodeQL, Templates)
- Schema Versioning (compatibilidade backward)
- Pontuacao Adaptativa (tamanho do projeto)

---

### Principais Funcionalidades

O sistema de análise inclui uma vasta gama de analistas e detectores para uma cobertura completa do projeto:

| Categoria       | Analistas e Detectores                                                                                                                                                                                                                                                                                                                           |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquitetura** | `analista-estrutura`, `diagnostico-projeto`, `estrategista-estrutura`, `sinais-projeto-avancados`, `sinais-projeto`                                                                                                                                                                                                                              |
| **Correções**   | `analista-pontuacao`, `analista-quick-fixes`, `auto-fix-engine`, `corretor-estrutura`, `fix-alias-imports`, `fix-md-fences`, `mapa-reversao`, `poda`, `pontuacao-fix`, `reescrever-testes-aliases`                                                                                                                                               |
| **Detectores**  | `detector-arquetipos`, `detector-arquitetura`, `detector-codigo-fragil`, `detector-construcoes-sintaticas`, `detector-contexto-inteligente`, `detector-dependencias`, `detector-duplicacoes`, `detector-estrutura`, `detector-fantasmas`, `detector-interfaces-inline`, `detector-performance`, `detector-seguranca`, `detector-tipos-inseguros` |
| **JS/TS**       | `analista-comandos-cli`, `analista-funcoes-longas`, `analista-padroes-uso`, `analista-todo-comments`, `orquestrador-arquetipos`                                                                                                                                                                                                                  |
| **Plugins**     | `analista-css-in-js`, `analista-css`, `analista-formater`, `analista-html`, `analista-python`, `analista-react-hooks`, `analista-react`, `analista-svg`, `analista-tailwind`, `analista-xml`, `detector-documentacao`, `detector-markdown`, `detector-node`, `detector-qualidade-testes`, `detector-xml`                                         |

#### Pool de Workers (desde v0.2.0)

```bash
# Paralelização automática ativada por padrão
prometheus diagnosticar

# Configuração manual
WORKER_POOL_MAX_WORKERS=4 prometheus diagnosticar
```

#### Sistema de Supressão Inline

```typescript
// @prometheus-disable-next-line hardcoded-secrets
const apiKey = "development-key-only";
```

---

Benefícios gerais:

- Performance: redução de ~70% nos arquivos processados
- Compatibilidade: filtros explícitos continuam funcionando
- Segurança: evita análise acidental de dependências

## Flags Essenciais para Iniciantes

### Modos de Execucao

```bash
# Modo seguro (recomendado para começar)
prometheus diagnosticar --safe-mode

# Modo verbose (mais detalhes)
prometheus diagnosticar --verbose

# Modo silencioso (menos output)
prometheus diagnosticar --silence

# Apenas varredura (não executa correções)
prometheus diagnosticar --scan-only
```

### Saídas Diferentes

```bash
# Saída JSON para ferramentas/automação
prometheus diagnosticar --json

# Saída compacta (menos detalhes)
prometheus diagnosticar --compacto

# Modo executivo (apenas problemas críticos)
prometheus diagnosticar --executive

# Exportar relatório para arquivo
prometheus diagnosticar --export relatorio.md
```

### Debug e Desenvolvimento

```bash
# Modo debug (informações detalhadas)
prometheus diagnosticar --debug

# Ver apenas erros
prometheus diagnosticar --only-errors

# Timeout personalizado (em segundos)
prometheus diagnosticar --timeout 60
```

## Workflows de Desenvolvimento

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Compilar projeto
npm run build

# Executar testes
npm test

# Verificar cobertura
npm run coverage

# Executar lint e formatação
npm run lint
npm run format:fix
```

### CI/CD Básico

```bash
# Build e testes
npm run build
npm test

# Análise completa
prometheus diagnosticar --json

# Verificar integridade
prometheus guardian --diff --json

# Alterar idioma para inglês
PROMETHEUS_LANGUAGE=en prometheus diagnosticar
```

## Internacionalizacao (i18n)

O Prometheus agora é totalmente bilíngue! Você pode alternar entre Português (Brasil) e Inglês para todas as saídas (terminal, logs, relatórios).

### Configuração de Idioma

1.  **Via Configuração (`prometheus.config.json`):**
    ```json
    { "LANGUAGE": "en" }
    ```
2.  **Via Variável de Ambiente:**
    ```bash
    export PROMETHEUS_LANGUAGE=en
    ```

## Integracao GitHub

O repositório vem pronto para colaboração profissional:

- **Workflows**: CI (Build/Test/Lint), CodeQL (Segurança) e Stale/Dependabot.
- **Templates**: Modelos estruturados para Pull Requests e Bug Reports.
- **Governança**: Configuração de `CODEOWNERS` e `FUNDING`.

### Debug de Problemas

```bash
# Modo debug completo
prometheus diagnosticar --debug --verbose

# Apenas um tipo específico de análise
prometheus diagnosticar --include "src/**/*.ts" --debug

# Ver logs detalhados
DEBUG=* prometheus diagnosticar
```

## Troubleshooting Comum

### "Comando não encontrado"

```bash
# Verifique se está no diretório correto
pwd
ls -la dist/bin/

# Recompile o projeto
npm run build

# Use caminho completo
node ./dist/bin/index.js diagnosticar
```

### "Erro de permissão"

```bash
# No Linux/Mac
chmod +x dist/bin/index.js

# Ou use node diretamente
node dist/bin/index.js diagnosticar
```

### "Timeout de análise"

```bash
# Aumente o timeout
prometheus diagnosticar --timeout 120

# Ou via variável
PROMETHEUS_ANALISE_TIMEOUT_POR_ANALISTA_MS=60000 prometheus diagnosticar
```

### "Muitos arquivos analisados"

```bash
# Restrinja a análise
prometheus diagnosticar --include "src/**" --exclude "**/*.test.*"

# Use modo scan-only para preview
prometheus diagnosticar --scan-only
```

### "Problemas de performance"

```bash
# Reduza workers
WORKER_POOL_MAX_WORKERS=1 prometheus diagnosticar

# Use modo conservador
PONTUACAO_MODO=conservador prometheus diagnosticar
```

## 📚 Comandos Principais

| Comando        | Descrição                             | Uso Comum                                 |
| -------------- | ------------------------------------- | ----------------------------------------- |
| `diagnosticar` | Análise completa do projeto           | `prometheus diagnosticar --json`          |
| `guardian`     | Verificação de integridade            | `prometheus guardian --diff`              |
| `podar`        | Remoção segura de arquivos órfãos     | `prometheus podar --dry-run`              |
| `reestruturar` | Reorganização de estrutura do projeto | `prometheus reestruturar --somente-plano` |
| `formatar`     | Formatação de código                  | `prometheus formatar --write`             |
| `fix-types`    | Correção de tipos inseguros           | `prometheus fix-types --dry-run`          |
| `metricas`     | Visualizar métricas agregadas         | `prometheus metricas --json`              |
| `perf`         | Análise de performance                | `prometheus perf compare`                 |
| `analistas`    | Listar analistas disponíveis          | `prometheus analistas --json`             |
| `otimizar-svg` | Otimização de arquivos SVG            | `prometheus otimizar-svg --write`         |
| `atualizar`    | Atualização segura do Prometheus      | `prometheus atualizar`                    |
| `reverter`     | Reverter mudanças de reestruturação   | `prometheus reverter listar`              |
| `names`        | Extrair nomes para tradução           | `prometheus names`                        |
| `rename`       | Aplicar renomeação de variáveis       | `prometheus rename`                       |
| `agent`        | Sistema de agentes de IA              | `prometheus agent chat`                   |

## Sistema de Agentes

O Prometheus inclui um sistema de agentes de IA que permite criar, gerenciar e executar agentes para diversas tarefas:

```bash
# Listar agentes disponíveis
prometheus agent agents

# Iniciar chat interativo
prometheus agent chat --agent coder

# Executar um prompt
prometheus agent run "Analise este código" --agent researcher

# Gerenciar memória
prometheus agent memory set --key projeto --value "App React"
```

**Funcionalidades:**
- Agentes especializados (coder, researcher, fast, etc.)
- Ferramentas de sistema (file read/write, shell exec, git)
- Gerenciamento de sessões e memória
- Suporte a múltiplos provedores LLM (OpenAI, Anthropic, Ollama, Gemini)

Veja o [Guia de Agentes](docs/guias/GUIA-AGENTES.md) para mais detalhes.

---

## Testes

```bash
npm run format:fix; npm run lint; npm test
```

Cobertura local:

```bash
npm run coverage && npm run coverage:gate
```

Gate no CI: aplicado somente no workflow `CI Principal` com 90% (env). Documentação de timeout: `docs/TESTING-VITEST-TIMEOUT.md`.

## Filtros Include/Exclude (Controle o que analisar)

### Exemplos Práticos

```bash
# Analisar apenas arquivos TypeScript
prometheus diagnosticar --include "**/*.ts" --include "**/*.tsx"

# Analisar apenas uma pasta específica
prometheus diagnosticar --include "src/**/*"

# Excluir testes e documentação
prometheus diagnosticar --exclude "**/*.test.*" --exclude "**/*.spec.*" --exclude "docs/**"

# Analisar apenas arquivos modificados recentemente (git)
prometheus diagnosticar --include "$(git diff --name-only HEAD~1)"

# Misturar include e exclude
prometheus diagnosticar --include "src/**/*.ts" --exclude "src/**/*.test.ts"
```

### Regras Importantes

- **`--include` tem prioridade** sobre `--exclude` e ignores padrão
- **`node_modules` é ignorado por padrão** - use `--include "node_modules/**"` para analisá-lo
- **Grupos de include**: dentro do grupo é AND, entre grupos é OR
- **Padrões glob** seguem sintaxe minimatch

### Casos de Uso Comuns

```bash
# Apenas código fonte (excluindo testes e config)
prometheus diagnosticar --include "src/**" --include "lib/**" --exclude "**/*.test.*"

# Apenas arquivos JavaScript/TypeScript
prometheus diagnosticar --include "**/*.{js,ts,jsx,tsx,mjs,cjs}"

# Excluir diretórios comuns
prometheus diagnosticar --exclude "node_modules/**" --exclude "dist/**" --exclude ".git/**" --exclude "coverage/**"

# Análise focada em uma feature específica
prometheus diagnosticar --include "src/features/auth/**" --include "src/components/auth/**"
```

## Variaveis de Ambiente Essenciais

### Performance e Paralelização

```bash
# Número de workers (padrão: auto)
export WORKER_POOL_MAX_WORKERS=4

# Tamanho do lote de processamento
export WORKER_POOL_BATCH_SIZE=10

# Timeout por analista (30s padrão)
export WORKER_POOL_TIMEOUT_MS=30000
```

### Modo de Pontuação

```bash
# Modo: padrao, conservador, permissivo
export PONTUACAO_MODO=conservador

# Fator de escala personalizado
export PONTUACAO_FATOR_ESCALA=2.0

# Pesos para frameworks específicos
export PONTUACAO_PESO_FRAMEWORK=1.05
export PONTUACAO_PESO_TYPESCRIPT=1.03
```

### Logs e Debug

```bash
# Silenciar logs durante JSON
export REPORT_SILENCE_LOGS=true

# Logs estruturados
export LOG_ESTRUTURADO=true

# Modo de desenvolvimento
export DEV_MODE=true

# Idioma (pt-BR ou en)
export PROMETHEUS_LANGUAGE=en
```

### Configurações de Segurança

```bash
# Modo seguro (desabilita operações perigosas)
export SAFE_MODE=true

# Permitir plugins
export ALLOW_PLUGINS=false

# Permitir execução de comandos
export ALLOW_EXEC=false
```

### Exemplos de Uso

**Para desenvolvimento local:**

```bash
export DEV_MODE=true
export WORKER_POOL_MAX_WORKERS=2
export PONTUACAO_MODO=conservador
prometheus diagnosticar --verbose
```

**Para CI/CD:**

```bash
export SAFE_MODE=true
export REPORT_SILENCE_LOGS=true
export WORKER_POOL_MAX_WORKERS=4
prometheus diagnosticar --json
```

**Para análise rápida:**

```bash
export WORKER_POOL_MAX_WORKERS=1
export PONTUACAO_MODO=permissivo
prometheus diagnosticar --scan-only
```

## Comandos

- `diagnosticar` — analise completa do projeto
- `guardian` — baseline e diff de integridade
- `podar` — remocao segura de arquivos orfaos
- `reestruturar` — plano de reorganizacao de estrutura
- `formatar` — formatacao de codigo (Prettier/interno)
- `fix-types` — correcao automatica de tipos inseguros (any/unknown)
- `analistas` — catalogo de analistas (`--json`, `--doc`)
- `metricas` — historico agregado de metricas
- `perf` — snapshots e comparacao de performance
- `otimizar-svg` — otimizacao de arquivos SVG
- `atualizar` — atualizacao segura com verificacao de integridade
- `reverter` — gerenciamento de mapa de reversao para reestruturacao
- `licencas` — ferramentas de licenca e disclaimer
- `names` — extracao de nomes de variaveis para mapeamento
- `rename` — aplicacao de renomeacoes em massa

## Flags globais

- `--silence`, `--verbose`, `--export`, `--debug`, `--scan-only`, `--json`

## Linguagens Suportadas

- **Primário (AST Babel completo)**: `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
- **Analisadores Específicos**: `.html`, `.css`, `.xml`, `.svg`, `.md`
- **Heurístico/Leve**: `.kt`, `.kts`, `.java`, `.gradle`, `.py`, `.php`

*Nota: Analistas que dependem de nós Babel atuam apenas em linguagens suportadas pelo Babel; demais arquivos são processados por plugins específicos quando disponíveis.*

## Seguranca (Plugins)

- Whitelist de extensoes (`.js`, `.mjs`, `.cjs`, `.ts`)
- Sanitizacao de paths e validacao de globs

## Saida JSON (Politicas)

- Em `--json`, logs verbosos sao silenciados ate a emissao do objeto final
- Unicode fora do ASCII basico e escapado como `\uXXXX` (inclui pares substitutos para caracteres fora do BMP)
- Quando o Guardian nao e executado, retornos usam status padrao coerente (ex.: `"nao-verificado"`), mantendo o shape estavel

## Saida `guardian --json` (Resumo)

```json
{ "status": "ok|baseline-criado|baseline-aceito|alteracoes-detectadas|erro" }
```

## Configuracao

Os arquivos de configuração ficam na raiz do projeto e são carregados em tempo de execução.

### prometheus.config.json (principal)

Exemplo (trecho real):

```json
{
  "INCLUDE_EXCLUDE_RULES": {
    "globalExcludeGlob": [
      "node_modules/**",
      "**/node_modules/**",
      ".pnpm/**",
      "**/.prometheus/**",
      "dist/**",
      "**/dist/**",
      "coverage/**",
      "**/coverage/**",
      "build/**",
      "**/build/**",
      "**/*.log",
      "**/*.lock",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "**/.git/**",
      "preview-prometheus/**",
      "tests/fixtures/**"
    ],
    "globalInclude": [],
    "globalExclude": [],
    "dirRules": {},
    "defaultExcludes": null
  },
  "ESTRUTURA_ARQUIVOS_RAIZ_MAX": 50,
  "REPO_ARQUETIPO": "prometheus-self",
  "STRUCTURE_AUTO_FIX": false,
  "REPORT_EXPORT_ENABLED": false,
  "coverageGate": {
    "lines": 70,
    "functions": 70,
    "branches": 70,
    "statements": 70
  }
}
```

Campos úteis:

- INCLUDE_EXCLUDE_RULES: controle de include/exclude (globs)
- ESTRUTURA_ARQUIVOS_RAIZ_MAX: máximo de arquivos raiz exibidos
- REPO_ARQUETIPO: arquétipo base de referência
- STRUCTURE_AUTO_FIX: ativa técnicas mutáveis (off por padrão)
- coverageGate: limiares de cobertura por métrica (90%)

### prometheus.config.safe.json (modo seguro)

Exemplo (trecho real):

```json
{
  "SAFE_MODE": true,
  "ALLOW_PLUGINS": false,
  "ALLOW_EXEC": false,
  "ALLOW_MUTATE_FS": false,
  "STRUCTURE_AUTO_FIX": false,
  "REPORT_EXPORT_ENABLED": false,
  "PROMETHEUS_ALLOW_EXEC": 1,
  "PROMETHEUS_ANALISE_TIMEOUT_POR_ANALISTA_MS": 10000,
  "productionDefaults": {
    "NODE_ENV": "development",
    "PROMETHEUS_MAX_ANALYST_TIMEOUT_MS": 10000,
    "WORKER_POOL_MAX_WORKERS": 2,
    "WORKER_POOL_BATCH_SIZE": 10,
    "PROMETHEUS_WORKER_HEARTBEAT_MS": 5000,
    "LOG_ESTRUTURADO": false,
    "REPORT_SILENCE_LOGS": true
  }
}
```


Recomendações:

- Mantenha SAFE_MODE habilitado em CI e ambientes compartilhados
- Ajuste productionDefaults para limitar workers/silenciar logs em pipelines

### prometheus.repo.arquetipo.json (perfil do repositório)

Exemplo (trecho real):

```json
{
  "arquetipoOficial": "cli-modular",
  "descricao": "Projeto personalizado: prometheus",
  "estruturaPersonalizada": {
    "arquivosChave": [
      "eslint.config.js",
      "package.json",
      "README.md",
      "tmp-debug-e2e.js",
      "vitest.config.ts"
    ],
    "diretorios": [
      ".husky",
      ".husky/_",
      ".vscode",
      "docs",
      "docs/branches",
      "docs/features",
      "docs/partials",
      "docs/perf",
      "docs/tests",
      "scripts",
      "src",
      "src/@types",
      "src/analistas",
      "src/arquitetos",
      "src/bin",
      "src/cli",
      "src/guardian",
      "src/nucleo",
      "src/relatorios",
      "src/tipos",
      "src/zeladores",
      "temp-fantasma",
      "temp-fantasma/src",
      "tests",
      "tests/analistas",
      "tests/arquitetos",
      "tests/cli",
      "tests/guardian",
      "tests/nucleo",
      "tests/raiz",
      "tests/relatorios",
      "tests/tipos",
      "tests/tmp",
      "tests/zeladores"
    ],
    "padroesNomenclatura": { "tests": "*.test.*" }
  },
  "melhoresPraticas": {
    "evitar": ["temp/", "cache/", "*.log"],
    "notas": [
      "Mantenha código fonte organizado em src/",
      "Separe testes em pasta dedicada",
      "Documente APIs e funcionalidades importantes"
    ],
    "recomendado": ["src/", "tests/", "docs/", "README.md", ".env.example"]
  },
  "metadata": { "criadoEm": "2025-09-06T22:15:41.078Z", "versao": "1.0.0" },
  "nome": "prometheus"
}
```

Dicas:

- Ajuste “diretorios” para refletir o layout real do seu repositório
- Use “arquivosChave” para reforçar detecção de estrutura
- “arquetipoOficial” ajuda comparações e drift na detecção

### Variáveis de ambiente (.env)

Você pode configurar o Prometheus via variáveis de ambiente (úteis para CI e ajustes locais). Um arquivo de exemplo está disponível em `.env.example`.

Principais variáveis:

- Pool de Workers:
  - `WORKER_POOL_ENABLED` (true|false)
  - `WORKER_POOL_MAX_WORKERS` (número ou `auto`)
  - `WORKER_POOL_BATCH_SIZE` (número)
  - `WORKER_POOL_TIMEOUT_MS` (ms por analista; padrão 30000)
  - `PROMETHEUS_WORKER_HEARTBEAT_MS` (ms; batimento do worker)
- Tempo de análise:
  - `PROMETHEUS_ANALISE_TIMEOUT_POR_ANALISTA_MS` (ms)
  - `PROMETHEUS_MAX_ANALYST_TIMEOUT_MS` (ms; alias compatível)
- Pontuação Adaptativa:
  - `PONTUACAO_MODO` (padrao|conservador|permissivo)
  - `PONTUACAO_FATOR_ESCALA` (override numérico)
  - `PONTUACAO_PESO_FRAMEWORK` (ex.: 1.05)
  - `PONTUACAO_PESO_TYPESCRIPT` (ex.: 1.03)
- Logs/JSON:
  - `REPORT_SILENCE_LOGS` (silenciar logs ao montar JSON)
  - `LOG_ESTRUTURADO` (true|false)
- Gate de Cobertura (CI vs local):
  - Local: valores do `coverageGate` (70% transitório)
  - CI Principal: override via `COVERAGE_GATE_LINES/FUNCTIONS/BRANCHES/STATEMENTS=90`

Exemplos rápidos:

```bash
# Bash / Linux / macOS
export WORKER_POOL_MAX_WORKERS=4
export PONTUACAO_MODO=conservador
export COVERAGE_GATE_LINES=90
prometheus diagnosticar --json
```

```powershell
# Windows PowerShell
$env:WORKER_POOL_MAX_WORKERS = 4
$env:PONTUACAO_MODO = "conservador"
$env:COVERAGE_GATE_LINES = 90
prometheus diagnosticar --json
```

## Leituras Adicionais

- [Documentacao Completa](docs/README.md)
- [Guia de Inicio Rapido](docs/guias/GUIA-INICIO-RAPIDO.md)
- [Guia de Comandos](docs/guias/GUIA-COMANDOS.md)
- [Guia de Configuracao](docs/guias/GUIA-CONFIGURACAO.md)
- [Guia de Agentes](docs/guias/GUIA-AGENTES.md)
- [Sistema de Seguranca](docs/arquitetura/SEGURANCA.md)
- [Type Safety](docs/arquitetura/TYPE-SAFETY.md)
- [Novidades v0.3.0](docs/releases/v0.3.0.md)
- [Novidades v0.2.0](docs/releases/v0.2.0.md)

---

## Licenca

 ![MIT-0](https://kitsune-free.vercel.app/api/svg/badges/info/badge-license-mit.svg)

 Avisos de terceiros: **THIRD-PARTY-NOTICES.txt**.

<img align="right" src="./img/fenix.png" width="90" height="90"/>
# prometheus

# prometheus
