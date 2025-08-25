import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadMercadoPagoSDK } from '../../utils/loadMercadoPago';

describe('loadMercadoPagoSDK', () => {
  let originalMercadoPago;
  let originalCreateElement;
  let originalAppendChild;
  let scriptMock;

  beforeEach(() => {
    originalMercadoPago = window.MercadoPago;
    originalCreateElement = document.createElement;
    originalAppendChild = document.body.appendChild;
    window.MercadoPago = undefined;
    scriptMock = {
      set src(value) { this._src = value; },
      get src() { return this._src; },
      set onload(fn) { this._onload = fn; },
      get onload() { return this._onload; },
      set onerror(fn) { this._onerror = fn; },
      get onerror() { return this._onerror; }
    };
    document.createElement = vi.fn(() => scriptMock);
    document.body.appendChild = vi.fn();
  });

  afterEach(() => {
    window.MercadoPago = originalMercadoPago;
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    vi.restoreAllMocks();
  });

  it('resolves immediately if window.MercadoPago is already loaded', async () => {
    window.MercadoPago = { fake: 'sdk' };
    const sdk = await loadMercadoPagoSDK();
    expect(sdk).toEqual({ fake: 'sdk' });
  });

  it('appends the MercadoPago script and resolves on load', async () => {
    const promise = loadMercadoPagoSDK();
    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(document.body.appendChild).toHaveBeenCalledWith(scriptMock);
    window.MercadoPago = { loaded: true };
    scriptMock.onload();
    const sdk = await promise;
    expect(sdk).toEqual({ loaded: true });
  });

  it('rejects if the script fails to load', async () => {
    const promise = loadMercadoPagoSDK();
    const error = new Error('Script failed');
    let rejected = false;
    promise.catch(e => {
      expect(e).toBe(error);
      rejected = true;
    });
    scriptMock.onerror(error);
    await Promise.resolve(); // allow promise to settle
    expect(rejected).toBe(true);
  });

  it('sets the correct script src', () => {
    loadMercadoPagoSDK();
    expect(scriptMock.src).toBe('https://sdk.mercadopago.com/js/v2');
  });
});
