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
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 py-2">
          {/* Goal Info */}
          <div className="flex items-center gap-3">
            <currentGoal.icon className={`w-4 h-4 ${currentGoal.color}`} />
            <span className="text-sm font-semibold gradient-text">{currentGoal.label}</span>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-1.5 bg-secondary/20"
              />
              {progress > 90 && (
                <div className="absolute inset-0 bg-gradient-primary opacity-50 rounded-full animate-glow-pulse blur-[1px]"></div>
              )}
            </div>
          </div>

          {/* Current Progress */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{totalAppointments.toLocaleString('pt-BR')}</span>
            <span className="text-muted-foreground">de</span>
            <span className="font-medium">{currentGoal.value.toLocaleString('pt-BR')}</span>
          </div>

          {/* Percentage */}
          <div className="text-sm font-bold text-primary min-w-[50px] text-right">
            {progress.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Achievement celebration */}
      {progress >= 100 && (
        <div className="absolute inset-0 bg-gradient-primary/5 animate-pulse pointer-events-none">
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Trophy className="w-4 h-4 text-warning animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}