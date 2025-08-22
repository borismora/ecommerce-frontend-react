import '@testing-library/jest-dom'

// Polyfills para Node
import { TextEncoder, TextDecoder } from 'util'
globalThis.TextEncoder = TextEncoder
globalThis.TextDecoder = TextDecoder

// Mock de import.meta
globalThis.importMeta = {
  env: {
    VITE_MP_PUBLIC_KEY: 'test_public_key',
    VITE_API_BASE_URL: 'http://localhost:3000'
  }
}

Object.defineProperty(globalThis, 'import', {
  value: { meta: globalThis.importMeta },
  writable: true,
  configurable: true
})
