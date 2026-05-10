/**
 * ✅ GOOD: Depends on abstraction (HttpAdapter interface)
 */
type HttpAdapter = {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<any>;
};

export class HttpClient {
  constructor(private adapter: HttpAdapter) {}

  async get(url: string) {
    return this.adapter.get(url);
  }

  async post(url: string, data: any) {
    return this.adapter.post(url, data);
  }
}
