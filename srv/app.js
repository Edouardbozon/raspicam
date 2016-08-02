import express from 'express';
import router from './routes/main.routes'
import path from 'path';

const app = express();

app.use('/', router);
app.use(express.static(path.join(__dirname, '/public')));

const srv = app.listen(3000, () => {
    const {address, port} = srv.address();
    console.log(`App listening at http://${address}:${port}`);
});

export default app;
