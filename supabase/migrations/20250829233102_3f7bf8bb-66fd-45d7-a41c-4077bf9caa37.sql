-- Create tables for new GoAgendas features

-- 1. Team/Employee Management
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Financial Management
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.cash_flow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  reference_id UUID, -- Can reference appointments, commissions, etc.
  reference_type TEXT, -- 'appointment', 'commission', 'other'
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Loyalty Program
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  points_earned INTEGER DEFAULT 0,
  points_spent INTEGER DEFAULT 0,
  points_balance INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'expired', 'bonus')),
  points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. VIP Club/Subscriptions
CREATE TABLE public.client_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'vip')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  benefits JSONB,
  price NUMERIC(10,2),
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Marketing Campaigns
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reactivation', 'birthday', 'anniversary', 'promotion', 'custom')),
  target_segment JSONB, -- Criteria for targeting clients
  message_template TEXT,
  discount_percentage NUMERIC(5,2),
  discount_amount NUMERIC(10,2),
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.campaign_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ DEFAULT now(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- 6. Referral System
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 7. Promotions/Marketplace
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'buy_x_get_y')),
  discount_value NUMERIC(10,2),
  min_amount NUMERIC(10,2),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_flash BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. NPS/Satisfaction
CREATE TABLE public.satisfaction_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  nps_score INTEGER CHECK (nps_score BETWEEN 0 AND 10),
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Inventory Control
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  category TEXT,
  unit_price NUMERIC(10,2),
  current_stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  reference_type TEXT, -- 'purchase', 'sale', 'service', 'adjustment'
  reference_id UUID, -- Can reference appointments, etc.
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Service-Product Relations (for automatic stock deduction)
CREATE TABLE public.service_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_used NUMERIC(10,3) DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service_id, product_id)
);

-- Enable RLS on all tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satisfaction_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-owned data
CREATE POLICY "Users can manage their employees" ON public.employees
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their commissions" ON public.commissions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = commissions.employee_id AND e.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their cash flow" ON public.cash_flow
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view loyalty points for their clients" ON public.loyalty_points
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.clients c 
    WHERE c.id = loyalty_points.client_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can view loyalty transactions for their clients" ON public.loyalty_transactions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.clients c 
    WHERE c.id = loyalty_transactions.client_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can view client subscriptions for their clients" ON public.client_subscriptions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.clients c 
    WHERE c.id = client_subscriptions.client_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their campaigns" ON public.campaigns
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view campaign sends for their campaigns" ON public.campaign_sends
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.campaigns c 
    WHERE c.id = campaign_sends.campaign_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can view referrals for their clients" ON public.referrals
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.clients c 
    WHERE (c.id = referrals.referrer_id OR c.id = referrals.referred_id) AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their promotions" ON public.promotions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view satisfaction surveys for their appointments" ON public.satisfaction_surveys
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = satisfaction_surveys.appointment_id AND a.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their products" ON public.products
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view stock movements for their products" ON public.stock_movements
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = stock_movements.product_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage service-product relations for their services" ON public.service_products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.services s 
    WHERE s.id = service_products.service_id AND s.user_id = auth.uid()
  ));

-- Add updated_at triggers
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_points_updated_at
  BEFORE UPDATE ON public.loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_subscriptions_updated_at
  BEFORE UPDATE ON public.client_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();