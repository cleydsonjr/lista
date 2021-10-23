package fun.zaps.facade.websocket;

import fun.zaps.facade.commands.SimpleListOperationCommand;
import fun.zaps.facade.executors.SimpleListOperationsExecutor;
import io.micronaut.websocket.WebSocketBroadcaster;
import io.micronaut.websocket.WebSocketSession;
import io.micronaut.websocket.annotation.OnClose;
import io.micronaut.websocket.annotation.OnMessage;
import io.micronaut.websocket.annotation.OnOpen;
import io.micronaut.websocket.annotation.ServerWebSocket;
import org.reactivestreams.Publisher;

import java.util.function.Predicate;

@ServerWebSocket("/ws/lists/{listId}")
public class SimpleListWebSocketServer {

	private final WebSocketBroadcaster broadcaster;
	private final SimpleListOperationsExecutor simpleListOperationsExecutor;

	public SimpleListWebSocketServer(
			WebSocketBroadcaster broadcaster,
			SimpleListOperationsExecutor simpleListOperationsExecutor
	) {
		this.broadcaster = broadcaster;
		this.simpleListOperationsExecutor = simpleListOperationsExecutor;
	}

	@OnOpen
	public Publisher<String> onOpen(String listId, WebSocketSession session) {
		String msg = "Joined!";
		return broadcaster.broadcast(msg, isValid(listId));
	}

	@OnMessage
	void onMessage(
			String listId,
			SimpleListOperationCommand command,
			WebSocketSession session) {
		try {
			this.simpleListOperationsExecutor.executeOperation(listId, command);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@OnClose
	public Publisher<String> onClose(
			String listId,
			WebSocketSession session) {
		String msg = "Disconnected!";
		return broadcaster.broadcast(msg, isValid(listId));
	}

	private Predicate<WebSocketSession> isValid(String listId) {
		return s -> listId.equalsIgnoreCase(s.getUriVariables().get("listId", String.class, null));
	}
}
