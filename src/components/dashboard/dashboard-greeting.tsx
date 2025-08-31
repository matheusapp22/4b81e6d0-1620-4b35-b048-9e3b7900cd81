import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Star, Sparkles, Zap, Activity } from 'lucide-react';

export function DashboardGreeting() {
  const { profile } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return 'Usuário';
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <GlassCard variant="premium" className="overflow-hidden relative group">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-primary rounded-full opacity-8 animate-float"></div>
      <div className="absolute bottom-6 left-6 w-12 h-12 bg-neon-cyan rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-neon-purple rounded-full opacity-20 animate-bounce-subtle"></div>
      
      <div className="relative z-10 p-10">
        <div className="flex items-center justify-between">
          <div className="space-y-6 flex-1">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <Badge className="status-indicator success px-4 py-2">
                <Activity className="w-3 h-3" />
                Sistema Online
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium Dashboard
              </Badge>
            </div>
            
            {/* Main Greeting */}
            <div className="space-y-3">
              <h1 className="text-display gradient-text leading-none">
                {getGreeting()}, {getName()}
              </h1>
              <p className="text-body text-muted-foreground max-w-lg leading-relaxed">
                Bem-vindo ao seu centro de comando. Aqui você tem controle total do seu negócio 
                com insights em tempo real e automações inteligentes.
              </p>
            </div>
            
            {/* Date and Quick Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 text-caption">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize font-medium">{today}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-micro text-success font-medium">
                  Tudo funcionando perfeitamente
                </span>
              </div>
            </div>
          </div>
          
          {/* Right side decoration */}
          <div className="hidden lg:flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-all duration-500 shadow-elevated">
                <TrendingUp className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center animate-bounce-subtle">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Rating Display */}
            <div className="text-center space-y-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-micro font-bold">Excelência</p>
                <p className="text-micro text-muted-foreground">5.0 de satisfação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}