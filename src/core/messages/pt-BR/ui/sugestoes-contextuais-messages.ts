// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

import { ICONES_ACAO, ICONES_ARQUIVO, ICONES_FEEDBACK } from './icons.js';

export const SugestoesContextuaisMensagens = createI18nMessages({
  arquetipoNaoIdentificado: 'Não foi possível identificar um arquétipo específico. Considere adicionar mais estrutura ao projeto.',
  projetoIdentificado: (tecnologia: string | undefined, confiancaPercent: number) => `${ICONES_FEEDBACK.info} Projeto identificado como: ${tecnologia} (confiança: ${confiancaPercent}%)`,
  evidenciaDependencia: (dependencia: string, tecnologia: string | undefined) => `${ICONES_ARQUIVO.package} Dependência ${dependencia} confirma projeto ${tecnologia}`,
  evidenciaImport: (valor: string, localizacao: string | undefined) => `${ICONES_ACAO.import} Import ${valor} detectado em ${localizacao}`,
  evidenciaCodigo: (localizacao: string | undefined) => `${ICONES_ARQUIVO.codigo} Padrão de código específico detectado em ${localizacao}`,
  evidenciaEstrutura: (valor: string, tecnologia: string | undefined) => `${ICONES_ARQUIVO.diretorio} Estrutura ${valor} típica de ${tecnologia}`,
  tecnologiasAlternativas: (alternativas: string) => `${ICONES_ACAO.analise} Outras tecnologias detectadas: ${alternativas}`,
  erroAnaliseContextual: (erro: string) => `Erro na análise contextual: ${erro}`,
  erroDuranteAnalise: 'Erro durante análise contextual inteligente'
}, {
  arquetipoNaoIdentificado: 'Could not identify a specific archetype. Consider adding more structure to the project.',
  projetoIdentificado: (tecnologia: string | undefined, confiancaPercent: number) => `${ICONES_FEEDBACK.info} Project identified as: ${tecnologia} (confidence: ${confiancaPercent}%)`,
  evidenciaDependencia: (dependencia: string, tecnologia: string | undefined) => `${ICONES_ARQUIVO.package} Dependency ${dependencia} confirms ${tecnologia} project`,
  evidenciaImport: (valor: string, localizacao: string | undefined) => `${ICONES_ACAO.import} Import ${valor} detected at ${localizacao}`,
  evidenciaCodigo: (localizacao: string | undefined) => `${ICONES_ARQUIVO.codigo} Specific code pattern detected at ${localizacao}`,
  evidenciaEstrutura: (valor: string, tecnologia: string | undefined) => `${ICONES_ARQUIVO.diretorio} Structure ${valor} typical of ${tecnologia}`,
  tecnologiasAlternativas: (alternativas: string) => `${ICONES_ACAO.analise} Other technologies detected: ${alternativas}`,
  erroAnaliseContextual: (erro: string) => `Error in contextual analysis: ${erro}`,
  erroDuranteAnalise: 'Error during intelligent contextual analysis'
});
