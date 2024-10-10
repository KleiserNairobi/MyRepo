-- Altera tabela parametro, adicionando novos campos
ALTER TABLE public.parametro
    ADD COLUMN distancia_bike numeric(6,3),
    ADD COLUMN distancia_moto numeric(6,3),
    ADD COLUMN distancia_carro numeric(6,3);

ALTER TABLE public.parametro
	ALTER COLUMN distancia_bike SET DEFAULT 0.0,
	ALTER COLUMN distancia_moto SET DEFAULT 0.0,
	ALTER COLUMN distancia_carro SET DEFAULT 0.0;

UPDATE public.parametro SET distancia_bike = 0.0, distancia_moto = 0.0, distancia_carro = 0.0;

ALTER TABLE public.parametro
	ALTER COLUMN distancia_bike SET NOT NULL,
	ALTER COLUMN distancia_moto SET NOT NULL,
	ALTER COLUMN distancia_carro SET NOT NULL;