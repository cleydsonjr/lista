package fun.zaps.exceptions;

import lombok.EqualsAndHashCode;
import lombok.ToString;

@ToString
@EqualsAndHashCode(callSuper = true)
public class ValidationException extends BusinessException {

	public ValidationException(String message) {
		super(message);
	}

}
