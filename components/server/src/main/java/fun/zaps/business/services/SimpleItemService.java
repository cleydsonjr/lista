package fun.zaps.business.services;

import fun.zaps.business.domain.SimpleItem;
import fun.zaps.business.domain.SimpleList;
import jakarta.inject.Singleton;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Singleton
@Transactional
public class SimpleItemService {

	private final SimpleListService simpleListService;

	@Inject
	public SimpleItemService(
			SimpleListService simpleListService
	) {
		this.simpleListService = simpleListService;
	}

	public Optional<SimpleItem> getItem(
			@NotNull String listEncodedId,
			@NotNull Integer index
	) {
		Optional<SimpleList> maybeList = simpleListService.findByEncodedId(listEncodedId);

		return maybeList.map(list -> list.getItems().get(index));
	}

	public Optional<SimpleItem> add(
			@NotNull String listEncodedId,
			@NotNull Integer index,
			@NotBlank String value
	) {
		SimpleItem simpleItem = new SimpleItem(Instant.now(), Instant.now(), value);

		return addItem(listEncodedId, index, simpleItem);
	}

	public Optional<SimpleItem> append(
			@NotNull String listEncodedId,
			@NotBlank String value
	) {
		SimpleItem simpleItem = new SimpleItem(Instant.now(), Instant.now(), value);

		return addItem(listEncodedId, null, simpleItem);
	}

	public Optional<SimpleItem> update(
			@NotNull String listEncodedId,
			@NotNull Integer index,
			@NotBlank @Size(max = 25) String value
	) {
		Optional<SimpleList> maybeList = simpleListService.findByEncodedId(listEncodedId);

		return maybeList.map(list -> {
			SimpleItem simpleItem = list.getItems().get(index);
			simpleItem.setValue(value);
			simpleItem.setDateUpdated(Instant.now());
			simpleListService.update(list);

			return simpleItem;
		});
	}

	public Optional<SimpleItem> delete(
			@NotNull String listEncodedId,
			@NotNull Integer index
	) {
		Optional<SimpleList> maybeList = simpleListService.findByEncodedId(listEncodedId);

		return maybeList.map(list -> {
			SimpleItem simpleItem = list.getItems().remove((int) index);
			simpleListService.update(list);

			return simpleItem;
		});
	}

	private Optional<SimpleItem> addItem(String listEncodedId, Integer index, SimpleItem simpleItem) {
		Optional<SimpleList> maybeList = simpleListService.findByEncodedId(listEncodedId);

		return maybeList.map(list -> {
			int addIndex = index != null ? index : list.getItems().size();
			list.getItems().add(addIndex, simpleItem);
			simpleListService.update(list);

			return simpleItem;
		});
	}

	public Optional<List<SimpleItem>> getItems(@NotNull String listEncodedId) {
		Optional<SimpleList> maybeList = simpleListService.findByEncodedId(listEncodedId);

		return maybeList.map(SimpleList::getItems);
	}

}
