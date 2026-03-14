# Agente IA (Autonomous Agent)

O Prometheus integra um sistema de Agente IA capaz de realizar tarefas complexas através de diálogos interativos ou comandos diretos.

## Visão Geral

O agente utiliza LLMs (Large Language Models) para entender intenções e executar ferramentas integradas. Ele pode ler arquivos, executar comandos shell, pesquisar na web e interagir com o repositório Git.

### Comandos Básicos

```bash
# Iniciar chat interativo
prometheus agent --interactive

# Usar um perfil de agente específico
prometheus agent --agent coder

# Definir provedor e modelo na linha de comando
prometheus agent --provider anthropic --model claude-3-sonnet
```

## Agentes Disponíveis

Os perfis de agentes são definidos na configuração e determinam o comportamento e ferramentas disponíveis:

- **default**: Assistente genérico e prestativo.
- **coder**: Especialista em programação com acesso a ferramentas de arquivo e shell.
- **researcher**: Focado em investigação e busca de informações.
- **fast**: Otimizado para respostas rápidas e diretas.

## Provedores Suportados

- **Ollama**: Para execução local.
- **OpenAI**: GPT-4, GPT-3.5, etc.
- **Anthropic**: Claude 3, Claude 2.1.
- **Gemini**: Google Gemini Pro.
- **Groq**: Inferência ultra-rápida.
- **DeepSeek**: Modelos especializados em chat e código.
