import json
import asyncio
from typing import Any, Dict, Optional, Union
from fastapi import WebSocket


class WebSocketAdapter:
    """A message bus adapter that sends progress updates over a FastAPI WebSocket connection.

    This replaces the MQTTAdapter and provides the same interface (connect, publish_data)
    so that sequencematching.py can use either adapter interchangeably.

    Because sequencematching.main() runs synchronously in a thread (via run_in_executor),
    and WebSocket.send_text() is async, we use asyncio.run_coroutine_threadsafe() to
    bridge the two worlds.

    Usage:
        ws_adapter = WebSocketAdapter(websocket, loop)
        ws_adapter.connect()
        ws_adapter.publish_data("sequence_matching_progress/1", {"current": 0, "total": 100})
    """

    def __init__(
        self, websocket: WebSocket, loop: Optional[asyncio.AbstractEventLoop] = None
    ) -> None:
        self._websocket = websocket
        self._loop = loop
        self._connected = False

    def connect(self) -> "WebSocketAdapter":
        """Mark the adapter as connected. The WebSocket is already accepted by FastAPI."""
        self._connected = True
        return self

    def publish_data(
        self,
        topic: str,
        payload: Union[Dict[str, Any], str],
        quos: Optional[int] = 0,
    ) -> bool:
        """Publish data to the WebSocket client.

        Messages are sent as JSON with the format:
        {
            "topic": "<topic>",
            "data": <payload>
        }

        This method is called from a sync thread context (run_in_executor),
        so it uses run_coroutine_threadsafe to schedule the async send.
        """
        if isinstance(payload, str):
            try:
                payload = json.loads(payload)
            except json.JSONDecodeError:
                payload = {"raw": payload}

        message = json.dumps({"topic": topic, "data": payload})

        try:
            if self._loop and self._loop.is_running():
                future = asyncio.run_coroutine_threadsafe(
                    self._websocket.send_text(message), self._loop
                )
                # Wait with a timeout to avoid blocking forever
                future.result(timeout=10)
            else:
                # Fallback: try to run in a new event loop (shouldn't normally happen)
                asyncio.run(self._websocket.send_text(message))
        except Exception as e:
            print(f"WebSocket send error on topic '{topic}': {e}")
            return False

        return True
