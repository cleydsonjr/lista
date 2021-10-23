package fun.zaps.facade.commands;

import io.micronaut.core.annotation.Introspected;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Introspected
@AllArgsConstructor
@NoArgsConstructor
public class SimpleItemCommand {

	@NotNull
	@NotBlank
	@Size(max = 25)
	private String value;

}
