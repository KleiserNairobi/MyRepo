-- Altera tabela parametro, adicionando campo distancia_caminhao
ALTER TABLE public.parametro
    ADD COLUMN distancia_caminhao numeric(6,3);

ALTER TABLE public.parametro
	ALTER COLUMN distancia_caminhao SET DEFAULT 0.0;

UPDATE public.parametro SET distancia_caminhao = 0.0;

ALTER TABLE public.parametro
	ALTER COLUMN distancia_caminhao SET NOT NULL;