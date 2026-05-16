import { vi } from "vitest";

export type MockMediaStreamOptions = {
  trackCount?: number;
};

export function createMockMediaStream(
  options: MockMediaStreamOptions = {}
): MediaStream {
  const { trackCount = 1 } = options;
  const tracks = Array.from({ length: trackCount }, () => ({
    kind: "audio" as const,
    stop: vi.fn(),
    enabled: true,
  }));

  return {
    getTracks: () => tracks,
    getAudioTracks: () => tracks,
    getVideoTracks: () => [],
    active: true,
    id: "mock-stream",
  } as unknown as MediaStream;
}

type MockMediaRecorderInstance = {
  stream: MediaStream;
  mimeType?: string;
  state: RecordingState;
  ondataavailable: ((event: BlobEvent) => void) | null;
  onstop: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
};

export type MockMediaRecorderOptions = {
  chunkData?: BlobPart[];
  chunkMimeType?: string;
};

export function createMockMediaRecorderClass(
  options: MockMediaRecorderOptions = {}
) {
  const { chunkData = ["mock-audio-chunk"], chunkMimeType = "audio/webm" } =
    options;

  const instances: MockMediaRecorderInstance[] = [];

  class MockMediaRecorder {
    static isTypeSupported = vi.fn(() => true);

    stream: MediaStream;
    mimeType?: string;
    state: RecordingState = "inactive";
    ondataavailable: ((event: BlobEvent) => void) | null = null;
    onstop: (() => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    start = vi.fn(() => {
      this.state = "recording";
    });
    stop = vi.fn(() => {
      if (this.state === "inactive") return;
      this.state = "inactive";
      const blob = new Blob(chunkData, { type: chunkMimeType });
      this.ondataavailable?.({ data: blob } as BlobEvent);
      this.onstop?.();
    });

    constructor(stream: MediaStream, init?: MediaRecorderOptions) {
      this.stream = stream;
      this.mimeType = init?.mimeType;
      instances.push(this);
    }
  }

  return {
    MockMediaRecorder,
    instances,
  };
}

export type InstallMediaMocksOptions = {
  getUserMediaReject?: Error;
  stream?: MediaStream;
  mediaRecorder?: MockMediaRecorderOptions;
};

export function installMediaMocks(options: InstallMediaMocksOptions = {}) {
  const stream = options.stream ?? createMockMediaStream();
  const getUserMedia = options.getUserMediaReject
    ? vi.fn().mockRejectedValue(options.getUserMediaReject)
    : vi.fn().mockResolvedValue(stream);

  const { MockMediaRecorder, instances } = createMockMediaRecorderClass(
    options.mediaRecorder
  );

  const previousMediaDevices = navigator.mediaDevices;
  const previousMediaRecorder = globalThis.MediaRecorder;
  const previousAudioContext = globalThis.AudioContext;

  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });

  vi.stubGlobal("MediaRecorder", MockMediaRecorder);

  class MockAudioContext {
    state = "running";
    createAnalyser = vi.fn(() => ({
      fftSize: 256,
      frequencyBinCount: 16,
      getByteFrequencyData: vi.fn((array: Uint8Array) => {
        array.fill(128);
      }),
    }));
    createMediaStreamSource = vi.fn(() => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }));
    close = vi.fn().mockResolvedValue(undefined);
  }

  vi.stubGlobal("AudioContext", MockAudioContext);

  return {
    stream,
    getUserMedia,
    instances,
    cleanup: () => {
      vi.unstubAllGlobals();
      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: previousMediaDevices,
      });
      if (previousMediaRecorder) {
        globalThis.MediaRecorder = previousMediaRecorder;
      }
      if (previousAudioContext) {
        globalThis.AudioContext = previousAudioContext;
      }
    },
  };
}
