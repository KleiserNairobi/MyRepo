package br.com.chamai.models;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Entity @Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Parametro {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "parametro_seq")
    @SequenceGenerator(name = "parametro_seq", sequenceName = "parametro_seq", initialValue = 2, allocationSize = 1)
    @ApiModelProperty(position = 1, required = false)
    private Long id;

    @Column(name = "perc_Aplicativo")
    @NotNull(message = "Percentual aplicativo é orbigatório")
    @ApiModelProperty(position = 2, required = true)
    private Float percentualAplicativo;

    @Column(name = "perc_Entregador")
    @NotNull(message = "Percentual entregador é orbigatório")
    @ApiModelProperty(position = 3, required = true)
    private Float percentualEntregador;

    @Column(name = "distancia_bike")
    @NotNull(message = "Distância de bike é orbigatório")
    @ApiModelProperty(position = 4, required = true)
    private Float distanciaBike;

    @Column(name = "distancia_moto")
    @NotNull(message = "Distância de moto é orbigatório")
    @ApiModelProperty(position = 5, required = true)
    private Float distanciaMoto;

    @Column(name = "distancia_carro")
    @NotNull(message = "Distância de carro é orbigatório")
    @ApiModelProperty(position = 6, required = true)
    private Float distanciaCarro;
    
    @Column(name = "distancia_caminhao")
    @NotNull(message = "Distância de caminhão é orbigatório")
    @ApiModelProperty(position = 7, required = true)
    private Float distanciaCaminhao;

}
