import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Bot,
  CheckCircle
} from "lucide-react";

export function DashboardShowcase() {
  return (
    <section className="py-32 cosmic-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 tech-grid opacity-10"></div>
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-tech rounded-full blur-3xl opacity-15 animate-float"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-neon rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 mb-20">
          <Badge className="glass-card bg-primary/10 text-primary border-primary/20 px-6 py-3 text-sm font-bold">
            <TrendingUp className="w-4 h-4 mr-2" />
            Visão Completa do Negócio
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-bold">
            <span className="block text-foreground">Sua empresa em</span>
            <span className="block gradient-text">tempo real</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Monitore performance, receita e satisfação dos clientes em um dashboard 
            intuitivo com insights alimentados por IA.
          </p>
        </div>
        
        {/* Dashboard mockup */}
        <div className="relative max-w-6xl mx-auto">
          <div className="glass-hero rounded-3xl p-8 lg:p-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold">Dashboard Executivo</h3>
                <p className="text-muted-foreground">Visão geral • Atualizado agora</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-success/20 text-success border-success/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Conectado
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Bot className="w-3 h-3 mr-1" />
                  IA Ativa
                </Badge>
              </div>
            </div>
            
            {/* Key metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: Calendar,
                  label: "Agendamentos Hoje",
                  value: "24",
                  change: "+18%",
                  color: "text-primary",
                  bgColor: "bg-primary/10"
                },
                {
                  icon: DollarSign,
                  label: "Receita do Mês",
                  value: "R$ 12.8k",
                  change: "+24%",
                  color: "text-success",
                  bgColor: "bg-success/10"
                },
                {
                  icon: Users,
                  label: "Novos Clientes",
                  value: "47",
                  change: "+12%",
                  color: "text-neon-blue",
                  bgColor: "bg-neon-blue/10"
                },
                {
                  icon: Star,
                  label: "Satisfação",
                  value: "4.9",
                  change: "+0.2",
                  color: "text-neon-purple",
                  bgColor: "bg-neon-purple/10"
                }
              ].map((metric, index) => (
                <div key={index} className="glass-card p-6 rounded-xl space-y-3 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div className="text-xs text-success font-medium">{metric.change}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Schedule preview */}
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Agenda de Hoje
                  </h4>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    12 agendamentos
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {[
                    { time: "09:00", client: "Maria Silva", service: "Corte + Escova", status: "confirmed" },
                    { time: "10:30", client: "João Santos", service: "Barba Completa", status: "in-progress" },
                    { time: "12:00", client: "Ana Costa", service: "Manicure", status: "pending" },
                    { time: "14:00", client: "Carlos Lima", service: "Corte Masculino", status: "confirmed" }
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-mono text-muted-foreground">{appointment.time}</div>
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {appointment.client[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{appointment.client}</div>
                          <div className="text-xs text-muted-foreground">{appointment.service}</div>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-success' :
                        appointment.status === 'in-progress' ? 'bg-primary animate-pulse' :
                        'bg-warning'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* AI insights */}
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neon-blue" />
                    Insights de IA
                  </h4>
                  <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 text-xs">
                    Atualizado
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-success">Oportunidade detectada</div>
                        <div className="text-xs text-muted-foreground">
                          Sextas-feiras têm 30% mais demanda. Considere adicionar mais horários.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-primary">Cliente frequente</div>
                        <div className="text-xs text-muted-foreground">
                          Maria Silva é elegível para programa de fidelidade.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-neon-purple/10 border border-neon-purple/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-neon-purple mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-neon-purple">Meta atingida</div>
                        <div className="text-xs text-muted-foreground">
                          Receita mensal bateu 120% da meta. Parabéns! 🎉
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                  <Bot className="w-3 h-3" />
                  <span>Próxima análise em 2 horas</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-primary opacity-10 rounded-3xl blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}