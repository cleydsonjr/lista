package fun.zaps.facade.commands;

import fun.zaps.business.domain.SimpleListType;
import io.micronaut.core.annotation.Introspected;
import io.micronaut.core.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

@Data
@Introspected
@AllArgsConstructor
@NoArgsConstructor
public class SimpleListCommand {

	@Nullable
	@Size(max = 30)
	private String name;

	@Nullable
	private SimpleListType type = SimpleListType.ITEMS;

}
