package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.models.*;
import br.com.chamai.models.dto.EntregaStatusDto;
import br.com.chamai.models.enums.StatusEntrega;
import br.com.chamai.repositories.EntregaStatusRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class EntregaStatusService {

    @Autowired private EntregaStatusRepository repository;
    @Autowired private EntregaService entregaService;
    @Autowired private LocalizacaoService localizacaoService;

    public List<EntregaStatus> findAll() {
        return repository.findAll();
    }

    public List<EntregaStatus> findByEntrega(Entrega entrega) {
        return repository.findByEntrega(entrega);
    }

    public EntregaStatus find(Long entrega, Long id) {
        EntregaStatusPK entregaStatusPK = EntregaStatusPK.builder().entrega(entrega).id(id).build();
        return repository.findById(entregaStatusPK).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de status de entrega " + entrega + "/" + id)
        );
    }

    public EntregaStatusDto getUltimoStatus(Long idEntrega) {
        Optional<EntregaStatus> entregaStatus = Optional.ofNullable(
                repository.getUltimoStatus(idEntrega)
                .orElseThrow(
                        () -> new EntidadeNaoEncontrada(
                        "Não existe status para a entrega de código " + idEntrega
                ))
        );
        EntregaStatusDto dto = new EntregaStatusDto();
        dto.setIdEntrega(entregaStatus.get().getEntrega().getId());
        dto.setId(entregaStatus.get().getId());
        dto.setData(entregaStatus.get().getData());
        dto.setHora(entregaStatus.get().getHora());
        dto.setStatus(getStatus(entregaStatus.get().getStatus()));
        dto.setDescricaoStatus(entregaStatus.get().getStatus().toString());
        return dto;
    }

    private String getStatus(StatusEntrega statusEntrega) {
        String status = null;
        switch (statusEntrega) {
            case NI: status = "NI"; break;
            case EDR: status = "EDR"; break;
            case I: status = "I"; break;
            case CA: status = "CA"; break;
            case CO: status = "CO"; break;
            case ENE: status = "ENE"; break;
        }
        return status;
    }

    @Transactional
    public EntregaStatus insert(EntregaStatus entity) {
        if (entity.getEntrega() == null || entity.getEntrega().getId() == null) {
            throw new EntidadeNaoEncontrada("Entrega não informada");
        }

        entity.setId(getNovoId(entity.getEntrega().getId()));
        entity.setData(LocalDate.now());
        entity.setHora(Time.valueOf(LocalTime.now()));
        repository.save(entity);

        if (entity.getStatus().equals(StatusEntrega.CO)) {
            Entrega entrega = entregaService.find(entity.getEntrega().getId());
            if (entrega.getEntregador().getId() != null) {
                Long entregador = entrega.getEntregador().getId();
                Optional<Localizacao> localizacao = localizacaoService.findByEntregador(entregador);
                if (localizacao.isPresent()) {
                    localizacaoService.updateDisponivel(entregador, true);
                }
            }
        }

        return entity;
    }

    @Transactional
    public EntregaStatus update(EntregaStatus entity, Long pagar, Long id) {
        EntregaStatus entregaStatus = find(pagar, id);
        BeanUtils.copyProperties(entity, entregaStatus, "entrega", "id");
        return repository.save(entregaStatus);
    }

    @Transactional
    public void delete(Long entrega, Long id) {
        find(entrega, id);
        EntregaStatusPK entregaStatusPK = EntregaStatusPK.builder().entrega(entrega).id(id).build();
        repository.deleteById(entregaStatusPK);
    }

    public Long getNovoId(long idEntrega) {
        EntregaStatus entregaStatus = repository.getUltimoID(idEntrega);
        if (entregaStatus == null) {
            return 1L;
        } else {
            return entregaStatus.getId() + 1;
        }
    }

}
