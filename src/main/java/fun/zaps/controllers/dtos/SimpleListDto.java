package fun.zaps.controllers.dtos;

import fun.zaps.domain.SimpleItem;
import io.micronaut.core.annotation.Introspected;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.Set;

@Data
@Introspected
@AllArgsConstructor
@Schema(
		name = "SimpleList"
)
public class SimpleListDto {

	@NotNull
	private String id;

	@NotNull
	private Instant dateCreated;

	@NotNull
	@NotBlank
	@Size(max = 25)
	private String name;

	@Size(max = 25)
	private Set<SimpleItemDto> items;

}
