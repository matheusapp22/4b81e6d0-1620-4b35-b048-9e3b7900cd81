import { AlertTriangle, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UpgradePromptProps {
  feature: string;
  currentPlan: string;
  requiredPlan: 'pro' | 'premium';
  remaining?: number;
  limit?: number;
  onUpgrade?: () => void;
}

const planDetails = {
  pro: {
    name: 'Pro',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  premium: {
    name: 'Premium',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
};

export function UpgradePrompt({ 
  feature, 
  currentPlan, 
  requiredPlan, 
  remaining, 
  limit,
  onUpgrade 
}: UpgradePromptProps) {
  const plan = planDetails[requiredPlan];
  const Icon = plan.icon;

  const isLimitReached = remaining !== undefined && limit !== undefined && remaining <= 0;

  return (
    <Card className={`border-2 ${plan.borderColor} ${plan.bgColor}/50`}>
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className={`p-2 rounded-full ${plan.bgColor}`}>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <Icon className={`w-6 h-6 ${plan.color}`} />
        </div>
        <CardTitle className="text-lg">
          {isLimitReached ? 'Limite Atingido!' : 'Recurso Premium'}
        </CardTitle>
        <CardDescription>
          {isLimitReached 
            ? `Você atingiu o limite de ${limit} ${feature} do plano ${currentPlan.toUpperCase()}`
            : `O recurso "${feature}" requer o plano ${plan.name}`
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        {remaining !== undefined && limit !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant={remaining > 0 ? "secondary" : "destructive"}>
                {remaining} de {limit === -1 ? '∞' : limit} restantes
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  remaining > (limit * 0.2) ? 'bg-green-500' : 
                  remaining > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: limit === -1 ? '100%' : `${Math.max(0, (remaining / limit) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          Faça upgrade para o plano <span className={`font-semibold ${plan.color}`}>{plan.name}</span> para desbloquear este recurso e muito mais!
        </p>

        <div className="space-y-2 text-xs text-left bg-white/80 p-3 rounded-lg">
          <h4 className="font-semibold text-center mb-2">O que você ganha com o {plan.name}:</h4>
          {requiredPlan === 'pro' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                <span>Até 100 agendamentos por mês</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                <span>Até 15 serviços</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                <span>Marketing e Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                <span>Controle de estoque</span>
              </div>
            </>
          )}
          {requiredPlan === 'premium' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-yellow-600 rounded-full" />
                <span>Agendamentos ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-yellow-600 rounded-full" />
                <span>Serviços e funcionários ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-yellow-600 rounded-full" />
                <span>Programa de fidelidade completo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-yellow-600 rounded-full" />
                <span>Todos os recursos premium</span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={onUpgrade}
          className="w-full" 
          variant={requiredPlan === 'premium' ? 'premium' : 'default'}
        >
          <Icon className="w-4 h-4 mr-2" />
          Fazer Upgrade para {plan.name}
        </Button>
      </CardFooter>
    </Card>
  );
}