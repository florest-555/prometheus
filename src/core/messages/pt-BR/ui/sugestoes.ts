// SPDX-License-Identifier: MIT-0
import { createI18nMessages, i18n } from '@shared/helpers/i18n.js';

// @prometheus-disable tipo-literal-inline-complexo
// Justificativa: tipos inline para sistema de sugestões
/**
 * Sistema Centralizado de Sugestões e Dicas
 *
 * Centraliza TODAS as sugestões contextuais do Prometheus:
 * - Dicas de uso de comandos
 * - Sugestões baseadas em contexto
 * - Mensagens de ajuda rápida
 * - Call-to-action para diferentes cenários
 */
import { ICONES } from './icons.js';

/**
 * Sugestões gerais de comandos
 */
export const SUGESTOES_COMANDOS = createI18nMessages({
  usarFull: `${ICONES.feedback.dica} Use --full para relatório detalhado com todas as informações`,
  usarJson: `${ICONES.feedback.dica} Use --json para saída estruturada em JSON`,
  combinarJsonExport: `${ICONES.feedback.dica} Combine --json com --export para salvar o relatório`,
  usarExport: `${ICONES.feedback.dica} Use --export <caminho> para salvar relatório em arquivo`,
  usarInclude: `${ICONES.feedback.dica} Use --include <pattern> para focar em arquivos específicos`,
  usarExclude: `${ICONES.feedback.dica} Use --exclude <pattern> para ignorar arquivos`,
  usarDryRun: `${ICONES.feedback.dica} Use --dry-run para simular sem modificar arquivos`,
  removerDryRun: `${ICONES.feedback.dica} Remova --dry-run para aplicar correções`,
  usarInterativo: `${ICONES.feedback.dica} Use --interactive para confirmar cada correção`,
  usarGuardian: `${ICONES.feedback.dica} Use --guardian para verificar integridade`,
  usarBaseline: `${ICONES.feedback.dica} Use --baseline para gerar baseline de referência`,
  usarAutoFix: `${ICONES.feedback.dica} Use --auto-fix para aplicar correções automáticas`,
}, {
  usarFull: `${ICONES.feedback.dica} Use --full for detailed report with all information`,
  usarJson: `${ICONES.feedback.dica} Use --json for structured JSON output`,
  combinarJsonExport: `${ICONES.feedback.dica} Combine --json with --export to save the report`,
  usarExport: `${ICONES.feedback.dica} Use --export <path> to save report to file`,
  usarInclude: `${ICONES.feedback.dica} Use --include <pattern> to focus on specific files`,
  usarExclude: `${ICONES.feedback.dica} Use --exclude <pattern> to ignore files`,
  usarDryRun: `${ICONES.feedback.dica} Use --dry-run to simulate without modifying files`,
  removerDryRun: `${ICONES.feedback.dica} Remove --dry-run to apply corrections`,
  usarInterativo: `${ICONES.feedback.dica} Use --interactive to confirm each correction`,
  usarGuardian: `${ICONES.feedback.dica} Use --guardian to check integrity`,
  usarBaseline: `${ICONES.feedback.dica} Use --baseline to generate reference baseline`,
  usarAutoFix: `${ICONES.feedback.dica} Use --auto-fix to apply automatic corrections`,
});

/**
 * Sugestões de diagnóstico
 */
export const SUGESTOES_DIAGNOSTICO = createI18nMessages({
  modoExecutivo: `${ICONES.diagnostico.executive} Modo executivo: mostrando apenas problemas críticos`,
  primeiraVez: [
    `${ICONES.feedback.dica} Primeira vez? Comece com: prometheus diagnosticar --full`,
    `${ICONES.feedback.dica} Use --help para ver todas as opções disponíveis`,
  ],
  projetoGrande: [
    `${ICONES.feedback.dica} Projeto grande detectado - use --include para análise incremental`,
    `${ICONES.feedback.dica} Use --quick para análise rápida inicial`,
  ],
  poucoProblemas: `${ICONES.nivel.sucesso} Projeto em bom estado! Apenas {count} problemas menores encontrados.`,
  muitosProblemas: [
    `${ICONES.feedback.atencao} Muitos problemas encontrados - priorize os críticos primeiro`,
    `${ICONES.feedback.dica} Use --executive para focar apenas no essencial`,
  ],
  usarFiltros: `${ICONES.feedback.dica} Use filtros --include/--exclude para análise focada`,
}, {
  modoExecutivo: `${ICONES.diagnostico.executive} Executive mode: showing only critical problems`,
  primeiraVez: [
    `${ICONES.feedback.dica} First time? Start with: prometheus diagnosticar --full`,
    `${ICONES.feedback.dica} Use --help to see all available options`,
  ],
  projetoGrande: [
    `${ICONES.feedback.dica} Large project detected - use --include for incremental analysis`,
    `${ICONES.feedback.dica} Use --quick for initial fast analysis`,
  ],
  poucoProblemas: `${ICONES.nivel.sucesso} Project in good state! Only {count} minor issues found.`,
  muitosProblemas: [
    `${ICONES.feedback.atencao} Many issues found - prioritize critical ones first`,
    `${ICONES.feedback.dica} Use --executive to focus only on essentials`,
  ],
  usarFiltros: `${ICONES.feedback.dica} Use --include/--exclude filters for focused analysis`,
});

/**
 * Sugestões de auto-fix
 */
export const SUGESTOES_AUTOFIX = createI18nMessages({
  autoFixDisponivel: `${ICONES.feedback.dica} Correções automáticas disponíveis - use --auto-fix`,
  autoFixAtivo: `${ICONES.feedback.atencao} Auto-fix ativo! Use --dry-run para simular sem modificar arquivos`,
  dryRunRecomendado: `${ICONES.feedback.dica} Recomendado: teste primeiro com --dry-run`,
  semMutateFS: `${ICONES.feedback.atencao} Auto-fix indisponível no momento`,
  validarDepois: [
    `${ICONES.feedback.dica} Execute npm run lint para verificar as correções`,
    `${ICONES.feedback.dica} Execute npm run build para verificar se o código compila`,
    `${ICONES.feedback.dica} Execute npm test para validar funcionalidades`,
  ],
}, {
  autoFixDisponivel: `${ICONES.feedback.dica} Automatic corrections available - use --auto-fix`,
  autoFixAtivo: `${ICONES.feedback.atencao} Auto-fix active! Use --dry-run to simulate without modifying files`,
  dryRunRecomendado: `${ICONES.feedback.dica} Recommended: test first with --dry-run`,
  semMutateFS: `${ICONES.feedback.atencao} Auto-fix currently unavailable`,
  validarDepois: [
    `${ICONES.feedback.dica} Run npm run lint to check corrections`,
    `${ICONES.feedback.dica} Run npm run build to check if code compiles`,
    `${ICONES.feedback.dica} Run npm test to validate functionality`,
  ],
});

/**
 * Sugestões de Guardian
 */
export const SUGESTOES_GUARDIAN = createI18nMessages({
  guardianDesabilitado: `${ICONES.comando.guardian} Guardian desativado. Use --guardian para verificar integridade`,
  primeiroBaseline: [
    `${ICONES.feedback.dica} Primeira execução: gere um baseline com --baseline`,
    `${ICONES.feedback.dica} O baseline serve como referência para mudanças futuras`,
  ],
  driftDetectado: [
    `${ICONES.feedback.atencao} Mudanças detectadas em relação ao baseline`,
    `${ICONES.feedback.dica} Revise as alterações antes de atualizar o baseline`,
    `${ICONES.feedback.dica} Use --baseline para atualizar referência`,
  ],
  integridadeOK: `${ICONES.nivel.sucesso} Integridade verificada - nenhuma mudança não autorizada`,
}, {
  guardianDesabilitado: `${ICONES.comando.guardian} Guardian disabled. Use --guardian to check integrity`,
  primeiroBaseline: [
    `${ICONES.feedback.dica} First run: generate a baseline with --baseline`,
    `${ICONES.feedback.dica} The baseline serves as a reference for future changes`,
  ],
  driftDetectado: [
    `${ICONES.feedback.atencao} Changes detected relative to baseline`,
    `${ICONES.feedback.dica} Review changes before updating baseline`,
    `${ICONES.feedback.dica} Use --baseline to update reference`,
  ],
  integridadeOK: `${ICONES.nivel.sucesso} Integrity verified - no unauthorized changes`,
});

/**
 * Sugestões de tipos (fix-types)
 */
export const SUGESTOES_TIPOS = createI18nMessages({
  ajustarConfianca: (atual: number) =>
    `${ICONES.feedback.dica} Use --confidence <num> para ajustar o limiar (atual: ${atual}%)`,
  revisar: (categoria: string) =>
    `${ICONES.feedback.dica} Revise os casos ${categoria} manualmente`,
  anyEncontrado: [
    `${ICONES.feedback.atencao} Tipos 'any' detectados - reduzem segurança do código`,
    `${ICONES.feedback.dica} Priorize substituir 'as any' e casts explícitos`,
  ],
  unknownLegitimo: `${ICONES.nivel.sucesso} Usos legítimos de 'unknown' identificados`,
  melhoravelDisponivel: `${ICONES.feedback.dica} Casos melhoráveis encontrados - revisar em refatoração futura`,
}, {
  ajustarConfianca: (atual: number) =>
    `${ICONES.feedback.dica} Use --confidence <num> to adjust threshold (current: ${atual}%)`,
  revisar: (categoria: string) =>
    `${ICONES.feedback.dica} Review ${categoria} cases manually`,
  anyEncontrado: [
    `${ICONES.feedback.atencao} 'any' types detected - they reduce code safety`,
    `${ICONES.feedback.dica} Prioritize replacing 'as any' and explicit casts`,
  ],
  unknownLegitimo: `${ICONES.nivel.sucesso} Legitimate uses of 'unknown' identified`,
  melhoravelDisponivel: `${ICONES.feedback.dica} Improvable cases found - review in future refactoring`,
});

/**
 * Sugestões de arquetipos
 */
export const SUGESTOES_ARQUETIPOS = createI18nMessages({
  monorepo: [
    `${ICONES.feedback.dica} Monorepo detectado: considere usar filtros por workspace`,
    `${ICONES.feedback.dica} Use --include packages/* para analisar workspaces específicos`,
  ],
  biblioteca: [
    `${ICONES.feedback.dica} Biblioteca detectada: foque em exports públicos e documentação`,
    `${ICONES.feedback.dica} Use --guardian para verificar API pública`,
  ],
  cli: [
    `${ICONES.feedback.dica} CLI detectado: priorize testes de comandos e flags`,
    `${ICONES.feedback.dica} Valide tratamento de erros em comandos`,
  ],
  api: [
    `${ICONES.feedback.dica} API detectada: foque em endpoints e contratos`,
    `${ICONES.feedback.dica} Considere testes de integração para rotas`,
    `${ICONES.feedback.dica} Valide documentação de API (OpenAPI/Swagger)`,
  ],
  frontend: [
    `${ICONES.feedback.dica} Frontend detectado: priorize componentes e state management`,
    `${ICONES.feedback.dica} Valide acessibilidade e performance`,
  ],
  confiancaBaixa: [
    `${ICONES.feedback.atencao} Confiança baixa na detecção: estrutura pode ser híbrida`,
    `${ICONES.feedback.dica} Use --criar-arquetipo --salvar-arquetipo para personalizar`,
  ],
}, {
  monorepo: [
    `${ICONES.feedback.dica} Monorepo detected: consider using filters per workspace`,
    `${ICONES.feedback.dica} Use --include packages/* to analyze specific workspaces`,
  ],
  biblioteca: [
    `${ICONES.feedback.dica} Library detected: focus on public exports and documentation`,
    `${ICONES.feedback.dica} Use --guardian to check public API`,
  ],
  cli: [
    `${ICONES.feedback.dica} CLI detected: prioritize command and flag tests`,
    `${ICONES.feedback.dica} Validate error handling in commands`,
  ],
  api: [
    `${ICONES.feedback.dica} API detected: focus on endpoints and contracts`,
    `${ICONES.feedback.dica} Consider integration tests for routes`,
    `${ICONES.feedback.dica} Validate API documentation (OpenAPI/Swagger)`,
  ],
  frontend: [
    `${ICONES.feedback.dica} Frontend detected: prioritize components and state management`,
    `${ICONES.feedback.dica} Validate accessibility and performance`,
  ],
  confiancaBaixa: [
    `${ICONES.feedback.atencao} Low detection confidence: structure might be hybrid`,
    `${ICONES.feedback.dica} Use --criar-arquetipo --salvar-arquetipo to customize`,
  ],
});

/**
 * Sugestões de reestruturação
 */
export const SUGESTOES_REESTRUTURAR = createI18nMessages({
  backupRecomendado: [
    `${ICONES.feedback.importante} IMPORTANTE: Faça backup antes de reestruturar!`,
    `${ICONES.feedback.dica} Use git para versionar antes de mudanças estruturais`,
  ],
  validarDepois: [
    `${ICONES.feedback.dica} Execute testes após reestruturação`,
    `${ICONES.feedback.dica} Valide imports e referências`,
  ],
  usarDryRun: `${ICONES.feedback.dica} Primeira vez? Use --dry-run para ver mudanças propostas`,
}, {
  backupRecomendado: [
    `${ICONES.feedback.importante} IMPORTANT: Backup before restructuring!`,
    `${ICONES.feedback.dica} Use git to version before structural changes`,
  ],
  validarDepois: [
    `${ICONES.feedback.dica} Run tests after restructuring`,
    `${ICONES.feedback.dica} Validate imports and references`,
  ],
  usarDryRun: `${ICONES.feedback.dica} First time? Use --dry-run to see proposed changes`,
});

/**
 * Sugestões de poda
 */
export const SUGESTOES_PODAR = createI18nMessages({
  cuidado: [
    `${ICONES.feedback.atencao} Poda remove arquivos permanentemente!`,
    `${ICONES.feedback.importante} Certifique-se de ter backup ou controle de versão`,
  ],
  revisar: `${ICONES.feedback.dica} Revise a lista de arquivos antes de confirmar`,
  usarDryRun: `${ICONES.feedback.dica} Use --dry-run para simular poda sem deletar`,
}, {
  cuidado: [
    `${ICONES.feedback.atencao} Pruning removes files permanently!`,
    `${ICONES.feedback.importante} Ensure you have backup or version control`,
  ],
  revisar: `${ICONES.feedback.dica} Review file list before confirming`,
  usarDryRun: `${ICONES.feedback.dica} Use --dry-run to simulate pruning without deleting`,
});

/**
 * Sugestões de métricas
 */
export const SUGESTOES_METRICAS = createI18nMessages({
  baseline: [
    `${ICONES.feedback.dica} Gere baseline para comparações futuras`,
    `${ICONES.feedback.dica} Use --json para integração com CI/CD`,
  ],
  tendencias: `${ICONES.feedback.dica} Execute regularmente para acompanhar tendências`,
  comparacao: `${ICONES.feedback.dica} Compare com execuções anteriores`,
}, {
  baseline: [
    `${ICONES.feedback.dica} Generate baseline for future comparisons`,
    `${ICONES.feedback.dica} Use --json for CI/CD integration`,
  ],
  tendencias: `${ICONES.feedback.dica} Run regularly to track trends`,
  comparacao: `${ICONES.feedback.dica} Compare with previous runs`,
});

/**
 * Sugestões de zeladores
 */
export const SUGESTOES_ZELADOR = createI18nMessages({
  imports: [
    `${ICONES.feedback.dica} Zelador de imports corrige caminhos automaticamente`,
    `${ICONES.feedback.dica} Use --dry-run para ver correções propostas`,
  ],
  estrutura: [
    `${ICONES.feedback.dica} Zelador de estrutura organiza arquivos por padrão`,
    `${ICONES.feedback.dica} Configure padrões em prometheus.config.json`,
  ],
}, {
  imports: [
    `${ICONES.feedback.dica} Import janitor fixes paths automatically`,
    `${ICONES.feedback.dica} Use --dry-run to see proposed fixes`,
  ],
  estrutura: [
    `${ICONES.feedback.dica} Structure janitor organizes files by pattern`,
    `${ICONES.feedback.dica} Configure patterns in prometheus.config.json`,
  ],
});

/**
 * Sugestões contextuais - função helper
 */
export function gerarSugestoesContextuais(contexto: {
  comando: string;
  temProblemas: boolean;
  countProblemas?: number;
  autoFixDisponivel?: boolean;
  guardianAtivo?: boolean;
  arquetipo?: string;
  flags?: string[];
}): string[] {
  const sugestoes: string[] = [];

  // Sugestões por comando
  switch (contexto.comando) {
    case 'diagnosticar':
      if (!contexto.temProblemas) {
        if (contexto.countProblemas !== undefined) {
          sugestoes.push(
            SUGESTOES_DIAGNOSTICO.poucoProblemas.replace(
              '{count}',
              String(contexto.countProblemas),
            ),
          );
        }
      } else if (contexto.countProblemas && contexto.countProblemas > 50) {
        sugestoes.push(...SUGESTOES_DIAGNOSTICO.muitosProblemas);
      }

      if (
        contexto.autoFixDisponivel &&
        !contexto.flags?.includes('--auto-fix')
      ) {
        sugestoes.push(SUGESTOES_AUTOFIX.autoFixDisponivel);
      }

      if (!contexto.guardianAtivo && !contexto.flags?.includes('--guardian')) {
        sugestoes.push(SUGESTOES_GUARDIAN.guardianDesabilitado);
      }

      if (!contexto.flags?.includes('--full') && contexto.temProblemas) {
        sugestoes.push(SUGESTOES_COMANDOS.usarFull);
      }
      break;

    case 'fix-types':
      if (contexto.autoFixDisponivel) {
        sugestoes.push(...SUGESTOES_AUTOFIX.validarDepois);
      }
      break;

    case 'reestruturar':
      sugestoes.push(...SUGESTOES_REESTRUTURAR.backupRecomendado);
      if (!contexto.flags?.includes('--dry-run')) {
        sugestoes.push(SUGESTOES_REESTRUTURAR.usarDryRun);
      }
      break;

    case 'podar':
      sugestoes.push(...SUGESTOES_PODAR.cuidado);
      break;
  }

  // Sugestões por arquétipo
  if (contexto.arquetipo) {
    switch (contexto.arquetipo) {
      case 'monorepo':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.monorepo);
        break;
      case 'biblioteca':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.biblioteca);
        break;
      case 'cli':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.cli);
        break;
      case 'api':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.api);
        break;
      case 'frontend':
        sugestoes.push(...SUGESTOES_ARQUETIPOS.frontend);
        break;
    }
  }

  return sugestoes;
}

/**
 * Formata sugestões para exibição
 */
export function formatarSugestoes(
  sugestoes: string[],
  titulo = i18n({ 'pt-BR': 'Sugestões', en: 'Suggestions' }),
): string[] {
  if (sugestoes.length === 0) return [];

  const linhas: string[] = ['', `┌── ${titulo} ${'─'.repeat(50)}`.slice(0, 70)];

  for (const sugestao of sugestoes) {
    linhas.push(`  ${sugestao}`);
  }

  linhas.push(`└${'─'.repeat(68)}`);
  linhas.push('');

  return linhas;
}

/**
 * Export consolidado
 */
export const SUGESTOES = {
  comandos: SUGESTOES_COMANDOS,
  diagnostico: SUGESTOES_DIAGNOSTICO,
  autofix: SUGESTOES_AUTOFIX,
  guardian: SUGESTOES_GUARDIAN,
  tipos: SUGESTOES_TIPOS,
  arquetipos: SUGESTOES_ARQUETIPOS,
  reestruturar: SUGESTOES_REESTRUTURAR,
  podar: SUGESTOES_PODAR,
  metricas: SUGESTOES_METRICAS,
  zelador: SUGESTOES_ZELADOR,
} as const;

export default SUGESTOES;
