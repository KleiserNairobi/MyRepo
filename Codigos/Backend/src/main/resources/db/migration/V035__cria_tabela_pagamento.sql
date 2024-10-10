-- cria_tabela_pagamento
CREATE SEQUENCE IF NOT EXISTS public.pagamento_seq START 1;

CREATE TABLE public.pagamento (
	id int4 NOT NULL DEFAULT nextval('pagamento_seq'),
	agendamento_id int4 NULL,
	entrega_id int4 NULL,
	gateway_id int4 NULL,
	tabela_preco_id int4 NOT NULL,
	id_retorno_gateway int4 NULL,
	tipo_pgto bpchar(2) NOT NULL,
	valor_percurso numeric(12,2) NOT NULL DEFAULT 0,
	valor_produto numeric(12,2) NOT NULL DEFAULT 0,
	desconto_id int4 NULL,
	valor_desconto numeric(12,2) NOT NULL DEFAULT 0,
	total numeric(12,2) NOT NULL DEFAULT 0,
	observacao varchar(200) NULL,
	CONSTRAINT pk_pagamento PRIMARY KEY (id),
	CONSTRAINT fk_pgto_agendamento FOREIGN KEY (agendamento_id) REFERENCES agendamento(id),
	CONSTRAINT fk_pgto_entrega FOREIGN KEY (entrega_id) REFERENCES entrega(id),
	CONSTRAINT fk_pgto_desconto FOREIGN KEY (desconto_id) REFERENCES desconto(id),
	CONSTRAINT fk_pgto_gateway FOREIGN KEY (gateway_id) REFERENCES gateway(id),
	CONSTRAINT fk_pgto_tabela_preco FOREIGN KEY (tabela_preco_id) REFERENCES tabela_preco(id)
);
