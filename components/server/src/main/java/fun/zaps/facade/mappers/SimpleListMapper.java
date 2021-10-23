package fun.zaps.facade.mappers;

import fun.zaps.facade.commands.SimpleListCommand;
import fun.zaps.facade.dtos.SimpleListDto;
import fun.zaps.business.domain.SimpleList;
import org.mapstruct.*;

@Mapper(componentModel = "jsr330", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class SimpleListMapper {

	@Mappings({
			@Mapping(target = "id", source = "id", qualifiedByName = "EncodedId"),
	})
	public abstract SimpleListDto toDto(SimpleList simpleList);

	public abstract SimpleList fromDto(SimpleListCommand scopeField);

	public abstract void updateFromDto(SimpleListCommand command, @MappingTarget SimpleList simpleList);

	@Named("EncodedId")
	public String mapId(Long id) {
		return id != null ? Long.toString(id, Character.MAX_RADIX) : null;
	}
}
