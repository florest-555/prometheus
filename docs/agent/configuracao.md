# Configuração do Agente

O Agente IA utiliza um arquivo de configuração centralizado no formato TOML.

## Localização

O arquivo é carregado de:
`~/.config/egocentric/config.toml`

## Estrutura do Arquivo

```toml
[providers.ollama]
base_url = "http://localhost:11434"
model = "qwen2.5:3b"

[providers.openai]
api_key = "sua-chave-aqui"
model = "gpt-4-turbo"

[agents.coder]
name = "Coder Assistant"
model = "claude-3-sonnet"
provider = "anthropic"
system_prompt = "Você é um engenheiro de software sênior."
tools = ["file_read", "file_write", "shell_exec"]

[defaults]
provider = "ollama"
model = "qwen2.5:3b"
agent = "default"

[performance]
max_iterations = 8
max_tokens = 1024
temperature = 0.4
```

## Ferramentas Disponíveis

| Ferramenta | Descrição |
| :--- | :--- |
| `file_read` | Lê o conteúdo de um arquivo |
| `file_write` | Escreve conteúdo em um arquivo |
| `file_list` | Lista arquivos em um diretório |
| `shell_exec` | Executa um comando shell |
| `git_exec` | Executa um comando Git |
| `web_fetch` | Busca conteúdo de uma URL |
| `web_search` | Pesquisa na web (se configurado) |
