-- inseri_endereco_admin
ALTER TABLE public.municipio
    ADD COLUMN latitude numeric(12,10) NULL,
    ADD COLUMN longitude numeric(12,10) NULL;
