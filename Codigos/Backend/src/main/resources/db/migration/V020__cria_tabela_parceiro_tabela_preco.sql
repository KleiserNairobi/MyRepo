-- cria_tabela_parceiro_tabela_preco
CREATE TABLE public.parceiro_tabela_preco (
	pessoa_id int4 NOT NULL,
	tabela_preco_id int4 NOT NULL,
	CONSTRAINT pk_ptp PRIMARY KEY (pessoa_id, tabela_preco_id),
	CONSTRAINT fk_ptp_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
	CONSTRAINT fk_ptp_tabela_preco FOREIGN KEY (tabela_preco_id) REFERENCES tabela_preco(id)
);