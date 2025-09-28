import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionLimits {
  plan_type: 'free' | 'pro' | 'premium';
  appointments_per_month: number;
  services_limit: number;
  employees_limit: number;
  storage_limit_mb: number;
  bio_links_limit: number;
  testimonials_limit: number;
  can_use_marketing: boolean;
  can_use_analytics: boolean;
  can_use_loyalty: boolean;
  can_use_inventory: boolean;
}

const PLAN_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    plan_type: 'free',
    appointments_per_month: 20,
    services_limit: 3,
    employees_limit: 1,
    storage_limit_mb: 100,
    bio_links_limit: 1,
    testimonials_limit: 3,
    can_use_marketing: false,
    can_use_analytics: false,
    can_use_loyalty: false,
    can_use_inventory: false,
  },
  pro: {
    plan_type: 'pro',
    appointments_per_month: 100,
    services_limit: 15,
    employees_limit: 5,
    storage_limit_mb: 1000,
    bio_links_limit: 3,
    testimonials_limit: 10,
    can_use_marketing: true,
    can_use_analytics: true,
    can_use_loyalty: false,
    can_use_inventory: true,
  },
  premium: {
    plan_type: 'premium',
    appointments_per_month: -1, // unlimited
    services_limit: -1, // unlimited
    employees_limit: -1, // unlimited
    storage_limit_mb: -1, // unlimited
    bio_links_limit: -1, // unlimited
    testimonials_limit: -1, // unlimited
    can_use_marketing: true,
    can_use_analytics: true,
    can_use_loyalty: true,
    can_use_inventory: true,
  },
};

export interface CurrentUsage {
  appointments_this_month: number;
  services_count: number;
  employees_count: number;
  bio_links_count: number;
  testimonials_count: number;
}

export function useSubscriptionLimits() {
  const { user } = useAuth();
  const [limits, setLimits] = useState<SubscriptionLimits>(PLAN_LIMITS.free);
  const [usage, setUsage] = useState<CurrentUsage>({
    appointments_this_month: 0,
    services_count: 0,
    employees_count: 0,
    bio_links_count: 0,
    testimonials_count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptionAndUsage();
    }
  }, [user]);

  const fetchSubscriptionAndUsage = async () => {
    if (!user) return;

    try {
      // Fetch current subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      const planType = subscription?.plan_type || 'free';
      setLimits(PLAN_LIMITS[planType] || PLAN_LIMITS.free);

      // Fetch current usage
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [appointmentsRes, servicesRes, employeesRes, bioLinksRes, testimonialsRes] = await Promise.all([
        // Appointments this month
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString()),
        
        // Services count
        supabase
          .from('services')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Employees count
        supabase
          .from('employees')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Bio links count
        supabase
          .from('bio_links')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Testimonials count
        supabase
          .from('testimonials')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
      ]);

      setUsage({
        appointments_this_month: appointmentsRes.count || 0,
        services_count: servicesRes.count || 0,
        employees_count: employeesRes.count || 0,
        bio_links_count: bioLinksRes.count || 0,
        testimonials_count: testimonialsRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching subscription limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreateAppointment = () => {
    if (limits.appointments_per_month === -1) return true;
    return usage.appointments_this_month < limits.appointments_per_month;
  };

  const canCreateService = () => {
    if (limits.services_limit === -1) return true;
    return usage.services_count < limits.services_limit;
  };

  const canCreateEmployee = () => {
    if (limits.employees_limit === -1) return true;
    return usage.employees_count < limits.employees_limit;
  };

  const canCreateBioLink = () => {
    if (limits.bio_links_limit === -1) return true;
    return usage.bio_links_count < limits.bio_links_limit;
  };

  const canCreateTestimonial = () => {
    if (limits.testimonials_limit === -1) return true;
    return usage.testimonials_count < limits.testimonials_limit;
  };

  const canAccessFeature = (feature: keyof Pick<SubscriptionLimits, 'can_use_marketing' | 'can_use_analytics' | 'can_use_loyalty' | 'can_use_inventory'>) => {
    return limits[feature];
  };

  const getRemainingCount = (type: 'appointments' | 'services' | 'employees' | 'bio_links' | 'testimonials') => {
    switch (type) {
      case 'appointments':
        if (limits.appointments_per_month === -1) return -1;
        return Math.max(0, limits.appointments_per_month - usage.appointments_this_month);
      case 'services':
        if (limits.services_limit === -1) return -1;
        return Math.max(0, limits.services_limit - usage.services_count);
      case 'employees':
        if (limits.employees_limit === -1) return -1;
        return Math.max(0, limits.employees_limit - usage.employees_count);
      case 'bio_links':
        if (limits.bio_links_limit === -1) return -1;
        return Math.max(0, limits.bio_links_limit - usage.bio_links_count);
      case 'testimonials':
        if (limits.testimonials_limit === -1) return -1;
        return Math.max(0, limits.testimonials_limit - usage.testimonials_count);
      default:
        return 0;
    }
  };

  return {
    limits,
    usage,
    loading,
    canCreateAppointment,
    canCreateService,
    canCreateEmployee,
    canCreateBioLink,
    canCreateTestimonial,
    canAccessFeature,
    getRemainingCount,
    refreshUsage: fetchSubscriptionAndUsage,
  };
}