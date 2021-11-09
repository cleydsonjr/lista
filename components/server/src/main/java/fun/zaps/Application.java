package fun.zaps;

import io.micronaut.runtime.Micronaut;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
		info = @Info(
				title = "zaps-list",
				version = "0.0.11"
		),
		servers = @Server(
				url = "http://localhost:8080/api"
		)
)
public class Application {

	public static void main(String[] args) {
		Micronaut.run(Application.class, args);
	}
}
