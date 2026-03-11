// SPDX-License-Identifier: MIT-0

export type TipoProjeto =
  | 'desconhecido'
  | 'landing'
  | 'api'
  | 'lib'
  | 'cli'
  | 'fullstack'
  | 'monorepo';

export interface SinaisProjeto {
  temPages?: boolean;
  temComponents?: boolean;
  temControllers?: boolean;
  temApi?: boolean;
  temExpress?: boolean;
  temSrc?: boolean;
  temCli?: boolean;
  temPrisma?: boolean;
  temPackages?: boolean;
  temTestes?: boolean;
  temCiCd?: boolean;
  temDocker?: boolean;
}

export interface DiagnosticoProjeto {
  tipo: TipoProjeto;
  sinais: (keyof SinaisProjeto)[];
  confiabilidade: number;
}
