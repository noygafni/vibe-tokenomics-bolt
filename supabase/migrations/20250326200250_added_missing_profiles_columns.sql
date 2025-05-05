ALTER TABLE public.profiles
    ADD COLUMN full_name VARCHAR(255);

ALTER TABLE public.profiles
    ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
