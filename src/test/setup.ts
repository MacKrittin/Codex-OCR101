import '@testing-library/jest-dom/vitest';

class DOMMatrixStub { constructor() {} }
Object.defineProperty(globalThis, 'DOMMatrix', { value: DOMMatrixStub, writable: true });
