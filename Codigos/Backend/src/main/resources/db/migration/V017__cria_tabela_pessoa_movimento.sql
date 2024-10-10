-- cria_tabela_pessoa_movimento
CREATE SEQUENCE IF NOT EXISTS public.pessoa_movimento_seq START 1;

CREATE TABLE public.pessoa_movimento (
	id int4 NOT NULL DEFAULT nextval('pessoa_movimento_seq'),
	pessoa_id int4 NOT NULL,
	origem bpchar(2) NOT NULL,
	documento varchar(20) NOT NULL,
	operacao bpchar(1) NOT NULL,
	"data" date NOT NULL,
	hora time NOT NULL,
	valor numeric(16,2) NOT NULL DEFAULT 0,
	quitado bool NOT NULL DEFAULT false,
	historico varchar(256) NOT NULL,
	CONSTRAINT pk_pessoa_movimento PRIMARY KEY (id),
	CONSTRAINT fk_pessoa_movimento_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
