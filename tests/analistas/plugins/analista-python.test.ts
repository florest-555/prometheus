// SPDX-License-Identifier: MIT-0
import { analistaPython } from '../../../src/analistas/plugins/analista-python';

describe('analistaPython', () => {
  it('should be defined', () => {
    expect(analistaPython).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaPython.nome).toBe('analista-python');
  });
});
