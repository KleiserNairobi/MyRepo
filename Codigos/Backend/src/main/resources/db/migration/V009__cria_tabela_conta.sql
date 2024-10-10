-- cria_tabela_conta
CREATE SEQUENCE IF NOT EXISTS public.conta_seq START 1;

CREATE TABLE public.conta (
	id int4 NOT NULL DEFAULT nextval('conta_seq'),
	pessoa_id int4 NOT NULL,
	agencia_id int4 NOT NULL,	
	codigo varchar(50) NOT NULL,
	tipo bpchar(1) NOT NULL,
	ativo bool NOT NULL,
	CONSTRAINT pk_conta PRIMARY KEY (id),
	CONSTRAINT fk_conta_agencia FOREIGN KEY (agencia_id) REFERENCES agencia(id),
	CONSTRAINT fk_conta_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
