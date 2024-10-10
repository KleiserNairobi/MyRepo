-- cria_tabela_banco_taxa
CREATE SEQUENCE IF NOT EXISTS public.banco_taxa_seq START 1;

CREATE TABLE public.banco_taxa (
	id int4 NOT NULL DEFAULT nextval('banco_taxa_seq'),
	banco_id int4 NOT NULL,
	"data" date NOT NULL,
	doc numeric(5,2) NOT NULL DEFAULT 0,
	ted numeric(5,2) NOT NULL DEFAULT 0,
	CONSTRAINT pk_banco_taxa PRIMARY KEY (id),
	CONSTRAINT fk_banco_taxa_banco FOREIGN KEY (banco_id) REFERENCES banco(id)
);
