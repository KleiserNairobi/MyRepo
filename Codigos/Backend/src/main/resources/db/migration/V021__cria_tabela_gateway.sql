-- V021_cria_tabela_gateway
CREATE SEQUENCE IF NOT EXISTS public.gateway_seq START 1;

CREATE TABLE public.gateway (
	id int4 NOT NULL DEFAULT nextval('gateway_seq'),
	nome varchar(60) NOT NULL,
	chave varchar(120) NULL,
	"token" varchar(256) NULL,
	tipo_gateway bpchar(2) NOT NULL,
	ativo bool NOT NULL DEFAULT false,
	CONSTRAINT pk_gateway PRIMARY KEY (id)
);
