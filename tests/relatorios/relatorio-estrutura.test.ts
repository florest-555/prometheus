// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { gerarRelatorioEstrutura } from '../../src/relatorios/relatorio-estrutura';

describe('relatorio-estrutura', () => {
  it('should return success message for aligned structure', () => {
    const mapa = [
      { arquivo: 'a.ts', atual: 'src', ideal: 'src' },
      { arquivo: 'b.ts', atual: 'src/components', ideal: 'src/components' },
    ];
    const result = gerarRelatorioEstrutura(mapa);
    expect(result).toContain('Estrutura verificada');
    expect(result).toContain('Tudo está em sua camada ideal');
  });

  it('should return diagnostic message for unaligned structure', () => {
    const mapa = [
      { arquivo: 'a.ts', atual: 'src', ideal: 'src' },
      { arquivo: 'b.ts', atual: 'src', ideal: 'src/components' }, // misaligned
    ];
    const result = gerarRelatorioEstrutura(mapa);
    expect(result).toContain('Diagnóstico de Estrutura');
    expect(result).toContain('1 arquivo(s) fora da camada esperada');
    expect(result).toContain('`b.ts` está em `src`, deveria estar em `src/components`');
  });

  it('should handle empty map', () => {
    const result = gerarRelatorioEstrutura([]);
    expect(result).toContain('Estrutura verificada');
  });
});
