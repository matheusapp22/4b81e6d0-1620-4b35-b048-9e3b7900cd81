import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Zap, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';

interface GoalMilestone {
  value: number;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  glowColor: string;
}

const MILESTONES: GoalMilestone[] = [
  {
    value: 100000,
    label: '100K Agendamentos',
    icon: Target,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    glowColor: 'shadow-primary'
  },
  {
    value: 500000,
    label: '500K Agendamentos',
    icon: Zap,
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/10',
    glowColor: 'shadow-neon-blue'
  },
  {
    value: 1000000,
    label: '1M Agendamentos',
    icon: Trophy,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    glowColor: 'shadow-warning'
  },
  {
    value: 5000000,
    label: '5M Agendamentos',
    icon: Crown,
    color: 'text-success',
    bgColor: 'bg-success/10',
    glowColor: 'shadow-success'
  }
];

export function GoalsProgress() {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchTotalAppointments();

    // Real-time updates
    const channel = supabase
      .channel('appointments-goals')
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

  const getCompletedMilestones = () => {
    return MILESTONES.filter(milestone => totalAppointments >= milestone.value);
  };

  const currentGoal = getCurrentGoal();
  const completedMilestones = getCompletedMilestones();
  const progress = Math.min((totalAppointments / currentGoal.value) * 100, 100);
  const isCompleted = totalAppointments >= currentGoal.value;

  if (loading) {
    return (
      <GlassCard variant="premium" className="p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="loading-skeleton w-12 h-12 rounded-2xl"></div>
            <div className="flex-1">
              <div className="loading-skeleton h-6 w-1/2 rounded mb-2"></div>
              <div className="loading-skeleton h-4 w-1/3 rounded"></div>
            </div>
          </div>
          <div className="loading-skeleton h-4 w-full rounded-full"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="premium" hover className="group">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-3xl ${currentGoal.bgColor} group-hover:scale-110 transition-all duration-400 ${currentGoal.glowColor}`}>
              <currentGoal.icon className={`w-8 h-8 ${currentGoal.color}`} />
            </div>
            <div>
              <h3 className="text-h4 font-bold gradient-text">Meta de Agendamentos</h3>
              <p className="text-caption text-muted-foreground">Próxima conquista: {currentGoal.label}</p>
            </div>
          </div>

          {completedMilestones.length > 0 && (
            <Badge className="status-indicator success px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              {completedMilestones.length} conquista{completedMilestones.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-body font-medium">
              {totalAppointments.toLocaleString('pt-BR')} agendamentos
            </span>
            <span className="text-caption text-muted-foreground">
              {currentGoal.value.toLocaleString('pt-BR')} meta
            </span>
          </div>

          <div className="relative">
            <Progress 
              value={progress} 
              className="h-4 bg-secondary/20 rounded-full overflow-hidden"
            />
            <div className="absolute inset-0 bg-gradient-primary opacity-80 rounded-full animate-shimmer"></div>
            
            {/* Glow effect when near completion */}
            {progress > 80 && (
              <div className="absolute inset-0 bg-gradient-primary opacity-40 rounded-full animate-glow-pulse blur-sm"></div>
            )}
          </div>

          <div className="flex items-center justify-between text-micro">
            <span className={`font-medium ${progress > 90 ? 'text-success animate-pulse' : 'text-muted-foreground'}`}>
              {progress.toFixed(1)}% concluído
            </span>
            <span className="text-muted-foreground">
              {Math.max(0, currentGoal.value - totalAppointments).toLocaleString('pt-BR')} restantes
            </span>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-4">
          <h4 className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">
            Conquistas
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {MILESTONES.map((milestone) => {
              const isAchieved = totalAppointments >= milestone.value;
              const isCurrent = milestone.value === currentGoal.value;
              
              return (
                <div
                  key={milestone.value}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                    isAchieved 
                      ? `${milestone.bgColor} border border-current` 
                      : isCurrent
                      ? 'bg-secondary/10 border border-secondary/20'
                      : 'bg-secondary/5'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isAchieved ? milestone.bgColor : 'bg-secondary/10'}`}>
                    <milestone.icon 
                      className={`w-4 h-4 ${
                        isAchieved ? milestone.color : 'text-muted-foreground'
                      }`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-micro font-medium truncate ${
                      isAchieved ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {milestone.value >= 1000000 
                        ? `${milestone.value / 1000000}M` 
                        : `${milestone.value / 1000}K`
                      }
                    </p>
                    {isAchieved && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-micro text-success">Conquista</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement animation when goal is reached */}
        {isCompleted && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-primary opacity-10 animate-pulse rounded-3xl"></div>
            <div className="absolute top-4 right-4">
              <Trophy className="w-8 h-8 text-warning animate-bounce" />
            </div>
          </div>
        )}

        {/* Hover Effect Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-b-3xl"></div>
      </div>
    </GlassCard>
  );
}