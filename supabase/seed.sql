-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert users into auth.users (assuming manual user creation is allowed in your local setup)
INSERT INTO auth.users (id) VALUES
    ('11111111-1111-1111-1111-111111111111'),
    ('22222222-2222-2222-2222-222222222222'),
    ('33333333-3333-3333-3333-333333333333'),
    ('44444444-4444-4444-4444-444444444444'),
    ('55555555-5555-5555-5555-555555555555');

-- Update profiles with name and role (since they are auto-created)
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

-- Insert a single studio
INSERT INTO public.studios (id, name, description, image_url) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tech Innovators', 'A startup incubator.', 'https://example.com/studio.png');

-- Associate users with the studio
INSERT INTO public.user_to_studio (id, user_id, studio_id, role) VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'superuser'),
    (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'user'),
    (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'user');

-- Insert two ventures
INSERT INTO public.ventures (id, name, description, image_url, v_token_amount, end_date, category, ledger_id) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'GreenTech', 'Sustainable energy venture.', 'https://example.com/greentech.png', 1000, '2025-12-31', 'energy', null),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'AI Solutions', 'Artificial Intelligence startup.', 'https://example.com/ai.png', 1500, '2025-12-31', 'technology', null);

-- Link ventures to the studio
INSERT INTO public.venture_to_studio (id, studio_id, venture_id) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- Associate users with ventures
INSERT INTO public.user_to_venture (id, user_id, venture_id, type) VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'co_founder'),
    (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'creator'),
    (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'co_founder'),
    (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'creator');

-- Create ledger accounts for users
INSERT INTO public.user_ledger_accounts (id, user_id, account_id, venture_id, account_type) VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'acct-001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'V_token'),
    (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'acct-002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'A_token'),
    (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'acct-003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'V_token'),
    (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'acct-004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'A_token');

-- Insert pulses for ventures (Updated for the new table structure)
INSERT INTO public.pulses (id, venture_id, founders_percentage, v_token_percentage, a_token_percentage, c_token_percentage, current_treasury, end_date) VALUES
    (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 50, 20, 15, 10, 5000, '2025-12-31'),
    (uuid_generate_v4(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', 70, 25, 20, 15, 7000, '2025-12-31');

-- No records added to smart_contracts or smart_contract_backers as requested
