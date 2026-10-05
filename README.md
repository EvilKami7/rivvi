# Rivvi

Небольшой сервис заявок на проверку автомобиля по VIN. Внешний сервис
эмулируется: результат приходит асинхронно и сохраняется в PostgreSQL.

## Стек

- Frontend: React, TypeScript, Vite, Socket.IO client.
- Backend: Node.js, Express, TypeScript, Socket.IO.
- Данные: PostgreSQL + Prisma ORM.
- Контейнеризация: Docker Compose.

## Быстрый запуск через Docker

Нужны Docker Desktop и Docker Compose.

```powershell
docker compose up --build
```

После запуска откройте `http://localhost:5173`. Compose поднимает frontend,
backend и PostgreSQL; backend автоматически применяет Prisma-миграции.

Остановка:

```powershell
docker compose down
```

Данные БД сохраняются в Docker volume. Полный сброс локальной БД:

```powershell
docker compose down -v
```

## Локальный запуск frontend и backend

Docker можно использовать только для БД:

```powershell
Copy-Item service\.env.example service\.env -Force
npm run dev:db
npm run db:migrate -- --name init
```

Затем в двух терминалах:

```powershell
npm run dev:back
npm run dev:front
```

Если порт `5173` занят, Vite выберет следующий свободный порт; прокси API
останется рабочим. Backend слушает `http://localhost:3000`.

## API

| Метод  | Путь              | Назначение                                         |
| ------ | ----------------- | -------------------------------------------------- |
| `POST` | `/api/checks`     | Создать проверку. Тело: `{ "vin": "17 символов" }` |
| `GET`  | `/api/checks`     | Вернуть 20 последних проверок                      |
| `GET`  | `/api/checks/:id` | Вернуть проверку по идентификатору                 |
| `GET`  | `/health`         | Проверка доступности backend                       |

## Архитектура

Клиент отправляет VIN в Express API. Контроллер валидирует запрос, а
`CheckService` создаёт запись со статусом `created`, затем переводит её в
`processing`, обращается к `MockVehicleProvider` и сохраняет результат со
статусом `completed`. Изменения статуса рассылаются через Socket.IO, поэтому
интерфейс обновляется без polling. Prisma изолирует работу с PostgreSQL.

```
client → Express controller → CheckService → MockVehicleProvider
                    │                │
                    └── Socket.IO ←──┴── Prisma → PostgreSQL
```

## Структура проекта

```
client/             React-приложение: компоненты, хук истории, API-клиент
service/src/        Express API: routes, controllers, services, providers
service/prisma/     Prisma-схема и миграции PostgreSQL
docker-compose.yml  Полный локальный стек
```

## Принятые решения

- Валидация VIN выполняется и в React, и на API, чтобы сервер не доверял
  клиенту.
- Провайдер автомобиля вынесен в отдельный интерфейс: mock можно заменить
  адаптером к реальному внешнему API без изменения бизнес-логики.
- Статусы `created → processing → completed/failed` позволяют отображать
  асинхронную работу и обрабатывать сбои провайдера.
- Compose запускает всё приложение, а отдельные npm-скрипты сохраняют быстрый
  локальный workflow без контейнеризации frontend/backend.

## Что добавить для production

1. Аутентификацию, ограничение частоты запросов и аудит действий.
2. Очередь задач и воркеры вместо фоновой задачи внутри HTTP-процесса.
3. Настоящий provider с таймаутами, retry/backoff и мониторингом ошибок.
4. Тесты для API, сервисного слоя и основных пользовательских сценариев.
5. Секреты и переменные окружения в секрет-хранилище, CI/CD, логи и метрики.


## Выполнение заняло 4-5чч
