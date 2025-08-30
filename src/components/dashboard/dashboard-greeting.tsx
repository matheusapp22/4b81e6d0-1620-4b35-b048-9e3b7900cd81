import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp, Star } from 'lucide-react';

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
    <Card className="glass-card overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text">
              {getGreeting()}, {getName()}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Aqui está o resumo do seu negócio hoje
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="capitalize">{today}</span>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Excelente!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}