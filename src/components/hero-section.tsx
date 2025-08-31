import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GlassCard } from '@/components/ui/glass-card';
import { Calendar, Clock, DollarSign, Users, Play, Star, Zap, ArrowRight, Sparkles, Shield, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Professional background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-cosmic opacity-8 rounded-full blur-2xl"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
      
      {/* Main content */}
      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left content */}
            <div className="space-y-10 text-center lg:text-left">
              {/* Professional badge */}
              <div className="inline-flex items-center gap-4 glass-card px-6 py-4 rounded-full">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Líder em gestão empresarial</span>
                </div>
                <div className="w-px h-5 bg-border"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">+2.000 empresas</span>
                </div>
              </div>

              {/* Professional headline */}
              <div className="space-y-8">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                  <span className="block text-foreground">
                    Gestão empresarial
                  </span>
                  <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    inteligente
                  </span>
                  <span className="block text-foreground">
                    e eficiente
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Plataforma completa para otimizar agendamentos, gerenciar clientes, 
                  coordenar equipes e controlar financeiro. Aumente sua produtividade 
                  e receita com tecnologia de ponta.
                </p>
              </div>

              {/* Trust metrics */}
              <div className="grid grid-cols-3 gap-8 py-8">
                <div className="text-center lg:text-left">
                  <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-bold text-primary">98%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Taxa de satisfação</p>
                </div>
                <div className="text-center lg:text-left">
                  <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                    <DollarSign className="w-5 h-5 text-success" />
                    <span className="text-3xl font-bold text-success">+45%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">ROI médio anual</p>
                </div>
                <div className="text-center lg:text-left">
                  <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span className="text-3xl font-bold text-secondary">5h</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Economizadas/dia</p>
                </div>
              </div>

              {/* Professional CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <Button 
                  onClick={handleStartFree}
                  size="lg" 
                  className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-premium text-lg px-12 py-7 font-semibold rounded-xl group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Iniciar Teste Gratuito
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Button>
                
                <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="glass-card border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-12 py-7 text-lg font-semibold rounded-xl group"
                    >
                      <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform text-primary" />
                      Demonstração Executiva
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl glass-premium">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">Demonstração GoAgendas Pro</DialogTitle>
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

              {/* Certifications */}
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-8 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>LGPD Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Suporte 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-4 h-4" />
                  <span>ISO 27001</span>
                </div>
              </div>
            </div>

            {/* Right: Professional Dashboard */}
            <div className="relative flex items-center justify-center">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <GlassCard variant="premium" className="p-8 space-y-6 shadow-2xl max-w-md mx-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border/20 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">GoAgendas Pro</h3>
                        <p className="text-sm text-muted-foreground">Dashboard Executivo</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 space-y-3 hover-glow">
                      <div className="flex items-center justify-between">
                        <Calendar className="w-6 h-6 text-primary" />
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">+18%</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">248</p>
                        <p className="text-sm text-muted-foreground">Agendamentos/mês</p>
                      </div>
                    </div>

                    <div className="glass-card p-5 space-y-3 hover-glow">
                      <div className="flex items-center justify-between">
                        <DollarSign className="w-6 h-6 text-success" />
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">+32%</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">R$ 28.5k</p>
                        <p className="text-sm text-muted-foreground">Receita mensal</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointments */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Agenda de Hoje</h4>
                      <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">15 Jan</span>
                    </div>
                    
                    {[
                      { name: "Dr. Silva", service: "Consulta Geral", time: "09:00", type: "medical" },
                      { name: "Ana Costa", service: "Corte + Escova", time: "10:30", type: "beauty" },
                      { name: "João Santos", service: "Personal Training", time: "14:00", type: "fitness" }
                    ].map((appointment, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 glass-card rounded-lg hover-glow">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          appointment.type === 'medical' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          appointment.type === 'beauty' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                          'bg-gradient-to-r from-green-500 to-emerald-600'
                        }`}>
                          {appointment.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{appointment.name}</p>
                          <p className="text-xs text-muted-foreground">{appointment.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{appointment.time}</p>
                          <div className="w-2 h-2 bg-success rounded-full mx-auto mt-1"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Floating indicators */}
                <div className="absolute -top-4 -right-4 glass-card p-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">Sistema Online</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 glass-card p-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">+47 novos clientes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};