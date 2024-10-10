-- cria_tabela_veiculo
CREATE SEQUENCE IF NOT EXISTS public.veiculo_seq START 1;

CREATE TABLE public.veiculo (
	id int4 NOT NULL DEFAULT nextval('veiculo_seq'),
	pessoa_id int4 NOT NULL,
	tipo bpchar(2) NOT NULL,
	modelo varchar(50) NOT NULL,
	renavan varchar(11) NULL,
	placa varchar(8) NULL,
	ativo bool NOT NULL DEFAULT false,
	CONSTRAINT pk_veiculo PRIMARY KEY (id),
	CONSTRAINT fk_veiculo_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
