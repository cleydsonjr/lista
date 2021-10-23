package fun.zaps.facade.websocket;

import fun.zaps.facade.SimpleListOperationEvent;
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.websocket.WebSocketBroadcaster;
import io.micronaut.websocket.WebSocketSession;

import javax.inject.Singleton;
import java.util.function.Predicate;

@Singleton
public class SimpleListOperationsWsEventListener implements ApplicationEventListener<SimpleListOperationEvent> {

	private final WebSocketBroadcaster broadcaster;

	public SimpleListOperationsWsEventListener(
			WebSocketBroadcaster broadcaster
	) {
		this.broadcaster = broadcaster;
	}

	@Override
	public void onApplicationEvent(SimpleListOperationEvent event) {
		broadcaster.broadcastAsync(event.getOperationResult(), isValid(event.getListId()));
	}

	private Predicate<WebSocketSession> isValid(String listId) {
		return s -> listId.equalsIgnoreCase(s.getUriVariables().get("listId", String.class, null));
	}

}
