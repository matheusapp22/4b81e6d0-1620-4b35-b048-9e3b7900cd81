-- Atualizar o agendamento existente para ter payment_status = 'paid'
UPDATE appointments 
SET payment_status = 'paid', 
    payment_amount = 160.00 
WHERE id = '38089a02-4dd2-4987-99b7-ca9859557038';