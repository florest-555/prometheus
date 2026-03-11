// SPDX-License-Identifier: MIT-0
import { analistaGithubActions } from '../../../src/analistas/plugins/analista-github-actions';
import { analistaGithubActions } from '../../../src/analistas/plugins/analista-github-actions';

describe('analistaGithubActions', () => {
  it('should be defined', () => {
    expect(analistaGithubActions).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaGithubActions.nome).toBe('analista-github-actions');
  });
});
