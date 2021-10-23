package fun.zaps.facade.dtos;

import io.micronaut.core.annotation.Introspected;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.Instant;

@Data
@Introspected
@AllArgsConstructor
@Schema(
		name = "SimpleItem"
)
public class SimpleItemDto {

	@NotNull
	private Instant dateCreated;

	@NotNull
	private Instant dateUpdated;

	@NotNull
	private String value;

}
