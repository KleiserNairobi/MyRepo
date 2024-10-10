-- cria_tabela_pagamento_status
CREATE TABLE public.pagamento_status (
	pagamento_id int4 NOT NULL,
	id int4 NOT NULL,
	"data" date NOT NULL DEFAULT CURRENT_DATE,
	hora timetz NOT NULL DEFAULT CURRENT_TIME,
	status bpchar(3) NOT NULL,
	CONSTRAINT pk_pgto_status PRIMARY KEY (pagamento_id, id),
	CONSTRAINT fk_pgto_status_pgto FOREIGN KEY (pagamento_id) REFERENCES pagamento(id)
);
