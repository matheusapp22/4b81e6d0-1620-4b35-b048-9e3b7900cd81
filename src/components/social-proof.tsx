import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Quote,
  Sparkles,
  Users,
  Calendar,
  Heart,
  TrendingUp
} from "lucide-react";

const testimonials = [
  {
    name: "Dr. Marina Santos",
    role: "Clínica Dermatológica",
    avatar: "M",
    rating: 5,
    text: "O GoAgendas revolucionou minha clínica. Agora tenho 40% mais agendamentos e zero no-shows. A IA realmente funciona!",
    metric: "+40% agendamentos"
  },
  {
    name: "Carlos Eduardo",
    role: "Barbearia Premium",
    avatar: "C",
    rating: 5,
    text: "Meus clientes adoram agendar pelo WhatsApp. Economizo 3 horas por dia e posso focar no que amo fazer.",
    metric: "3h/dia economizadas"
  },
  {
    name: "Ana Beatriz",
    role: "Studio de Beleza",
    avatar: "A",
    rating: 5,
    text: "A gestão financeira integrada mudou meu negócio. Agora sei exatamente quanto ganho por serviço e posso planejar melhor.",
    metric: "+25% receita"
  }
];

const useCases = [
  {
    icon: Heart,
    title: "Salões de Beleza",
    description: "Cortes, coloração, tratamentos",
    clients: "400+ salões"
  },
  {
    icon: Users,
    title: "Clínicas e Consultórios",
    description: "Médicos, dentistas, fisioterapeutas",
    clients: "250+ clínicas"
  },
  {
    icon: Sparkles,
    title: "Estética e Bem-estar",
    description: "Massagem, acupuntura, pilates",
    clients: "300+ estúdios"
  },
  {
    icon: TrendingUp,
    title: "Serviços Profissionais",
    description: "Coaching, consultoria, advocacia",
    clients: "150+ profissionais"
  }
];

export function SocialProof() {
  return (
    <section className="py-32 cosmic-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 tech-grid opacity-5"></div>
      <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-neon rounded-full blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-tech rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 mb-20">
          <Badge className="glass-card bg-primary/10 text-primary border-primary/20 px-6 py-3 text-sm font-bold">
            <Users className="w-4 h-4 mr-2" />
            Casos de Sucesso
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-bold">
            <span className="block text-foreground">Ideal para</span>
            <span className="block gradient-text">todo tipo de negócio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Profissionais de diferentes áreas já transformaram seus negócios 
            com nossa plataforma inteligente.
          </p>
        </div>
        
        {/* Use cases */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {useCases.map((useCase, index) => (
            <div 
              key={index} 
              className="glass-card rounded-2xl p-6 space-y-4 text-center hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <useCase.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  {useCase.clients}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="space-y-8 mb-20">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              O que nossos clientes <span className="gradient-text">dizem</span>
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5 • 1000+ avaliações</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="glass-card rounded-2xl p-6 space-y-4 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-success/20 text-success border-success/30 text-xs">
                      {testimonial.metric}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="relative">
                  <Quote className="w-6 h-6 text-primary/30 absolute -top-2 -left-1" />
                  <p className="text-sm leading-relaxed pl-6">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="glass-card rounded-3xl p-8 lg:p-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">1000+</div>
              <div className="font-semibold">Profissionais Ativos</div>
              <div className="text-sm text-muted-foreground">Em todo o Brasil</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">50k+</div>
              <div className="font-semibold">Agendamentos/mês</div>
              <div className="text-sm text-muted-foreground">E crescendo</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">99.9%</div>
              <div className="font-semibold">Uptime</div>
              <div className="text-sm text-muted-foreground">Sempre disponível</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">24/7</div>
              <div className="font-semibold">Suporte</div>
              <div className="text-sm text-muted-foreground">Em português</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}