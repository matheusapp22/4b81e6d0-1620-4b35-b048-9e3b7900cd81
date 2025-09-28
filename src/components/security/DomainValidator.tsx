import { useEffect, useState } from 'react';

// Lista de domínios autorizados para produção
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '.lovable.dev',
  '.sandbox.lovable.dev',
  '.lovable.app',
  'lovable.app',
  '.lovableproject.com',
  'lovableproject.com',
  // Adicione seus domínios de produção aqui
  // 'seudominio.com',
  // 'www.seudominio.com'
];

export function DomainValidator({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(true);

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
      // Em vez de redirecionar, define o estado como não autorizado
      setIsAuthorized(false);
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
          setIsAuthorized(false);
        }
      } catch {
        // Se não conseguir verificar o parent, bloqueia
        setIsAuthorized(false);
      }
    }
  }, []);

  // Se não autorizado, mostra mensagem de acesso negado
  if (!isAuthorized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#dc3545', marginBottom: '1rem' }}>Acesso Não Autorizado</h1>
          <p style={{ color: '#6c757d' }}>Este domínio não está autorizado a acessar esta aplicação.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}