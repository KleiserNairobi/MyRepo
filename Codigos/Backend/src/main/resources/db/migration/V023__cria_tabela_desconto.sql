-- cria_tabela_desconto
CREATE SEQUENCE IF NOT EXISTS public.desconto_seq START 1;

CREATE TABLE public.desconto (
    id int4 NOT NULL DEFAULT nextval('desconto_seq'),
	codigo varchar(10) NOT NULL,
	descricao varchar(45) NOT NULL,
	valor numeric(10,2) NOT NULL,
	piso numeric(10,2) NOT NULL,
	validade_inicio date NOT NULL DEFAULT CURRENT_DATE,
	validade_fim date NULL,
	CONSTRAINT pk_desconto PRIMARY KEY (id)
);
