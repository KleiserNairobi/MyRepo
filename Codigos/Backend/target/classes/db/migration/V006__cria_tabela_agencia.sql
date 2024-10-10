-- cria_tabela_agencia
CREATE SEQUENCE IF NOT EXISTS public.agencia_seq START 1;

CREATE TABLE public.agencia (
	id int4 NOT NULL DEFAULT nextval('agencia_seq'),
	banco_id int4 NOT NULL,
	codigo varchar(15) NOT NULL,
	nome varchar(40) NULL,
	CONSTRAINT pk_agencia PRIMARY KEY (id),
	CONSTRAINT fk_agencia_banco FOREIGN KEY (banco_id) REFERENCES banco(id)
);
