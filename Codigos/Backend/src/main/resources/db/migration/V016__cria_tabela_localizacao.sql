-- cria_tabela_localizacao
CREATE SEQUENCE IF NOT EXISTS public.localizacao_seq START 1;

CREATE TABLE public.localizacao (
	id int4 NOT NULL DEFAULT nextval('localizacao_seq'),
	pessoa_id int4 NOT NULL,
	disponivel bool NULL DEFAULT true,
	"data" date NOT NULL DEFAULT CURRENT_DATE,
	hora timetz NOT NULL DEFAULT CURRENT_TIME,
	latitude numeric(13,10) NULL,
	longitude numeric(13,10) NULL,
	CONSTRAINT pk_localizacao PRIMARY KEY (id),
	CONSTRAINT fk_localizacao_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
