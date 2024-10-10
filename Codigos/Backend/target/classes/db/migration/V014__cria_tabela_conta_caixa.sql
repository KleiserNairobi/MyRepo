-- cria_tabela_conta_caixa
CREATE SEQUENCE IF NOT EXISTS public.conta_caixa_seq START 1;

CREATE TABLE public.conta_caixa (
	id int4 NOT NULL DEFAULT nextval('conta_caixa_seq'),
	conta_id int4 NULL,	
	nome varchar(50) NOT NULL,
	tipo bpchar(1) NOT NULL,
	referencia VARCHAR(7) NOT NULL,
	data_fechamento date NULL,
	saldo_anterior numeric(16,2) NOT NULL,
	movimento_recebimento numeric(16,2) NOT NULL,
	movimento_pagamento numeric(16,2) NOT NULL,
	saldo_atual numeric(16,2) NOT NULL,
	saldo_disponivel numeric(16,2) NOT NULL,
	CONSTRAINT pk_conta_caixa PRIMARY KEY (id),
	CONSTRAINT fk_conta_caixa_conta FOREIGN KEY (conta_id) REFERENCES conta(id)
);
