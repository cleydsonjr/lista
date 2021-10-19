package fun.zaps.controllers;

import fun.zaps.controllers.commands.SimpleListCommand;
import fun.zaps.controllers.dtos.SimpleListDto;
import fun.zaps.controllers.mappers.SimpleListMapper;
import fun.zaps.domain.SimpleList;
import fun.zaps.exceptions.ResourceNotFoundException;
import fun.zaps.services.SimpleListService;
import io.micronaut.http.annotation.*;
import io.micronaut.transaction.annotation.ReadOnly;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.inject.Inject;
import org.mapstruct.factory.Mappers;

import javax.validation.Valid;

@Controller("/lists")
@Tag(name = "SimpleList")
public class SimpleListController {

	@Inject
	private SimpleListService simpleListService;

	private final SimpleListMapper simpleListMapper = Mappers.getMapper(SimpleListMapper.class);

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
				.orElseThrow(() -> new ResourceNotFoundException("A lista informada não existe!"));
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
		}).orElseThrow(() -> new ResourceNotFoundException("A lista informada não foi encontrada!"));
	}

}
