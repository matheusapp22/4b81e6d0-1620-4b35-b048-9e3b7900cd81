import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Area, AreaChart } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { TrendingUp, Calendar, DollarSign, Activity, Users, Sparkles } from 'lucide-react';

interface ChartData {
  day: string;
  appointments: number;
  revenue: number;
  clients: number;
}

export function StatsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });

        const chartData: ChartData[] = [];

        for (const date of last7Days) {
          // Get appointments count
          const { count: appointmentsCount } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('appointment_date', date);

          // Get revenue for the day
          const { data: appointmentsData } = await supabase
            .from('appointments')
            .select('payment_amount')
            .eq('user_id', user.id)
            .eq('appointment_date', date)
            .eq('payment_status', 'paid');

          const revenue = appointmentsData?.reduce(
            (sum, apt) => sum + (apt.payment_amount || 0), 
            0
          ) || 0;

          // Get new clients count
          const { count: clientsCount } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', `${date}T00:00:00`)
            .lt('created_at', `${date}T23:59:59`);

          chartData.push({
            day: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
            appointments: appointmentsCount || 0,
            revenue: revenue,
            clients: clientsCount || 0
          });
        }

        setData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard variant="elevated" className="p-4 border-0 shadow-elevated">
          <p className="text-caption font-bold text-muted-foreground mb-3">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-caption font-medium">{entry.name}</span>
                </div>
                <span className="text-caption font-bold" style={{ color: entry.color }}>
                  {entry.name === 'Receita' ? `R$ ${entry.value.toFixed(2)}` : entry.value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <GlassCard key={i} variant="premium" className="p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="loading-skeleton w-6 h-6 rounded-xl"></div>
                <div className="loading-skeleton h-6 w-32 rounded"></div>
              </div>
              <div className="loading-skeleton h-40 rounded-2xl"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Revenue Chart */}
      <GlassCard variant="premium" hover className="group chart-premium">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-success/10 group-hover:bg-success/20 transition-all duration-400 shadow-card">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <h4 className="font-bold text-body">Receita</h4>
                <p className="text-caption">Últimos 7 dias</p>
              </div>
            </div>
            <Badge className="status-indicator success px-3 py-1">
              <TrendingUp className="w-3 h-3" />
              +24%
            </Badge>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2, fill: 'white' }}
                  name="Receita"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Appointments Chart */}
      <GlassCard variant="premium" hover className="group chart-premium">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-400 shadow-card">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-body">Agendamentos</h4>
                <p className="text-caption">Últimos 7 dias</p>
              </div>
            </div>
            <Badge className="status-indicator info px-3 py-1">
              <Activity className="w-3 h-3" />
              +12%
            </Badge>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="30%">
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="appointments" 
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  className="data-point"
                  name="Agendamentos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Clients Chart */}
      <GlassCard variant="premium" hover className="group chart-premium">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-neon-purple/10 group-hover:bg-neon-purple/20 transition-all duration-400 shadow-card">
                <Users className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <h4 className="font-bold text-body">Novos Clientes</h4>
                <p className="text-caption">Últimos 7 dias</p>
              </div>
            </div>
            <Badge className="status-indicator success px-3 py-1">
              <TrendingUp className="w-3 h-3" />
              +8%
            </Badge>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="clients" 
                  stroke="hsl(var(--neon-purple))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--neon-purple))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--neon-purple))', strokeWidth: 2, fill: 'white' }}
                  className="data-point"
                  name="Clientes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}