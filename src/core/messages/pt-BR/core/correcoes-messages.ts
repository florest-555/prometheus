// SPDX-License-Identifier: MIT-0
import { buildTypesRelPathPosix, getTypesDirectoryDisplay } from '@core/config/conventions.js';
import { ICONES } from '@core/messages/pt-BR/ui/icons.js';
import { createI18nMessages } from '@shared/helpers/i18n.js';

/**
 * Mensagens de Quick Fixes - Any/Unknown
 */
export const MENSAGENS_CORRECAO_TIPOS = createI18nMessages({
  // Títulos e descrições de quick fixes
  fixAny: {
    title: 'Substituir any por tipos seguros',
    description: `Analisa uso de any e infere/cria tipos corretos em ${getTypesDirectoryDisplay()}`
  },
  fixUnknown: {
    title: 'Substituir unknown por tipos específicos',
    description: 'Detecta padrões de type guards e cria tipos dedicados'
  },
  // Mensagens de validação
  validacao: {
    falha: (erros: string[]) => `Validação falhou: ${erros.join(', ')}`,
    revisar: 'Revise manualmente'
  },
  // Warnings e sugestões
  warnings: {
    confiancaBaixa: (confianca: number) => `Tipo inseguro (any) com confiança muito baixa (${confianca}%) para correção automática`,
    confiancaMedia: (confianca: number, tipoSugerido: string) => `Tipo inseguro detectado. Sugestão: ${tipoSugerido} (confiança: ${confianca}%)`,
    unknownApropriado: 'unknown apropriado aqui (entrada genérica ou baixa confiança)',
    useTiposCentralizados: () => `Use tipos centralizados em diretório dedicado (${getTypesDirectoryDisplay()})`,
    criarTipoDedicado: (caminho: string) => `Considere criar tipo dedicado em ${buildTypesRelPathPosix(caminho)}`,
    adicioneTypeGuards: () => `Se possível, adicione type guards ou crie tipo dedicado em ${getTypesDirectoryDisplay()}`
  },
  // Mensagens de erro
  erros: {
    extrairNome: 'Não foi possível extrair nome da variável',
    variavelNaoUsada: 'Variável não utilizada - impossível inferir tipo',
    analise: (erro: string) => `Erro na análise: ${erro}`
  }
}, {
  fixAny: {
    title: 'Replace any with safe types',
    description: `Analyzes use of any and infers/creates correct types in ${getTypesDirectoryDisplay()}`
  },
  fixUnknown: {
    title: 'Replace unknown with specific types',
    description: 'Detects type guard patterns and creates dedicated types'
  },
  validacao: {
    falha: (erros: string[]) => `Validation failed: ${erros.join(', ')}`,
    revisar: 'Manually review'
  },
  warnings: {
    confiancaBaixa: (confianca: number) => `Unsafe type (any) with very low confidence (${confianca}%) for automatic correction`,
    confiancaMedia: (confianca: number, tipoSugerido: string) => `Unsafe type detected. Suggestion: ${tipoSugerido} (confidence: ${confianca}%)`,
    unknownApropriado: 'unknown appropriate here (generic input or low confidence)',
    useTiposCentralizados: () => `Use centralized types in dedicated directory (${getTypesDirectoryDisplay()})`,
    criarTipoDedicado: (caminho: string) => `Consider creating dedicated type in ${buildTypesRelPathPosix(caminho)}`,
    adicioneTypeGuards: () => `If possible, add type guards or create dedicated type in ${getTypesDirectoryDisplay()}`
  },
  erros: {
    extrairNome: 'Could not extract variable name',
    variavelNaoUsada: 'Variable not used - impossible to infer type',
    analise: (erro: string) => `Analysis error: ${erro}`
  }
});

/**
 * Mensagens de Auto-Fix
 */
export const MENSAGENS_AUTOFIX = createI18nMessages({
  // Mensagens de status
  iniciando: (modo: string) => `${ICONES.acao.correcao} Iniciando auto-fix (modo: ${modo})`,
  dryRun: `${ICONES.feedback.info} Dry-run: simulando correções (nenhuma mudança será aplicada)`,
  aplicando: (count: number) => `Aplicando ${count} correção${count !== 1 ? 'ões' : ''}...`,
  concluido: (aplicadas: number, falhas: number) => `${ICONES.nivel.sucesso} Auto-fix concluído: ${aplicadas} aplicada${aplicadas !== 1 ? 's' : ''}, ${falhas} falha${falhas !== 1 ? 's' : ''}`,
  naoDisponivel: `${ICONES.feedback.info} Nenhuma correção automática disponível`,
  // Flags e modos
  flags: {
    fixSafe: `${ICONES.comando.guardian} Flag --fix-safe detectada: ativando modo conservador`,
    requireMutateFS: `${ICONES.status.falha} Auto-fix indisponível no momento.`
  },
  // Logs de progresso
  logs: {
    modoConservador: `${ICONES.comando.guardian} Modo conservador ativado - aplicando apenas correções de alta confiança`,
    validarEslint: `${ICONES.acao.analise} Executando validação ESLint pós-auto-fix...`,
    arquivoMovido: (origem: string, destino: string) => `${ICONES.status.ok} Movido: ${origem} → ${destino}`,
    arquivoRevertido: (origem: string, destino: string) => `↩️ Arquivo revertido: ${destino} → ${origem}`,
    arquivoRevertidoConteudo: (origem: string, destino: string) => `↩️ Arquivo revertido com conteúdo original: ${destino} → ${origem}`
  },
  // Resultados
  resultados: {
    sucesso: (count: number) => `${ICONES.status.ok} ${count} arquivo(s) corrigido(s)`,
    falhas: (count: number) => `${ICONES.status.falha} ${count} arquivo(s) com erro`,
    erroArquivo: (arquivo: string, erro: string) => `${ICONES.status.falha} ${arquivo}: ${erro}`
  },
  // Dicas pós-correção
  dicas: {
    executarLint: `${ICONES.feedback.dica} Execute \`npm run lint\` para verificar as correções`,
    executarBuild: `${ICONES.feedback.dica} Execute \`npm run build\` para verificar se o código compila`,
    removerDryRun: `${ICONES.feedback.dica} Remova --dry-run para aplicar correções automaticamente`,
    ajustarConfianca: `${ICONES.feedback.dica} Use --confidence <num> para ajustar o limiar (atual: 85%)`
  }
}, {
  iniciando: (modo: string) => `${ICONES.acao.correcao} Starting auto-fix (mode: ${modo})`,
  dryRun: `${ICONES.feedback.info} Dry-run: simulating corrections (no changes will be applied)`,
  aplicando: (count: number) => `Applying ${count} correction${count !== 1 ? 's' : ''}...`,
  concluido: (aplicadas: number, falhas: number) => `${ICONES.nivel.sucesso} Auto-fix concluded: ${aplicadas} applied, ${falhas} failure${falhas !== 1 ? 's' : ''}`,
  naoDisponivel: `${ICONES.feedback.info} No automatic corrections available`,
  flags: {
    fixSafe: `${ICONES.comando.guardian} --fix-safe flag detected: activating conservative mode`,
    requireMutateFS: `${ICONES.status.falha} Auto-fix currently unavailable.`
  },
  logs: {
    modoConservador: `${ICONES.comando.guardian} Conservative mode activated - applying only high-confidence corrections`,
    validarEslint: `${ICONES.acao.analise} Running ESLint validation after auto-fix...`,
    arquivoMovido: (origem: string, destino: string) => `${ICONES.status.ok} Moved: ${origem} → ${destino}`,
    arquivoRevertido: (origem: string, destino: string) => `↩️ File reverted: ${destino} → ${origem}`,
    arquivoRevertidoConteudo: (origem: string, destino: string) => `↩️ File reverted with original content: ${destino} → ${origem}`
  },
  resultados: {
    sucesso: (count: number) => `${ICONES.status.ok} ${count} file(s) fixed`,
    falhas: (count: number) => `${ICONES.status.falha} ${count} file(s) with error`,
    erroArquivo: (arquivo: string, erro: string) => `${ICONES.status.falha} ${arquivo}: ${erro}`
  },
  dicas: {
    executarLint: `${ICONES.feedback.dica} Run \`npm run lint\` to verify fixes`,
    executarBuild: `${ICONES.feedback.dica} Run \`npm run build\` to verify code compiles`,
    removerDryRun: `${ICONES.feedback.dica} Remove --dry-run to apply corrections automatically`,
    ajustarConfianca: `${ICONES.feedback.dica} Use --confidence <num> to adjust threshold (current: 85%)`
  }
});

/**
 * Mensagens de Relatórios de Análise
 */
export const MENSAGENS_RELATORIOS_ANALISE = createI18nMessages({
  asyncPatterns: {
    titulo: `${ICONES.relatorio.resumo} Análise de Padrões Async/Await`,
    padroes: `\n${ICONES.relatorio.resumo} Padrões de Uso do Código:`,
    recomendacoes: `\n${ICONES.feedback.dica} Recomendações de Correção:\n`,
    critico: `${ICONES.nivel.erro} CRÍTICO (Revisar Imediatamente):`,
    alto: `\n${ICONES.feedback.atencao} ALTO (Revisar em Sprint Atual):`,
    salvo: (caminho: string) => `${ICONES.nivel.sucesso} Relatório async salvo em: ${caminho}`
  },
  fixTypes: {
    analiseSalva: `${ICONES.arquivo.json} Análise detalhada salva em: .prometheus/fix-types-analise.json`,
    possibilidades: `└─ ${ICONES.acao.analise} Possibilidades alternativas:`,
    sugestao: (texto: string) => `└─ ${ICONES.feedback.dica} ${texto}`,
    exportado: `${ICONES.arquivo.doc} Relatórios de fix-types exportados:`
  },
  guardian: {
    baselineAceito: `${ICONES.status.ok} Guardian: baseline aceito manualmente (--aceitar).`,
    exportado: `${ICONES.arquivo.doc} Relatórios Guardian exportados:`
  }
}, {
  asyncPatterns: {
    titulo: `${ICONES.relatorio.resumo} Async/Await Patterns Analysis`,
    padroes: `\n${ICONES.relatorio.resumo} Code Usage Patterns:`,
    recomendacoes: `\n${ICONES.feedback.dica} Correction Recommendations:\n`,
    critico: `${ICONES.nivel.erro} CRITICAL (Review Immediately):`,
    alto: `\n${ICONES.feedback.atencao} HIGH (Review in Current Sprint):`,
    salvo: (caminho: string) => `${ICONES.nivel.sucesso} Async report saved at: ${caminho}`
  },
  fixTypes: {
    analiseSalva: `${ICONES.arquivo.json} Detailed analysis saved at: .prometheus/fix-types-analise.json`,
    possibilidades: `└─ ${ICONES.acao.analise} Alternative possibilities:`,
    sugestao: (texto: string) => `└─ ${ICONES.feedback.dica} ${texto}`,
    exportado: `${ICONES.arquivo.doc} fix-types reports exported:`
  },
  guardian: {
    baselineAceito: `${ICONES.status.ok} Guardian: baseline manually accepted (--aceitar).`,
    exportado: `${ICONES.arquivo.doc} Guardian reports exported:`
  }
});

/**
 * Mensagens de Arquetipos
 */
export const MENSAGENS_ARQUETIPOS_HANDLER = createI18nMessages({
  timeout: `${ICONES.feedback.atencao} Detecção de arquetipos expirou (timeout)`,
  salvo: (caminho: string) => `${ICONES.status.ok} Arquétipo personalizado salvo em ${caminho}`,
  falha: `${ICONES.feedback.atencao} Falha ao gerar plano via arquétipos.`,
  falhaEstrategista: `${ICONES.feedback.atencao} Estrategista falhou ao sugerir plano.`,
  falhaGeral: `${ICONES.feedback.atencao} Falha geral no planejamento.`
}, {
  timeout: `${ICONES.feedback.atencao} Archetype detection timed out`,
  salvo: (caminho: string) => `${ICONES.status.ok} Custom archetype saved at ${caminho}`,
  falha: `${ICONES.feedback.atencao} Failed to generate plan via archetypes.`,
  falhaEstrategista: `${ICONES.feedback.atencao} Strategist failed to suggest plan.`,
  falhaGeral: `${ICONES.feedback.atencao} General failure in planning.`
});

/**
 * Mensagens de Plugins
 */
export const MENSAGENS_PLUGINS = createI18nMessages({
  registrado: (nome: string, extensoes: string[]) => `${ICONES.status.ok} Plugin ${nome} registrado com extensões: ${extensoes.join(', ')}`,
  configAtualizada: `${ICONES.acao.correcao} Configuração do registry atualizada`,
  erroParsear: (linguagem: string, erro: string) => `${ICONES.feedback.atencao} Erro ao parsear ${linguagem}: ${erro}`
}, {
  registrado: (nome: string, extensoes: string[]) => `${ICONES.status.ok} Plugin ${nome} registered with extensions: ${extensoes.join(', ')}`,
  configAtualizada: `${ICONES.acao.correcao} Registry configuration updated`,
  erroParsear: (linguagem: string, erro: string) => `${ICONES.feedback.atencao} Error parsing ${linguagem}: ${erro}`
});

/**
 * Mensagens de Executor
 */
export const MENSAGENS_EXECUTOR = createI18nMessages({
  analiseCompleta: (tecnica: string, arquivo: string, duracao: string) => `${ICONES.arquivo.arquivo} '${tecnica}' analisou ${arquivo} em ${duracao}`,
  fastModeAtivado: '[PERFORMANCE] Modo rapido ativado: processamento paralelo com Workers',
  analiseRapidaConcluida: (total: number, duracao: string) => `[SUCESSO] Analise rapida concluida: ${total} arquivos em ${duracao}`,
  tecnicaGlobalSucesso: (nome: string) => `Tecnica global "${nome}"`,
  tecnicaGlobalErro: (nome: string, erro: string) => `[ERRO] Erro na tecnica global '${nome}': ${erro}`,
  tecnicaGlobalTimeout: (nome: string) => `[TIMEOUT] Analista global '${nome}' excedeu o tempo limite`,
  tecnicaGlobalTimeoutOcorrencia: (nome: string, timeout: number) => `Timeout na tecnica global '${nome}': ${timeout}ms excedido`,
  tecnicaGlobalErroOcorrencia: (nome: string, erro: string) => `Falha na tecnica global '${nome}': ${erro}`,
  tecnicaLocalErro: (nome: string, arquivo: string, erro: string) => `[ERRO] Erro em '${nome}' para ${arquivo}: ${erro}`,
  tecnicaLocalTimeoutOcorrencia: (nome: string, arquivo: string, timeout: number) => `Timeout na tecnica '${nome}' para ${arquivo}: ${timeout}ms excedido`,
  tecnicaLocalErroOcorrencia: (nome: string, arquivo: string, erro: string) => `Falha na tecnica '${nome}' para ${arquivo}: ${erro}`,
  stackTrace: 'Stack trace:',
  arquivosAnalisadosProgress: (atual: number, total: number) => `Arquivos analisados: ${atual}/${total}`,
  arquivosAnalisadosTotal: (total: number) => `Arquivos analisados: ${total}`,
  arquivoProcessando: (atual: number, total: number, path: string) => `Arquivo ${atual}/${total}: ${path}`,
  falhaPersistirMetricas: (erro: string) => `Falha ao persistir historico de metricas: ${erro}`
}, {
  analiseCompleta: (tecnica: string, arquivo: string, duracao: string) => `${ICONES.arquivo.arquivo} '${tecnica}' analyzed ${arquivo} in ${duracao}`,
  fastModeAtivado: '[PERFORMANCE] Fast mode activated: parallel processing with Workers',
  analiseRapidaConcluida: (total: number, duracao: string) => `[SUCCESS] Fast analysis concluded: ${total} files in ${duracao}`,
  tecnicaGlobalSucesso: (nome: string) => `Global technique "${nome}"`,
  tecnicaGlobalErro: (nome: string, erro: string) => `[ERROR] Error in global technique '${nome}': ${erro}`,
  tecnicaGlobalTimeout: (nome: string) => `[TIMEOUT] Global analyst '${nome}' exceeded time limit`,
  tecnicaGlobalTimeoutOcorrencia: (nome: string, timeout: number) => `Timeout in global technique '${nome}': ${timeout}ms exceeded`,
  tecnicaGlobalErroOcorrencia: (nome: string, erro: string) => `Failure in global technique '${nome}': ${erro}`,
  tecnicaLocalErro: (nome: string, arquivo: string, erro: string) => `[ERROR] Error in '${nome}' for ${arquivo}: ${erro}`,
  tecnicaLocalTimeoutOcorrencia: (nome: string, arquivo: string, timeout: number) => `Timeout in technique '${nome}' for ${arquivo}: ${timeout}ms exceeded`,
  tecnicaLocalErroOcorrencia: (nome: string, arquivo: string, erro: string) => `Failure in technique '${nome}' for ${arquivo}: ${erro}`,
  stackTrace: 'Stack trace:',
  arquivosAnalisadosProgress: (atual: number, total: number) => `Files analyzed: ${atual}/${total}`,
  arquivosAnalisadosTotal: (total: number) => `Files analyzed: ${total}`,
  arquivoProcessando: (atual: number, total: number, path: string) => `File ${atual}/${total}: ${path}`,
  falhaPersistirMetricas: (erro: string) => `Failed to persist metrics history: ${erro}`
});

/**
 * Export consolidado
 */
export const MENSAGENS_CORRECOES = {
  fixTypes: MENSAGENS_CORRECAO_TIPOS,
  autofix: MENSAGENS_AUTOFIX,
  relatorios: MENSAGENS_RELATORIOS_ANALISE,
  arquetipos: MENSAGENS_ARQUETIPOS_HANDLER,
  plugins: MENSAGENS_PLUGINS,
  executor: MENSAGENS_EXECUTOR
} as const;
export default MENSAGENS_CORRECOES;