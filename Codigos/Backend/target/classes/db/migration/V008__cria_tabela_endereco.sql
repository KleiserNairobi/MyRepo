-- cria_tabela_endereco
CREATE SEQUENCE IF NOT EXISTS public.endereco_seq START 1;

CREATE TABLE public.endereco (
	id int4 NOT NULL DEFAULT nextval('endereco_seq'),
	pessoa_id int4 NOT NULL,
	cep varchar(9) NOT NULL,
	logradouro varchar(60) NOT NULL,
	numero varchar(10) NOT NULL,
	complemento varchar(60) NOT NULL,
	bairro varchar(60) NOT NULL,
	municipio_id int4 NOT NULL,
	referencia varchar(60) NULL,
	latitude numeric(12,10) NULL,
	longitude numeric(12,10) NULL,
	nome_cliente varchar(60) NULL,
	telefone_cliente varchar(14) NULL,
	ativo bool NOT NULL,
	CONSTRAINT pk_endereco PRIMARY KEY (id),
	CONSTRAINT fk_endereco_municipio FOREIGN KEY (municipio_id) REFERENCES municipio(id),
	CONSTRAINT fk_endereco_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
