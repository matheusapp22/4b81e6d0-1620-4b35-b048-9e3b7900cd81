import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/auth-context';
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  Zap, 
  LogOut,
  Bell,
  User,
  Link2,
  DollarSign,
  Gift,
  Mail,
  Package,
  UserCheck,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export function DashboardHeader() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, category: 'main' },
    { href: '/appointments', label: 'Agendamentos', icon: Calendar, category: 'main' },
    { href: '/clients', label: 'Clientes', icon: Users, category: 'main' },
    { href: '/employees', label: 'Equipe', icon: UserCheck, category: 'business' },
    { href: '/financial', label: 'Financeiro', icon: DollarSign, category: 'business' },
    { href: '/loyalty', label: 'Fidelidade', icon: Gift, category: 'growth' },
    { href: '/marketing', label: 'Marketing', icon: Mail, category: 'growth' },
    { href: '/inventory', label: 'Estoque', icon: Package, category: 'business' },
    { href: '/reports', label: 'Relatórios', icon: BarChart3, category: 'analytics' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="nav-premium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-green rounded-full animate-tech-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-2xl gradient-text tracking-tight">GoAgendas</span>
                {profile?.business_name && (
                  <p className="text-micro text-muted-foreground font-medium leading-tight">
                    {profile.business_name}
                  </p>
                )}
              </div>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2">
            {navigationItems.slice(0, 6).map((item) => (
              <Button 
                key={item.href}
                variant="ghost" 
                size="sm" 
                asChild
                className={cn(
                  "nav-item h-11 px-4 rounded-2xl",
                  isActive(item.href) && "active bg-primary/10 text-primary border border-primary/20"
                )}
              >
                <a href={item.href} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Button>
            ))}
            
            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="nav-item h-11 px-4 rounded-2xl">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Mais</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-0 w-56" align="end">
                {navigationItems.slice(6).map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                    <a href={item.href} className="flex items-center gap-3 p-3">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="relative h-11 w-11 rounded-2xl hover:scale-110 transition-all duration-300"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-warning animate-rotate-subtle" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl hover:scale-110 transition-all duration-300">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse">
                <div className="w-full h-full bg-primary rounded-full animate-ping"></div>
              </div>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden h-11 w-11 rounded-2xl hover:scale-110 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-2xl hover:scale-110 transition-all duration-300 p-0">
                  <Avatar className="h-11 w-11 border-2 border-border shadow-card">
                    <AvatarImage src={profile?.avatar_url} alt="Profile" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-0 w-72" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-border">
                      <AvatarImage src={profile?.avatar_url} alt="Profile" />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-body font-semibold leading-none">
                        {profile?.first_name 
                          ? `${profile.first_name} ${profile.last_name || ''}`.trim()
                          : 'Usuário'
                        }
                      </p>
                      <p className="text-caption leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      {profile?.business_name && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {profile.business_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                
                <div className="p-2 space-y-1">
                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-3">
                    <a href="/services" className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Serviços</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-3">
                    <a href="/calendar" className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Agenda</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-3">
                    <a href="/settings" className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Perfil</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-3">
                    <a href="/biolink-editor" className="flex items-center gap-3">
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Editor BioLink</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-3">
                    <a href="/settings" className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Configurações</span>
                    </a>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator className="bg-border/50" />
                <div className="p-2">
                  <DropdownMenuItem 
                    onClick={signOut} 
                    className="cursor-pointer text-destructive focus:text-destructive rounded-xl p-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sair</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-6 border-t border-border/50 animate-slide-up">
            <nav className="grid grid-cols-2 gap-3">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "justify-start nav-item h-12 rounded-2xl",
                    isActive(item.href) && "active bg-primary/10 text-primary border border-primary/20"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <a href={item.href} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}