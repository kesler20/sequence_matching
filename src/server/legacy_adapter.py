"""Legacy message bus adapter for synchronous HTTP endpoints.

This adapter provides the same interface as WebSocketAdapter and MQTTAdapter
but silently discards messages since legacy endpoints don't support real-time progress updates.
"""

from typing import Any, Dict, Optional, Union


class LegacyAdapter:
    """A silent message bus adapter for legacy HTTP endpoints.

    This adapter implements the MessageBusProtocol interface but doesn't
    actually send any messages, as the legacy REST endpoints don't support
    streaming progress updates.
    """

    def __init__(self) -> None:
        self._connected = False

    def connect(self) -> "LegacyAdapter":
        """Mark the adapter as connected."""
        self._connected = True
        return self

    def publish_data(
        self,
        topic: str,
        payload: Union[Dict[str, Any], str],
        quos: Optional[int] = 0,
    ) -> bool:
        """Silently discard the message (no-op for legacy endpoints)."""
        return True
