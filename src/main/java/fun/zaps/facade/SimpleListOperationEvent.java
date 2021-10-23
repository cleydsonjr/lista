package fun.zaps.facade;

import fun.zaps.facade.dtos.SimpleListOperationResultDto;
import io.micronaut.core.annotation.Introspected;
import lombok.Data;
import lombok.NonNull;

@Data
@Introspected
public class SimpleListOperationEvent {

	@NonNull
	private String listId;

	@NonNull
	private SimpleListOperationResultDto operationResult;

}
