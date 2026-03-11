// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorSegurancaMensagens = createI18nMessages({
  // Novas detecções de vulnerabilidade
  sqlInjection: 'Possível SQL Injection - concatenação de input do usuário em query SQL',
  sqlInjectionSugestao: 'Use parameterized queries ou ORM: db.query("SELECT * FROM users WHERE id = ?", [userId])',

  commandInjection: 'Possível Command Injection - input do usuário passando para shell',
  commandInjectionSugestao: 'Valide e sanitize rigorosamente inputs antes de usar em comandos shell. Use lista branca.',

  xxe: 'Possível vulnerabilidade XXE (XML External Entity) - parser XML não seguro',
  xxeSugestao: 'Desabilite processamento DTD e entidades externas no parser XML',

  insecureDeserialization: 'Desserialização insegura pode permitir execução de código remoto',
  insecureDeserializationSugestao: 'Use JSON.parse ou bibliotecas de serialização segura. Valide dados antes de deserializar.',

  catastrophicRegex: 'Regex potencialmente catastrófico (ReDoS) - padrão com backtracking exponencial',
  catastrophicRegexSugestao: 'Use padrões sem backtracking: (a+)+ substitua por a+, use atomic groups',

  weakRandom: 'Math.random() não é criptograficamente seguro',
  weakRandomSugestao: 'Use crypto.randomUUID() ou crypto.getRandomValues() para valores aleatórios seguros',

  insecureCookie: 'Cookie definido sem flags de segurança (secure, HttpOnly, SameSite)',
  insecureCookieSugestao: 'Adicione flags: Secure, HttpOnly, SameSite=Strict|Lax para proteção XSS e CSRF',

  missingCsrf: 'Endpoint mutativo (POST/PUT/DELETE) sem proteção CSRF explícita',
  missingCsrfSugestao: 'Implemente proteção CSRF: use token anti-CSRF em formulários e validate no backend',

  hardcodedIp: 'Endereço IP hardcoded no código',
  hardcodedIpSugestao: 'Use variáveis de ambiente para IPs/hosts: process.env.API_HOST',

  jwtWeak: 'JWT com algoritmo fraco ou segredo hardcoded',
  jwtWeakSugestao: 'Use RS256/ES256 (assimetrico). Armazene segredo em ambiente seguro.',

  tarPit: 'Possível proteção contra força bruta com delay excessivo que pode ser explorado',
  tarPitSugestao: 'Considere usar rate limiting com limite adaptativo e CAPTCHA após tentativas falhas',

  bypassSecurity: 'Possível bypass de verificação de segurança ou checagem de ambiente',
  bypassSecuritySugestao: 'Remova bypasses de segurança. Verificações de ambiente devem ser consistentes.'
}, {
  sqlInjection: 'Possible SQL Injection - user input concatenated into SQL query',
  sqlInjectionSugestao: 'Use parameterized queries or ORM: db.query("SELECT * FROM users WHERE id = ?", [userId])',

  commandInjection: 'Possible Command Injection - user input passed to shell',
  commandInjectionSugestao: 'Validate and sanitize inputs before using in shell commands. Use whitelist.',

  xxe: 'Possible XXE (XML External Entity) vulnerability - insecure XML parser',
  xxeSugestao: 'Disable DTD processing and external entities in XML parser',

  insecureDeserialization: 'Insecure deserialization may allow remote code execution',
  insecureDeserializationSugestao: 'Use JSON.parse or secure serialization libraries. Validate data before deserializing.',

  catastrophicRegex: 'Potentially catastrophic regex (ReDoS) - pattern with exponential backtracking',
  catastrophicRegexSugestao: 'Use patterns without backtracking: (a+)+ replace with a+, use atomic groups',

  weakRandom: 'Math.random() is not cryptographically secure',
  weakRandomSugestao: 'Use crypto.randomUUID() or crypto.getRandomValues() for secure random values',

  insecureCookie: 'Cookie set without security flags (secure, HttpOnly, SameSite)',
  insecureCookieSugestao: 'Add flags: Secure, HttpOnly, SameSite=Strict|Lax for XSS and CSRF protection',

  missingCsrf: 'Mutable endpoint (POST/PUT/DELETE) without explicit CSRF protection',
  missingCsrfSugestao: 'Implement CSRF protection: use anti-CSRF token in forms and validate in backend',

  hardcodedIp: 'Hardcoded IP address in code',
  hardcodedIpSugestao: 'Use environment variables for IPs/hosts: process.env.API_HOST',

  jwtWeak: 'JWT with weak algorithm or hardcoded secret',
  jwtWeakSugestao: 'Use RS256/ES256 (asymmetric). Store secret in secure environment.',

  tarPit: 'Possible brute force protection with excessive delay that may be exploited',
  tarPitSugestao: 'Consider using adaptive rate limiting and CAPTCHA after failed attempts',

  bypassSecurity: 'Possible security check bypass or environment check bypass',
  bypassSecuritySugestao: 'Remove security bypasses. Environment checks should be consistent.'
});
