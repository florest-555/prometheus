// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { emitirConselhoPrometheus } from '../../src/relatorios/conselheiro-prometheus';
import * as logs from '../../src/core/messages/index';

vi.mock('../../src/core/messages/index.js', () => ({
  logConselheiro: {
    respira: vi.fn(),
    madrugada: vi.fn(),
    volumeAlto: vi.fn(),
    cuidado: vi.fn(),
  }
}));

describe('conselheiro-prometheus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not emit advice during normal hours with low volume', () => {
    emitirConselhoPrometheus({ hora: 14, arquivosParaCorrigir: 10, arquivosParaPodar: 5 });
    expect(logs.logConselheiro.respira).not.toHaveBeenCalled();
    expect(logs.logConselheiro.madrugada).not.toHaveBeenCalled();
    expect(logs.logConselheiro.volumeAlto).not.toHaveBeenCalled();
  });

  it('should emit advice late at night (e.g. 23:00)', () => {
    emitirConselhoPrometheus({ hora: 23, arquivosParaCorrigir: 10, arquivosParaPodar: 5 });
    expect(logs.logConselheiro.respira).toHaveBeenCalled();
    expect(logs.logConselheiro.madrugada).toHaveBeenCalledWith('23h');
  });

  it('should emit advice specifically for 2am', () => {
    emitirConselhoPrometheus({ hora: 2, arquivosParaCorrigir: 10, arquivosParaPodar: 5 });
    expect(logs.logConselheiro.madrugada).toHaveBeenCalledWith('2h');
  });

  it('should emit advice for high volume of files to fix', () => {
    emitirConselhoPrometheus({ hora: 14, arquivosParaCorrigir: 201, arquivosParaPodar: 5 });
    expect(logs.logConselheiro.volumeAlto).toHaveBeenCalled();
    expect(logs.logConselheiro.cuidado).toHaveBeenCalled();
  });

  it('should emit advice for high volume of files to prune', () => {
    emitirConselhoPrometheus({ hora: 14, arquivosParaCorrigir: 5, arquivosParaPodar: 205 });
    expect(logs.logConselheiro.volumeAlto).toHaveBeenCalled();
  });

  it('should handle both conditions combined', () => {
    emitirConselhoPrometheus({ hora: 1, arquivosParaCorrigir: 300, arquivosParaPodar: 10 });
    expect(logs.logConselheiro.madrugada).toHaveBeenCalled();
    expect(logs.logConselheiro.volumeAlto).toHaveBeenCalled();
    expect(logs.logConselheiro.cuidado).toHaveBeenCalled();
  });
});
