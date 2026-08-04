interface IdCrypto {
  randomUUID?: () => string;
}

let fallbackSequence = 0;

export function createId(source: IdCrypto | undefined = globalThis.crypto) {
  if (typeof source?.randomUUID === 'function') return source.randomUUID();

  fallbackSequence += 1;
  return `id-${Date.now().toString(36)}-${fallbackSequence.toString(36)}-${Math.random().toString(36).slice(2)}`;
}
