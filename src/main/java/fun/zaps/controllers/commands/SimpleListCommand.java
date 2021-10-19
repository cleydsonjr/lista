package fun.zaps.controllers.commands;

import io.micronaut.core.annotation.Introspected;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Introspected
@AllArgsConstructor
@NoArgsConstructor
public class SimpleListCommand {

	private String name;

}
