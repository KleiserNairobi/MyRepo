package br.com.chamai.repositories.queries;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import br.com.chamai.models.Agencia;
import br.com.chamai.repositories.filters.AgenciaFilter;

public class AgenciaRepositoryImpl implements AgenciaRepositoryQuery {

	@PersistenceContext private EntityManager entityManager;

	@Override
	public Page<Agencia> filtrar(AgenciaFilter filter, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = this.entityManager.getCriteriaBuilder();
		CriteriaQuery<Agencia> criteriaQuery = criteriaBuilder.createQuery(Agencia.class);
		Root<Agencia> root = criteriaQuery.from(Agencia.class);
		
		Predicate[] predicates = criarRestricoes(filter, criteriaBuilder, root);
		
		criteriaQuery.where(predicates);
		TypedQuery<Agencia> typedQuery = this.entityManager.createQuery(criteriaQuery);
		
		adicionarRestricaoDePaginacao(typedQuery, pageable);
		
		return new PageImpl<>(typedQuery.getResultList(), pageable, total(filter));
	}

	private Predicate[] criarRestricoes(AgenciaFilter filter, CriteriaBuilder criteriaBuilder,
			Root<Agencia> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (!StringUtils.isEmpty(filter.getNome())) {
			predicates.add(
					criteriaBuilder.like(
							criteriaBuilder.lower(root.get("nome")), "%" + filter.getNome().toLowerCase() + "%")
					);
		}
		
		if (!StringUtils.isEmpty(filter.getBanco())) {
			predicates.add(
					criteriaBuilder.like(
							criteriaBuilder.lower(root.get("banco").get("nome")), "%" + filter.getBanco().toLowerCase() + "%")
					);
		}
		
		return predicates.toArray(new Predicate[predicates.size()]);
	}

	private void adicionarRestricaoDePaginacao(TypedQuery<?> typedQuery, Pageable pageable) {
		int paginaAtual = pageable.getPageNumber();
		int totalRegistroPorPagina = pageable.getPageSize();
		
		int primeiroRegistroDaPagina = paginaAtual * totalRegistroPorPagina;
		
		typedQuery.setFirstResult(primeiroRegistroDaPagina);
		typedQuery.setMaxResults(totalRegistroPorPagina);
	}

	private Long total(AgenciaFilter filter) {
		CriteriaBuilder criteriaBuilder = this.entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<Agencia> root = criteriaQuery.from(Agencia.class);
		
		Predicate[] predicates = criarRestricoes(filter, criteriaBuilder, root);
		criteriaQuery.where(predicates);
		
		criteriaQuery.select(criteriaBuilder.count(root));
		return this.entityManager.createQuery(criteriaQuery).getSingleResult();
	}

}
