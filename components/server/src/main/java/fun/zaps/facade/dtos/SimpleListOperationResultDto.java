package fun.zaps.facade.dtos;

import fun.zaps.facade.commands.SimpleListOperationCommand;
import io.micronaut.core.annotation.Introspected;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NonNull;

@Data
@Introspected
@Schema(name = "SimpleListOperationResult")
public class SimpleListOperationResultDto {

	@NonNull
	private SimpleListOperationCommand command;

	@NonNull
	private SimpleItemDto resultItem;

}
