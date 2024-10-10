-- cria_tabela_permissao
CREATE SEQUENCE IF NOT EXISTS public.permissao_seq START 1;

CREATE TABLE public.permissao (
	id int4 NOT NULL DEFAULT nextval('permissao_seq'),
	nome varchar(40) NOT NULL,
	CONSTRAINT pk_permissao PRIMARY KEY (id),
	CONSTRAINT uk_permissao_nome UNIQUE (nome)
);
