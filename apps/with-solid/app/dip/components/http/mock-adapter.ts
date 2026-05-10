/**
 * ✅ GOOD: Mock implementation for testing
 */
type HttpAdapter = {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<any>;
};

export class MockAdapter implements HttpAdapter {
  async get(url: string) {
    // Mock response for testing
    return { data: "Mock data from " + url, timestamp: Date.now() };
  }

  async post(url: string, data: any) {
    return { success: true, data };
  }
}
