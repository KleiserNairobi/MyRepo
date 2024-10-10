-- cria_tabela_entrega_status
CREATE TABLE public.entrega_status (
	entrega_id int4 NOT NULL,
	id int4 NOT NULL,
	"data" date NOT NULL DEFAULT CURRENT_DATE,
	hora timetz NOT NULL DEFAULT CURRENT_TIME,
	status bpchar(3) NOT NULL,
	CONSTRAINT pk_entrega_status PRIMARY KEY (entrega_id, id),
	CONSTRAINT fk_entrega_status_entrega FOREIGN KEY (entrega_id) REFERENCES entrega(id)
);
