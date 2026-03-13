// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registrarComandos } from '../../src/cli/comandos';
import * as commands from '../../src/cli/commands/index';

vi.mock('../../src/cli/commands/index', () => ({
  comandoAnalistas: vi.fn(),
  comandoAtualizar: vi.fn(),
  comandoDiagnosticar: vi.fn(),
  comandoFormatar: vi.fn(),
  comandoGuardian: vi.fn(),
  comandoKit: vi.fn(),
  comandoLicencas: vi.fn(),
  comandoMetricas: vi.fn(),
  comandoNames: vi.fn(),
  comandoOtimizarSvg: vi.fn(),
  comandoPodar: vi.fn(),
  comandoReestruturar: vi.fn(),
  comandoRename: vi.fn(),
  criarComandoFixTypes: vi.fn(),
  registrarComandoReverter: vi.fn(),
}));

describe('cli/comandos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registrarComandos should add all configured commands to the program', () => {
    const mockProgram = {
      addCommand: vi.fn(),
    };
    const mockFlags = vi.fn();

    registrarComandos(mockProgram as any, mockFlags);

    // Verify all command factories are called
    expect(commands.comandoDiagnosticar).toHaveBeenCalledWith(mockFlags);
    expect(commands.comandoGuardian).toHaveBeenCalledWith(mockFlags);
    expect(commands.comandoFormatar).toHaveBeenCalledWith(mockFlags);
    expect(commands.comandoOtimizarSvg).toHaveBeenCalledWith(mockFlags);
    expect(commands.comandoPodar).toHaveBeenCalledWith(mockFlags);
    expect(commands.comandoReestruturar).toHaveBeenCalledWith(mockFlags);
    expect(commands.comandoAtualizar).toHaveBeenCalledWith(mockFlags);
    
    // Commands without flags setup
    expect(commands.comandoAnalistas).toHaveBeenCalled();
    expect(commands.comandoMetricas).toHaveBeenCalled();
    expect(commands.criarComandoFixTypes).toHaveBeenCalled();
    expect(commands.comandoLicencas).toHaveBeenCalled();
    expect(commands.comandoKit).toHaveBeenCalledWith(mockFlags);

    expect(commands.comandoNames).toHaveBeenCalledWith(mockFlags);
    expect(commands.comandoRename).toHaveBeenCalledWith(mockFlags);

    // Special registrar function
    expect(commands.registrarComandoReverter).toHaveBeenCalledWith(mockProgram);

    // Program should have had `addCommand` called for each (minus the registrar logic)
    expect(mockProgram.addCommand).toHaveBeenCalled();
  });
});
