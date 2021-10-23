package fun.zaps.facade.commands;

import io.micronaut.core.annotation.Introspected;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Introspected
@NoArgsConstructor
public class SimpleListOperationCommand {

	@NotNull
	private SimpleListOperation operation;

	private Integer index;

	@Valid
	private SimpleItemCommand item;

	public enum SimpleListOperation {
		ADD,
		APPEND,
		UPDATE,
		DELETE
	}

	private SimpleListOperationCommand(SimpleListOperation operation, Integer index, SimpleItemCommand item) {
		this.operation = operation;
		this.index = index;
		this.item = item;
	}

	private SimpleListOperationCommand(SimpleListOperation operation, Integer index) {
		this.operation = operation;
		this.index = index;
	}

	private SimpleListOperationCommand(SimpleListOperation operation, SimpleItemCommand item) {
		this.operation = operation;
		this.item = item;
	}

	public static SimpleListOperationCommand addCommand(Integer index, SimpleItemCommand item) {
		return new SimpleListOperationCommand(SimpleListOperation.ADD, index, item);
	}

	public static SimpleListOperationCommand appendCommand(SimpleItemCommand item) {
		return new SimpleListOperationCommand(SimpleListOperation.APPEND, item);
	}

	public static SimpleListOperationCommand updateCommand(Integer index, SimpleItemCommand item) {
		return new SimpleListOperationCommand(SimpleListOperation.UPDATE, index, item);
	}

	public static SimpleListOperationCommand deleteCommand(Integer index) {
		return new SimpleListOperationCommand(SimpleListOperation.DELETE, index);
	}

}
