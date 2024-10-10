-- Cria tabela pessoa_desconto
CREATE SEQUENCE IF NOT EXISTS public.pessoa_desconto_seq START 1;

CREATE TABLE public.pessoa_desconto (
    id int4 NOT NULL DEFAULT nextval('pessoa_desconto_seq'),
	pessoa_id int4 NOT NULL,
	desconto_id int4 NOT NULL,
	CONSTRAINT pk_pd PRIMARY KEY (id),
	CONSTRAINT fk_pd_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id),
	CONSTRAINT fk_pd_desconto FOREIGN KEY (desconto_id) REFERENCES desconto(id)
);
