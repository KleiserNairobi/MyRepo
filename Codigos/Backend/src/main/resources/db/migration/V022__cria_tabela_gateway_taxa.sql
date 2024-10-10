-- cria_tabela_gateway_taxa
CREATE SEQUENCE IF NOT EXISTS public.gateway_taxa_seq START 1;

CREATE TABLE public.gateway_taxa (
	id int4 NOT NULL DEFAULT nextval('gateway_taxa_seq'),
	gateway_id int4 NOT NULL,
	"data" date NOT NULL,
	debito numeric(5,2) NOT NULL,
	credito_avista numeric(5,2) NOT NULL,
	credito_parcelado numeric(5,2) NOT NULL,
	credito_antecipacao numeric(5,2) NOT NULL,
	boleto numeric(5,2) NOT NULL,
	taxa_administrativa numeric(5,2) NOT NULL DEFAULT 0,
	CONSTRAINT pk_gt PRIMARY KEY (id),
	CONSTRAINT fk_gt_gateway FOREIGN KEY (gateway_id) REFERENCES gateway(id)
);

