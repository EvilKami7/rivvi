import 'dotenv/config';
import http from 'node:http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { CheckController } from './controllers/check.controller.js';
import { prisma } from './db/prisma.js';
import { MockVehicleProvider } from './providers/mock-vehicle.provider.js';
import { CheckService } from './services/check.service.js';

const io = new Server({ cors: { origin: env.corsOrigin } });
const checkService = new CheckService(prisma, new MockVehicleProvider(), io);
const app = createApp(new CheckController(checkService));
const server = http.createServer(app);

io.attach(server);
server.listen(env.port, () => console.log(`API listening on port ${env.port}`));
