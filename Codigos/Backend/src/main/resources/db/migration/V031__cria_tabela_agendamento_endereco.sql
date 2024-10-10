-- cria_tabela_agendamento_endereco
CREATE SEQUENCE IF NOT EXISTS public.agendamento_endereco_seq START 1;

CREATE TABLE public.agendamento_endereco (
	id int4 NOT NULL DEFAULT nextval('agendamento_endereco_seq'),
	agendamento_id int4 NOT NULL,
	tipo varchar(1) NOT NULL,
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
	CONSTRAINT pk_ae PRIMARY KEY (id),
	CONSTRAINT fk_ae_agendamento FOREIGN KEY (agendamento_id) REFERENCES agendamento(id),
	CONSTRAINT fk_ae_municipio FOREIGN KEY (municipio_id) REFERENCES municipio(id)
);
