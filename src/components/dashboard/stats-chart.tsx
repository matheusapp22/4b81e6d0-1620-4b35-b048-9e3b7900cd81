import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Area, AreaChart } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { TrendingUp, Calendar, DollarSign, Activity } from 'lucide-react';

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
        <GlassCard variant="minimal" className="p-3 border-0 shadow-elevated">
          <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Receita' ? `R$ ${entry.value.toFixed(2)}` : entry.value}
            </p>
          ))}
        </GlassCard>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <GlassCard key={i} variant="premium" className="p-6">
            <div className="loading-skeleton h-4 w-3/4 mb-4 rounded"></div>
            <div className="loading-skeleton h-32 rounded-xl"></div>
          </GlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Chart */}
      <GlassCard variant="premium" hover className="group">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-green/10 group-hover:bg-neon-green/20 transition-colors duration-300">
              <DollarSign className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h4 className="font-semibold text-body">Receita</h4>
              <p className="text-caption">Últimos 7 dias</p>
            </div>
          </div>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(120 60% 45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(120 60% 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(120 60% 45%)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={{ fill: 'hsl(120 60% 45%)', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, stroke: 'hsl(120 60% 45%)', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Appointments Chart */}
      <GlassCard variant="premium" hover className="group">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-blue/10 group-hover:bg-neon-blue/20 transition-colors duration-300">
              <Calendar className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h4 className="font-semibold text-body">Agendamentos</h4>
              <p className="text-caption">Últimos 7 dias</p>
            </div>
          </div>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="20%">
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="appointments" 
                  fill="hsl(220 100% 50%)"
                  radius={[6, 6, 0, 0]}
                  className="data-point"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Clients Chart */}
      <GlassCard variant="premium" hover className="group">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-purple/10 group-hover:bg-neon-purple/20 transition-colors duration-300">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <h4 className="font-semibold text-body">Novos Clientes</h4>
              <p className="text-caption">Últimos 7 dias</p>
            </div>
          </div>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="clients" 
                  stroke="hsl(270 100% 60%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(270 100% 60%)', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(270 100% 60%)', strokeWidth: 2, fill: 'white' }}
                  className="data-point"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}