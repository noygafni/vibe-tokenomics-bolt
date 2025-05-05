ALTER TABLE public.pulses
    RENAME COLUMN duration_percentage TO founders_percentage;

ALTER TABLE public.pulses
    DROP COLUMN duration;

ALTER TABLE public.pulses
    ADD COLUMN end_date TIMESTAMP;