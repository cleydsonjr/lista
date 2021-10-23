package fun.zaps.facade.mappers;

import fun.zaps.facade.commands.SimpleItemCommand;
import fun.zaps.facade.dtos.SimpleItemDto;
import fun.zaps.business.domain.SimpleItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "jsr330", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class SimpleItemMapper {

	public abstract SimpleItemDto toDto(SimpleItem simpleItem);

	public abstract SimpleItem fromDto(SimpleItemCommand scopeField);

	public abstract void updateFromDto(SimpleItemCommand command, @MappingTarget SimpleItem simpleItem);

}
