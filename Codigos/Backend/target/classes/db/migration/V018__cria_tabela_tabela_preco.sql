-- cria_tabela_tabela_preco
CREATE SEQUENCE IF NOT EXISTS public.tabela_preco_seq START 1;

CREATE TABLE public.tabela_preco (
	id int4 NOT NULL DEFAULT nextval('tabela_preco_seq'),
	tipo_veiculo bpchar(2) NOT NULL,	
	descricao varchar(45) NOT NULL,
	tarifa_km numeric(6,3) NOT NULL,
	tarifa_valor numeric(12,2) NOT NULL,
	validade_inicio date NOT NULL DEFAULT CURRENT_DATE,
	validade_fim date NULL,
	padrao bool NOT NULL,
	ativo bool NOT NULL,	
	CONSTRAINT pk_tabela_preco PRIMARY KEY (id)
);
