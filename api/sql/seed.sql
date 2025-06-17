DELETE FROM history;
DELETE FROM transactions;
DELETE FROM payment_methods;
DELETE FROM clients;
DELETE FROM categories;
DELETE FROM accounts;
DELETE FROM users;


ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE payment_methods AUTO_INCREMENT = 1;
ALTER TABLE history AUTO_INCREMENT = 1;


INSERT INTO users (id, name, email, password, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Pedro5g', 'pedro5g@email.com', '$2y$12$tZ/2QAg38OOHe1iuVHHAouhwPqWsCcnMxndHSZZVu6tLwV0QUXcEm', '2024-01-15 10:00:00'),
('550e8400-e29b-41d4-a716-446655440001', 'Maria Santos', 'maria@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2024-02-01 14:30:00'),
('550e8400-e29b-41d4-a716-446655440002', 'João Oliveira', 'joao@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2024-01-20 09:15:00');


INSERT INTO accounts (id, name, type, balance, user_id) VALUES

('660e8400-e29b-41d4-a716-446655440000', 'Conta Corrente Principal', 'bank', 15750.50, '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440001', 'Poupança', 'bank', 25000.00, '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440002', 'Carteira Digital', 'digital', 850.75, '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440003', 'Dinheiro Físico', 'cash', 320.00, '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440004', 'Bitcoin Wallet', 'crypto', 8500.00, '550e8400-e29b-41d4-a716-446655440000'),

('660e8400-e29b-41d4-a716-446655440005', 'Conta Corrente', 'bank', 8200.30, '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440006', 'Investimentos', 'bank', 45000.00, '550e8400-e29b-41d4-a716-446655440001'),

('660e8400-e29b-41d4-a716-446655440007', 'Conta Pessoal', 'bank', 3500.80, '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440008', 'PayPal', 'digital', 1200.50, '550e8400-e29b-41d4-a716-446655440002');


UPDATE users SET current_account_id = '660e8400-e29b-41d4-a716-446655440000' WHERE id = '550e8400-e29b-41d4-a716-446655440000';
UPDATE users SET current_account_id = '660e8400-e29b-41d4-a716-446655440005' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE users SET current_account_id = '660e8400-e29b-41d4-a716-446655440007' WHERE id = '550e8400-e29b-41d4-a716-446655440002';


INSERT INTO categories (name, type, emoji, account_id) VALUES

('Salário', 'income', '💰', '660e8400-e29b-41d4-a716-446655440000'),
('Freelance', 'income', '💻', '660e8400-e29b-41d4-a716-446655440000'),
('Vendas Online', 'income', '🛒', '660e8400-e29b-41d4-a716-446655440000'),
('Investimentos', 'income', '📈', '660e8400-e29b-41d4-a716-446655440000'),
('Renda Extra', 'income', '💡', '660e8400-e29b-41d4-a716-446655440000'),

('Alimentação', 'expense', '🍔', '660e8400-e29b-41d4-a716-446655440000'),
('Transporte', 'expense', '🚗', '660e8400-e29b-41d4-a716-446655440000'),
('Moradia', 'expense', '🏠', '660e8400-e29b-41d4-a716-446655440000'),
('Saúde', 'expense', '⚕️', '660e8400-e29b-41d4-a716-446655440000'),
('Educação', 'expense', '📚', '660e8400-e29b-41d4-a716-446655440000'),
('Lazer', 'expense', '🎮', '660e8400-e29b-41d4-a716-446655440000'),
('Compras', 'expense', '🛍️', '660e8400-e29b-41d4-a716-446655440000'),
('Serviços', 'expense', '🔧', '660e8400-e29b-41d4-a716-446655440000'),
('Impostos', 'expense', '📋', '660e8400-e29b-41d4-a716-446655440000'),
('Outros', 'expense', '📦', '660e8400-e29b-41d4-a716-446655440000'),

('Salário Empresa', 'income', '💼', '660e8400-e29b-41d4-a716-446655440005'),
('Consultoria', 'income', '👩‍💼', '660e8400-e29b-41d4-a716-446655440005'),
('Alimentação', 'expense', '🥗', '660e8400-e29b-41d4-a716-446655440005'),
('Casa', 'expense', '🏡', '660e8400-e29b-41d4-a716-446655440005'),
('Viagens', 'expense', '✈️', '660e8400-e29b-41d4-a716-446655440005'),

('Trabalho', 'income', '⚡', '660e8400-e29b-41d4-a716-446655440007'),
('Gastos Pessoais', 'expense', '👤', '660e8400-e29b-41d4-a716-446655440007'),
('Tecnologia', 'expense', '💾', '660e8400-e29b-41d4-a716-446655440007');


INSERT INTO clients (id, name, email, phone, account_id) VALUES

('770e8400-e29b-41d4-a716-446655440000', 'Tech Solutions Ltda', 'contato@techsolutions.com', '(11) 99999-1111', '660e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440001', 'Digital Marketing Pro', 'vendas@digitalmarketing.com', '(11) 88888-2222', '660e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440002', 'E-commerce Plus', 'financeiro@ecommerceplus.com', '(21) 77777-3333', '660e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440003', 'StartUp Inovadora', 'ceo@startupinovadora.com', '(31) 66666-4444', '660e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440004', 'Consultoria Financeira', 'admin@consultoriafinanceira.com', '(41) 55555-5555', '660e8400-e29b-41d4-a716-446655440000'),

('770e8400-e29b-41d4-a716-446655440005', 'Empresa ABC', 'rh@empresaabc.com', '(11) 44444-6666', '660e8400-e29b-41d4-a716-446655440005'),
('770e8400-e29b-41d4-a716-446655440006', 'Instituto XYZ', 'contato@institutoxyz.org', '(21) 33333-7777', '660e8400-e29b-41d4-a716-446655440005'),

('770e8400-e29b-41d4-a716-446655440007', 'Freelance Client', 'projeto@freelanceclient.com', '(31) 22222-8888', '660e8400-e29b-41d4-a716-446655440007');


INSERT INTO payment_methods (name, emoji, user_id) VALUES

('Dinheiro', '💵', '550e8400-e29b-41d4-a716-446655440000'),
('Cartão de Débito', '💳', '550e8400-e29b-41d4-a716-446655440000'),
('Cartão de Crédito', '💎', '550e8400-e29b-41d4-a716-446655440000'),
('PIX', '📱', '550e8400-e29b-41d4-a716-446655440000'),
('TED/DOC', '🏦', '550e8400-e29b-41d4-a716-446655440000'),
('PayPal', '🌐', '550e8400-e29b-41d4-a716-446655440000'),
('Crypto', '₿', '550e8400-e29b-41d4-a716-446655440000'),

('Cartão Empresa', '💼', '550e8400-e29b-41d4-a716-446655440001'),
('PIX', '📲', '550e8400-e29b-41d4-a716-446655440001'),
('Transferência', '🔄', '550e8400-e29b-41d4-a716-446655440001'),

('Dinheiro', '💰', '550e8400-e29b-41d4-a716-446655440002'),
('Cartão', '💳', '550e8400-e29b-41d4-a716-446655440002');


INSERT INTO transactions (id, title, description, amount, type, date, is_scheduled, scheduled_date, confirmed, recurrence, account_id, category_id, client_id, payment_method_id, user_id, created_at) VALUES

('880e8400-e29b-41d4-a716-446655440000', 'Salário Janeiro', 'Salário mensal da empresa XYZ', 5500.00, 'income', '2024-01-05', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440000', 1, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-01-05 08:00:00'),
('880e8400-e29b-41d4-a716-446655440001', 'Projeto Freelance - Tech Solutions', 'Desenvolvimento de sistema web', 2500.00, 'income', '2024-01-15', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 2, '770e8400-e29b-41d4-a716-446655440000', 4, '550e8400-e29b-41d4-a716-446655440000', '2024-01-15 14:30:00'),
('880e8400-e29b-41d4-a716-446655440002', 'Aluguel Janeiro', 'Pagamento aluguel apartamento', 1200.00, 'expense', '2024-01-10', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440000', 8, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-01-10 09:00:00'),
('880e8400-e29b-41d4-a716-446655440003', 'Supermercado', 'Compras mensais no supermercado', 450.80, 'expense', '2024-01-12', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 6, NULL, 2, '550e8400-e29b-41d4-a716-446655440000', '2024-01-12 19:45:00'),
('880e8400-e29b-41d4-a716-446655440004', 'Combustível', 'Abastecimento do carro', 120.00, 'expense', '2024-01-08', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 7, NULL, 2, '550e8400-e29b-41d4-a716-446655440000', '2024-01-08 16:20:00'),

('880e8400-e29b-41d4-a716-446655440005', 'Salário Fevereiro', 'Salário mensal da empresa XYZ', 5500.00, 'income', '2024-02-05', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440000', 1, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-02-05 08:00:00'),
('880e8400-e29b-41d4-a716-446655440006', 'Venda Produto Online', 'Venda de curso online', 800.00, 'income', '2024-02-12', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 3, NULL, 6, '550e8400-e29b-41d4-a716-446655440000', '2024-02-12 11:30:00'),
('880e8400-e29b-41d4-a716-446655440007', 'Aluguel Fevereiro', 'Pagamento aluguel apartamento', 1200.00, 'expense', '2024-02-10', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440000', 8, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-02-10 09:00:00'),
('880e8400-e29b-41d4-a716-446655440008', 'Plano de Saúde', 'Mensalidade plano de saúde familiar', 380.00, 'expense', '2024-02-15', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440000', 9, NULL, 2, '550e8400-e29b-41d4-a716-446655440000', '2024-02-15 10:15:00'),
('880e8400-e29b-41d4-a716-446655440009', 'Cinema', 'Ida ao cinema com a família', 85.00, 'expense', '2024-02-18', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 11, NULL, 3, '550e8400-e29b-41d4-a716-446655440000', '2024-02-18 20:30:00'),

('880e8400-e29b-41d4-a716-446655440010', 'Freelance Digital Marketing', 'Campanha de marketing digital', 1800.00, 'income', '2024-03-08', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 2, '770e8400-e29b-41d4-a716-446655440001', 4, '550e8400-e29b-41d4-a716-446655440000', '2024-03-08 16:45:00'),
('880e8400-e29b-41d4-a716-446655440011', 'Investimento em Ações', 'Compra de ações da empresa ABC', 2000.00, 'expense', '2024-03-20', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440001', 4, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-03-20 14:20:00'),
('880e8400-e29b-41d4-a716-446655440012', 'Curso Online', 'Curso de especialização em tecnologia', 350.00, 'expense', '2024-03-25', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 10, NULL, 3, '550e8400-e29b-41d4-a716-446655440000', '2024-03-25 13:10:00'),

('880e8400-e29b-41d4-a716-446655440013', 'Dividendos', 'Dividendos de investimentos', 450.00, 'income', '2024-04-10', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440001', 4, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-04-10 09:30:00'),
('880e8400-e29b-41d4-a716-446655440014', 'Manutenção Carro', 'Revisão e troca de óleo', 280.00, 'expense', '2024-04-15', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 7, NULL, 2, '550e8400-e29b-41d4-a716-446655440000', '2024-04-15 11:00:00'),

('880e8400-e29b-41d4-a716-446655440015', 'Projeto E-commerce', 'Desenvolvimento de loja virtual', 3200.00, 'income', '2024-05-22', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 2, '770e8400-e29b-41d4-a716-446655440002', 4, '550e8400-e29b-41d4-a716-446655440000', '2024-05-22 17:15:00'),
('880e8400-e29b-41d4-a716-446655440016', 'Equipamentos Tech', 'Compra de notebook para trabalho', 2800.00, 'expense', '2024-05-10', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440000', 12, NULL, 3, '550e8400-e29b-41d4-a716-446655440000', '2024-05-10 15:45:00'),

('880e8400-e29b-41d4-a716-446655440017', 'Salário Junho', 'Salário mensal da empresa XYZ', 5500.00, 'income', '2024-06-05', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440000', 1, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-06-05 08:00:00'),
('880e8400-e29b-41d4-a716-446655440018', 'Consultoria StartUp', 'Projeto de consultoria para startup', 4000.00, 'income', '2024-06-30', TRUE, '2024-06-30', FALSE, 'none', '660e8400-e29b-41d4-a716-446655440000', 2, '770e8400-e29b-41d4-a716-446655440003', 4, '550e8400-e29b-41d4-a716-446655440000', '2024-06-15 10:00:00'),
('880e8400-e29b-41d4-a716-446655440019', 'Férias Família', 'Viagem de férias agendada', 3500.00, 'expense', '2024-07-15', TRUE, '2024-07-15', FALSE, 'none', '660e8400-e29b-41d4-a716-446655440000', 11, NULL, 3, '550e8400-e29b-41d4-a716-446655440000', '2024-06-20 14:30:00'),


('880e8400-e29b-41d4-a716-446655440020', 'Salário Empresa ABC', 'Salário mensal consultoria', 6500.00, 'income', '2024-03-05', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440005', 16, '770e8400-e29b-41d4-a716-446655440005', 9, '550e8400-e29b-41d4-a716-446655440001', '2024-03-05 08:30:00'),
('880e8400-e29b-41d4-a716-446655440021', 'Projeto Instituto XYZ', 'Consultoria especializada', 2800.00, 'income', '2024-03-20', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440005', 17, '770e8400-e29b-41d4-a716-446655440006', 10, '550e8400-e29b-41d4-a716-446655440001', '2024-03-20 16:00:00'),
('880e8400-e29b-41d4-a716-446655440022', 'Restaurante Executivo', 'Almoços de trabalho', 480.00, 'expense', '2024-03-25', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440005', 18, NULL, 8, '550e8400-e29b-41d4-a716-446655440001', '2024-03-25 13:45:00'),
('880e8400-e29b-41d4-a716-446655440023', 'Condomínio', 'Taxa condominial mensal', 850.00, 'expense', '2024-03-10', FALSE, NULL, TRUE, 'monthly', '660e8400-e29b-41d4-a716-446655440005', 19, NULL, 9, '550e8400-e29b-41d4-a716-446655440001', '2024-03-10 10:00:00'),
('880e8400-e29b-41d4-a716-446655440024', 'Viagem Trabalho', 'Despesas de viagem a São Paulo', 1200.00, 'expense', '2024-04-08', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440005', 20, NULL, 8, '550e8400-e29b-41d4-a716-446655440001', '2024-04-08 18:20:00'),


('880e8400-e29b-41d4-a716-446655440025', 'Freelance Web', 'Desenvolvimento site corporativo', 1500.00, 'income', '2024-04-12', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440007', 21, '770e8400-e29b-41d4-a716-446655440007', 12, '550e8400-e29b-41d4-a716-446655440002', '2024-04-12 14:15:00'),
('880e8400-e29b-41d4-a716-446655440026', 'Compras Pessoais', 'Roupas e acessórios', 320.00, 'expense', '2024-04-15', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440007', 22, NULL, 11, '550e8400-e29b-41d4-a716-446655440002', '2024-04-15 16:30:00'),
('880e8400-e29b-41d4-a716-446655440027', 'Upgrade PC', 'Melhoria no setup de trabalho', 800.00, 'expense', '2024-05-02', FALSE, NULL, TRUE, 'none', '660e8400-e29b-41d4-a716-446655440007', 23, NULL, 12, '550e8400-e29b-41d4-a716-446655440002', '2024-05-02 11:45:00'),


('880e8400-e29b-41d4-a716-446655440028', 'Salário Julho', 'Salário mensal da empresa XYZ', 5500.00, 'income', '2024-07-05', TRUE, '2024-07-05', FALSE, 'monthly', '660e8400-e29b-41d4-a716-446655440000', 1, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-06-25 08:00:00'),
('880e8400-e29b-41d4-a716-446655440029', 'Investimento Programado', 'Aporte mensal em fundos', 1000.00, 'expense', '2024-07-10', TRUE, '2024-07-10', FALSE, 'monthly', '660e8400-e29b-41d4-a716-446655440001', 4, NULL, 5, '550e8400-e29b-41d4-a716-446655440000', '2024-06-25 09:00:00'),
('880e8400-e29b-41d4-a716-446655440030', 'Seguro Anual', 'Pagamento seguro do carro', 1200.00, 'expense', '2024-08-15', TRUE, '2024-08-15', FALSE, 'yearly', '660e8400-e29b-41d4-a716-446655440000', 7, NULL, 2, '550e8400-e29b-41d4-a716-446655440000', '2024-06-20 10:30:00');


INSERT INTO history (day, total_income, total_expense, account_id, created_at) VALUES
-- Janeiro 2024
('2024-01-31', 8000.00, 1770.80, '660e8400-e29b-41d4-a716-446655440000', '2024-01-31 23:59:59'),
-- Fevereiro 2024  
('2024-02-29', 6300.00, 1665.00, '660e8400-e29b-41d4-a716-446655440000', '2024-02-29 23:59:59'),
-- Março 2024
('2024-03-31', 1800.00, 2350.00, '660e8400-e29b-41d4-a716-446655440000', '2024-03-31 23:59:59'),
('2024-03-31', 450.00, 0.00, '660e8400-e29b-41d4-a716-446655440001', '2024-03-31 23:59:59'),
-- Abril 2024
('2024-04-30', 450.00, 280.00, '660e8400-e29b-41d4-a716-446655440000', '2024-04-30 23:59:59'),
('2024-04-30', 450.00, 280.00, '660e8400-e29b-41d4-a716-446655440001', '2024-04-30 23:59:59'),
-- Maio 2024
('2024-05-31', 3200.00, 2800.00, '660e8400-e29b-41d4-a716-446655440000', '2024-05-31 23:59:59'),
-- Junho 2024
('2024-06-30', 5500.00, 0.00, '660e8400-e29b-41d4-a716-446655440000', '2024-06-30 23:59:59'),
-- Histórico das outras contas
-- Maria - Março 2024
('2024-03-31', 9300.00, 1330.00, '660e8400-e29b-41d4-a716-446655440005', '2024-03-31 23:59:59'),
-- Maria - Abril 2024
('2024-04-30', 0.00, 1200.00, '660e8400-e29b-41d4-a716-446655440005', '2024-04-30 23:59:59'),
-- João - Abril 2024
('2024-04-30', 1500.00, 320.00, '660e8400-e29b-41d4-a716-446655440007', '2024-04-30 23:59:59'),
-- João - Maio 2024
('2024-05-31', 0.00, 800.00, '660e8400-e29b-41d4-a716-446655440007', '2024-05-31 23:59:59');


SELECT 'RESUMO GERAL' as info;
SELECT 
    u.name as usuario,
    COUNT(DISTINCT a.id) as contas,
    COUNT(DISTINCT t.id) as transacoes,
    COUNT(DISTINCT c.id) as categorias,
    COUNT(DISTINCT cl.id) as clientes,
    COUNT(DISTINCT pm.id) as metodos_pagamento
FROM users u
LEFT JOIN accounts a ON u.id = a.user_id
LEFT JOIN transactions t ON u.id = t.user_id
LEFT JOIN categories c ON a.id = c.account_id
LEFT JOIN clients cl ON a.id = cl.account_id
LEFT JOIN payment_methods pm ON u.id = pm.user_id
GROUP BY u.id, u.name;

SELECT 'BALANÇOS POR CONTA' as info;
SELECT 
    u.name as usuario,
    a.name as conta,
    a.type as tipo,
    a.balance as saldo,
    COUNT(t.id) as total_transacoes
FROM accounts a
JOIN users u ON a.user_id = u.id
LEFT JOIN transactions t ON a.id = t.account_id
GROUP BY a.id, u.name, a.name, a.type, a.balance
ORDER BY u.name, a.name;

SELECT 'TRANSAÇÕES AGENDADAS' as info;
SELECT 
    u.name as usuario,
    t.title as titulo,
    t.amount as valor,
    t.scheduled_date as data_agendada,
    t.confirmed as confirmada
FROM transactions t
JOIN users u ON t.user_id = u.id
WHERE t.is_scheduled = TRUE
ORDER BY t.scheduled_date;

SELECT 'RESUMO FINANCEIRO POR USUÁRIO' as info;
SELECT 
    u.name as usuario,
    SUM(CASE WHEN t.type = 'income' AND t.confirmed = TRUE THEN t.amount ELSE 0 END) as total_receitas,
    SUM(CASE WHEN t.type = 'expense' AND t.confirmed = TRUE THEN ABS(t.amount) ELSE 0 END) as total_despesas,
    SUM(CASE WHEN t.type = 'income' AND t.confirmed = TRUE THEN t.amount ELSE 0 END) - 
    SUM(CASE WHEN t.type = 'expense' AND t.confirmed = TRUE THEN ABS(t.amount) ELSE 0 END) as saldo_liquido
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.name
ORDER BY u.name;


COMMIT;


-- Email: pedro5g@email.com
-- Senha: senha123