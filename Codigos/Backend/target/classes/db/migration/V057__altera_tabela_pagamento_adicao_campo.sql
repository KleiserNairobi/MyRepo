-- Altera tabela pagamento, renomeando e adicionando novo campo
ALTER TABLE public.pagamento
    RENAME COLUMN id_retorno_gateway TO gateway_id_pagamento;
ALTER TABLE public.pagamento
    ADD gateway_id_devolucao int4 NULL;