package fun.zaps;

import io.micronaut.runtime.Micronaut;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
		info = @Info(
				title = "lista",
				version = "0.0.1"
		),
		servers = @Server(
				url = "http://localhost:8080"
		)
)
public class Application {

	public static void main(String[] args) {
		Micronaut.run(Application.class, args);
	}
}
