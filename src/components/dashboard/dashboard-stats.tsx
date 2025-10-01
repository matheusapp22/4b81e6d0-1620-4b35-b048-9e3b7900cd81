import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, Users, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';

interface Stats {
  todayAppointments: number;
  totalClients: number;
  monthlyRevenue: number;
  completionRate: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString().split('T')[0];

        // Today's appointments
        const { count: todayCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('appointment_date', today);

        // Total clients
        const { count: clientsCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Monthly revenue
        const { data: monthlyPayments } = await supabase
          .from('appointments')
          .select('payment_amount')
          .eq('user_id', user.id)
          .eq('payment_status', 'paid')
          .gte('appointment_date', startOfMonth);

        const monthlyRevenue = monthlyPayments?.reduce(
          (sum, appointment) => sum + (appointment.payment_amount || 0), 
          0
        ) || 0;

        // Completion rate (this month)
        const { count: totalAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('appointment_date', startOfMonth);

        const { count: completedAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('appointment_date', startOfMonth);

        const completionRate = totalAppointments 
          ? Math.round((completedAppointments || 0) / totalAppointments * 100)
          : 0;

        setStats({
          todayAppointments: todayCount || 0,
          totalClients: clientsCount || 0,
          monthlyRevenue,
          completionRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Real-time updates for appointments
    const channel = supabase
      .channel('dashboard-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const statsData = [
    {
      title: 'Agendamentos Hoje',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+12%',
      trendIcon: TrendingUp,
      trendColor: 'text-success',
      description: 'vs. ontem',
      isPositive: true
    },
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: Users,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/10',
      trend: '+8%',
      trendIcon: TrendingUp,
      trendColor: 'text-success',
      description: 'este mês',
      isPositive: true
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+24%',
      trendIcon: TrendingUp,
      trendColor: 'text-success',
      description: 'vs. mês anterior',
      isPositive: true
    },
    {
      title: 'Taxa de Conclusão',
      value: `${stats.completionRate}%`,
      icon: stats.completionRate >= 80 ? Activity : Clock,
      color: stats.completionRate >= 80 ? 'text-success' : 'text-warning',
      bgColor: stats.completionRate >= 80 ? 'bg-success/10' : 'bg-warning/10',
      trend: stats.completionRate >= 80 ? '+5%' : '-2%',
      trendIcon: stats.completionRate >= 80 ? TrendingUp : TrendingDown,
      trendColor: stats.completionRate >= 80 ? 'text-success' : 'text-warning',
      description: 'este mês',
      isPositive: stats.completionRate >= 80
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} variant="premium" className="p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="loading-skeleton w-12 h-12 rounded-2xl"></div>
                <div className="loading-skeleton w-16 h-6 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="loading-skeleton h-4 w-3/4 rounded"></div>
                <div className="loading-skeleton h-10 w-1/2 rounded"></div>
                <div className="loading-skeleton h-3 w-2/3 rounded"></div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {statsData.map((stat, index) => (
        <GlassCard 
          key={stat.title} 
          variant="premium" 
          hover 
          className="group animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
            {/* Header with Icon and Trend */}
            <div className="flex items-center justify-between">
              <div className={`p-3 lg:p-4 rounded-2xl lg:rounded-3xl ${stat.bgColor} group-hover:scale-110 transition-all duration-400 shadow-card`}>
                <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
              </div>
              
              <Badge className={`status-indicator ${stat.isPositive ? 'success' : 'warning'} px-2 py-1 lg:px-3 lg:py-1 text-xs`}>
                <stat.trendIcon className="w-3 h-3" />
                {stat.trend}
              </Badge>
            </div>
            
            {/* Content */}
            <div className="space-y-2 lg:space-y-3">
              <p className="text-xs sm:text-sm lg:text-caption text-muted-foreground font-medium">
                {stat.title}
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold gradient-text">
                {stat.value}
              </p>
              <p className="text-xs lg:text-micro text-muted-foreground flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stat.isPositive ? 'bg-success' : 'bg-warning'} animate-pulse flex-shrink-0`}></div>
                {stat.description}
              </p>
            </div>

            {/* Hover Effect Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}