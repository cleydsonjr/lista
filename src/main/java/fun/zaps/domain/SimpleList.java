package fun.zaps.domain;

import io.micronaut.data.annotation.DateCreated;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
public class SimpleList {

	@Id
	@GeneratedValue
	private Long id; // 2.176.782.335

	@DateCreated
	private Instant dateCreated;

	@NotNull
	@NotBlank
	@Size(max = 25)
	private String name;

	@Size(max = 25)
	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private Set<SimpleItem> items;

}
