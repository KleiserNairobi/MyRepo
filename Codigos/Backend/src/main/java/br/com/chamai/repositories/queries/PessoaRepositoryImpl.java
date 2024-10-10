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

import br.com.chamai.models.Pessoa;
import br.com.chamai.repositories.filters.PessoaFilter;

public class PessoaRepositoryImpl implements PessoaRepositoryQuery {

	@PersistenceContext private EntityManager entityManager;

	@Override
	public Page<Pessoa> filtrar(PessoaFilter filter, Pageable pageable) {
		CriteriaBuilder criteriaBuilder = this.entityManager.getCriteriaBuilder();
		CriteriaQuery<Pessoa> criteriaQuery = criteriaBuilder.createQuery(Pessoa.class);
		Root<Pessoa> root = criteriaQuery.from(Pessoa.class);
		
		Predicate[] predicates = criarRestricoes(filter, criteriaBuilder, root);
		
		criteriaQuery.where(predicates);
		TypedQuery<Pessoa> typedQuery = this.entityManager.createQuery(criteriaQuery);
		
		adicionarRestricaoDePaginacao(typedQuery, pageable);
		
		return new PageImpl<>(typedQuery.getResultList(), pageable, total(filter));
	}

	private Predicate[] criarRestricoes(PessoaFilter filter, CriteriaBuilder criteriaBuilder,
			Root<Pessoa> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (!StringUtils.isEmpty(filter.getNome())) {
			predicates.add(
					criteriaBuilder.like(
							criteriaBuilder.lower(root.get("nome")), "%" + filter.getNome().toLowerCase() + "%")
					);
		}
		
		if (!StringUtils.isEmpty(filter.getNomeFantasia())) {
			predicates.add(
					criteriaBuilder.like(
							criteriaBuilder.lower(root.get("nomeFantasia")), "%" + filter.getNomeFantasia().toLowerCase() + "%")
					);
		}
		
		if (!StringUtils.isEmpty(filter.getRamoAtividade())) {
			predicates.add(
					criteriaBuilder.like(
							criteriaBuilder.lower(root.get("ramoAtividade")), "%" + filter.getRamoAtividade().toLowerCase() + "%")
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

	private Long total(PessoaFilter filter) {
		CriteriaBuilder criteriaBuilder = this.entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<Pessoa> root = criteriaQuery.from(Pessoa.class);
		
		Predicate[] predicates = criarRestricoes(filter, criteriaBuilder, root);
		criteriaQuery.where(predicates);
		
		criteriaQuery.select(criteriaBuilder.count(root));
		return this.entityManager.createQuery(criteriaQuery).getSingleResult();
	}

}
