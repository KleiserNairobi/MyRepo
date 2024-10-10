-- cria_tabela_banco

CREATE SEQUENCE IF NOT EXISTS public.banco_seq START 758;

CREATE TABLE public.banco (
	id int4 NOT NULL DEFAULT nextval('banco_seq'),
	codigo varchar(4) NOT NULL,
	nome varchar(40) NOT NULL,
	CONSTRAINT pk_banco PRIMARY KEY (id)
);
