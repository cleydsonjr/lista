package fun.zaps.facade.controllers;

import io.micronaut.core.io.ResourceResolver;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.types.files.StreamedFile;
import jakarta.inject.Inject;

@Controller("/")
public class IndexController {
	@Inject
	ResourceResolver res;

	@Get("/{path:[^\\.]*}")
	@Produces(MediaType.TEXT_HTML)
	public HttpResponse<?> refresh(HttpRequest<?> request, String path) {
		StreamedFile indexFile = new StreamedFile(res.getResource("classpath:public/index.html").get());
		return HttpResponse.ok(indexFile);
	}

}
