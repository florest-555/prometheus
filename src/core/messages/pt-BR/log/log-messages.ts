// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

/**
 * Sistema de mensagens de log centralizadas e contextuais
 * Adapta-se automaticamente ao tipo e complexidade do projeto
 */
import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_FEEDBACK, ICONES_NIVEL, ICONES_RELATORIO, ICONES_STATUS } from '../ui/icons.js';

export const LogMensagens = createI18nMessages({
  sistema: {
    inicializacao: {
      sucesso: `${ICONES_FEEDBACK.foguete} Prometheus inicializado em {tempo}ms`,
      falha: `${ICONES_STATUS.falha} Falha na inicialização: {erro}`,
      configuracao: `${ICONES_ARQUIVO.config} Configuração carregada: {fonte} ({campos} campos)`,
      erro_generico: `${ICONES_STATUS.falha} Erro: {mensagem}`
    },
    shutdown: `${ICONES_STATUS.ok} Análise concluída graciosamente`,
    atualizacao: {
      executando: `${ICONES_ACAO.import} Executando: {comando}`,
      sucesso: `${ICONES_STATUS.ok} Atualização concluída com sucesso!`,
      falha: `${ICONES_STATUS.falha} Atualização abortada ou falhou.`,
      detalhes: `${ICONES_FEEDBACK.atencao} {detalhe}`
    },
    performance: {
      regressao_detectada: `${ICONES_FEEDBACK.atencao} Regressão acima de {limite}% detectada.`,
      sem_regressoes: `${ICONES_STATUS.ok} Sem regressões significativas.`
    },
    poda: {
      cancelada: `${ICONES_STATUS.falha} Poda cancelada.`,
      concluida: `${ICONES_STATUS.ok} Poda concluída: Arquivos órfãos removidos com sucesso!`
    },
    reversao: {
      nenhum_move: `${ICONES_STATUS.falha} Nenhum move encontrado para o arquivo: {arquivo}`,
      revertendo: `${ICONES_COMANDO.reverter} Revertendo moves para: {arquivo}`,
      sucesso: `${ICONES_STATUS.ok} Arquivo revertido com sucesso: {arquivo}`,
      falha: `${ICONES_STATUS.falha} Falha ao reverter arquivo: {arquivo}`
    },
    auto: {
      mapa_reversao: {
        erro_carregar: `${ICONES_STATUS.falha} Erro ao carregar mapa de reversão: {erro}`,
        erro_salvar: `${ICONES_STATUS.falha} Erro ao salvar mapa de reversão: {erro}`,
        move_nao_encontrado: `${ICONES_STATUS.falha} Move não encontrado: {id}`,
        arquivo_destino_nao_encontrado: `${ICONES_STATUS.falha} Arquivo de destino não encontrado: {destino}`,
        arquivo_existe_origem: `${ICONES_FEEDBACK.atencao} Arquivo já existe na origem: {origem}`,
        erro_reverter: `${ICONES_STATUS.falha} Erro ao reverter move: {erro}`,
        nenhum_move: `${ICONES_FEEDBACK.atencao} Nenhum move encontrado para: {arquivo}`,
        revertendo_move: `${ICONES_COMANDO.reverter} Revertendo move: {id}`,
        move_revertido: `${ICONES_STATUS.ok} Move revertido com sucesso: {id}`,
        falha_reverter_move: `${ICONES_STATUS.falha} Falha ao reverter move: {id}`,
        carregado: `${ICONES_RELATORIO.lista} Mapa de reversão carregado: {moves} moves registrados`,
        nenhum_encontrado: `${ICONES_RELATORIO.lista} Nenhum mapa de reversão encontrado, iniciando novo`
      },
      poda: {
        nenhum_arquivo: `${ICONES_STATUS.ok} Nenhum arquivo para podar neste ciclo.\n`,
        podando: `${ICONES_COMANDO.podar} Podando {quantidade} arquivos...`,
        podando_simulado: `${ICONES_COMANDO.podar} Podando {quantidade} arquivos... (SIMULADO)`,
        arquivo_movido: `${ICONES_STATUS.ok} {arquivo} movido para abandonados.`
      },
      corretor: {
        erro_criar_diretorio: `${ICONES_STATUS.falha} Falha ao criar diretório para {destino}: {erro}`,
        destino_existe: `${ICONES_FEEDBACK.atencao} Destino já existe: {arquivo} → {destino}`,
        erro_mover: `${ICONES_STATUS.falha} Falha ao mover {arquivo} via rename: {erro}`
      }
    },
    correcoes: {
      nenhuma_disponivel: `${ICONES_STATUS.ok} Nenhuma correção automática disponível`,
      aplicando: `${ICONES_ACAO.correcao} Aplicando correções automáticas em modo {modo}...`,
      arquivo_nao_encontrado: `${ICONES_FEEDBACK.atencao} Arquivo não encontrado para correção: {arquivo}`,
      aplicada: `${ICONES_STATUS.ok} {titulo} (confiança: {confianca}%)`,
      corrigido: `${ICONES_STATUS.ok} Corrigido: {arquivo}`,
      falha: `${ICONES_FEEDBACK.atencao} Falha ao aplicar quick fix {id}: {erro}`,
      nenhuma_aplicada: `${ICONES_FEEDBACK.atencao} Nenhuma correção pôde ser aplicada`,
      estatisticas: `${ICONES_STATUS.ok} {estatisticas}`,
      eslint_harmonia: `${ICONES_STATUS.ok} Validação ESLint concluída - harmonia mantida`,
      eslint_ajustes: `${ICONES_STATUS.ok} ESLint aplicou ajustes adicionais para harmonia total`,
      eslint_falha: `${ICONES_STATUS.falha} ESLint validation falhou: {erro}`
    },
    processamento: {
      fix_detectada: `${ICONES_ACAO.correcao} Flag --fix detectada: ativando correções automáticas`,
      eslint_output: `${ICONES_RELATORIO.lista} ESLint output: {output}`,
      resumo_ocorrencias: `${ICONES_DIAGNOSTICO.stats} Resumo das {total} ocorrências:`,
      dicas_contextuais: `${ICONES_FEEDBACK.dica} Dicas contextuais:`,
      detalhamento_ocorrencias: `${ICONES_DIAGNOSTICO.stats} Detalhamento das {total} ocorrências:`,
      erros_criticos: `${ICONES_RELATORIO.error} {total} erros críticos encontrados - priorize estes primeiro`,
      avisos_encontrados: `${ICONES_RELATORIO.warning} {total} avisos encontrados`,
      quick_fixes_muitos: `${ICONES_ACAO.correcao} {total} correções automáticas disponíveis:`,
      quick_fixes_comando: '   → PROMETHEUS_ALLOW_MUTATE_FS=1 npm run diagnosticar --fix',
      quick_fixes_executar: '   (comando pronto para executar)',
      todos_muitos: `${ICONES_RELATORIO.lista} {total} TODOs encontrados - considere --include para focar em área específica`,
      todos_poucos: `${ICONES_RELATORIO.lista} {total} TODOs encontrados - bom controle!`,
      muitas_ocorrencias: `${ICONES_FEEDBACK.atencao} Muitas ocorrências - use --executive para visão de alto nível`,
      filtrar_pasta: `${ICONES_ARQUIVO.diretorio} Ou filtre por pasta: --include "src/cli" ou --include "src/analistas"`,
      usar_full: `${ICONES_DIAGNOSTICO.completo} Use --full para detalhamento completo`,
      usar_json: `${ICONES_ARQUIVO.json} Use --json para saída estruturada (CI/scripts)`,
      projeto_limpo: `${ICONES_STATUS.ok} Projeto limpo! Use --guardian-check para verificação de integridade`,
      analistas_problemas: `${ICONES_DIAGNOSTICO.inicio} Analistas que encontraram problemas: {quantidade}`
    }
  },
  scanner: {
    inicio: `${ICONES_DIAGNOSTICO.inicio} Iniciando varredura em: {diretorio}`,
    progresso: `${ICONES_ARQUIVO.diretorio} Escaneando: {diretorio} ({arquivos} arquivos)`,
    filtros: `${ICONES_DIAGNOSTICO.stats} Filtros aplicados: {include} includes, {exclude} excludes`,
    completo: `${ICONES_STATUS.ok} Varredura concluída: {arquivos} arquivos em {diretorios} diretórios`,
    arquivo_lido: `${ICONES_STATUS.ok} Arquivo lido: {arquivo}`
  },
  analistas: {
    execucao: {
      inicio_simples: `${ICONES_DIAGNOSTICO.inicio} Analisando {arquivo}`,
      sucesso_simples: `${ICONES_STATUS.ok} {arquivo}: {ocorrencias} issues`,
      inicio_detalhado: `${ICONES_DIAGNOSTICO.inicio} Executando '{analista}' em {arquivo} ({tamanho}kb)`,
      sucesso_detalhado: `${ICONES_STATUS.ok} '{analista}' concluído: {ocorrencias} ocorrências ({tempo}ms)`,
      timeout: `${ICONES_FEEDBACK.atencao} Timeout do analista '{analista}' após {tempo}ms`,
      erro: `${ICONES_STATUS.falha} Erro no analista '{analista}': {erro}`,
      skip: `${ICONES_STATUS.pulado} Pulando '{arquivo}' (suprimido por configuração)`,
      batch_progresso: `${ICONES_DIAGNOSTICO.progresso} Progresso: {arquivos}/{total} ({percentual}%)`,
      batch_concluido_simples: `${ICONES_STATUS.ok} Análise concluída - {total} problemas encontrados`,
      batch_concluido_detalhado: `${ICONES_STATUS.ok} Verificações concluídas - {total} problemas detectados em {duracao}s`
    },
    metricas: {
      performance: `${ICONES_DIAGNOSTICO.stats} Performance: {analistas} analistas, {media}ms/arquivo médio`,
      cache_hit: `${ICONES_DIAGNOSTICO.rapido} Cache hit: {hits}/{total} ({percentual}%)`,
      worker_pool: `${ICONES_STATUS.executando} Worker pool: {ativos}/{total} workers ativos`
    }
  },
  filtros: {
    incluindo: ` ${ICONES_ACAO.criar} Incluindo: {pattern} ({matches} arquivos)`,
    excluindo: ` ${ICONES_ACAO.deletar} Excluindo: {pattern} ({matches} arquivos)`,
    supressao: `${ICONES_STATUS.pausado} Suprimidas {count} ocorrências: {motivo}`,
    cli_override: `${ICONES_DIAGNOSTICO.stats} CLI override: {tipo} patterns dominando configuração`
  },
  projeto: {
    detectado: `${ICONES_RELATORIO.lista} Projeto detectado: {tipo} ({confianca}% confiança)`,
    estrutura: `${ICONES_DIAGNOSTICO.stats} Estrutura: {arquivos} arquivos, {linguagens} linguagens`,
    complexidade: `${ICONES_DIAGNOSTICO.stats} Complexidade: {nivel} (baseado em {metricas})`,
    recomendacao: `${ICONES_FEEDBACK.dica} Recomendação: {acao} para este tipo de projeto`
  },
  contexto: {
    desenvolvedor_novo: `${ICONES_FEEDBACK.info} Projeto simples detectado - logs simplificados ativados`,
    equipe_experiente: `${ICONES_FEEDBACK.info} Projeto empresarial detectado - logs detalhados ativados`,
    ci_cd: `${ICONES_FEEDBACK.info} Ambiente CI/CD detectado - logs estruturados ativados`,
    debug_mode: `${ICONES_FEEDBACK.info} Modo debug ativo - logs verbosos ativados`
  },
  ocorrencias: {
    critica: `${ICONES_NIVEL.critico} CRÍTICO: {mensagem} em {arquivo}:{linha}`,
    aviso: `${ICONES_NIVEL.aviso} Aviso: {mensagem} ({categoria})`,
    info: `${ICONES_NIVEL.info} Info: {mensagem}`,
    sugestao: `${ICONES_FEEDBACK.dica} Sugestão: {mensagem} - {acao_sugerida}`
  },
  relatorio: {
    resumo: `${ICONES_DIAGNOSTICO.stats} Resumo: {total} issues ({criticos} críticos, {avisos} avisos)`,
    categorias: `${ICONES_RELATORIO.lista} Principais: {top_categorias}`,
    arquivo_problema: `${ICONES_FEEDBACK.atencao} Mais issues: {arquivo} ({count} ocorrências)`,
    tendencia: `${ICONES_DIAGNOSTICO.stats} Tendência: {direcao} comparado à baseline`,
    repositorio_impecavel: 'Repositório impecável',
    ocorrencias_encontradas: 'Encontradas {total} ocorrências',
    fim_padroes_uso: `\n${ICONES_STATUS.ok} Fim do relatório de padrões de uso.\n`,
    funcoes_longas: `${ICONES_FEEDBACK.atencao} Funções longas encontradas:`,
    gerado: `${ICONES_ARQUIVO.arquivo} Relatório {formato} gerado: {caminho}`,
    erro_geracao: `${ICONES_STATUS.falha} Erro ao gerar relatório: {erro}`
  },
  conselheiro: {
    volume_alto: `${ICONES_FEEDBACK.info} volume de tarefas alto? O código não foge; burnout sim.`,
    respira: `${ICONES_FEEDBACK.info} Ei, rapidinho: respira só por um instante.`,
    cuidado: `${ICONES_FEEDBACK.info} Se cuida: toma uma água, alonga, fecha os olhos 5 min. Continuamos depois.\n`,
    madrugada: `${ICONES_FEEDBACK.atencao} Já passa das {hora}. Código compila amanhã; você descansa agora.`
  },
  guardian: {
    integridade_ok: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.ok} Guardian: integridade preservada.`,
    baseline_criado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} Guardian baseline criado.`,
    baseline_aceito: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} Guardian: novo baseline aceito — execute novamente.`,
    alteracoes_detectadas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} Guardian: alterações suspeitas detectadas! Considere executar 'prometheus guardian --diff'.`,
    bloqueado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} Guardian bloqueou: alterações suspeitas ou erro fatal.`,
    modo_permissivo: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} Modo permissivo: prosseguindo sob risco.`,
    scan_only: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} Modo scan-only: {arquivos} arquivos mapeados.`,
    avisos_encontrados: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} Há ocorrências de nível aviso`,
    full_scan_aviso: `${ICONES_NIVEL.aviso} --full-scan ativo: baseline NÃO será persistido com escopo expandido.`,
    full_scan_warning_baseline: `${ICONES_NIVEL.aviso} --full-scan ativo, mas será criado baseline com escopo expandido temporariamente.`,
    aceitando_baseline: `\n${ICONES_COMANDO.atualizar} Aceitando novo baseline de integridade...\n`,
    baseline_aceito_sucesso: `${ICONES_STATUS.ok} Novo baseline de integridade aceito com sucesso!`,
    comparando_integridade: `\n${ICONES_DIAGNOSTICO.stats} Comparando integridade do Prometheus com o baseline...\n`,
    diferencas_detectadas: `${ICONES_RELATORIO.error} Differences detected:`,
    diferenca_item: '  - {diferenca}',
    comando_diff_recomendado: 'Execute com --diff para mostrar diferenças detalhadas ou --accept para aceitar novo baseline.',
    integridade_preservada: `${ICONES_STATUS.ok} Nenhuma diferença detectada. Integridade preservada.`,
    verificando_integridade: `\n${ICONES_DIAGNOSTICO.guardian} Verificando integridade do Prometheus...\n`,
    baseline_criado_console: `${ICONES_DIAGNOSTICO.guardian} Guardian baseline criado`,
    baseline_atualizado: `${ICONES_DIAGNOSTICO.guardian} Baseline atualizado e aceito`,
    alteracoes_suspeitas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} Alterações suspeitas detectadas!`,
    erro_guardian: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} Erro no Guardian: {erro}`,
    info: `${ICONES_FEEDBACK.info} {mensagem}`,
    aviso: `${ICONES_FEEDBACK.atencao} {mensagem}`
  },
  metricas: {
    execucoes_registradas: `\n${ICONES_DIAGNOSTICO.stats} Execuções registradas: {quantidade}`,
    nenhum_historico: 'Nenhum histórico de métricas encontrado ainda. Execute um diagnóstico com --metricas ativo.'
  },
  auto: {
    plugin_ignorado: `${ICONES_NIVEL.aviso} Plugin ignorado ({plugin}): {erro}`,
    caminho_nao_resolvido: `${ICONES_NIVEL.aviso} Caminho de plugin não resolvido: {plugin}`,
    plugin_falhou: `${ICONES_STATUS.falha} Plugin falhou: {plugin} — {erro}`,
    move_removido: `${ICONES_ACAO.deletar} Move removido do mapa: {id}`
  },
  core: {
    parsing: {
      erro_babel: `${ICONES_NIVEL.aviso} Erro de parsing Babel em {arquivo}: {erro}`,
      erro_ts: `${ICONES_NIVEL.aviso} Erro TS compiler parse em {arquivo}: {erro}`,
      erro_xml: `${ICONES_NIVEL.aviso} Erro XML parse em {arquivo}: {erro}`,
      erro_html: `${ICONES_NIVEL.aviso} Erro HTML parse em {arquivo}: {erro}`,
      erro_css: `${ICONES_NIVEL.aviso} Erro CSS parse em {arquivo}: {erro}`,
      nenhum_parser: `${ICONES_NIVEL.aviso} Nenhum parser disponível para extensão: {extensao}`,
      timeout_parsing: `${ICONES_NIVEL.aviso} Parsing timeout após {timeout}ms para extensão {extensao}`,
      plugin_nao_encontrado: `${ICONES_NIVEL.aviso} Plugin não encontrado para {extensao}, usando sistema legado`,
      sistema_plugins_falhou: `${ICONES_STATUS.falha} Sistema de plugins falhou: {erro}, usando sistema legado`,
      plugins_registrados: `${ICONES_DIAGNOSTICO.inicio} Plugins padrão registrados no sistema`,
      usando_plugin: `${ICONES_DIAGNOSTICO.inicio} Usando plugin '{nome}' para {extensao}`
    },
    plugins: {
      erro_carregar: `${ICONES_STATUS.falha} Erro ao carregar plugin {nome}: {erro}`,
      tentando_autoload: `${ICONES_DIAGNOSTICO.inicio} Tentando autoload para extensão {extensao}`,
      autoload_falhou: `${ICONES_STATUS.falha} Autoload falhou para {nome}`,
      extensao_nao_suportada: `${ICONES_NIVEL.aviso} Extensão {extensao} não suportada pelo core plugin`,
      registrando: `${ICONES_DIAGNOSTICO.inicio} Registrando plugin: {nome} v{versao}`
    },
    executor: {
      reaproveitado_incremental: `${ICONES_DIAGNOSTICO.rapido} Reaproveitado {arquivo} (incremental)`
    }
  }
}, {
  sistema: {
    inicializacao: {
      sucesso: `${ICONES_FEEDBACK.foguete} Prometheus initialized in {tempo}ms`,
      falha: `${ICONES_STATUS.falha} Initialization failure: {erro}`,
      configuracao: `${ICONES_ARQUIVO.config} Configuration loaded: {fonte} ({campos} fields)`,
      erro_generico: `${ICONES_STATUS.falha} Error: {mensagem}`
    },
    shutdown: `${ICONES_STATUS.ok} Analysis concluded gracefully`,
    atualizacao: {
      executando: `${ICONES_ACAO.import} Running: {comando}`,
      sucesso: `${ICONES_STATUS.ok} Update completed successfully!`,
      falha: `${ICONES_STATUS.falha} Update aborted or failed.`,
      detalhes: `${ICONES_FEEDBACK.atencao} {detalhe}`
    },
    performance: {
      regressao_detectada: `${ICONES_FEEDBACK.atencao} Regression above {limite}% detected.`,
      sem_regressoes: `${ICONES_STATUS.ok} No significant regressions.`
    },
    poda: {
      cancelada: `${ICONES_STATUS.falha} Pruning canceled.`,
      concluida: `${ICONES_STATUS.ok} Pruning completed: Orphaned files removed successfully!`
    },
    reversao: {
      nenhum_move: `${ICONES_STATUS.falha} No move found for file: {arquivo}`,
      revertendo: `${ICONES_COMANDO.reverter} Reverting moves for: {arquivo}`,
      sucesso: `${ICONES_STATUS.ok} File reverted successfully: {arquivo}`,
      falha: `${ICONES_STATUS.falha} Failed to revert file: {arquivo}`
    },
    auto: {
      mapa_reversao: {
        erro_carregar: `${ICONES_STATUS.falha} Error loading rollback map: {erro}`,
        erro_salvar: `${ICONES_STATUS.falha} Error saving rollback map: {erro}`,
        move_nao_encontrado: `${ICONES_STATUS.falha} Move not found: {id}`,
        arquivo_destino_nao_encontrado: `${ICONES_STATUS.falha} Target file not found: {destino}`,
        arquivo_existe_origem: `${ICONES_FEEDBACK.atencao} File already exists at origin: {origem}`,
        erro_reverter: `${ICONES_STATUS.falha} Error reverting move: {erro}`,
        nenhum_move: `${ICONES_FEEDBACK.atencao} No move found for: {arquivo}`,
        revertendo_move: `${ICONES_COMANDO.reverter} Reverting move: {id}`,
        move_revertido: `${ICONES_STATUS.ok} Move reverted successfully: {id}`,
        falha_reverter_move: `${ICONES_STATUS.falha} Failed to revert move: {id}`,
        carregado: `${ICONES_RELATORIO.lista} Rollback map loaded: {moves} moves registered`,
        nenhum_encontrado: `${ICONES_RELATORIO.lista} No rollback map found, starting new one`
      },
      poda: {
        nenhum_arquivo: `${ICONES_STATUS.ok} No files to prune in this cycle.\n`,
        podando: `${ICONES_COMANDO.podar} Pruning {quantidade} files...`,
        podando_simulado: `${ICONES_COMANDO.podar} Pruning {quantidade} files... (SIMULATED)`,
        arquivo_movido: `${ICONES_STATUS.ok} {arquivo} moved to abandoned.`
      },
      corretor: {
        erro_criar_diretorio: `${ICONES_STATUS.falha} Failed to create directory for {destino}: {erro}`,
        destino_existe: `${ICONES_FEEDBACK.atencao} Destination already exists: {arquivo} → {destino}`,
        erro_mover: `${ICONES_STATUS.falha} Failed to move {arquivo} via rename: {erro}`
      }
    },
    correcoes: {
      nenhuma_disponivel: `${ICONES_STATUS.ok} No automatic corrections available`,
      aplicando: `${ICONES_ACAO.correcao} Applying automatic corrections in {modo} mode...`,
      arquivo_nao_encontrado: `${ICONES_FEEDBACK.atencao} File not found for correction: {arquivo}`,
      aplicada: `${ICONES_STATUS.ok} {titulo} (confidence: {confianca}%)`,
      corrigido: `${ICONES_STATUS.ok} Fixed: {arquivo}`,
      falha: `${ICONES_FEEDBACK.atencao} Failed to apply quick fix {id}: {erro}`,
      nenhuma_aplicada: `${ICONES_FEEDBACK.atencao} No corrections could be applied`,
      estatisticas: `${ICONES_STATUS.ok} {estatisticas}`,
      eslint_harmonia: `${ICONES_STATUS.ok} ESLint validation completed - harmony maintained`,
      eslint_ajustes: `${ICONES_STATUS.ok} ESLint applied additional adjustments for total harmony`,
      eslint_falha: `${ICONES_STATUS.falha} ESLint validation failed: {erro}`
    },
    processamento: {
      fix_detectada: `${ICONES_ACAO.correcao} --fix flag detected: activating automatic corrections`,
      eslint_output: `${ICONES_RELATORIO.lista} ESLint output: {output}`,
      resumo_ocorrencias: `${ICONES_DIAGNOSTICO.stats} Summary of {total} occurrences:`,
      dicas_contextuais: `${ICONES_FEEDBACK.dica} Contextual tips:`,
      detalhamento_ocorrencias: `${ICONES_DIAGNOSTICO.stats} Details of {total} occurrences:`,
      erros_criticos: `${ICONES_RELATORIO.error} {total} critical errors found - prioritize these first`,
      avisos_encontrados: `${ICONES_RELATORIO.warning} {total} warnings found`,
      quick_fixes_muitos: `${ICONES_ACAO.correcao} {total} automatic corrections available:`,
      quick_fixes_comando: '   → PROMETHEUS_ALLOW_MUTATE_FS=1 npm run diagnosticar --fix',
      quick_fixes_executar: '   (command ready to execute)',
      todos_muitos: `${ICONES_RELATORIO.lista} {total} TODOs found - consider --include to focus on specific area`,
      todos_poucos: `${ICONES_RELATORIO.lista} {total} TODOs found - good control!`,
      muitas_ocorrencias: `${ICONES_FEEDBACK.atencao} Many occurrences - use --executive for high-level view`,
      filtrar_pasta: `${ICONES_ARQUIVO.diretorio} Or filter by folder: --include "src/cli" or --include "src/analistas"`,
      usar_full: `${ICONES_DIAGNOSTICO.completo} Use --full for complete details`,
      usar_json: `${ICONES_ARQUIVO.json} Use --json for structured output (CI/scripts)`,
      projeto_limpo: `${ICONES_STATUS.ok} Clean project! Use --guardian-check for integrity check`,
      analistas_problemas: `${ICONES_DIAGNOSTICO.inicio} Analysts that found problems: {quantidade}`
    }
  },
  scanner: {
    inicio: `${ICONES_DIAGNOSTICO.inicio} Starting scan in: {diretorio}`,
    progresso: `${ICONES_ARQUIVO.diretorio} Scanning: {diretorio} ({arquivos} files)`,
    filtros: `${ICONES_DIAGNOSTICO.stats} Filters applied: {include} includes, {exclude} excludes`,
    completo: `${ICONES_STATUS.ok} Scan completed: {arquivos} files in {diretorios} directories`,
    arquivo_lido: `${ICONES_STATUS.ok} File read: {arquivo}`
  },
  analistas: {
    execucao: {
      inicio_simples: `${ICONES_DIAGNOSTICO.inicio} Analyzing {arquivo}`,
      sucesso_simples: `${ICONES_STATUS.ok} {arquivo}: {ocorrencias} issues`,
      inicio_detalhado: `${ICONES_DIAGNOSTICO.inicio} Running '{analista}' in {arquivo} ({tamanho}kb)`,
      sucesso_detalhado: `${ICONES_STATUS.ok} '{analista}' completed: {ocorrencias} occurrences ({tempo}ms)`,
      timeout: `${ICONES_FEEDBACK.atencao} Analyst '{analista}' timed out after {tempo}ms`,
      erro: `${ICONES_STATUS.falha} Error in analyst '{analista}': {erro}`,
      skip: `${ICONES_STATUS.pulado} Skipping '{arquivo}' (suppressed by configuration)`,
      batch_progresso: `${ICONES_DIAGNOSTICO.progresso} Progress: {arquivos}/{total} ({percentual}%)`,
      batch_concluido_simples: `${ICONES_STATUS.ok} Analysis concluded - {total} problems found`,
      batch_concluido_detalhado: `${ICONES_STATUS.ok} Checks completed - {total} problems detected in {duracao}s`
    },
    metricas: {
      performance: `${ICONES_DIAGNOSTICO.stats} Performance: {analistas} analysts, {media}ms/file average`,
      cache_hit: `${ICONES_DIAGNOSTICO.rapido} Cache hit: {hits}/{total} ({percentual}%)`,
      worker_pool: `${ICONES_STATUS.executando} Worker pool: {ativos}/{total} active workers`
    }
  },
  filtros: {
    incluindo: ` ${ICONES_ACAO.criar} Including: {pattern} ({matches} files)`,
    excluindo: ` ${ICONES_ACAO.deletar} Excluding: {pattern} ({matches} files)`,
    supressao: `${ICONES_STATUS.pausado} Suppressed {count} occurrences: {motivo}`,
    cli_override: `${ICONES_DIAGNOSTICO.stats} CLI override: {tipo} patterns overriding configuration`
  },
  projeto: {
    detectado: `${ICONES_RELATORIO.lista} Project detected: {tipo} ({confianca}% confidence)`,
    estrutura: `${ICONES_DIAGNOSTICO.stats} Structure: {arquivos} files, {linguagens} languages`,
    complexidade: `${ICONES_DIAGNOSTICO.stats} Complexity: {nivel} (based on {metricas})`,
    recomendacao: `${ICONES_FEEDBACK.dica} Recommendation: {acao} for this type of project`
  },
  contexto: {
    desenvolvedor_novo: `${ICONES_FEEDBACK.info} Simple project detected - simplified logs activated`,
    equipe_experiente: `${ICONES_FEEDBACK.info} Enterprise project detected - detailed logs activated`,
    ci_cd: `${ICONES_FEEDBACK.info} CI/CD environment detected - structured logs activated`,
    debug_mode: `${ICONES_FEEDBACK.info} Debug mode active - verbose logs activated`
  },
  ocorrencias: {
    critica: `${ICONES_NIVEL.critico} CRITICAL: {mensagem} in {arquivo}:{linha}`,
    aviso: `${ICONES_NIVEL.aviso} Warning: {mensagem} ({categoria})`,
    info: `${ICONES_NIVEL.info} Info: {mensagem}`,
    sugestao: `${ICONES_FEEDBACK.dica} Suggestion: {mensagem} - {acao_sugerida}`
  },
  relatorio: {
    resumo: `${ICONES_DIAGNOSTICO.stats} Summary: {total} issues ({criticos} critical, {avisos} warnings)`,
    categorias: `${ICONES_RELATORIO.lista} Top: {top_categorias}`,
    arquivo_problema: `${ICONES_FEEDBACK.atencao} More issues: {arquivo} ({count} occurrences)`,
    tendencia: `${ICONES_DIAGNOSTICO.stats} Trend: {direcao} compared to baseline`,
    repositorio_impecavel: 'Impeccable repository',
    ocorrencias_encontradas: 'Found {total} occurrences',
    fim_padroes_uso: `\n${ICONES_STATUS.ok} End of usage patterns report.\n`,
    funcoes_longas: `${ICONES_FEEDBACK.atencao} Long functions found:`,
    gerado: `${ICONES_ARQUIVO.arquivo} {formato} report generated: {caminho}`,
    erro_geracao: `${ICONES_STATUS.falha} Error generating report: {erro}`
  },
  conselheiro: {
    volume_alto: `${ICONES_FEEDBACK.info} High task volume? Code doesn't run away; burnout does.`,
    respira: `${ICONES_FEEDBACK.info} Hey, just a second: breathe for a moment.`,
    cuidado: `${ICONES_FEEDBACK.info} Take care of yourself: drink some water, stretch, close your eyes for 5 min. We'll continue later.\n`,
    madrugada: `${ICONES_FEEDBACK.atencao} It's past {hora}. Code compiles tomorrow; you rest now.`
  },
  guardian: {
    integridade_ok: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.ok} Guardian: integrity preserved.`,
    baseline_criado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} Guardian baseline created.`,
    baseline_aceito: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} Guardian: new baseline accepted — run again.`,
    alteracoes_detectadas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} Guardian: suspicious changes detected! Consider running 'prometheus guardian --diff'.`,
    bloqueado: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} Guardian blocked: suspicious changes or fatal error.`,
    modo_permissivo: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} Permissive mode: proceeding at risk.`,
    scan_only: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.info} Scan-only mode: {arquivos} files mapped.`,
    avisos_encontrados: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.aviso} There are warning-level occurrences`,
    full_scan_aviso: `${ICONES_NIVEL.aviso} --full-scan active: baseline will NOT be persisted with expanded scope.`,
    full_scan_warning_baseline: `${ICONES_NIVEL.aviso} --full-scan active, but a baseline with expanded scope will be temporarily created.`,
    aceitando_baseline: `\n${ICONES_COMANDO.atualizar} Accepting new integrity baseline...\n`,
    baseline_aceito_sucesso: `${ICONES_STATUS.ok} New integrity baseline accepted successfully!`,
    comparando_integridade: `\n${ICONES_DIAGNOSTICO.stats} Comparing Prometheus integrity with baseline...\n`,
    diferencas_detectadas: `${ICONES_RELATORIO.error} Differences detected:`,
    diferenca_item: '  - {diferenca}',
    comando_diff_recomendado: 'Run with --diff to show detailed differences or --accept to accept new baseline.',
    integridade_preservada: `${ICONES_STATUS.ok} No differences detected. Integrity preserved.`,
    verificando_integridade: `\n${ICONES_DIAGNOSTICO.guardian} Verifying Prometheus integrity...\n`,
    baseline_criado_console: `${ICONES_DIAGNOSTICO.guardian} Guardian baseline created`,
    baseline_atualizado: `${ICONES_DIAGNOSTICO.guardian} Baseline updated and accepted`,
    alteracoes_suspeitas: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_NIVEL.erro} Suspicious changes detected!`,
    erro_guardian: `${ICONES_DIAGNOSTICO.guardian} ${ICONES_STATUS.falha} Guardian error: {erro}`,
    info: `${ICONES_FEEDBACK.info} {mensagem}`,
    aviso: `${ICONES_FEEDBACK.atencao} {mensagem}`
  },
  metricas: {
    execucoes_registradas: `\n${ICONES_DIAGNOSTICO.stats} Registered executions: {quantidade}`,
    nenhum_historico: 'No metrics history found yet. Run a diagnosis with --metricas active.'
  },
  auto: {
    plugin_ignorado: `${ICONES_NIVEL.aviso} Plugin ignored ({plugin}): {erro}`,
    caminho_nao_resolvido: `${ICONES_NIVEL.aviso} Plugin path not resolved: {plugin}`,
    plugin_falhou: `${ICONES_STATUS.falha} Plugin failed: {plugin} — {erro}`,
    move_removido: `${ICONES_ACAO.deletar} Move removed from map: {id}`
  },
  core: {
    parsing: {
      erro_babel: `${ICONES_NIVEL.aviso} Babel parsing error in {arquivo}: {erro}`,
      erro_ts: `${ICONES_NIVEL.aviso} TS compiler parse error in {arquivo}: {erro}`,
      erro_xml: `${ICONES_NIVEL.aviso} XML parse error in {arquivo}: {erro}`,
      erro_html: `${ICONES_NIVEL.aviso} HTML parse error in {arquivo}: {erro}`,
      erro_css: `${ICONES_NIVEL.aviso} CSS parse error in {arquivo}: {erro}`,
      nenhum_parser: `${ICONES_NIVEL.aviso} No parser available for extension: {extensao}`,
      timeout_parsing: `${ICONES_NIVEL.aviso} Parsing timeout after {timeout}ms for extension {extensao}`,
      plugin_nao_encontrado: `${ICONES_NIVEL.aviso} Plugin not found for {extensao}, using legacy system`,
      sistema_plugins_falhou: `${ICONES_STATUS.falha} Plugin system failed: {erro}, using legacy system`,
      plugins_registrados: `${ICONES_DIAGNOSTICO.inicio} Default plugins registered in the system`,
      usando_plugin: `${ICONES_DIAGNOSTICO.inicio} Using plugin '{nome}' for {extensao}`
    },
    plugins: {
      erro_carregar: `${ICONES_STATUS.falha} Error loading plugin {nome}: {erro}`,
      tentando_autoload: `${ICONES_DIAGNOSTICO.inicio} Attempting autoload for extension {extensao}`,
      autoload_falhou: `${ICONES_STATUS.falha} Autoload failed for {nome}`,
      extensao_nao_suportada: `${ICONES_NIVEL.aviso} Extension {extensao} not supported by core plugin`,
      registrando: `${ICONES_DIAGNOSTICO.inicio} Registering plugin: {nome} v{versao}`
    },
    executor: {
      reaproveitado_incremental: `${ICONES_DIAGNOSTICO.rapido} Reused {arquivo} (incremental)`
    }
  }
});

/**
 * Configuração de contexto adaptativo para diferentes tipos de projeto
 */
export const LogContextConfiguracao = {
  // Projeto simples: poucos arquivos, um desenvolvedor
  simples: {
    nivel_detalhamento: 'basico',
    mostrar_performance: false,
    mostrar_cache: false,
    mostrar_workers: false,
    formato_arquivo: 'nome_apenas',
    // apenas nome do arquivo, não path completo
    agrupar_ocorrencias: true
  },
  // Projeto médio: equipe pequena, múltiplas linguagens
  medio: {
    nivel_detalhamento: 'moderado',
    mostrar_performance: true,
    mostrar_cache: false,
    mostrar_workers: false,
    formato_arquivo: 'relativo',
    // path relativo
    agrupar_ocorrencias: true
  },
  // Projeto complexo: grande equipe, CI/CD, múltiplos módulos
  complexo: {
    nivel_detalhamento: 'completo',
    mostrar_performance: true,
    mostrar_cache: true,
    mostrar_workers: true,
    formato_arquivo: 'completo',
    // path completo + metadados
    agrupar_ocorrencias: false
  },
  // Ambiente CI/CD: logs estruturados, sem cores
  ci: {
    nivel_detalhamento: 'estruturado',
    mostrar_performance: true,
    mostrar_cache: true,
    mostrar_workers: true,
    formato_arquivo: 'relativo',
    agrupar_ocorrencias: false,
    formato_saida: 'json_lines'
  }
} as const;