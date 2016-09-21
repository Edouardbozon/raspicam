import express from 'express';
import Raspicam from 'raspicam';
import path from 'path';

const router = express.Router();

router.use((req, res, next) => {
  console.log('Server requested at: ', Date.now());
  next();
});

router.get('/', (req, res) => {
    res.send({success: 'request succeded'});
    
});

export default router;
