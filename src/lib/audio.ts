// Client helpers for MediaRecorder blobs (transient, in-memory only).
export function getSupportedMimeType() {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "audio/webm";
}
