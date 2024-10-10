-- cria_tabela_movimento_conta_caixa
CREATE SEQUENCE IF NOT EXISTS public.movimento_conta_caixa_seq START 1;

CREATE TABLE public.movimento_conta_caixa (
	id int4 NOT NULL DEFAULT nextval('movimento_conta_caixa_seq'),
	conta_caixa_id int4 NOT NULL,
	categoria_id int4 NOT NULL,
	origem bpchar(1) NOT NULL,
	documento varchar(20) NOT NULL,
	operacao bpchar(1) NOT NULL,
	"data" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	valor numeric(16,2) NOT NULL,
	historico varchar(256) NOT NULL,
	CONSTRAINT pk_mcc PRIMARY KEY (id),
	CONSTRAINT fk_mcc_cc FOREIGN KEY (conta_caixa_id) REFERENCES conta_caixa(id),
	CONSTRAINT fk_mcc_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);
