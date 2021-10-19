package fun.zaps.services;

import fun.zaps.domain.SimpleList;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

@JdbcRepository(dialect = Dialect.H2)
public interface SimpleListRepository extends CrudRepository<SimpleList, Long> {

}
