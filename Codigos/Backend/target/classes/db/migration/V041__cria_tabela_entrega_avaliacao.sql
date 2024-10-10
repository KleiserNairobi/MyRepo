-- cria_tabela_entrega_avaliacao
CREATE SEQUENCE IF NOT EXISTS public.entrega_avaliacao_seq START 1;

CREATE TABLE public.entrega_avaliacao (
	id int4 NOT NULL DEFAULT nextval('entrega_avaliacao_seq'),
	entrega_id int4 NOT NULL,
	pessoa_id int4 NOT NULL,
	classificacao numeric(2,1) NOT NULL,
	comentario varchar(200) NULL,
	"data" date NOT NULL DEFAULT CURRENT_DATE,
	CONSTRAINT pk_ea PRIMARY KEY (id),
	CONSTRAINT fk_ea_entrega FOREIGN KEY (entrega_id) REFERENCES entrega(id),
	CONSTRAINT fk_ea_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
