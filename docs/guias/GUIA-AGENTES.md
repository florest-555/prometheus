# Guia do Sistema de Agentes do Prometheus

> Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
> Última atualização: 10 de março de 2026

---

## Visão Geral

O sistema de agentes do Prometheus permite criar e gerenciar agentes de IA que podem executar tarefas, interagir com o sistema de arquivos, executar comandos e acessar a web. O sistema é baseado em um loop de conversação que integra com provedores de LLM (Large Language Models).

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Sistema de Agentes                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AgentLoop    │  │ ToolRegistry │  │ LLM Drivers  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │               │                   │               │
│  ┌──────┴──────┐  ┌────┴─────┐      ┌─────┴─────┐         │
│  │ Conversa    │  │ Ferramentas│     │ Provedores│         │
│  │ (Mensagens) │  │ (Tools)   │     │ (LLM)     │         │
│  └─────────────┘  └───────────┘     └───────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Comandos de Agentes

### 1. Listar Agentes Disponíveis

```bash
prometheus agent agents
```

**Saída padrão:**
```
Available agents:
  auto (dynamic selection)
  default, qwen, qwen-coder, coder, researcher, fast
```

### 2. Iniciar Chat Interativo

```bash
prometheus agent chat --agent <nome-do-agente> --session <id-da-sessao>
```

**Opções:**
- `-a, --agent <nome>`: Nome do agente a ser usado
- `-s, --session <id>`: ID da sessão para continuidade

**Exemplos:**
```bash
# Chat com agente padrão
prometheus agent chat

# Chat com agente específico
prometheus agent chat --agent coder

# Continuar sessão existente
prometheus agent chat --session abc123
```

### 3. Executar Prompt

Executa um prompt diretamente sem iniciar chat interativo.

```bash
prometheus agent run "<prompt>" --agent <nome-do-agente>
```

**Opções:**
- `-a, --agent <nome>`: Nome do agente (padrão: default)
- `-i, --image <caminho>`: Caminho para imagem (se suportado)

**Exemplos:**
```bash
# Executar prompt simples
prometheus agent run "Explique como funciona a função principal"

# Usar agente específico
prometheus agent run "Analise este código" --agent coder

# Com imagem
prometheus agent run "Descreva esta imagem" --image ./screenshot.png
```

### 4. Gerenciar Memória

O sistema de memória permite armazenar e recuperar dados entre sessões.

```bash
# Listar memória
prometheus agent memory list

# Definir valor
prometheus agent memory set --key <chave> --value <valor>

# Obter valor
prometheus agent memory get --key <chave>

# Deletar valor
prometheus agent memory delete --key <chave>
```

**Exemplos:**
```bash
# Armazenar contexto do projeto
prometheus agent memory set --key projeto_contexto --value "App React com TypeScript"

# Recuperar contexto
prometheus agent memory get --key projeto_contexto

# Deletar valor antigo
prometheus agent memory delete --key projeto_contexto
```

### 5. Gerenciar Sessões

```bash
# Listar sessões
prometheus agent sessions

# Listar sessões de um agente específico
prometheus agent sessions --agent coder
```

### 6. Configuração de Provedores

```bash
# Mostrar configuração atual
prometheus agent config show

# Definir chave de API
prometheus agent config set-key --provider <provedor> --key <chave-api>

# Listar provedores configurados
prometheus agent config providers
```

**Provedores suportados:**
- `anthropic` - Claude models
- `gemini` - Google Gemini
- `ollama` - Modelos locais via Ollama
- `openai` - GPT models

**Exemplos:**
```bash
# Configurar API key do OpenAI
prometheus agent config set-key --provider openai --key "sk-..."

# Configurar Ollama local
prometheus agent config set-key --provider ollama --key "localhost:11434"
```

### 7. Verificar Provedores LLM

```bash
prometheus agent llmcheck
```

Testa a conexão com os provedores LLM configurados.

### 8. TUI (Terminal User Interface)

```bash
prometheus agent tui
```

Lança a interface de usuário no terminal (em desenvolvimento).

---

## Ferramentas do Agente

O sistema de agentes inclui várias ferramentas que os agentes podem usar:

| Ferramenta | Descrição | Parâmetros |
|------------|-----------|------------|
| `file_read` | Lê o conteúdo de um arquivo | `path`: caminho do arquivo |
| `file_write` | Escreve conteúdo em um arquivo | `path`: caminho, `content`: conteúdo |
| `file_list` | Lista arquivos em um diretório | `path`: caminho, `recursive`: booleano |
| `shell_exec` | Executa comandos no shell | `command`: comando, `cwd`: diretório, `timeout`: segundos |
| `web_fetch` | Busca conteúdo de uma URL | `url`: URL |
| `web_search` | Busca na web | `query`: termo de busca, `limit`: número de resultados |
| `git_exec` | Executa comandos Git | `command`: comando git, `cwd`: diretório |
| `rag_index` | Indexa texto para RAG | `content`: texto, `metadata`: metadados |
| `rag_search` | Busca no banco de dados vetorial | `query`: termo de busca |

---

## Agentes Disponíveis

### 1. **auto** (Seleção Dinâmica)

- Seleciona automaticamente o agente mais apropriado baseado no contexto
- Ideal para uso geral

### 2. **default**

- Agente padrão para tarefas gerais
- Equilibrado em performance e capacidade

### 3. **coder** / **qwen-coder**

- Especializado em programação e código
- Ideal para revisão de código, geração de código e debug

### 4. **researcher**

- Especializado em pesquisa e análise
- Ideal para busca de informações e síntese de dados

### 5. **fast**

- Otimizado para respostas rápidas
- Ideal para tarefas simples e rápidas

---

## Exemplos de Uso

### Análise de Código com Agente

```bash
# Executar análise de código com agente coder
prometheus agent run "Analise o código em src/ e sugira melhorias de performance" --agent coder
```

### Gerenciamento de Projeto

```bash
# Iniciar chat para discussão sobre arquitetura
prometheus agent chat --agent researcher

# Na conversa, você pode:
# - Discutir decisões de arquitetura
# - Pedir explicações sobre padrões de código
# - Solicitar sugestões de refatoração
```

### Tarefa Automatizada

```bash
# Criar script para tarefa específica
prometheus agent run "Crie um script que organize os arquivos por extensão" --agent coder
```

### Integração com Git

```bash
# Analisar mudanças no Git
prometheus agent run "Analise as alterações no último commit" --agent researcher

# Executar comando Git
prometheus agent memory set --key last_commit --value "$(git log -1 --oneline)"
```

---

## Configuração de Agentes

### Modelo de Configuração

Os agentes podem ser configurados via arquivo de configuração ou variáveis de ambiente:

```json
{
  "agents": {
    "coder": {
      "name": "coder",
      "model": "gpt-4",
      "provider": "openai",
      "system_prompt": "Você é um assistente de programação especializado...",
      "tools": ["file_read", "file_write", "shell_exec", "git_exec"]
    }
  }
}
```

### Variáveis de Ambiente

```bash
# Provedor padrão
export AGENT_DEFAULT_PROVIDER=openai

# Modelo padrão
export AGENT_DEFAULT_MODEL=gpt-4

# Timeout de operações
export AGENT_OPERATION_TIMEOUT=30
```

---

## Integração com o Resto do Prometheus

O sistema de agentes está integrado com:

1. **Análise de Código**: Use agentes para analisar e melhorar código
2. **Guardian**: Verificação de integridade com contexto de IA
3. **Relatórios**: Geração de relatórios assistida por IA
4. **Documentação**: Criação e manutenção de docs

### Exemplo: Revisão de Diagnóstico

```bash
# Gerar diagnóstico
prometheus diagnosticar --json > diagnostic.json

# Usar agente para analisar resultados
prometheus agent run "Analise este diagnóstico e sugira ações prioritárias" --agent researcher < diagnostic.json
```

---

## Resolução de Problemas

### "Chave de API não encontrada"

```bash
# Configure a chave do provedor
prometheus agent config set-key --provider openai --key "sk-..."
```

### "Provedor não suportado"

Verifique os provedores disponíveis:
```bash
prometheus agent config providers
```

### "Timeout na execução"

Aumente o timeout:
```bash
export AGENT_OPERATION_TIMEOUT=60
prometheus agent run "tarefa longa"
```

---

## Melhores Práticas

1. **Sessões**: Use sessões para manter contexto em conversas longas
2. **Memória**: Armazene informações importantes na memória para reutilização
3. **Ferramentas**: Use ferramentas específicas para tarefas específicas
4. **Provedores**: Configure múltiplos provedores como fallback

---

## Referências

- [Guia de Início Rápido](GUIA-INICIO-RAPIDO.md)
- [Guia de Comandos](GUIA-COMANDOS.md)
- [Guia de Configuração](GUIA-CONFIGURACAO.md)

---

**Versão:** 0.4.0 | **Licença:** MIT-0
