-- cria_tabela_estado
CREATE TABLE public.estado (
	sigla varchar(2) NOT NULL,
	nome varchar(40) NOT NULL,
	CONSTRAINT pk_estado PRIMARY KEY (sigla)
);