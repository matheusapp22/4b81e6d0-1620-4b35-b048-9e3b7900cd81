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
  X
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
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export function DashboardHeader() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/appointments', label: 'Agendamentos', icon: Calendar },
    { href: '/clients', label: 'Clientes', icon: Users },
    { href: '/employees', label: 'Equipe', icon: UserCheck },
    { href: '/financial', label: 'Financeiro', icon: DollarSign },
    { href: '/loyalty', label: 'Fidelidade', icon: Gift },
    { href: '/marketing', label: 'Marketing', icon: Mail },
    { href: '/inventory', label: 'Estoque', icon: Package },
    { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="nav-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-tech-pulse"></div>
              </div>
              <div>
                <span className="font-bold text-xl gradient-text tracking-tight">GoAgendas</span>
                {profile?.business_name && (
                  <p className="text-xs text-muted-foreground font-medium leading-tight">{profile.business_name}</p>
                )}
              </div>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button 
                key={item.href}
                variant="ghost" 
                size="sm" 
                asChild
                className={cn(
                  "nav-item",
                  isActive(item.href) && "active bg-primary/10 text-primary"
                )}
              >
                <a href={item.href}>
                  <item.icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </a>
              </Button>
            ))}
          </nav>
          
          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-transform duration-200">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={profile?.avatar_url} alt="Profile" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass-card border-0" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none">
                      {profile?.first_name 
                        ? `${profile.first_name} ${profile.last_name || ''}`.trim()
                        : 'Usuário'
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {profile?.business_name && (
                      <p className="text-xs leading-none text-primary font-medium">
                        {profile.business_name}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/services" className="flex items-center gap-3 p-3">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>Serviços</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/calendar" className="flex items-center gap-3 p-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Agenda</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/settings" className="flex items-center gap-3 p-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Perfil</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/biolink-editor" className="flex items-center gap-3 p-3">
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    <span>Editor BioLink</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/settings" className="flex items-center gap-3 p-3">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Configurações</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive p-3">
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "justify-start nav-item",
                    isActive(item.href) && "active bg-primary/10 text-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <a href={item.href}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
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