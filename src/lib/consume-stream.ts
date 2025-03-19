export async function consumeReadableStream(
  stream: ReadableStream<Uint8Array>,
  callback: (chunk: string) => void,
  signal: AbortSignal
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  signal.addEventListener("abort", () => reader.cancel(), { once: true });

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (value) {
        const decodedChunk = decoder.decode(value, { stream: true });
        console.log("Received chunk:", decodedChunk);
        callback(decodedChunk);
      }
    }
  } catch (error) {
    if (signal.aborted) {
      console.error("Stream reading was aborted:", error);
    } else {
      console.error("Error consuming stream:", error);
    }
  } finally {
    reader.releaseLock();
  }
}
