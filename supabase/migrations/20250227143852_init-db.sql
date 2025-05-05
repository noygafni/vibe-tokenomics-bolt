-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    role TEXT CHECK (role IN ('superuser', 'user'))
);

-- Function to handle new user creation in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user deletion in auth.users
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.profiles WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for inserting and deleting profiles
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_delete_user();

-- Studios table
CREATE TABLE public.studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- User to Studio association table
CREATE TABLE public.user_to_studio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    studio_id UUID REFERENCES public.studios(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('superuser', 'user'))
);

-- Ventures table
CREATE TABLE public.ventures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    v_token_amount NUMERIC NOT NULL,
    duration INT NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Studio to Venture association table
CREATE TABLE public.venture_to_studio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES public.studios(id) ON DELETE CASCADE,
    venture_id UUID REFERENCES public.ventures(id) ON DELETE CASCADE
);

-- User to Venture association table
CREATE TABLE public.user_to_venture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    venture_id UUID REFERENCES public.ventures(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('co_founder', 'creator'))
);

-- User Ledger Account table
CREATE TABLE public.user_ledger_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id TEXT NOT NULL, -- Assuming it's coming from an external ledger system
    venture_id UUID REFERENCES public.ventures(id) ON DELETE CASCADE,
    account_type TEXT CHECK (account_type IN ('V_token', 'A_token'))
);

-- Pulse table
CREATE TABLE public.pulses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venture_id UUID REFERENCES public.ventures(id) ON DELETE CASCADE,
    duration INT NOT NULL,
    duration_percentage NUMERIC,
    v_token_percentage NUMERIC,
    a_token_percentage NUMERIC,
    c_token_percentage NUMERIC,
    current_treasury NUMERIC,
    created_at TIMESTAMP DEFAULT now()
);

-- Smart Contracts table
CREATE TABLE public.smart_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pulse_id UUID REFERENCES public.pulses(id) ON DELETE CASCADE,
    holder_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    initiator_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT,
    conversion_rate NUMERIC,
    required_v_tokens_amount NUMERIC,
    value_in_currency NUMERIC,
    status TEXT CHECK (status IN ('new', 'assigned', 'pending_beckers', 'pending_multi_sigs', 'activated', 'terminated', 'completed', 'cancelled')),
    type TEXT CHECK (type IN ('resource', 'labor')),
    a_tokens_granted NUMERIC,
    buffer_time INT,
    completed_date TIMESTAMP,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

-- Smart Contract Backers table
CREATE TABLE public.smart_contract_backers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smart_contract_id UUID REFERENCES public.smart_contracts(id) ON DELETE CASCADE,
    backer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    staking_v_tokens_amount NUMERIC,
    created_at TIMESTAMP DEFAULT now()
);
