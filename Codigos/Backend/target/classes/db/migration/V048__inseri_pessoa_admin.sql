-- inseri_pessoa_admin
INSERT INTO public.pessoa
(id, tipo, nome, email,  telefone,  entregador, cliente, colaborador,  ativo, online, parceiro)
VALUES
(1, 'F', 'WEBSOCKET API AWS', 'websocket@chamai.com.br', '(62)99999-9999', false, false, true, true, false, false);

INSERT INTO public.pessoa
(id, tipo, nome, email,  telefone,  entregador, cliente, colaborador,  ativo, online, parceiro)
VALUES
(2, 'F', 'NAIROBI SISTEMAS', 'nairobi.sistemas@gmail.com', '(62)99999-9998', false, false, true, true, false, false);

INSERT INTO public.pessoa
(id, tipo, nome, email,  telefone,  entregador, cliente, colaborador,  ativo, online, parceiro)
VALUES
(3, 'F', 'CHAMAIH', 'chamaih@chamaih.com.br', '(64)99999-9999', false, false, true, true, false, false);

ALTER SEQUENCE pessoa_seq RESTART WITH 4;