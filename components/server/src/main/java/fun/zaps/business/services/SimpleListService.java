package fun.zaps.business.services;

import fun.zaps.business.domain.SimpleList;
import fun.zaps.business.domain.SimpleListType;
import fun.zaps.business.helpers.IdEncoder;
import fun.zaps.business.repositories.SimpleListRepository;
import io.micronaut.core.annotation.NonNull;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;
import java.util.Map;
import java.util.Optional;

@Singleton
@Transactional
public class SimpleListService {

	private final SimpleListRepository repository;
	private final IdEncoder idEncoder;

	private static final Map<SimpleListType, String> DEFAULT_LIST_NAME = Map.of(
			SimpleListType.ITEMS, "Lista de itens",
			SimpleListType.PEOPLE, "Lista de pessoas"
	);

	@Inject
	public SimpleListService(
			SimpleListRepository repository,
			IdEncoder idEncoder
	) {
		this.repository = repository;
		this.idEncoder = idEncoder;
	}

	@NonNull
	public Optional<SimpleList> findByEncodedId(@NotNull @NonNull String encodedId) {
		Long id = idEncoder.decode(encodedId);

		return this.repository.findById(id);
	}

	public SimpleList save(SimpleList simpleList) {
		if (simpleList.getName() == null || simpleList.getName().isEmpty()) {
			simpleList.setName(DEFAULT_LIST_NAME.get(simpleList.getType()));
		}
		return repository.save(simpleList);
	}

	public SimpleList update(SimpleList simpleList) {
		return repository.update(simpleList);
	}

}
