package fun.zaps.facade.executors;

import fun.zaps.business.domain.SimpleItem;
import fun.zaps.business.services.SimpleItemService;
import fun.zaps.facade.SimpleListOperationEvent;
import fun.zaps.facade.commands.SimpleItemCommand;
import fun.zaps.facade.commands.SimpleListOperationCommand;
import fun.zaps.facade.dtos.SimpleItemDto;
import fun.zaps.facade.dtos.SimpleListOperationResultDto;
import fun.zaps.facade.mappers.SimpleItemMapper;
import io.micronaut.context.event.ApplicationEventPublisher;
import jakarta.inject.Singleton;

import javax.validation.Valid;
import java.util.Optional;

@Singleton
public class SimpleListOperationsExecutor {

	private final SimpleItemService simpleItemService;

	private final SimpleItemMapper simpleItemMapper;

	private final ApplicationEventPublisher<SimpleListOperationEvent> eventPublisher;

	public SimpleListOperationsExecutor(
			SimpleItemService simpleItemService,
			SimpleItemMapper simpleItemMapper,
			ApplicationEventPublisher<SimpleListOperationEvent> eventPublisher
	) {
		this.simpleItemService = simpleItemService;
		this.simpleItemMapper = simpleItemMapper;
		this.eventPublisher = eventPublisher;
	}

	public Optional<SimpleItemDto> executeOperation(String listId, @Valid SimpleListOperationCommand command) {
		Optional<SimpleItemDto> simpleItemDto = doExecuteOperation(listId, command);

		simpleItemDto
				.map((simpleItem) -> new SimpleListOperationResultDto(command, simpleItem))
				.ifPresent((resultDto) -> eventPublisher.publishEvent(new SimpleListOperationEvent(listId, resultDto)));

		return simpleItemDto;
	}

	private Optional<SimpleItemDto> doExecuteOperation(String listId, SimpleListOperationCommand command) {
		final SimpleItemCommand commandItem = command.getItem();
		final Optional<SimpleItem> maybeResultItem;

		switch (command.getOperation()) {
			case ADD:
				maybeResultItem = simpleItemService.add(listId, command.getIndex(), commandItem.getValue());
				break;
			case APPEND:
				maybeResultItem = simpleItemService.append(listId, commandItem.getValue());
				break;
			case UPDATE:
				maybeResultItem = simpleItemService.update(listId, command.getIndex(), commandItem.getValue());
				break;
			case DELETE:
				maybeResultItem = simpleItemService.delete(listId, command.getIndex());
				break;
			default:
				throw new IllegalStateException("Operaçao desconhecida");
		}

		return maybeResultItem.map(simpleItemMapper::toDto);
	}

}
