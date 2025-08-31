import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GlassCard } from '@/components/ui/glass-card';
import { Calendar, Clock, DollarSign, Users, Play, Star, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-neon-purple/20 rounded-full blur-3xl animate-cosmic-drift"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-neon-blue/15 to-primary/15 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-cosmic opacity-10 rounded-full blur-3xl animate-cosmic-drift"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20"></div>
      
      {/* Main content */}
      <div className="relative container mx-auto px-4 pt-40 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-neon-purple bg-clip-text text-transparent">
              Agendamentos Inteligentes
            </span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          {/* Main headline */}
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-display leading-[1.1] tracking-tight">
              <span className="block">Agendamentos</span>
              <span className="block bg-gradient-to-r from-primary via-neon-blue to-neon-purple bg-clip-text text-transparent">
                inteligentes
              </span>
              <span className="block">para negócios</span>
              <span className="relative inline-block">
                modernos
                <div className="absolute -inset-2 bg-gradient-neon opacity-20 blur-xl rounded-full animate-pulse"></div>
              </span>
            </h1>
            
            <p className="text-subtitle text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              O GoAgendas é a plataforma completa para gestão de clientes, agendamentos, 
              equipe e financeiro. Transforme sua empresa com tecnologia de ponta.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Button 
              onClick={handleStartFree}
              size="lg" 
              className="bg-gradient-primary hover:scale-105 transition-all duration-500 shadow-premium hover:shadow-glow px-10 py-6 text-lg font-semibold rounded-2xl group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Criar Conta Gratuita
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Button>
            
            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="glass-card border-primary/30 hover:border-primary/60 hover:bg-primary/10 px-10 py-6 text-lg font-semibold rounded-2xl group backdrop-blur-md"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform text-primary" />
                  Ver Demonstração
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl glass-premium">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">Demonstração do GoAgendas</DialogTitle>
                </DialogHeader>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="GoAgendas Demo"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-primary border-3 border-background shadow-lg animate-bounce-subtle"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">+2.000 empresas</p>
                <p className="text-xs text-muted-foreground">confiam no GoAgendas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">4.9/5 estrelas</p>
                <p className="text-xs text-muted-foreground">avaliação média</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};