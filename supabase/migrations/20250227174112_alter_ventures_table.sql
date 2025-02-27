ALTER TABLE public.ventures
    DROP COLUMN duration;

ALTER TABLE public.ventures
    ADD COLUMN end_date TIMESTAMP;

ALTER TABLE public.ventures
    ADD COLUMN ledger_id text;