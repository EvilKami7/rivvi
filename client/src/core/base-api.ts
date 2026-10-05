import { handleHttpError } from './error-handler';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestConfig = Omit<RequestInit, 'body' | 'method'> & {
  method?: HttpMethod;
  data?: unknown;
};

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { method = 'GET', data, headers: customHeaders, ...options } = config;
  const normalizedMethod = method.toUpperCase() as HttpMethod;
  const headers = new Headers(customHeaders);
  headers.set('Accept', 'application/json');

  if (data !== undefined && !['GET', 'HEAD'].includes(normalizedMethod)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    method: normalizedMethod,
    headers,
    credentials: 'include',
    body:
      data === undefined || ['GET', 'HEAD'].includes(normalizedMethod)
        ? undefined
        : JSON.stringify(data),
  });

  if (!response.ok) {
    return handleHttpError(response);
  }

  const contentType = response.headers.get('content-type') ?? '';
  return (
    contentType.includes('application/json') ? response.json() : response.text()
  ) as Promise<T>;
}

export const http = {
  request,
  get: <T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'data'>) =>
    request<T>(endpoint, { ...config, method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown, config?: Omit<RequestConfig, 'method' | 'data'>) =>
    request<T>(endpoint, { ...config, method: 'POST', data }),
  put: <T>(endpoint: string, data?: unknown, config?: Omit<RequestConfig, 'method' | 'data'>) =>
    request<T>(endpoint, { ...config, method: 'PUT', data }),
  delete: <T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'data'>) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};
