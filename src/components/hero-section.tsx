import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Bell, CreditCard, BarChart3, Users, Play, Sparkles, Zap, Star, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/auth');
  };

  return (
    <section className="min-h-screen cosmic-background flex items-center justify-center px-6 md:px-8 relative overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-2xl animate-cosmic-drift"></div>
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-neon-blue/5 rounded-full blur-xl animate-float"></div>
      
      {/* Ambient Light Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
        {/* Left Side - Content */}
        <div className="space-y-10 text-center lg:text-left">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 glass-neon px-6 py-3 rounded-full text-sm font-medium animate-neon-pulse">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="gradient-text font-semibold">Novo: IA + WhatsApp + Pagamentos</span>
            </div>
            
            <h1 className="text-display">
              <span className="block text-foreground">Agendamento</span>
              <span className="block gradient-text">Inteligente</span>
              <span className="block text-foreground">para Profissionais</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Automatize agendamentos, receba pagamentos e tenha relatórios em tempo real.
              A plataforma mais avançada para seu negócio.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-primary hover:shadow-glow text-primary-foreground px-8 py-4 rounded-2xl font-semibold shadow-premium transition-all duration-500 hover:scale-105"
              onClick={handleStartFree}
            >
              Começar Grátis
              <Zap className="w-5 h-5 ml-2" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="w-full sm:w-auto glass-card hover:glass-neon px-8 py-4 rounded-2xl font-semibold border-primary/30 hover:border-primary/60 transition-all duration-500">
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Demo - GoAgendas
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full h-full rounded-lg overflow-hidden border border-border">
                  <iframe
                    src="/dashboard"
                    className="w-full h-full border-0"
                    title="Demo GoAgendas"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Grátis até 20 agendamentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Sem taxa de instalação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Dashboard Preview */}
        <div className="relative order-first lg:order-last animate-scale-in">
          <GlassCard variant="premium" className="p-8 space-y-8 hover-lift">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <div className="inline-flex items-center gap-2 glass-neon px-4 py-2 rounded-full text-xs font-semibold animate-pulse-glow">
                <Activity className="w-3 h-3 text-primary" />
                <span className="gradient-text">Sistema Online</span>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <GlassCard variant="minimal" className="p-6 space-y-4 hover-glow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                    <Calendar className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Hoje</span>
                </div>
                <div className="text-3xl font-bold gradient-text">12</div>
                <div className="text-sm text-muted-foreground">agendamentos</div>
              </GlassCard>
              
              <GlassCard variant="minimal" className="p-6 space-y-4 hover-glow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-success to-neon-green rounded-2xl flex items-center justify-center shadow-glow">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Receita</span>
                </div>
                <div className="text-3xl font-bold gradient-text">R$ 1.240</div>
                <div className="text-sm text-muted-foreground">este mês</div>
              </GlassCard>
            </div>
            
            {/* Recent Appointments */}
            <div className="space-y-6 hidden md:block">
              <h4 className="font-semibold text-foreground">Próximos Agendamentos</h4>
              <div className="space-y-4">
                {[
                  { time: "14:30", client: "João Silva", service: "Corte + Barba", status: "confirmed" },
                  { time: "15:00", client: "Maria Santos", service: "Manicure", status: "scheduled" },
                  { time: "16:30", client: "Pedro Costa", service: "Massagem", status: "confirmed" },
                ].map((appointment, index) => (
                  <GlassCard 
                    key={index} 
                    variant="minimal"
                    className="p-4 flex items-center gap-4 hover-glow cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-card">
                      <Clock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{appointment.client}</div>
                      <div className="text-xs text-muted-foreground truncate">{appointment.service}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-semibold text-foreground">{appointment.time}</div>
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium glass-card ${
                        appointment.status === 'confirmed' 
                          ? 'text-success border-success/30' 
                          : 'text-info border-info/30'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" size="sm" className="flex-col h-20 gap-2 p-4 glass-card hover:glass-neon border-primary/20">
                <Bell className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Notificar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-20 gap-2 p-4 glass-card hover:glass-neon border-primary/20">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Relatório</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-20 gap-2 p-4 glass-card hover:glass-neon border-primary/20">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Clientes</span>
              </Button>
            </div>

            {/* Rating Section */}
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-border">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">5.0 • Excelente</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}