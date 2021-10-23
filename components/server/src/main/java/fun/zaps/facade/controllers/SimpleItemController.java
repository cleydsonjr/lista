package fun.zaps.facade.controllers;

import fun.zaps.business.exceptions.ResourceNotFoundException;
import fun.zaps.business.services.SimpleItemService;
import fun.zaps.facade.commands.SimpleItemCommand;
import fun.zaps.facade.commands.SimpleListOperationCommand;
import fun.zaps.facade.dtos.SimpleItemDto;
import fun.zaps.facade.executors.SimpleListOperationsExecutor;
import fun.zaps.facade.mappers.SimpleItemMapper;
import io.micronaut.http.annotation.*;
import io.micronaut.transaction.annotation.ReadOnly;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Controller("/api/lists/{listId}/items")
@Tag(name = "SimpleItem")
public class SimpleItemController {

	private final SimpleItemService simpleItemService;

	private final SimpleItemMapper simpleItemMapper;

	private final SimpleListOperationsExecutor simpleListOperationsExecutor;

	public SimpleItemController(
			SimpleItemService simpleItemService,
			SimpleItemMapper simpleItemMapper,
			SimpleListOperationsExecutor simpleListOperationsExecutor
	) {
		this.simpleItemService = simpleItemService;
		this.simpleItemMapper = simpleItemMapper;
		this.simpleListOperationsExecutor = simpleListOperationsExecutor;
	}

	@Operation(summary = "Obtem item da lista pelo indice")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@ReadOnly
	@Get()
	List<SimpleItemDto> getItems(@PathVariable String listId) {
		return simpleItemService.getItems(listId)
				.map(items -> items.stream().map(simpleItemMapper::toDto).collect(Collectors.toList()))
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

	@Operation(summary = "Obtem item da lista pelo indice")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@ReadOnly
	@Get("/{index}")
	SimpleItemDto getItemById(@PathVariable String listId, @PathVariable Integer index) {
		return simpleItemService.getItem(listId, index)
				.map(simpleItemMapper::toDto)
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

	@Operation(
			description = "Adiciona um nova item na lista em um indice especifico."
	)
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@Post("/{index}")
	SimpleItemDto addItem(@PathVariable String listId, @PathVariable Integer index, @Body @Valid SimpleItemCommand command) {
		return this.simpleListOperationsExecutor.executeOperation(listId, SimpleListOperationCommand.addCommand(index, command))
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

	@Operation(
			description = "Remove item da lista em um indice especifico."
	)
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@Delete("/{index}")
	SimpleItemDto deleteItem(@PathVariable String listId, @PathVariable Integer index) {
		return this.simpleListOperationsExecutor.executeOperation(listId, SimpleListOperationCommand.deleteCommand(index))
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

	@Operation(
			description = "Adiciona uma novo item ao fim da lista."
	)
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@Post()
	SimpleItemDto appendItem(@PathVariable String listId, @Body @Valid SimpleItemCommand command) {
		return this.simpleListOperationsExecutor.executeOperation(listId, SimpleListOperationCommand.appendCommand(command))
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

	@Operation(summary = "Atualiza um item da lista lista.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@Put("/{index}")
	SimpleItemDto updateItem(@PathVariable String listId, @PathVariable Integer index, @Body @Valid SimpleItemCommand command) {
		return this.simpleListOperationsExecutor.executeOperation(listId, SimpleListOperationCommand.updateCommand(index, command))
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

}
