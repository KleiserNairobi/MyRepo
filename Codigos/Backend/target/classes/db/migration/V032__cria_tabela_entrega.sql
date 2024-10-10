-- cria_tabela_entrega
CREATE SEQUENCE IF NOT EXISTS public.entrega_seq START 1;

CREATE TABLE public.entrega (
	id int4 NOT NULL DEFAULT nextval('entrega_seq'),
	cliente_id int4 NOT NULL,
	entregador_id int4 NULL,
	"data" date NOT NULL DEFAULT CURRENT_DATE,
	agendamento_id int4 NULL,
	tipo_veiculo bpchar(2) NOT NULL,
	deslocamento bpchar(3) NOT NULL,
	distancia numeric(9,3) NOT NULL,
	previsao timetz NULL,
	hora_saida timetz NULL,
	hora_chegada timetz NULL,
	CONSTRAINT pk_entrega PRIMARY KEY (id),
	CONSTRAINT fk_entrega_agendamento FOREIGN KEY (agendamento_id) REFERENCES agendamento(id),
	CONSTRAINT fk_entrega_cliente FOREIGN KEY (cliente_id) REFERENCES pessoa(id),
	CONSTRAINT fk_entrega_entregador FOREIGN KEY (entregador_id) REFERENCES pessoa(id)
);
