import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Lista de domínios autorizados para produção
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '.lovable.dev',
  '.sandbox.lovable.dev',
  // Adicione seus domínios de produção aqui
  // 'seudominio.com',
  // 'www.seudominio.com'
];

export function DomainValidator({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const currentDomain = window.location.hostname;
    
    // Verifica se o domínio atual está na lista de permitidos
    const isAllowed = ALLOWED_DOMAINS.some(domain => {
      if (domain.startsWith('.')) {
        return currentDomain.endsWith(domain) || currentDomain === domain.slice(1);
      }
      return currentDomain === domain;
    });

    if (!isAllowed && process.env.NODE_ENV === 'production') {
      // Redireciona para página de erro ou bloqueia acesso
      window.location.href = 'about:blank';
      return;
    }

    // Adiciona proteção contra iframe embedding em domínios não autorizados
    if (window.self !== window.top) {
      try {
        const parentOrigin = new URL(document.referrer).hostname;
        const isParentAllowed = ALLOWED_DOMAINS.some(domain => {
          if (domain.startsWith('.')) {
            return parentOrigin.endsWith(domain) || parentOrigin === domain.slice(1);
          }
          return parentOrigin === domain;
        });
        
        if (!isParentAllowed) {
          window.top!.location.href = 'about:blank';
        }
      } catch {
        // Se não conseguir verificar o parent, bloqueia
        window.top!.location.href = 'about:blank';
      }
    }
  }, [navigate]);

  return <>{children}</>;
}