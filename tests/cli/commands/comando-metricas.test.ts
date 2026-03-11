// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { comandoMetricas } from '../../../src/cli/commands/comando-metricas';
import * as persistencia from '../../../src/shared/persistence/persistencia';
import { config } from '../../../src/core/config/config';

vi.mock('../../../src/shared/persistence/persistencia', () => ({
  lerEstado: vi.fn(),
  salvarEstado: vi.fn(),
}));

// Mock console.log for json output
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('cli/commands/comando-metricas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should define metricas command properly', () => {
    const cmd = comandoMetricas();
    expect(cmd.name()).toBe('metricas');
    expect(cmd.options.some(o => o.long === '--json')).toBe(true);
  });

  it('should call action to read metricas, and handle gracefully empty DB', async () => {
    const cmd = comandoMetricas();
    
    vi.mocked(persistencia.lerEstado).mockResolvedValueOnce([]);

    await cmd.parseAsync(['node', 'test']);
    
    expect(persistencia.lerEstado).toHaveBeenCalledWith(config.ANALISE_METRICAS_HISTORICO_PATH);
  });

  it('should export json if requested', async () => {
    const cmd = comandoMetricas();
    
    const fakeData = [
      { timestamp: 1234, tempoAnaliseMs: 10, totalArquivos: 5 },
      { timestamp: 1235, tempoAnaliseMs: 20, totalArquivos: 3 }
    ];
    vi.mocked(persistencia.lerEstado).mockResolvedValueOnce(fakeData as any[]);

    await cmd.parseAsync(['node', 'test', '--json']);

    expect(consoleSpy).toHaveBeenCalled();
    const jsonCall = consoleSpy.mock.calls.find(call => typeof call[0] === 'string' && call[0].includes('"historico":'));
    const jsonOutput = jsonCall ? jsonCall[0] : consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(jsonOutput);
    expect(parsed.total).toBe(2);
    expect(parsed.historico).toHaveLength(2);
    expect(parsed.agregados).toBeDefined();
  });

  it('should export to file if requested', async () => {
    const cmd = comandoMetricas();
    
    vi.mocked(persistencia.lerEstado).mockResolvedValueOnce([]);

    await cmd.parseAsync(['node', 'test', '--export', 'my-metrics.json']);

    expect(persistencia.salvarEstado).toHaveBeenCalled();
  });
});
