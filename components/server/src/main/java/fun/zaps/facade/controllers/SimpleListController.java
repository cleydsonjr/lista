package fun.zaps.facade.controllers;

import fun.zaps.business.domain.SimpleList;
import fun.zaps.business.exceptions.ResourceNotFoundException;
import fun.zaps.business.services.SimpleListService;
import fun.zaps.facade.commands.SimpleListCommand;
import fun.zaps.facade.commands.SimpleListOperationCommand;
import fun.zaps.facade.dtos.SimpleItemDto;
import fun.zaps.facade.dtos.SimpleListDto;
import fun.zaps.facade.dtos.SimpleListOperationResultDto;
import fun.zaps.facade.executors.SimpleListOperationsExecutor;
import fun.zaps.facade.mappers.SimpleListMapper;
import io.micronaut.http.annotation.*;
import io.micronaut.transaction.annotation.ReadOnly;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.validation.Valid;

@Controller("/api/lists")
@Tag(name = "SimpleList")
public class SimpleListController {

	private final SimpleListService simpleListService;

	private final SimpleListMapper simpleListMapper;

	private final SimpleListOperationsExecutor simpleListOperationsExecutor;

	public SimpleListController(
			SimpleListService simpleListService,
			SimpleListMapper simpleListMapper,
			SimpleListOperationsExecutor simpleListOperationsExecutor
	) {
		this.simpleListService = simpleListService;
		this.simpleListMapper = simpleListMapper;
		this.simpleListOperationsExecutor = simpleListOperationsExecutor;
	}

	@Operation(summary = "Obtem a lista pelo ID")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@ReadOnly
	@Get("/{listId}")
	SimpleListDto getSimpleListById(@PathVariable String listId) {
		return simpleListService.findByEncodedId(listId)
				.map(simpleListMapper::toDto)
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

	@Operation(
			description = "Adiciona uma nova lista."
	)
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@Post()
	SimpleListDto addSimpleList(@Body @Valid SimpleListCommand command) {
		SimpleList simpleList = simpleListMapper.fromDto(command);
		simpleList = simpleListService.save(simpleList);

		return simpleListMapper.toDto(simpleList);
	}

	@Operation(summary = "Atualiza uma lista. Permite atualizar apenas o nome.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@Put("/{listId}")
	SimpleListDto updateSimpleList(@PathVariable String listId, @Body @Valid SimpleListCommand command) {
		return simpleListService.findByEncodedId(listId).map(simpleList -> {
			simpleListMapper.updateFromDto(command, simpleList);
			return simpleListMapper.toDto(simpleListService.update(simpleList));
		}).orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

	@Operation(summary = "Executa operaçao em uma lista. Permite atualizar apenas o nome.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Operacao bem sucedida"),
			@ApiResponse(responseCode = "404", description = "Recurso não encontrado")
	})
	@Post("/{listId}")
	SimpleListOperationResultDto executeOperation(@PathVariable String listId, @Body @Valid SimpleListOperationCommand command) {
		return this.simpleListOperationsExecutor.executeOperation(listId, command)
				.map((simpleItem) -> new SimpleListOperationResultDto(command, simpleItem))
				.orElseThrow(() -> new ResourceNotFoundException("Lista com id '" + listId + "' não foi encontrada!"));
	}

}
