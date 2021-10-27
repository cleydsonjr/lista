package fun.zaps.facade.commands;

import io.micronaut.core.annotation.Introspected;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

@Data
@Introspected
@AllArgsConstructor
@NoArgsConstructor
public class SimpleListCommand {

	@Size(max = 30)
	private String name;

}
