package fun.zaps.facade.commands;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.core.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Introspected
@AllArgsConstructor
@NoArgsConstructor
public class SimpleItemCommand {

	@NotNull
	@Size(max = 30)
	private String value;

	@Min(0)
	@Nullable
	private Integer additional;

}
