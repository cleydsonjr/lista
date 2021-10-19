package fun.zaps.domain;

import io.micronaut.data.annotation.DateCreated;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;

@Data
@Entity
@NoArgsConstructor
public class SimpleItem {

	@Id
	@GeneratedValue
	private Long id;

	@DateCreated
	private Instant dateCreated;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "list_id")
	SimpleList list;

	@NotNull
	@NotBlank
	@Size(max = 25)
	private String value;

}
