package fun.zaps;

import com.google.cloud.sql.postgres.SocketFactory;
import io.micronaut.configuration.jdbc.hikari.DatasourceConfiguration;
import io.micronaut.context.annotation.Value;
import io.micronaut.context.event.BeanInitializedEventListener;
import io.micronaut.context.event.BeanInitializingEvent;
import io.micronaut.core.util.StringUtils;

import javax.inject.Singleton;

@Singleton
public class CloudSqlPostgresqlDatasourceConfigurationListener implements BeanInitializedEventListener<DatasourceConfiguration> {

	@Value("${google-cloud.sql.instance}")
	protected String cloudSqlInstance;

	public DatasourceConfiguration onInitialized(BeanInitializingEvent<DatasourceConfiguration> event) {
		DatasourceConfiguration config = event.getBean();

		if (StringUtils.isNotEmpty(cloudSqlInstance)) {
			config.addDataSourceProperty("socketFactory", SocketFactory.class.getName());
			config.addDataSourceProperty("cloudSqlInstance", this.cloudSqlInstance);
		}

		return config;
	}
}
