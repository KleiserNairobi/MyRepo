-- inseri_usuario_admin
INSERT INTO usuario (id,pessoa_id,nome,email,telefone,senha,senha_social,ativo)
VALUES (1,1,'WEBSOCKET API AWS','websocket@chamai.com.br','(62)99999-9999','$2a$10$Ff8aGiXOrp81GV6bcJikBekSTe8GVvyO.UTloQYJUmscqsZstNNJS',NULL,true);
INSERT INTO usuario (id,pessoa_id,nome,email,telefone,senha,senha_social,ativo)
VALUES (2,2,'NAIROBI SISTEMAS','nairobi.sistemas@gmail.com','(62)99999-9998','$2a$10$Ff8aGiXOrp81GV6bcJikBekSTe8GVvyO.UTloQYJUmscqsZstNNJS',NULL,true);
INSERT INTO usuario (id,pessoa_id,nome,email,telefone,senha,senha_social,ativo)
VALUES (3,2,'VICENTE SILVA','vicente.pspenha@gmail.com','(62)98499-4081','$2a$10$2Tnjf.0VAvY2AjbNa.Ltq.QMU8yeuNsSsSvfS4S5Ptcv6QG58xzay',NULL,true);
INSERT INTO usuario (id,pessoa_id,nome,email,telefone,senha,senha_social,ativo)
VALUES (4,2,'PABLO LIMA','pablolimajp@yahoo.com.br','(83)99656-0999','$2a$10$Ff8aGiXOrp81GV6bcJikBekSTe8GVvyO.UTloQYJUmscqsZstNNJS',NULL,true);
INSERT INTO usuario (id,pessoa_id,nome,email,telefone,senha,senha_social,ativo)
VALUES (5,3,'CHAMAIH S/A','chamaih@chamaih.com.br','(64)99999-9999','$2a$10$Ff8aGiXOrp81GV6bcJikBekSTe8GVvyO.UTloQYJUmscqsZstNNJS',NULL,true);
INSERT INTO usuario (id,pessoa_id,nome,email,telefone,senha,senha_social,ativo)
VALUES (6,3,'ADMIN CHAMAIH','admin@chamaih.com.br','(64)99999-9998','$2a$10$Ff8aGiXOrp81GV6bcJikBekSTe8GVvyO.UTloQYJUmscqsZstNNJS',NULL,true);


ALTER SEQUENCE usuario_seq RESTART WITH 7;