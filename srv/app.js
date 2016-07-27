import express from 'express';
import Raspicam from 'raspicam';

const app = express();
const port = 3000;

let fileURI;

const writePath = (mode) => {
    let uniqId = Date.now().toString();
    let path = `/work/raspicam/data/${mode}s/raspi-${uniqId}`;
    fileURI = `${path}.jpg`;
    return path;
};

app.get('/', (req, res) => {
    try {
        let camera = new Raspicam({
            mode: 'photo',
            output: writePath('photo')
        });
        camera.start();
        console.log(`camera take photo at ${ Date.now().toString() }.`);
        res.send(fileURI);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${ port.toString() }!`);
});
