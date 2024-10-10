-- cria_tabela_municipio

CREATE SEQUENCE IF NOT EXISTS public.municipio_seq START 5391;

CREATE TABLE public.municipio (
	id int4 NOT NULL DEFAULT nextval('municipio_seq'),
	nome varchar(60) NOT NULL,
	estado_id varchar(2) NOT NULL,
	cobertura bool NULL DEFAULT false,
	CONSTRAINT pk_municipio PRIMARY KEY (id),
	CONSTRAINT fk_municipio_estado FOREIGN KEY (estado_id) REFERENCES estado(sigla)
);

