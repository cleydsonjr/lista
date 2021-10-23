package fun.zaps.business.services;

import fun.zaps.business.domain.SimpleList;
import fun.zaps.business.repositories.SimpleListRepository;
import io.micronaut.core.annotation.NonNull;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;
import java.util.Optional;

@Singleton
@Transactional
public class SimpleListService {

	private final SimpleListRepository repository;

	@Inject
	public SimpleListService(SimpleListRepository repository) {
		this.repository = repository;
	}

	@NonNull
	public Optional<SimpleList> findByEncodedId(@NotNull @NonNull String encodedId) {
		Long id = Long.parseLong(encodedId, Character.MAX_RADIX);

		return this.repository.findById(id);
	}

	public SimpleList save(SimpleList simpleList) {
		if (simpleList.getName() == null) {
			simpleList.setName("Nova lista");
		}
		return repository.save(simpleList);
	}

	public SimpleList update(SimpleList simpleList) {
		return repository.update(simpleList);
	}

}
