-- cria_tabela_usuario
CREATE SEQUENCE IF NOT EXISTS public.usuario_seq START 1;

CREATE TABLE public.usuario (
	id int4 NOT NULL DEFAULT nextval('usuario_seq'),
	pessoa_id int4 NOT NULL,
	nome varchar(40) NOT NULL,
	email varchar(100) NULL,
	telefone varchar(14) NULL,
	senha varchar(200) NOT NULL,
	senha_social varchar(200) NULL,
	ativo bool NOT NULL,
	CONSTRAINT pk_usuario PRIMARY KEY (id),
	CONSTRAINT uk_usuario_email UNIQUE (email),
	CONSTRAINT uk_usuario_telefone UNIQUE (telefone),
	CONSTRAINT fk_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
