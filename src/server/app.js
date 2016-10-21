import express from 'express';
import path from 'path';
import router from './routes/main.routes';
import fs from 'fs';
import socketIO from 'socket.io';

import SocketService from './service/socket';

const app = express();
const server = app.listen(3000);
const io = new socketIO(server);
const socket = new SocketService(io);

app.use('/', router);
app.use(express.static(path.resolve(__dirname, '../', '../', 'dist')));

export default app;
