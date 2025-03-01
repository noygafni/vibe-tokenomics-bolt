ALTER TABLE public.smart_contract_backers
    ADD COLUMN transaction_id text;

ALTER TABLE public.smart_contract_backers
    ADD COLUMN has_signed boolean;