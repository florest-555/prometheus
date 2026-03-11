// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorDependenciasMensagens = createI18nMessages({
  importDependenciaExterna: (val: string) => `Importação de dependência externa: '${val}'`,
  importRelativoLongo: (val: string) => `Import relativo sobe muitos diretórios: '${val}'`,
  importJsEmTs: (val: string) => `Importação de arquivo .js em TypeScript: '${val}'`,
  importArquivoInexistente: (val: string) => `Importação de arquivo inexistente: '${val}'`,
  requireDependenciaExterna: (val: string) => `Require de dependência externa: '${val}'`,
  requireRelativoLongo: (val: string) => `Require relativo sobe muitos diretórios: '${val}'`,
  requireJsEmTs: (val: string) => `Require de arquivo .js em TypeScript: '${val}'`,
  requireArquivoInexistente: (val: string) => `Require de arquivo inexistente: '${val}'`,
  importUsadoRegistroDinamico: (nome: string) => `Import '${nome}' usado via registro dinâmico (heurística)`,
  usoMistoRequireImport: 'Uso misto de require e import no mesmo arquivo. Padronize para um só estilo.',
  importCircularSelf: 'Importação circular detectada: o arquivo importa a si mesmo.',
  dependenciaCircular: (totalArquivos: number, caminhoCompleto: string) => `Dependência circular detectada (${totalArquivos} arquivo(s)): ${caminhoCompleto}`,
  importSemExtensao: (modulo: string) => `Import sem extensão explícita: '${modulo}'. Considere adicionar para clareza.`,
  importHttpInseguro: (url: string) => `Import de URL HTTP (inseguro): '${url}'. Use HTTPS.`,
  importNaoResolvido: (modulo: string) => `Módulo não resolvido: '${modulo}'. Verifique installed/typos.`,
  duplicataDependencia: (nome: string) => `Dependência duplicada detectada: '${nome}'. Remova duplicatas.`,
  dependenciaFantasmaImport: (nome: string) => `Dependência fantasma: "${nome}" é importado mas não está no package.json.`,
  dependenciaFantasmaRequire: (nome: string) => `Dependência fantasma: "${nome}" é requerido mas não está no package.json.`
}, {
  importDependenciaExterna: (val: string) => `External dependency import: '${val}'`,
  importRelativoLongo: (val: string) => `Relative import goes up too many directories: '${val}'`,
  importJsEmTs: (val: string) => `.js file import in TypeScript: '${val}'`,
  importArquivoInexistente: (val: string) => `Import of non-existent file: '${val}'`,
  requireDependenciaExterna: (val: string) => `External dependency require: '${val}'`,
  requireRelativoLongo: (val: string) => `Relative require goes up too many directories: '${val}'`,
  requireJsEmTs: (val: string) => `.js file require in TypeScript: '${val}'`,
  requireArquivoInexistente: (val: string) => `Require of non-existent file: '${val}'`,
  importUsadoRegistroDinamico: (nome: string) => `Import '${nome}' used via dynamic registry (heuristic)`,
  usoMistoRequireImport: 'Mixed use of require and import in the same file. Standardize to a single style.',
  importCircularSelf: 'Circular import detected: the file imports itself.',
  dependenciaCircular: (totalArquivos: number, caminhoCompleto: string) => `Circular dependency detected (${totalArquivos} file(s)): ${caminhoCompleto}`,
  importSemExtensao: (modulo: string) => `Import without explicit extension: '${modulo}'. Consider adding for clarity.`,
  importHttpInseguro: (url: string) => `Import from HTTP URL (insecure): '${url}'. Use HTTPS.`,
  importNaoResolvido: (modulo: string) => `Unresolved module: '${modulo}'. Check if installed/typos.`,
  duplicataDependencia: (nome: string) => `Duplicate dependency detected: '${nome}'. Remove duplicates.`,
  dependenciaFantasmaImport: (nome: string) => `Phantom dependency: "${nome}" is imported but not in package.json.`,
  dependenciaFantasmaRequire: (nome: string) => `Phantom dependency: "${nome}" is required but not in package.json.`
});