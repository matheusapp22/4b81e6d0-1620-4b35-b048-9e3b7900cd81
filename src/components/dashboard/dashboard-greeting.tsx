import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { GlassCard } from '@/components/ui/glass-card';
import { Calendar, TrendingUp, Star, Sparkles } from 'lucide-react';

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
      <div className="absolute inset-0 matrix-pattern opacity-30"></div>
      
      {/* Floating elements */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-primary rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-neon-cyan rounded-full opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4 flex-1">
            {/* Greeting */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Dashboard
                </span>
              </div>
              <h1 className="text-display gradient-text">
                {getGreeting()}, {getName()}
              </h1>
              <p className="text-body text-muted-foreground max-w-md">
                Aqui está o resumo do seu negócio hoje. Tudo funcionando perfeitamente.
              </p>
            </div>
            
            {/* Date */}
            <div className="flex items-center gap-3 text-caption">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="capitalize font-medium">{today}</span>
            </div>
          </div>
          
          {/* Right side decoration */}
          <div className="hidden md:flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-10 h-10 text-white animate-pulse" />
            </div>
            
            {/* Rating stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-3 h-3 fill-yellow-400 text-yellow-400 animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">Excelente!</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}