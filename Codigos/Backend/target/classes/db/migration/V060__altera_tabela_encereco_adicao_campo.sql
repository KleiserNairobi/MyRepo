-- adiciona coluna na tabela endereco
ALTER TABLE public.endereco
    ADD COLUMN proprio bool NOT NULL DEFAULT false;