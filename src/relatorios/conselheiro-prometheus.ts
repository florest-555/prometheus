// SPDX-License-Identifier: MIT-0
import { logConselheiro } from '@core/messages/index.js';

import type { ConselhoContextoPrometheus } from '@';

// Re-exporta para compatibilidade com nome original
export type ConselhoContexto = ConselhoContextoPrometheus;

const HORA_MADRUGADA_INICIO = 23;
const HORA_MADRUGADA_FIM = 4;
const ARQUIVOS_PARA_CORRIGIR_LIMITE = 200;
const ARQUIVOS_PARA_PODAR_LIMITE = 200;

export function emitirConselhoPrometheus(
  estresse: ConselhoContextoPrometheus,
): void {
  const {
    hora = new Date().getHours(),
    arquivosParaCorrigir = 0,
    arquivosParaPodar = 0,
  } = estresse;

  const madrugada = hora >= HORA_MADRUGADA_INICIO || hora < HORA_MADRUGADA_FIM;
  const muitosArquivos = arquivosParaCorrigir > ARQUIVOS_PARA_CORRIGIR_LIMITE || arquivosParaPodar > ARQUIVOS_PARA_PODAR_LIMITE;

  if (!madrugada && !muitosArquivos) return;

  // Primeira linha com frase-chave esperada pelos testes
  logConselheiro.respira();
  if (madrugada) {
    // Mensagem deve conter a expressão "passa das 2h" para testes
    const horaRef = hora >= 2 && hora < 3 ? '2h' : `${hora}h`;
    logConselheiro.madrugada(horaRef);
  }
  if (muitosArquivos) {
    // Deve conter "volume de tarefas" (minúsculas) para os testes
    logConselheiro.volumeAlto();
  }
  logConselheiro.cuidado();
}
