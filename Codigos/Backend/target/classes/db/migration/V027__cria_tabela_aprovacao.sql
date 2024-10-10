-- cria_tabela_aprovacao
CREATE SEQUENCE IF NOT EXISTS public.aprovacao_seq START 1;

CREATE TABLE public.aprovacao (
	id int4 NOT NULL DEFAULT nextval('aprovacao_seq'),
	pessoa_id int4 NOT NULL,
	status bpchar(1) NOT NULL,
	"data" date NOT NULL,
	hora time NOT NULL,
	CONSTRAINT pk_aprovacao PRIMARY KEY (id),
	CONSTRAINT fk_aprovacao_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
