package fun.zaps.facade.dtos;

import fun.zaps.business.domain.SimpleListType;
import io.micronaut.core.annotation.Introspected;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

@Data
@Introspected
@AllArgsConstructor
@Schema(name = "SimpleList")
public class SimpleListDto {

	@NotNull
	private String id;

	@NotNull
	private Instant dateCreated;

	@NotNull
	private Instant dateUpdated;

	@NotNull
	@NotBlank
	@Size(max = 30)
	private String name;

	@Size(max = 144)
	private String description;

	@NotNull
	private SimpleListType type;

	@Size(max = 50)
	private List<SimpleItemDto> items;

}
