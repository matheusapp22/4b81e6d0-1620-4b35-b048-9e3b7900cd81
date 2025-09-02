import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minuto
  message: 'Muitas tentativas. Tente novamente em alguns instantes.'
};

export function useRateLimit(key: string, config: Partial<RateLimitConfig> = {}) {
  const { toast } = useToast();
  const [isBlocked, setIsBlocked] = useState(false);
  const finalConfig = { ...defaultConfig, ...config };

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const storageKey = `rateLimit_${key}`;
    const stored = localStorage.getItem(storageKey);
    
    let requests: number[] = stored ? JSON.parse(stored) : [];
    
    // Remove requests mais antigas que a janela de tempo
    requests = requests.filter(timestamp => now - timestamp < finalConfig.windowMs);
    
    if (requests.length >= finalConfig.maxRequests) {
      setIsBlocked(true);
      toast({
        title: "Rate limit excedido",
        description: finalConfig.message,
        variant: "destructive",
      });
      
      // Desbloqueio automático após a janela de tempo
      const oldestRequest = Math.min(...requests);
      const timeToUnblock = finalConfig.windowMs - (now - oldestRequest);
      setTimeout(() => setIsBlocked(false), timeToUnblock);
      
      return false;
    }
    
    // Adiciona nova request
    requests.push(now);
    localStorage.setItem(storageKey, JSON.stringify(requests));
    
    return true;
  };

  const reset = () => {
    localStorage.removeItem(`rateLimit_${key}`);
    setIsBlocked(false);
  };

  return { checkRateLimit, isBlocked, reset };
}

interface RateLimiterProps {
  children: React.ReactNode;
  config?: Partial<RateLimitConfig>;
  onBlock?: () => void;
}

export function RateLimiter({ children, config, onBlock }: RateLimiterProps) {
  const { checkRateLimit, isBlocked } = useRateLimit('global', config);

  useEffect(() => {
    if (isBlocked && onBlock) {
      onBlock();
    }
  }, [isBlocked, onBlock]);

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            Acesso Temporariamente Bloqueado
          </h1>
          <p className="text-muted-foreground">
            Muitas tentativas detectadas. Aguarde alguns instantes e tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}