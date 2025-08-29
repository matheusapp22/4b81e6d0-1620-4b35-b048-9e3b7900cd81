import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Zap, Menu, X } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 glass border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">GoAgendas</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <a href="/dashboard">Dashboard</a>
                </Button>
                <Button variant="outline" onClick={signOut}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <a href="/#features">Recursos</a>
                </Button>
                <Button variant="ghost" asChild>
                  <a href="/#pricing">Preços</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/auth">Entrar</a>
                </Button>
                <Button asChild>
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
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-glass-border">
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="ghost" className="justify-start" asChild>
                    <a href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</a>
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" asChild>
                    <a href="/#features" onClick={() => setMobileMenuOpen(false)}>Recursos</a>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <a href="/#pricing" onClick={() => setMobileMenuOpen(false)}>Preços</a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="/auth" onClick={() => setMobileMenuOpen(false)}>Entrar</a>
                  </Button>
                  <Button className="justify-start" asChild>
                    <a href="/auth" onClick={() => setMobileMenuOpen(false)}>Começar Grátis</a>
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