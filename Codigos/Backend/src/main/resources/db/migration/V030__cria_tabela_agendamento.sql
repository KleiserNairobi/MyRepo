-- cria_tabela_agendamento
CREATE SEQUENCE IF NOT EXISTS public.agendamento_seq START 1;

CREATE TABLE public.agendamento (
	id int4 NOT NULL DEFAULT nextval('agendamento_seq'),
	cliente_id int4 NOT NULL,
	entregador_id int4 NULL,
	id_origem int4 NULL,
	tipo_agendamento bpchar(1) NOT NULL,
	qtde_repeticao smallint NOT NULL,
	data_execucao date NOT NULL DEFAULT CURRENT_DATE,
	hora_execucao time NOT NULL,
	tipo_veiculo bpchar(2) NOT NULL,
	deslocamento varchar(3) NOT NULL,
	distancia numeric(6,3) NOT NULL,
	previsao time NOT NULL,
	ativo bool NOT NULL DEFAULT false,
	realizado bool NOT NULL DEFAULT false,
	CONSTRAINT pk_agendamento PRIMARY KEY (id),
	CONSTRAINT fk_agendamento_cliente FOREIGN KEY (cliente_id) REFERENCES pessoa(id),
	CONSTRAINT fk_agendamento_entregador FOREIGN KEY (entregador_id) REFERENCES pessoa(id)
);
