-- cria_tabela_parametro

CREATE SEQUENCE IF NOT EXISTS public.parametro_seq START 1;

CREATE TABLE public.parametro (
	id int4 NOT NULL DEFAULT nextval('parametro_seq'),
	perc_aplicativo numeric(5,2) NOT NULL DEFAULT 0,
	perc_entregador numeric(5,2) NOT NULL DEFAULT 0,
	CONSTRAINT pk_parametro PRIMARY KEY (id)
);

