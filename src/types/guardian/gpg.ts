// SPDX-License-Identifier: MIT-0

export interface GpgSignature {
  assinatura: string;
  assinante: string;
  keyId?: string;
  timestamp: string;
}

export interface GpgVerificationResult {
  valido: boolean;
  assinante?: string;
  keyId?: string;
  mensagem?: string;
}
