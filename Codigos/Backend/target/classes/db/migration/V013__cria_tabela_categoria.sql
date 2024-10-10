-- cria_tabela_categoria
CREATE SEQUENCE IF NOT EXISTS public.categoria_seq START 1;

CREATE TABLE public.categoria (
	id int4 NOT NULL DEFAULT nextval('categoria_seq'),
	tipo bpchar(1) NOT NULL,
	codigo varchar(10) NOT NULL,
	descricao varchar(60) NOT NULL,
	CONSTRAINT pk_categoria PRIMARY KEY (id),
	CONSTRAINT uk_codigo UNIQUE (codigo)
);
