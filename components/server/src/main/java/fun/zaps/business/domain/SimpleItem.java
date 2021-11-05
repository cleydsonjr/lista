package fun.zaps.business.domain;

import io.micronaut.core.annotation.Introspected;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;

@Data
@Introspected
@RequiredArgsConstructor
public class SimpleItem {

	@NotNull
	@NonNull
	private Instant dateCreated;

	@NotNull
	@NonNull
	private Instant dateUpdated;

	@NotNull
	@NonNull
	@Size(max = 30)
	private String value;

	@Min(0)
	private Integer additional;

}
