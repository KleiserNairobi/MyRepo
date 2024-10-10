-- cria_tabela_entrega_endereco
CREATE SEQUENCE IF NOT EXISTS public.entrega_endereco_seq START 1;

CREATE TABLE public.entrega_endereco (
	id int4 NOT NULL DEFAULT nextval('entrega_endereco_seq'),
	entrega_id int4 NOT NULL,	
	tipo bpchar(1) NOT NULL,
	cep varchar(9) NULL,
	logradouro varchar(60) NOT NULL,
	numero varchar(10) NULL,
	complemento varchar(60) NULL,
	referencia varchar(60) NULL,
	contato varchar(45) NULL,
	telefone varchar(15) NULL,
	tarefa varchar(256) NULL,
	bairro varchar(60) NULL,
	municipio_id int4 NULL,	
	latitude numeric(12,10) NULL,
	longitude numeric(12,10) NULL,
	CONSTRAINT pk_ee PRIMARY KEY (id),
	CONSTRAINT fk_ee_entrega FOREIGN KEY (entrega_id) REFERENCES entrega(id),
	CONSTRAINT fk_ee_municipio FOREIGN KEY (municipio_id) REFERENCES municipio(id)
);
