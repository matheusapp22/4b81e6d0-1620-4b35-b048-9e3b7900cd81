import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar, BarChart3, Users, Settings, Zap } from "lucide-react";

export function Navigation() {
  return (
    <GlassCard className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4">
      <nav className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">GoAgendas</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm">
            <BarChart3 className="w-4 h-4" />
            Relatórios
          </Button>
          <Button variant="ghost" size="sm">
            <Users className="w-4 h-4" />
            Clientes
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button variant="hero" size="sm">
            Começar Grátis
          </Button>
        </div>
      </nav>
    </GlassCard>
  );
}