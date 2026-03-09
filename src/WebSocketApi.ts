/**
 * WebSocketApi provides a direct WebSocket connection to the FastAPI backend
 * for the sequence matching feature. This replaces the MQTTApi class that
 * previously routed through AWS IoT.
 *
 * Usage:
 * ```typescript
 * const ws = new WebSocketApi();
 * ws.onMessage("sequence_matching_progress/1", (data) => { ... });
 * ws.onMessage("sequence_matching_progress/plot", (data) => { ... });
 * await ws.startSequenceMatching(files, sequenceLength);
 * ```
 */

import { BACKEND_WS_URL } from "./config/urls";

type MessageCallback = (data: any) => void;

export default class WebSocketApi {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<string, MessageCallback[]> = new Map();
  private onConnectCallbacks: (() => void)[] = [];
  private onErrorCallbacks: ((error: Event) => void)[] = [];
  private onCloseCallbacks: (() => void)[] = [];
  private isConnected: boolean = false;

  /**
   * Start the sequence matching workflow:
   * 1. Opens a WebSocket to /ws/sequence-matching
   * 2. Sends configuration (sequence_length, number_of_scans)
   * 3. Sends each file as base64-encoded data
   * 4. Listens for progress messages from the backend
   *
   * @param files The scan files to upload
   * @param sequenceLength The sequence length parameter
   */
  async startSequenceMatching(files: File[], sequenceLength: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${BACKEND_WS_URL}/ws/sequence-matching`;
      this.socket = new WebSocket(url);

      this.socket.onopen = async () => {
        this.isConnected = true;
        try {
          // Send configuration
          this.socket!.send(
            JSON.stringify({
              sequence_length: sequenceLength,
              number_of_scans: files.length,
            }),
          );

          // Send each file as base64
          for (const file of files) {
            const base64Data = await this.fileToBase64(file);
            this.socket!.send(
              JSON.stringify({
                filename: file.name,
                data: base64Data,
              }),
            );
          }

          // Notify connect callbacks
          this.onConnectCallbacks.forEach((cb) => cb());
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          const { topic, data } = message;

          // Dispatch to registered handlers
          const handlers = this.messageHandlers.get(topic);
          if (handlers) {
            handlers.forEach((handler) => handler(data));
          }

          // Also dispatch to wildcard handlers
          const wildcardHandlers = this.messageHandlers.get("*");
          if (wildcardHandlers) {
            wildcardHandlers.forEach((handler) => handler({ topic, data }));
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      this.socket.onerror = (event) => {
        console.error("WebSocket error:", event);
        this.onErrorCallbacks.forEach((cb) => cb(event));
        reject(event);
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.onCloseCallbacks.forEach((cb) => cb());
      };
    });
  }

  /**
   * Register a callback for messages on a specific topic.
   *
   * @param topic The topic to listen for (e.g., "sequence_matching_progress/1")
   * @param callback The function to call with the message data
   */
  onMessage(topic: string, callback: MessageCallback): this {
    const existing = this.messageHandlers.get(topic) || [];
    existing.push(callback);
    this.messageHandlers.set(topic, existing);
    return this;
  }

  /**
   * Register a callback for when the WebSocket connection is established.
   */
  onConnect(callback: () => void): this {
    this.onConnectCallbacks.push(callback);
    if (this.isConnected) {
      callback();
    }
    return this;
  }

  /**
   * Register a callback for WebSocket errors.
   */
  onError(callback: (error: Event) => void): this {
    this.onErrorCallbacks.push(callback);
    return this;
  }

  /**
   * Register a callback for when the WebSocket connection closes.
   */
  onClose(callback: () => void): this {
    this.onCloseCallbacks.push(callback);
    return this;
  }

  /**
   * Disconnect the WebSocket connection.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.messageHandlers.clear();
    this.onConnectCallbacks = [];
    this.onErrorCallbacks = [];
    this.onCloseCallbacks = [];
  }

  /**
   * Convert a File to a base64-encoded string.
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
