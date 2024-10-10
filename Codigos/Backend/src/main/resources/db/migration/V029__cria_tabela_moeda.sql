-- cria_tabela_moeda
CREATE SEQUENCE IF NOT EXISTS public.moeda_seq START 1;

CREATE TABLE public.moeda (
	id int4 NOT NULL DEFAULT nextval('moeda_seq'),
	descricao varchar(60) NOT NULL,
	CONSTRAINT pk_moeda PRIMARY KEY (id)
);
