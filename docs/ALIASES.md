---
Proveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).
Nada aqui implica cessão de direitos morais/autorais.
Conteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.
Referências a materiais externos devem ser linkadas e reescritas com palavras próprias.
---

# Sistema de Aliases do i-c-l-org

> **ARQUIVO GERADO AUTOMATICAMENTE**
> Use `npm run sync-aliases` para atualizar

## Visão Geral

O i-c-l-org utiliza um sistema centralizado de aliases TypeScript para simplificar imports e manter consistência em todo o projeto.

## Aliases Disponíveis

## Como Usar

### Em Arquivos TypeScript

```typescript
// [OK] Correto - usar aliases
import { executar } from '@nucleo/executor';
import { analisarPadroes } from '@analistas/javascript-typescript/analista-padroes-uso';
import { salvarEstado } from '@shared/persistence/persistencia';

// [ERR] Incorreto - imports relativos longos
import { executar } from '../../../nucleo/executor';
```

### Em Testes

```typescript
// [OK] Correto - mesmos aliases funcionam nos testes
import { describe, it, expect } from 'vitest';
import { JavaPlugin } from '@shared/plugins/java/java-plugin';
```

## Configuração Automática

O sistema sincroniza automaticamente:

- [OK] `tsconfig.json` - Paths para desenvolvimento
- [OK] `tsconfig.eslint.json` - Paths para ESLint
- [OK] `src/node.loader.mjs` - Loader ESM para src/
- [OK] `tests/node.loader.mjs` - Loader ESM para testes
