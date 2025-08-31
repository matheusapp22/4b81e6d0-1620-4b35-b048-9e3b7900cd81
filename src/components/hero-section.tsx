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
    <section className="min-h-screen bg-background flex items-center justify-center px-6 md:px-8 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-2xl"></div>
      
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Side - Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-6">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary border border-border rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              Novo: IA + WhatsApp + Pagamentos
            </Badge>
            
            <h1 className="text-display leading-tight">
              <span className="block">Agendamento</span>
              <span className="block gradient-text">Inteligente</span>
              <span className="block">para Profissionais</span>
            </h1>
            
            <p className="text-subtitle text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Automatize agendamentos, receba pagamentos e tenha relatórios em tempo real.
              A plataforma mais avançada para seu negócio.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm transition-colors"
              onClick={handleStartFree}
            >
              Começar Grátis
              <Zap className="w-4 h-4 ml-2" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Ver Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-title flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Demo - GoAgendas
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <iframe
                    src="/dashboard"
                    className="w-full h-full border-0"
                    title="Demo GoAgendas"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-caption">
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
        <div className="relative order-first lg:order-last">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-card">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-title font-semibold">Dashboard</h3>
              <Badge className="bg-success/10 text-success border-success/20 border px-3 py-1 rounded-full text-xs font-medium">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-caption">Hoje</span>
                </div>
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-caption">agendamentos</div>
              </div>
              
              <div className="bg-secondary rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-success" />
                  <span className="text-caption">Receita</span>
                </div>
                <div className="text-2xl font-bold text-foreground">R$ 1.240</div>
                <div className="text-caption">este mês</div>
              </div>
            </div>
            
            {/* Recent Appointments */}
            <div className="space-y-4 hidden md:block">
              <h4 className="font-semibold text-body">Próximos Agendamentos</h4>
              <div className="space-y-3">
                {[
                  { time: "14:30", client: "João Silva", service: "Corte + Barba", status: "confirmed" },
                  { time: "15:00", client: "Maria Santos", service: "Manicure", status: "scheduled" },
                  { time: "16:30", client: "Pedro Costa", service: "Massagem", status: "confirmed" },
                ].map((appointment, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary border border-border rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{appointment.client}</div>
                      <div className="text-caption truncate">{appointment.service}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{appointment.time}</div>
                      <Badge className={`${appointment.status === 'confirmed' ? 'bg-success/10 text-success border-success/20' : 'bg-info/10 text-info border-info/20'} border rounded-full px-2 py-1 text-xs`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="flex-col h-16 gap-2">
                <Bell className="w-4 h-4" />
                <span className="text-micro">Notificar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-micro">Relatório</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-2">
                <Users className="w-4 h-4" />
                <span className="text-micro">Clientes</span>
              </Button>
            </div>

            {/* Rating Section */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>
              <span className="text-caption font-medium">5.0 • Excelente</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}