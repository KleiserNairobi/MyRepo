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

import br.com.chamai.models.Estado;
import br.com.chamai.repositories.filters.EstadoFilter;

public class EstadoRepositoryImpl implements EstadoRepositoryQuery {

	@PersistenceContext private EntityManager entityManager;

	@Override
	public Page<Estado> filtrar(EstadoFilter filter, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = this.entityManager.getCriteriaBuilder();
		CriteriaQuery<Estado> criteriaQuery = criteriaBuilder.createQuery(Estado.class);
		Root<Estado> root = criteriaQuery.from(Estado.class);
		
		Predicate[] predicates = criarRestricoes(filter, criteriaBuilder, root);
		
		criteriaQuery.where(predicates);
		TypedQuery<Estado> typedQuery = this.entityManager.createQuery(criteriaQuery);
		
		adicionarRestricaoDePaginacao(typedQuery, pageable);
		
		return new PageImpl<>(typedQuery.getResultList(), pageable, total(filter));
	}

	private Predicate[] criarRestricoes(EstadoFilter filter, CriteriaBuilder criteriaBuilder,
			Root<Estado> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (!StringUtils.isEmpty(filter.getNome())) {
			predicates.add(
					criteriaBuilder.like(
							criteriaBuilder.lower(root.get("nome")), "%" + filter.getNome().toLowerCase() + "%")
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

	private Long total(EstadoFilter filter) {
		CriteriaBuilder criteriaBuilder = this.entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<Estado> root = criteriaQuery.from(Estado.class);
		
		Predicate[] predicates = criarRestricoes(filter, criteriaBuilder, root);
		criteriaQuery.where(predicates);
		
		criteriaQuery.select(criteriaBuilder.count(root));
		return this.entityManager.createQuery(criteriaQuery).getSingleResult();
	}

}
