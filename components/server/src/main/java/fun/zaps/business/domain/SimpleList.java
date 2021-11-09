package fun.zaps.business.domain;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.TypeDef;
import io.micronaut.data.model.DataType;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class SimpleList {

	@Id
	@GeneratedValue
	private Long id; // 2.176.782.335

	@DateCreated
	private Instant dateCreated;

	@DateUpdated
	private Instant dateUpdated;

	@NotNull
	@NotBlank
	@Size(max = 30)
	private String name;

	@Nullable
	@Size(max = 144)
	private String description;

	@NotNull
	@Enumerated(EnumType.STRING)
	private SimpleListType type = SimpleListType.ITEMS;

	@Size(max = 50)
	@TypeDef(type = DataType.JSON)
	private List<SimpleItem> items = new ArrayList<>();

}
