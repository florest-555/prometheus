// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const AnalistaFuncoesLongasMensagens = createI18nMessages({
  funcaoLonga: (linhas: number, maximo: number) => `Função com ${linhas} linhas (máx: ${maximo})`,
  muitosParametros: (quantidade: number, maximo: number) => `Função com muitos parâmetros (${quantidade}, máx: ${maximo})`,
  funcaoAninhada: (nivel: number, maximo: number) => `Função aninhada em nível ${nivel} (máx: ${maximo})`,
  funcaoSemComentario: () => 'Função sem comentário acima.'
}, {
  funcaoLonga: (linhas: number, maximo: number) => `Function with ${linhas} lines (max: ${maximo})`,
  muitosParametros: (quantidade: number, maximo: number) => `Function with many parameters (${quantidade}, max: ${maximo})`,
  funcaoAninhada: (nivel: number, maximo: number) => `Function nested at level ${nivel} (max: ${maximo})`,
  funcaoSemComentario: () => 'Function without comment above.'
});
