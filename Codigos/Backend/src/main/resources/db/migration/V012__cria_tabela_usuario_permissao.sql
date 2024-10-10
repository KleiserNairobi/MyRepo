-- cria_tabela_usuario_permissao
CREATE TABLE public.usuario_permissao (
	usuario_id int4 NOT NULL,
	permissao_id int4 NOT NULL,
	CONSTRAINT pk_usuario_permissao PRIMARY KEY (usuario_id, permissao_id),
	CONSTRAINT fk_permissao FOREIGN KEY (permissao_id) REFERENCES permissao(id),
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);