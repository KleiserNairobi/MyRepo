-- cria_tabela_pagar
CREATE SEQUENCE IF NOT EXISTS public.pagar_seq START 1;

CREATE TABLE public.pagar (
	id int4 NOT NULL DEFAULT nextval('pagar_seq'),
	pessoa_id int4 NOT NULL,
	categoria_id int4 NOT NULL,
	moeda_id int4 NOT NULL,
	origem bpchar(2) NOT NULL,
	documento varchar(20) NOT NULL,
	emissao date NOT NULL,
	primeiro_vcto date NOT NULL,
	parcelas int2 NOT NULL,
	valor_total numeric(16,2) NOT NULL,
	valor_pagar numeric(16,2) NOT NULL,
	historico varchar(256) NULL,
	CONSTRAINT pk_pagar PRIMARY KEY (id),
	CONSTRAINT fk_pagar_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id),
	CONSTRAINT fk_pagar_moeda FOREIGN KEY (moeda_id) REFERENCES moeda(id),
	CONSTRAINT fk_pagar_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
