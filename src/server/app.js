import express from 'express';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import router from './routes/main.routes'
import './dist/'

const app = express();

app.use('/', router);
app.use(express.static(path.join(__dirname, '/public')));

const srv = app.listen(3000, () => {
    const {address, port} = srv.address();
    console.log(`App listening at http://localhost:${port}`);
});

export default app;
