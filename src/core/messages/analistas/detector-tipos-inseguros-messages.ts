// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorTiposInsegurosMensagens = createI18nMessages({
  tipoInseguroObject: () => 'Tipo Object é muito permissivo - qualquer valor é aceito',
  tipoInseguroFunction: () => 'Tipo Function é muito permissivo - aceita qualquer função',
  tipoInseguroEmptyObject: () => 'Objeto vazio {} é permissivo - não garante estrutura',
  sugestaoObject: () => 'Use tipo específico: string, number[], Record<string, T>, interface específica',
  sugestaoFunction: () => 'Defina assinatura específica: (param: Tipo) => RetornoType ou use CallableType',
  sugestaoEmptyObject: () => 'Defina interface ou type específico para o objeto',
  revisaoManual: () => 'Revisão manual recomendada'
}, {
  tipoInseguroObject: () => 'Type Object is too permissive - any value is accepted',
  tipoInseguroFunction: () => 'Type Function is too permissive - accepts any function',
  tipoInseguroEmptyObject: () => 'Empty object {} is permissive - does not guarantee structure',
  sugestaoObject: () => 'Use specific type: string, number[], Record<string, T>, specific interface',
  sugestaoFunction: () => 'Define specific signature: (param: Type) => ReturnType or use CallableType',
  sugestaoEmptyObject: () => 'Define specific interface or type for the object',
  revisaoManual: () => 'Manual review recommended'
});
