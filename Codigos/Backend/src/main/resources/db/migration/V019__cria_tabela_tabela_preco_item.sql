-- cria_tabela_tabela_preco_item
CREATE SEQUENCE IF NOT EXISTS public.tabela_preco_item_seq START 1;

CREATE TABLE public.tabela_preco_item (
	id int4 NOT NULL DEFAULT nextval('tabela_preco_item_seq'),
	tabela_preco_id int4 NOT NULL,
	hora_inicio timetz NOT NULL,
	hora_fim timetz NOT NULL,
	tarifa_adicional numeric(12,2) NOT NULL,
	CONSTRAINT pk_tpi PRIMARY KEY (id),
	CONSTRAINT fk_tpi_tp FOREIGN KEY (tabela_preco_id) REFERENCES tabela_preco(id)
);
