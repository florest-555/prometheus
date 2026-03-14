// SPDX-License-Identifier: MIT-0
import { PROMETHEUS_ARQUIVOS } from '@core/registry/paths.js';

/**
 * [*] Caminho absoluto para o arquivo de baseline principal (usado pelo Sentinela).
 *
 * Usa o sistema de paths centralizado: .prometheus/guardian.baseline.json
 * Com fallback automático para baseline.json legado se necessário.
 */
export const LINHA_BASE_CAMINHO = PROMETHEUS_ARQUIVOS.GUARDIAN_BASELINE;

/**
 * [*] Caminho padrão para os registros da Vigia Oculta.
 *
 * Integridade de execução armazenada em .prometheus/integridade.json
 */
export const REGISTRO_VIGIA_CAMINHO_PADRAO = PROMETHEUS_ARQUIVOS.REGISTRO_VIGIA;
/**
 * [HASH] Algoritmo padrão utilizado para hashing de integridade.
 * (BLAKE3 é o padrão universal do Guardian.)
 */
export const ALGORITMO_HASH = 'blake3';