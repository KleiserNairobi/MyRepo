-- Adicionando novos campos a tabela entrega
ALTER TABLE entrega ADD hora_execucao timetz NULL;
ALTER TABLE entrega ADD hora_migracao timetz NULL;
ALTER TABLE entrega ADD preferencia_id int4 NULL;

ALTER TABLE entrega ADD CONSTRAINT fk_entrega_entregador_preferencia
FOREIGN KEY (preferencia_id) REFERENCES pessoa(id);