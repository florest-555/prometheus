// SPDX-License-Identifier: MIT-0

export interface ConfigExcludesPadrao {
  padroesSistema: string[];
  nodeJs: string[];
  typeScript: string[];
  python: string[];
  java: string[];
  dotnet: string[];
  ferramentasDev: string[];
  controleVersao: string[];
  temporarios: string[];
  documentacao: string[];
  metadata: {
    versao: string;
    ultimaAtualizacao: string;
    descricao: string;
  };
}
