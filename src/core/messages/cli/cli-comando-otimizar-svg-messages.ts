// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoOtimizarSvgMensagens = createI18nMessages({
  descricao: 'Otimiza SVGs do projeto usando o otimizador interno (svgo-like).',
  opcoes: {
    dir: 'Diretório base para a operação',
    write: 'Aplica as mudanças no filesystem',
    dry: 'Executa em modo simulação (não grava mudanças no disco)',
    include: 'Glob pattern a INCLUIR (pode repetir a flag ou usar vírgulas / espaços para múltiplos)',
    exclude: 'Glob pattern a EXCLUIR adicionalmente (pode repetir a flag ou usar vírgulas / espaços)'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando otimizar-svg: ${erro}`,
    falhaOtimizar: (erro: string) => `Falha ao otimizar SVGs: ${erro}`
  },
  status: {
    titulo: 'OTIMIZAR SVG',
    linhaLogOtimizacao: (rel: string, original: string, otimizado: string, economia: string) =>
      `${rel} — ${original} → ${otimizado} (−${economia})`,
    linhaLogDry: (rel: string, original: string, otimizado: string, economia: string) =>
      `[dry] ${rel} — ${original} → ${otimizado} (−${economia})`,
    nenhumSugerido: 'Nenhum SVG acima do limiar de otimização.',
    resumoCandidatos: (candidatos: number, economia: string, total: number) =>
      `Candidatos: ${candidatos} | Economia potencial: ${economia} | Total de SVGs lidos: ${total}`,
    concluidoWrite: (otimizados: number, candidatos: number) =>
      `Otimização aplicada em ${otimizados}/${candidatos} arquivos.`,
    avisoDicaWrite: 'Use --write para aplicar as otimizações.'
  }
}, {
  descricao: 'Optimizes project SVGs using internal optimizer (svgo-like).',
  opcoes: {
    dir: 'Base directory for the operation',
    write: 'Apply changes to the filesystem',
    dry: 'Execute in simulation mode (does not write changes to disk)',
    include: 'Glob pattern to INCLUDE (can repeat the flag or use commas/spaces for multiple)',
    exclude: 'Glob pattern to EXCLUDE additionally (can repeat the flag or use commas/spaces)'
  },
  erros: {
    falhaFlags: (erro: string) => `Failed to apply flags to optimize-svg command: ${erro}`,
    falhaOtimizar: (erro: string) => `Failed to optimize SVGs: ${erro}`
  },
  status: {
    titulo: 'OPTIMIZE SVG',
    linhaLogOtimizacao: (rel: string, original: string, otimizado: string, economia: string) =>
      `${rel} — ${original} → ${otimizado} (−${economia})`,
    linhaLogDry: (rel: string, original: string, otimizado: string, economia: string) =>
      `[dry] ${rel} — ${original} → ${otimizado} (−${economia})`,
    nenhumSugerido: 'No SVGs above optimization threshold.',
    resumoCandidatos: (candidatos: number, economia: string, total: number) =>
      `Candidates: ${candidatos} | Potential savings: ${economia} | Total SVGs read: ${total}`,
    concluidoWrite: (otimizados: number, candidatos: number) =>
      `Optimization applied to ${otimizados}/${candidatos} files.`,
    avisoDicaWrite: 'Use --write to apply optimizations.'
  }
});
