-- cria_tabela_parcela_pagar
CREATE TABLE public.parcela_pagar (
	pagar_id int4 NOT NULL,
	id int4 NOT NULL,
	data_emissao date NOT NULL,
	data_vencimento date NOT NULL,
	valor numeric(16,2) NOT NULL,
	data_pagamento date NULL,
	taxa_juro numeric(5,2) NULL,
	taxa_multa numeric(5,2) NULL,
	taxa_desconto numeric(5,2) NULL,
	valor_juro numeric(12,2) NULL,
	valor_multa numeric(12,2) NULL,
	valor_desconto numeric(12,2) NULL,
	valor_pagamento numeric(16,2) NULL,
	CONSTRAINT pk_parcela_pagar PRIMARY KEY (pagar_id, id),
	CONSTRAINT fk_parcela_pagar_pagar FOREIGN KEY (pagar_id) REFERENCES pagar(id)
);