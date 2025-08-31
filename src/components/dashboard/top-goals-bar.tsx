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
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Goal Info */}
          <div className="flex items-center gap-3">
            <currentGoal.icon className={`w-5 h-5 ${currentGoal.color}`} />
            <span className="text-sm font-semibold gradient-text">Meta: {currentGoal.label}</span>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-2 bg-secondary/30 rounded-full"
              />
              {progress > 90 && (
                <div className="absolute inset-0 bg-gradient-primary opacity-60 rounded-full animate-glow-pulse"></div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{totalAppointments.toLocaleString('pt-BR')}</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-muted-foreground">{currentGoal.value.toLocaleString('pt-BR')}</span>
            </div>
            
            <div className="px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-bold text-primary">{progress.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement celebration */}
      {progress >= 100 && (
        <div className="absolute inset-0 bg-gradient-primary/10 animate-pulse pointer-events-none rounded-b-lg">
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <Trophy className="w-5 h-5 text-warning animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}