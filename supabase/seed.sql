-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert users into auth.users
INSERT INTO auth.users (id) VALUES
    ('11111111-1111-1111-1111-111111111111'),
    ('22222222-2222-2222-2222-222222222222'),
    ('33333333-3333-3333-3333-333333333333'),
    ('44444444-4444-4444-4444-444444444444'),
    ('55555555-5555-5555-5555-555555555555');

-- Update profiles
UPDATE public.profiles
SET name = 'Alice', role = 'superuser'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE public.profiles
SET name = 'Bob', role = 'user'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE public.profiles
SET name = 'Charlie', role = 'user'
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE public.profiles
SET name = 'Dave', role = 'user'
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE public.profiles
SET name = 'Eve', role = 'user'
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Insert studios
INSERT INTO public.studios (id, name, description, image_url) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tech Innovators', 'A startup incubator focused on emerging technologies.', 'https://example.com/tech-innovators.png'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Green Future', 'Sustainability and clean energy ventures.', 'https://example.com/green-future.png'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'HealthTech Hub', 'Healthcare innovation studio.', 'https://example.com/healthtech.png'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Inself', 'Personal development and self-improvement platform.', 'https://example.com/inself.png');

-- Associate users with studios
INSERT INTO public.user_to_studio (id, user_id, studio_id, role) VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'superuser'),
    (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'superuser'),
    (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'superuser'),
    (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'superuser');

-- Insert ventures
INSERT INTO public.ventures (id, name, description, image_url, v_token_amount, end_date, category, ledger_id) VALUES
    ('11111111-aaaa-bbbb-cccc-dddddddddddd', 'AI Vision', 'Computer vision solutions for retail.', 'https://example.com/ai-vision.png', 5000, NOW() + INTERVAL '180 days', 'technology', null),
    ('22222222-aaaa-bbbb-cccc-dddddddddddd', 'SolarFlow', 'Revolutionary solar panel technology.', 'https://example.com/solarflow.png', 3000, NOW() + INTERVAL '365 days', 'energy', null),
    ('33333333-aaaa-bbbb-cccc-dddddddddddd', 'BioTech Plus', 'Advanced biotechnology research.', 'https://example.com/biotech.png', 8000, NOW() + INTERVAL '730 days', 'healthcare', null),
    ('44444444-aaaa-bbbb-cccc-dddddddddddd', 'CryptoSecure', 'Blockchain security solutions.', 'https://example.com/cryptosecure.png', 4000, NOW() + INTERVAL '180 days', 'blockchain', null),
    ('55555555-aaaa-bbbb-cccc-dddddddddddd', 'EcoPackage', 'Sustainable packaging solutions.', 'https://example.com/ecopackage.png', 2500, NOW() + INTERVAL '365 days', 'sustainability', null),
    ('66666666-aaaa-bbbb-cccc-dddddddddddd', 'SmartAgri', 'IoT solutions for agriculture.', 'https://example.com/smartagri.png', 6000, NOW() + INTERVAL '365 days', 'agriculture', null),
    ('77777777-aaaa-bbbb-cccc-dddddddddddd', 'Inself', 'Personal development platform with AI-powered coaching.', 'https://example.com/inself-venture.png', 10000, NOW() + INTERVAL '365 days', 'wellness', null);

-- Link ventures to studios
INSERT INTO public.venture_to_studio (id, studio_id, venture_id) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-aaaa-bbbb-cccc-dddddddddddd'),
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-aaaa-bbbb-cccc-dddddddddddd'),
    (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-aaaa-bbbb-cccc-dddddddddddd'),
    (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-aaaa-bbbb-cccc-dddddddddddd'),
    (uuid_generate_v4(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-aaaa-bbbb-cccc-dddddddddddd'),
    (uuid_generate_v4(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-aaaa-bbbb-cccc-dddddddddddd'),
    (uuid_generate_v4(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-aaaa-bbbb-cccc-dddddddddddd');

-- Associate users with ventures
INSERT INTO public.user_to_venture (id, user_id, venture_id, type) VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', '11111111-aaaa-bbbb-cccc-dddddddddddd', 'co_founder'),
    (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', '22222222-aaaa-bbbb-cccc-dddddddddddd', 'co_founder'),
    (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', '33333333-aaaa-bbbb-cccc-dddddddddddd', 'co_founder'),
    (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', '44444444-aaaa-bbbb-cccc-dddddddddddd', 'creator'),
    (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', '55555555-aaaa-bbbb-cccc-dddddddddddd', 'creator'),
    (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', '77777777-aaaa-bbbb-cccc-dddddddddddd', 'co_founder'),
    (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', '77777777-aaaa-bbbb-cccc-dddddddddddd', 'creator');

-- Create ledger accounts for ventures
INSERT INTO public.user_ledger_accounts (id, user_id, account_id, venture_id, account_type) VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'acct_ai_v', '11111111-aaaa-bbbb-cccc-dddddddddddd', 'V_token'),
    (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'acct_solar_v', '22222222-aaaa-bbbb-cccc-dddddddddddd', 'V_token'),
    (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'acct_bio_v', '33333333-aaaa-bbbb-cccc-dddddddddddd', 'V_token'),
    (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'acct_crypto_a', '44444444-aaaa-bbbb-cccc-dddddddddddd', 'A_token'),
    (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'acct_eco_a', '55555555-aaaa-bbbb-cccc-dddddddddddd', 'A_token'),
    (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'acct_inself_v', '77777777-aaaa-bbbb-cccc-dddddddddddd', 'V_token'),
    (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'acct_inself_a', '77777777-aaaa-bbbb-cccc-dddddddddddd', 'A_token');

-- Insert pulses for ventures
INSERT INTO public.pulses (id, venture_id, founders_percentage, v_token_percentage, a_token_percentage, c_token_percentage, current_treasury, end_date) VALUES
    (uuid_generate_v4(), '11111111-aaaa-bbbb-cccc-dddddddddddd', 20, 30, 25, 15, 10000, NOW() + INTERVAL '30 days'),
    (uuid_generate_v4(), '22222222-aaaa-bbbb-cccc-dddddddddddd', 25, 35, 20, 10, 8000, NOW() + INTERVAL '60 days'),
    (uuid_generate_v4(), '33333333-aaaa-bbbb-cccc-dddddddddddd', 30, 40, 15, 5, 15000, NOW() + INTERVAL '90 days'),
    (uuid_generate_v4(), '44444444-aaaa-bbbb-cccc-dddddddddddd', 15, 25, 30, 20, 7000, NOW() + INTERVAL '30 days'),
    (uuid_generate_v4(), '55555555-aaaa-bbbb-cccc-dddddddddddd', 20, 30, 25, 15, 5000, NOW() + INTERVAL '45 days'),
    (uuid_generate_v4(), '66666666-aaaa-bbbb-cccc-dddddddddddd', 25, 35, 20, 10, 12000, NOW() + INTERVAL '60 days'),
    (uuid_generate_v4(), '77777777-aaaa-bbbb-cccc-dddddddddddd', 25, 35, 25, 15, 15000, NOW() + INTERVAL '45 days');

-- Insert sample smart contracts
INSERT INTO public.smart_contracts (
    id, pulse_id, holder_user_id, initiator_user_id, description,
    conversion_rate, required_v_tokens_amount, value_in_currency,
    status, type, a_tokens_granted, buffer_time, due_date
) VALUES
    (
        uuid_generate_v4(),
        (SELECT id FROM public.pulses WHERE venture_id = '11111111-aaaa-bbbb-cccc-dddddddddddd' LIMIT 1),
        '44444444-4444-4444-4444-444444444444',
        '11111111-1111-1111-1111-111111111111',
        'AI Model Development',
        1.5,
        1000,
        5000,
        'pending_beckers',
        'labor',
        750,
        7,
        NOW() + INTERVAL '30 days'
    ),
    (
        uuid_generate_v4(),
        (SELECT id FROM public.pulses WHERE venture_id = '22222222-aaaa-bbbb-cccc-dddddddddddd' LIMIT 1),
        '55555555-5555-5555-5555-555555555555',
        '22222222-2222-2222-2222-222222222222',
        'Solar Panel Prototype',
        2.0,
        2000,
        10000,
        'activated',
        'resource',
        1000,
        14,
        NOW() + INTERVAL '60 days'
    ),
    (
        uuid_generate_v4(),
        (SELECT id FROM public.pulses WHERE venture_id = '77777777-aaaa-bbbb-cccc-dddddddddddd' LIMIT 1),
        '55555555-5555-5555-5555-555555555555',
        '44444444-4444-4444-4444-444444444444',
        'AI Coach Development',
        1.8,
        1500,
        8000,
        'pending_beckers',
        'labor',
        1200,
        10,
        NOW() + INTERVAL '45 days'
    );

-- Insert smart contract backers
INSERT INTO public.smart_contract_backers (id, smart_contract_id, backer_user_id, staking_v_tokens_amount) VALUES
    (uuid_generate_v4(), (SELECT id FROM public.smart_contracts LIMIT 1), '33333333-3333-3333-3333-333333333333', 500),
    (uuid_generate_v4(), (SELECT id FROM public.smart_contracts LIMIT 1), '22222222-2222-2222-2222-222222222222', 500),
    (uuid_generate_v4(), (SELECT id FROM public.smart_contracts ORDER BY id LIMIT 1 OFFSET 1), '11111111-1111-1111-1111-111111111111', 1000),
    (uuid_generate_v4(), (SELECT id FROM public.smart_contracts ORDER BY id LIMIT 1 OFFSET 1), '44444444-4444-4444-4444-444444444444', 1000),
    (uuid_generate_v4(), (SELECT id FROM public.smart_contracts ORDER BY id LIMIT 1 OFFSET 2), '11111111-1111-1111-1111-111111111111', 800),
    (uuid_generate_v4(), (SELECT id FROM public.smart_contracts ORDER BY id LIMIT 1 OFFSET 2), '22222222-2222-2222-2222-222222222222', 700);
