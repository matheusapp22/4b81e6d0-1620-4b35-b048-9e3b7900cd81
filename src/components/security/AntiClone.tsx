import { useEffect, useState } from 'react';

// Fingerprinting básico do cliente
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('SaaS Fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return btoa(fingerprint).slice(0, 32);
}

// Verifica se está sendo executado em ferramentas de desenvolvimento
function detectDevTools(): boolean {
  let devtools = false;
  
  // Detector baseado em console
  const threshold = 160;
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      devtools = true;
    }
  }, 500);
  
  return devtools;
}

// Ofusca código JavaScript crítico
function obfuscateCode() {
  // Adiciona código dummy para confundir scrapers
  const dummyFunctions = Array.from({ length: 50 }, (_, i) => {
    return `function dummy${i}() { return Math.random() * ${i}; }`;
  }).join('\n');
  
  const script = document.createElement('script');
  script.textContent = dummyFunctions;
  document.head.appendChild(script);
}

export function AntiClone({ children }: { children: React.ReactNode }) {
  const [isValidEnvironment, setIsValidEnvironment] = useState(true);

  useEffect(() => {
    // Gera fingerprint único
    const fingerprint = generateFingerprint();
    console.log('🔒 Sistema protegido - ID:', fingerprint);

    // Detecta ferramentas de desenvolvimento
    if (detectDevTools() && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Ferramentas de desenvolvimento detectadas');
    }

    // Ofusca código
    obfuscateCode();

    // Proteção contra cópia de código
    document.addEventListener('selectstart', (e) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    });

    document.addEventListener('contextmenu', (e) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    });

    // Proteção contra hotkeys de desenvolvimento
    document.addEventListener('keydown', (e) => {
      if (process.env.NODE_ENV === 'production') {
        // F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
          console.warn('🚫 Ação bloqueada por segurança');
        }
      }
    });

    // Verifica integridade do DOM periodicamente
    const integrityCheck = setInterval(() => {
      const scripts = document.querySelectorAll('script[src]');
      const suspiciousScripts = Array.from(scripts).filter(script => {
        const src = (script as HTMLScriptElement).src;
        return src && !src.includes(window.location.hostname) && 
               !src.includes('uhgceuwfwslqwkytgdoi.supabase.co') &&
               !src.includes('lovable.dev');
      });

      if (suspiciousScripts.length > 0 && process.env.NODE_ENV === 'production') {
        console.error('🚨 Scripts suspeitos detectados');
        setIsValidEnvironment(false);
      }
    }, 5000);

    // Adiciona marca d'água invisível
    const watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.bottom = '0';
    watermark.style.right = '0';
    watermark.style.opacity = '0.01';
    watermark.style.fontSize = '1px';
    watermark.style.color = 'transparent';
    watermark.textContent = `© SaaS Protected - ${fingerprint}`;
    document.body.appendChild(watermark);

    return () => {
      clearInterval(integrityCheck);
      document.body.removeChild(watermark);
    };
  }, []);

  if (!isValidEnvironment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive mb-4">
            🚨 Ambiente Não Autorizado
          </h1>
          <p className="text-muted-foreground">
            Este sistema está protegido contra uso não autorizado.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}