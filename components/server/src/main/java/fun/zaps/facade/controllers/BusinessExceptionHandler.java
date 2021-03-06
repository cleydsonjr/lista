package fun.zaps.facade.controllers;

import fun.zaps.business.exceptions.BusinessException;
import fun.zaps.business.exceptions.ResourceNotFoundException;
import fun.zaps.business.exceptions.ValidationException;
import fun.zaps.facade.dtos.ResponseException;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Produces
@Singleton
@Requires(classes = {RuntimeException.class, ExceptionHandler.class})
public class BusinessExceptionHandler implements ExceptionHandler<RuntimeException, HttpResponse<ResponseException>> {

	private static final Logger LOG = LoggerFactory.getLogger(BusinessExceptionHandler.class);

	@Override
	public HttpResponse<ResponseException> handle(HttpRequest request, RuntimeException exception) {
		if (exception instanceof ResourceNotFoundException) {
			return resourceNotFoundHttpResponse((ResourceNotFoundException) exception);
		} else if (exception instanceof ValidationException) {
			return validationHttpResponse((ValidationException) exception);
		} else {
			return exceptionAsHttpResponse(exception);
		}
	}

	private static HttpResponse<ResponseException> exceptionAsHttpResponse(RuntimeException exception) {
		if (!(exception instanceof BusinessException)) {
			LOG.error(exception.getMessage(), exception);
		}
		return HttpResponse.serverError(new ResponseException(exception.getMessage()));
	}

	private static HttpResponse<ResponseException> resourceNotFoundHttpResponse(ResourceNotFoundException exception) {
		return HttpResponse.notFound(new ResponseException(exception.getMessage()));
	}

	private static HttpResponse<ResponseException> validationHttpResponse(ValidationException exception) {
		return HttpResponse.unprocessableEntity().body(new ResponseException(exception.getMessage()));
	}

}
