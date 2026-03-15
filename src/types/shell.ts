// SPDX-License-Identifier: MIT-0

export interface ProblemaShell {
  tipo: string;
  nivel: 'erro' | 'aviso' | 'info';
  mensagem: string;
  linha?: number;
  coluna?: number;
  contexto?: string;
}
