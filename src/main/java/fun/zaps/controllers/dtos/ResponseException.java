package fun.zaps.controllers.dtos;

import io.micronaut.core.annotation.Introspected;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
@Introspected
public class ResponseException {

	@NotNull
	private final String message;

}
