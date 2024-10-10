-- cria_tabela_habilitacao
CREATE SEQUENCE IF NOT EXISTS public.habilitacao_seq START 1;

CREATE TABLE public.habilitacao (
	id int4 NOT NULL DEFAULT nextval('habilitacao_seq'),
	pessoa_id int4 NOT NULL,
	registro varchar(15) NOT NULL,
	validade date NOT NULL,
	categoria varchar(3) NOT NULL,
	local_expedicao varchar(60) NOT NULL,
	data_emissao date NOT NULL,
	primeira_habilitacao date NULL,
	CONSTRAINT pk_habilitacao PRIMARY KEY (id),
	CONSTRAINT fk_habilitacao_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
