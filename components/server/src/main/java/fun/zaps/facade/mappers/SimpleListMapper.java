package fun.zaps.facade.mappers;

import fun.zaps.business.domain.SimpleList;
import fun.zaps.business.helpers.IdEncoder;
import fun.zaps.facade.commands.SimpleListCommand;
import fun.zaps.facade.dtos.SimpleListDto;
import org.mapstruct.*;

import javax.inject.Inject;

@Mapper(componentModel = "jsr330", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class SimpleListMapper {

	@Inject
	private IdEncoder idEncoder;

	@Mappings({
			@Mapping(target = "id", source = "id", qualifiedByName = "EncodedId"),
	})
	public abstract SimpleListDto toDto(SimpleList simpleList);

	public abstract SimpleList fromDto(SimpleListCommand scopeField);

	public abstract void updateFromDto(SimpleListCommand command, @MappingTarget SimpleList simpleList);

	@Named("EncodedId")
	public String mapId(Long id) {
		return id != null ? idEncoder.encode(id) : null;
	}
}
