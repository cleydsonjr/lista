package fun.zaps.business.domain;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.TypeDef;
import io.micronaut.data.model.DataType;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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

	@Size(max = 25)
	@TypeDef(type = DataType.JSON)
	private List<SimpleItem> items = new ArrayList<>();

}
