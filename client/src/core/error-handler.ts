const ERROR_MESSAGES: Record<number, string> = {
  400: 'Неверный запрос',
  401: 'Требуется авторизация',
  403: 'Доступ запрещён',
  404: 'Ресурс не найден',
  409: 'Конфликт данных',
  422: 'Неверные параметры',
  500: 'Ошибка сервера',
  502: 'Сервер недоступен',
  503: 'Сервис временно недоступен',
};

export class HttpError extends Error {
  readonly status: number;
  readonly response: Response;

  constructor(message: string, status: number, response: Response) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.response = response;
  }
}

export async function handleHttpError(response: Response): Promise<never> {
  const fallbackMessage = ERROR_MESSAGES[response.status] ?? `Ошибка: ${response.statusText}`;
  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
  const message = body?.error ?? body?.message ?? fallbackMessage;

  throw new HttpError(message, response.status, response);
}
