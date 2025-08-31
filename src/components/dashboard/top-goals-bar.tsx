import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, Zap, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';

interface GoalMilestone {
  value: number;
  label: string;
  icon: any;
  color: string;
}

const MILESTONES: GoalMilestone[] = [
  {
    value: 100000,
    label: '100K',
    icon: Target,
    color: 'text-primary'
  },
  {
    value: 500000,
    label: '500K',
    icon: Zap,
    color: 'text-neon-blue'
  },
  {
    value: 1000000,
    label: '1M',
    icon: Trophy,
    color: 'text-warning'
  },
  {
    value: 5000000,
    label: '5M',
    icon: Crown,
    color: 'text-success'
  }
];

export function TopGoalsBar() {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchTotalAppointments = async () => {
      try {
        const { count } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setTotalAppointments(count || 0);
      } catch (error) {
        console.error('Error fetching total appointments:', error);
      }
    };

    fetchTotalAppointments();

    // Real-time updates
    const channel = supabase
      .channel('appointments-top-bar')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTotalAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getCurrentGoal = () => {
    for (const milestone of MILESTONES) {
      if (totalAppointments < milestone.value) {
        return milestone;
      }
    }
    return MILESTONES[MILESTONES.length - 1];
  };

  const currentGoal = getCurrentGoal();
  const progress = Math.min((totalAppointments / currentGoal.value) * 100, 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-6 py-3">
          {/* Current Goal Icon */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-secondary/10`}>
              <currentGoal.icon className={`w-4 h-4 ${currentGoal.color}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Meta:</span>
                <span className="text-sm font-bold gradient-text">{currentGoal.label}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-2 bg-secondary/20"
              />
              {progress > 80 && (
                <div className="absolute inset-0 bg-gradient-primary opacity-40 rounded-full animate-glow-pulse blur-[1px]"></div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold gradient-text">
                {totalAppointments.toLocaleString('pt-BR')}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            
            <div className="w-px h-8 bg-border"></div>
            
            <div className="text-center">
              <div className="font-bold text-primary">
                {progress.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Progresso</div>
            </div>

            <div className="w-px h-8 bg-border"></div>
            
            <div className="text-center">
              <div className="font-bold text-muted-foreground">
                {Math.max(0, currentGoal.value - totalAppointments).toLocaleString('pt-BR')}
              </div>
              <div className="text-xs text-muted-foreground">Restantes</div>
            </div>
          </div>

          {/* Milestones indicators */}
          <div className="flex items-center gap-1">
            {MILESTONES.map((milestone) => {
              const isAchieved = totalAppointments >= milestone.value;
              const isCurrent = milestone.value === currentGoal.value;
              
              return (
                <div
                  key={milestone.value}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isAchieved 
                      ? 'bg-success animate-pulse' 
                      : isCurrent
                      ? 'bg-primary/50 animate-pulse'
                      : 'bg-secondary/30'
                  }`}
                  title={`${milestone.label} - ${isAchieved ? 'Conquistado' : 'Pendente'}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievement celebration overlay */}
      {progress >= 100 && (
        <div className="absolute inset-0 bg-gradient-primary/10 animate-pulse pointer-events-none">
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Trophy className="w-6 h-6 text-warning animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}