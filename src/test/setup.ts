import "@testing-library/jest-dom/vitest";

const localStorageValues = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return localStorageValues.size;
  },
  clear() {
    localStorageValues.clear();
  },
  getItem(key) {
    return localStorageValues.get(key) ?? null;
  },
  key(index) {
    return [...localStorageValues.keys()][index] ?? null;
  },
  removeItem(key) {
    localStorageValues.delete(key);
  },
  setItem(key, value) {
    localStorageValues.set(key, String(value));
  },
};

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: localStorageMock,
});

class AudioParamMock {
  setValueAtTime() {}
  exponentialRampToValueAtTime() {}
}

class OscillatorNodeMock {
  type: OscillatorType = "sine";
  frequency = new AudioParamMock();
  connect() {}
  start() {}
  stop() {}
}

class GainNodeMock {
  gain = new AudioParamMock();
  connect() {}
}

class AudioContextMock {
  state: AudioContextState = "running";
  currentTime = 0;
  destination = {} as AudioDestinationNode;
  createOscillator() {
    return new OscillatorNodeMock();
  }
  createGain() {
    return new GainNodeMock();
  }
  resume() {
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
}

Object.defineProperty(window, "AudioContext", {
  configurable: true,
  value: AudioContextMock,
});

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

Element.prototype.scrollIntoView = () => undefined;
