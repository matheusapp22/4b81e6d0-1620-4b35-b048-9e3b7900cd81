-- Update the existing user profile with a business name for demo
UPDATE profiles 
SET business_name = 'studio-beleza', 
    phone = '(11) 99999-9999'
WHERE email = 'matheusporfirio555@gmail.com';

-- Insert some demo services for the business
INSERT INTO services (user_id, name, description, price, duration, color, is_active) VALUES 
(
  (SELECT user_id FROM profiles WHERE email = 'matheusporfirio555@gmail.com'),
  'Corte de Cabelo',
  'Corte moderno e estilizado',
  35.00,
  30,
  '#6C63FF',
  true
),
(
  (SELECT user_id FROM profiles WHERE email = 'matheusporfirio555@gmail.com'),
  'Barba',
  'Aparar e modelar a barba',
  20.00,
  20,
  '#217991',
  true
),
(
  (SELECT user_id FROM profiles WHERE email = 'matheusporfirio555@gmail.com'),
  'Cabelo + Barba',
  'Pacote completo de cuidados',
  50.00,
  45,
  '#142771',
  true
);