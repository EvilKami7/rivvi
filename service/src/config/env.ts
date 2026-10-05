const defaultOrigin = 'http://localhost:5173';

export const env = {
  corsOrigin: process.env.CORS_ORIGIN ?? defaultOrigin,
  port: Number(process.env.PORT ?? 3000),
};
