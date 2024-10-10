-- cria_tabela_foto
CREATE SEQUENCE IF NOT EXISTS public.foto_seq START 1;

CREATE TABLE public.foto (
	id int4 NOT NULL DEFAULT nextval('foto_seq'),
	pessoa_id int4 NOT NULL,
	nome_arquivo varchar(100) NOT NULL,
	tipo_foto bpchar(4) NOT NULL,
	descricao varchar(150) NOT NULL,
	tipo_conteudo bpchar(4) NOT NULL,
	tamanho int4 NOT NULL,
	link varchar(256) NULL,
	CONSTRAINT pk_foto PRIMARY KEY (id),
	CONSTRAINT fk_foto_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);
