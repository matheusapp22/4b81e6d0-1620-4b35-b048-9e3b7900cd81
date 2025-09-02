// Sanitização de entrada para prevenir XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Validação de email mais rigorosa
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validação de telefone
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Geração de token CSRF
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Verificação de token CSRF
export function verifyCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken && token.length === 64;
}

// Hash de senha (para validação adicional no frontend)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validação de força de senha
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Senha deve ter pelo menos 8 caracteres');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos uma letra minúscula');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos uma letra maiúscula');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos um número');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos um caractere especial');

  // Verificar sequências comuns
  const commonSequences = ['123456', 'abcdef', 'qwerty', 'password'];
  if (commonSequences.some(seq => password.toLowerCase().includes(seq))) {
    score -= 2;
    feedback.push('Evite sequências comuns');
  }

  return {
    isValid: score >= 4,
    score: Math.max(0, score),
    feedback
  };
}

// Detectar ataques de força bruta
export class BruteForceProtection {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutos

  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record) return false;

    const now = Date.now();
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return false;
    }

    return record.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier) || { count: 0, lastAttempt: 0 };

    if (now - record.lastAttempt > this.windowMs) {
      record.count = 1;
    } else {
      record.count++;
    }

    record.lastAttempt = now;
    this.attempts.set(identifier, record);

    return record.count >= this.maxAttempts;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Instância global do protetor de força bruta
export const bruteForceProtection = new BruteForceProtection();

// Limpar dados sensíveis do localStorage periodicamente
export function clearSensitiveData(): void {
  const sensitiveKeys = ['auth_token', 'session_data', 'user_credentials'];
  sensitiveKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

// Configurar limpeza automática de dados sensíveis
export function setupAutoDataClearance(): void {
  // Limpar dados ao fechar a aba
  window.addEventListener('beforeunload', clearSensitiveData);
  
  // Limpar dados periodicamente (a cada hora)
  setInterval(clearSensitiveData, 60 * 60 * 1000);
}

// Verificar se a conexão é segura
export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

// Detectar ataques XSS
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}