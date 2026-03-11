---
Proveniencia e Autoria: Este documento integra o projeto Prometheus (licenca MIT-0).
Nada aqui implica cessao de direitos morais/autorais.
Conteudos de terceiros nao licenciados de forma compativel nao devem ser incluidos.
Referencias a materiais externos devem ser linkadas e reescritas com palavras proprias.
---

# Roadmap e Melhorias Futuras

## Prioridade Imediata (curto prazo)

- [ ] **Eliminacao de Silent Catches**: substituir `catch {}` em fluxos principais por tratamento minimo (debug/metrica), sem ruido para usuario final.
- [ ] **Tipagem do Cache Global**: remover dependencias de `globalThis as any` com estrutura tipada e ownership claro.
- [ ] **Regras de Falso Positivo (Feedback)**: incorporar ajustes de heuristica registrados em `docs/planos/feedback.md`.

## Prioridade Media

- [ ] **Observabilidade Granular**: eventos de inicio/fim por analista no executor para progresso detalhado.
- [ ] **Deduplicacao de Logica de Saida**: centralizar formatacao de tabelas/blocos de log em utilitario interno.
- [ ] **Extensibilidade via Plugins**: permitir carregamento de analistas externos com contrato estavel.

## Prioridade Estrategica (longo prazo)

- [ ] **Sanitizacao de Caminhos**: componente central para validar caminhos e bloquear path traversal.
- [ ] **Auditoria de Dependencias no Diagnostico**: integrar verificacao de vulnerabilidades ao fluxo da CLI.
- [ ] **Suporte a Parsers de Alta Performance**: avaliar `swc`/`oxc` para casos de analise simplificada.

## Itens Ja Atendidos

- [x] `CONTRIBUTING.md` presente.
- [x] `SECURITY.md` presente.

## Sequencia Recomendada

1. Resolver backlog de qualidade interna (silent catches + tipagem global).
2. Aplicar melhorias de heuristica do feedback para reduzir falso positivo.
3. Avancar em observabilidade e arquitetura de plugins.
4. Endurecer seguranca e performance de parser em paralelo com maturidade do projeto.
