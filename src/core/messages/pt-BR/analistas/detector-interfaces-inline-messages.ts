// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorInterfacesInlineMensagens = createI18nMessages({
  moverTipoParaTipos: (nomeTipo: string, tiposDir = 'src/tipos') => `Mover tipo '${nomeTipo}' para ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceExportadaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `Interface '${nomeInterface}' exportada deve estar em ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceComplexaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `Interface '${nomeInterface}' complexa deve ser movida para ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  tipoDuplicado: (args: {
    propriedades: string[];
    totalOcorrencias: number;
    contextoDesc: string;
    nomesSugeridos: string;
  }) => `Tipo {${args.propriedades.join(', ')}...} duplicado ${args.totalOcorrencias}x ${args.contextoDesc} - extrair como '${args.nomesSugeridos}Type'`
}, {
  moverTipoParaTipos: (nomeTipo: string, tiposDir = 'src/tipos') => `Move type '${nomeTipo}' to ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceExportadaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `Exported interface '${nomeInterface}' should be in ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  interfaceComplexaParaTipos: (nomeInterface: string, tiposDir = 'src/tipos') => `Complex interface '${nomeInterface}' should be moved to ${tiposDir.endsWith('/') ? tiposDir : `${tiposDir}/`}`,
  tipoDuplicado: (args: {
    propriedades: string[];
    totalOcorrencias: number;
    contextoDesc: string;
    nomesSugeridos: string;
  }) => `Type {${args.propriedades.join(', ')}...} duplicated ${args.totalOcorrencias}x ${args.contextoDesc} - extract as '${args.nomesSugeridos}Type'`
});