// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const ExcecoesMensagens = createI18nMessages({
  // CLI
  exit1: 'exit:1',
  requireMutateFsAutoFix: 'Auto-fix indisponível',
  autoFixTimeout: (timeoutMs: number) => `Auto-fix timeout após ${timeoutMs}ms`,
  // Plugins / import seguro
  pluginsDesabilitadosSafeMode: 'Carregamento de plugins desabilitado em SAFE_MODE. Defina PROMETHEUS_ALLOW_PLUGINS=1 para permitir.',
  pluginBloqueado: (erro: string) => `Plugin bloqueado: ${erro}`,
  caminhoPluginNaoResolvido: 'Caminho de plugin não resolvido',
  // Registry de plugins
  pluginRegistradoNaoPodeSerObtido: (name: string) => `Plugin ${name} está registrado mas não pode ser obtido`,
  pluginCarregandoPromiseNaoPodeSerObtida: (name: string) => `Plugin ${name} está sendo carregado mas promise não pode ser obtida`,
  naoFoiPossivelCarregarPlugin: (name: string, errMsg: string) => `Não foi possível carregar o plugin '${name}': ${errMsg}`,
  pluginDeveTerNomeValido: 'Plugin deve ter um nome válido',
  pluginDeveTerVersaoValida: 'Plugin deve ter uma versão válida',
  pluginDeveDefinirPeloMenosUmaExtensao: 'Plugin deve definir pelo menos uma extensão',
  pluginDeveImplementarMetodoParse: 'Plugin deve implementar método parse()',
  // Tipos/Analistas
  definicaoAnalistaInvalida: 'Definição de analista inválida',
  analistaSemFuncaoAplicar: (nome: string) => `Analista ${nome} sem função aplicar`,
  // Validação / Segurança
  caminhoForaDaCwdNaoPermitido: (p: string) => `Caminho fora da CWD não permitido: ${p}`,
  persistenciaNegadaForaRaizProjeto: (caminho: string) => `Persistência negada: caminho fora da raiz do projeto: ${caminho}`,
  // Persistência (ambiente)
  fsWriteFileBinaryIndisponivel: 'fs.writeFile (binary) indisponível no ambiente atual',
  fsReadFileIndisponivel: 'fs.readFile indisponível no ambiente atual',
  fsWriteFileIndisponivel: 'fs.writeFile indisponível no ambiente atual',
  fsRenameIndisponivel: 'fs.rename indisponível no ambiente atual',
  fsMkdirIndisponivel: 'fs.mkdir indisponível no ambiente atual',
  // Schema
  versaoSchemaDesconhecida: (versao: string) => `Versão de schema desconhecida: ${versao}`,
  relatorioSchemaInvalido: (erros: string) => `Relatório com schema inválido: ${erros}`,
  // File registry
  arquivoNaoEncontrado: (fileCaminho: string) => `Arquivo não encontrado: ${fileCaminho}`,
  validacaoFalhouPara: (fileCaminho: string) => `Validação falhou para ${fileCaminho}`,
  erroAoLer: (fileCaminho: string, errMsg: string) => `Erro ao ler ${fileCaminho}: ${errMsg}`,
  erroAoEscrever: (fileCaminho: string, errMsg: string) => `Erro ao escrever ${fileCaminho}: ${errMsg}`,
  erroAoDeletar: (fileCaminho: string, errMsg: string) => `Erro ao deletar ${fileCaminho}: ${errMsg}`,
  // Scanner
  statIndefinidoPara: (fullCaminho: string) => `Stat indefinido para ${fullCaminho}`,
  // Reversão
  mapaReversaoCorrompido: 'Mapa de reversão corrompido',
  // Relatórios
  semPkg: 'sem pkg'
}, {
  exit1: 'exit:1',
  requireMutateFsAutoFix: 'Auto-fix unavailable',
  autoFixTimeout: (timeoutMs: number) => `Auto-fix timeout after ${timeoutMs}ms`,
  pluginsDesabilitadosSafeMode: 'Plugin loading disabled in SAFE_MODE. Set PROMETHEUS_ALLOW_PLUGINS=1 to allow.',
  pluginBloqueado: (erro: string) => `Plugin blocked: ${erro}`,
  caminhoPluginNaoResolvido: 'Plugin path not resolved',
  pluginRegistradoNaoPodeSerObtido: (name: string) => `Plugin ${name} is registered but cannot be obtained`,
  pluginCarregandoPromiseNaoPodeSerObtida: (name: string) => `Plugin ${name} is loading but promise cannot be obtained`,
  naoFoiPossivelCarregarPlugin: (name: string, errMsg: string) => `Could not load plugin '${name}': ${errMsg}`,
  pluginDeveTerNomeValido: 'Plugin must have a valid name',
  pluginDeveTerVersaoValida: 'Plugin must have a valid version',
  pluginDeveDefinirPeloMenosUmaExtensao: 'Plugin must define at least one extension',
  pluginDeveImplementarMetodoParse: 'Plugin must implement parse() method',
  definicaoAnalistaInvalida: 'Invalid analyst definition',
  analistaSemFuncaoAplicar: (nome: string) => `Analyst ${nome} without apply function`,
  caminhoForaDaCwdNaoPermitido: (p: string) => `Path outside CWD not allowed: ${p}`,
  persistenciaNegadaForaRaizProjeto: (caminho: string) => `Persistence denied: path outside project root: ${caminho}`,
  fsWriteFileBinaryIndisponivel: 'fs.writeFile (binary) unavailable in current environment',
  fsReadFileIndisponivel: 'fs.readFile unavailable in current environment',
  fsWriteFileIndisponivel: 'fs.writeFile unavailable in current environment',
  fsRenameIndisponivel: 'fs.rename unavailable in current environment',
  fsMkdirIndisponivel: 'fs.mkdir unavailable in current environment',
  versaoSchemaDesconhecida: (versao: string) => `Unknown schema version: ${versao}`,
  relatorioSchemaInvalido: (erros: string) => `Report with invalid schema: ${erros}`,
  arquivoNaoEncontrado: (fileCaminho: string) => `File not found: ${fileCaminho}`,
  validacaoFalhouPara: (fileCaminho: string) => `Validation failed for ${fileCaminho}`,
  erroAoLer: (fileCaminho: string, errMsg: string) => `Error reading ${fileCaminho}: ${errMsg}`,
  erroAoEscrever: (fileCaminho: string, errMsg: string) => `Error writing ${fileCaminho}: ${errMsg}`,
  erroAoDeletar: (fileCaminho: string, errMsg: string) => `Error deleting ${fileCaminho}: ${errMsg}`,
  statIndefinidoPara: (fullCaminho: string) => `Stat undefined for ${fullCaminho}`,
  mapaReversaoCorrompido: 'Rollback map corrupted',
  semPkg: 'no pkg'
});