import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { Zap, Menu, X, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navigation on auth page
  if (window.location.pathname === '/auth') {
    return null;
  }

  // If user is logged in, don't show this navigation (dashboard has its own header)
  if (user && (
    window.location.pathname === '/dashboard' ||
    window.location.pathname === '/services' ||
    window.location.pathname === '/clients' ||
    window.location.pathname === '/appointments' ||
    window.location.pathname === '/calendar' ||
    window.location.pathname === '/reports' ||
    window.location.pathname === '/settings' ||
    window.location.pathname === '/biolink-editor' ||
    window.location.pathname === '/employees' ||
    window.location.pathname === '/financial' ||
    window.location.pathname === '/loyalty' ||
    window.location.pathname === '/marketing' ||
    window.location.pathname === '/inventory'
  )) {
    return null;
  }

  return (
    <nav className="nav-premium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold text-2xl gradient-text tracking-tight">GoAgendas</span>
              <Badge variant="secondary" className="ml-3 px-2 py-1 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Button variant="elegant" asChild>
                  <a href="/dashboard">Dashboard</a>
                </Button>
                <Button variant="outline" onClick={signOut}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="nav-item">
                  <a href="/#features">Recursos</a>
                </Button>
                <Button variant="ghost" asChild className="nav-item">
                  <a href="/#pricing">Preços</a>
                </Button>
                <Button variant="elegant" asChild>
                  <a href="/auth">Entrar</a>
                </Button>
                <Button variant="futuristic" asChild>
                  <a href="/auth">Começar Grátis</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-12 w-12 rounded-2xl hover:scale-110 transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-8 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <Button variant="elegant" className="justify-start h-12" asChild>
                    <a href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start h-12" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start nav-item h-12" asChild>
                    <a href="/#features" onClick={() => setMobileMenuOpen(false)}>
                      Recursos
                    </a>
                  </Button>
                  <Button variant="ghost" className="justify-start nav-item h-12" asChild>
                    <a href="/#pricing" onClick={() => setMobileMenuOpen(false)}>
                      Preços
                    </a>
                  </Button>
                  <Button variant="elegant" className="justify-start h-12" asChild>
                    <a href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Entrar
                    </a>
                  </Button>
                  <Button variant="futuristic" className="justify-start h-12" asChild>
                    <a href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Começar Grátis
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}