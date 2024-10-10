-- cria_tabela_parcela_receber
CREATE TABLE public.parcela_receber (
	receber_id int4 NOT NULL,
	id int4 NOT NULL,
	data_emissao date NOT NULL,
	data_vencimento date NOT NULL,
	valor numeric(16,2) NOT NULL,
	data_recebimento date NULL,
	taxa_juro numeric(5,2) NULL,
	taxa_multa numeric(5,2) NULL,
	taxa_desconto numeric(5,2) NULL,
	valor_juro numeric(12,2) NULL,
	valor_multa numeric(12,2) NULL,
	valor_desconto numeric(12,2) NULL,
	valor_recebimento numeric(16,2) NULL,
	CONSTRAINT pk_parcela_receber PRIMARY KEY (receber_id, id),
	CONSTRAINT fk_parcela_receber_receber FOREIGN KEY (receber_id) REFERENCES receber(id)
);