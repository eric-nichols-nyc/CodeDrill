/**
 * ✅ GOOD: Concrete implementation of HttpAdapter
 */
type HttpAdapter = {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<any>;
};

export class FetchAdapter implements HttpAdapter {
  async get(url: string) {
    const response = await fetch(url);
    return response.json();
  }

  async post(url: string, data: any) {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
